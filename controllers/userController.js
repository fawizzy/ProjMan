import { v4 as uuidv4 } from "uuid";
import dbClient from "../db/mysql";
import sha1 from "sha1"
import redisClient from "../db/redis"
import sendMail from "../utility/sendMail";


async function signUp(req, res, next){
    const id = uuidv4();
    const username = req.body ? req.body.username : null;
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;
    const role = req.body ? req.body.role : null;

    if (!username){
        res.status(400).json({error: "Missing username"});
        return;
    }
    if (!email){
        res.status(400).json({error: "Missing email"});
        return;
    }
    if (!password){
        res.status(400).json({error: "Missing password"});
        return;
    }
    if (!role){
        res.status(400).json({error: "Missing role"});
        return;
    }

    const hashed_password = sha1(password)
    const insert_user = `INSERT INTO users (id, email, username, password, role) VALUES (?, ?, ?, ?, ?)`
    const values = [id, email, username, hashed_password, role]

    dbClient.db.query(insert_user, values, (error, result, fields)=>{
        if (error) {
            console.log(error);
            res.status(401).json(error.message)
        }
        else{
            res.locals.user_id = id
            next()
        }
    })

    
}


async function logIn(req, res){
    console.log("login")
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;

    if (!email){
        res.status(401).json({error: "email missing"})
        return;
    }
    if (!password){
        res.status(401).json({error: "password missing"})
        return;
    }
    const hashed_password = sha1(password)
    
    const find_user = `SELECT * FROM users WHERE users.email = ? AND users.password=?`
    let values = [email, hashed_password]

    dbClient.db.query(find_user, values, (error, result, fields)=>{
        if (error) {
            console.log(error);
        }
        console.log(result.length)
        if (result[0]){
            result.forEach(async (user)=>{
                const token = uuidv4()
                const key = `auth_${token}`
                res.cookie("session_id", token)
                const user_string = JSON.stringify(user)
                await redisClient.set(key, user_string, 60*60*240)
                res.status(201).json({token: token, user: user.email})
                return            
            })
        }else{
            res.status(401).json({error:"invalid email or password"})
        }

    })
}

async function logOut(req, res){
    const token = req.cookies.session_id
    const key = `auth_${token}`
    const deleted = await redisClient.delete(key)
    res.status(202).json("logout successful")
    
}


async function forgotPassword(req, res){
    const email = req.body ? req.body.email : null;
    
    const find_user = `SELECT * FROM users WHERE users.email = ? limit 1`
    let values = [email]

    dbClient.db.query(find_user, values, (error, result, fields)=>{
        if (error) {
            console.log(error);
        }
        
        if (result.length > 0){
            result.forEach(async (user)=>{
                const token = uuidv4()
                const key = `reset_${token}`
                console.log(user.username)   
                await redisClient.set(key, user.id, 60)
                const mailOptions = {
                    from: "ProjMan",
                    to: email,
                    subject: "testing",
                    text: `reset token is ${token}`
                }
                
                sendMail(mailOptions)
                res.status(201).json({token: token, user: user.email})
                return            
            })
        }else{
            res.status(401).json("user does not exist")
        }
    })
}

async function resetPassword(req, res){
    console.log("reset")
    const token = req.body ? req.body.token: null;
    const password = req.body ? req.body.password : null
    const key = `reset_${token}`
    const userId = await redisClient.get(key)

    if (!password){
        res.status(401).json({error: "password is null"})
    }
    if (!userId){
        res.status(401).json({error: "userId is null"})
    }

    const hashed_password = sha1(password)
    const changePassword = `UPDATE users SET password=? WHERE users.id = ?`
    const values = [hashed_password, userId]

    dbClient.db.query(changePassword, values, (error, result, fields)=>{
        if (error) {
            console.log(error);
        }
        
        console.log(result)
        res.send("password set successful")
    })
}

async function currentUser(req, res){
    let user = JSON.parse(res.locals.user)
    user = {
        id: user.id,
        email: user.email,
        username: user.username
    }
    res.status(201).json(user)
}


const UserController = {
    signUp,
    logIn,
    logOut,
    forgotPassword,
    resetPassword,
    currentUser
}

module.exports = UserController