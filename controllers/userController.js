import { v4 as uuidv4 } from "uuid";
import dbClient from "../db/db";
import sha1 from "sha1"
import redisClient from "../db/redis"


async function signUp(req, res){
    let someVar = []
    const username = req.body ? req.body.username : null;
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;
    //const users = await dbClient.db.collection("users");
    if (!username){
        res.status(400).json({error: "Missing name"});
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

    const hashed_password = sha1(password)
    const insert_user = `INSERT INTO users (id, email, username, password) VALUES (?, ?, ?, ?)`
    values = [uuidv4(), email, username, hashed_password]

    dbClient.db.query(insert_user, values, (error, result, fields)=>{
        if (error.errno===1062) {
            console.log(error);
            res.status(401).json("user already exists")
        }
        else{
            res.status(201).json("user inserted")
        }
    })    
}


async function logIn(req, res){
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
    
    const find_user = `SELECT id FROM users WHERE users.email = ? AND users.password=?`
    let values = [email, hashed_password]

    dbClient.db.query(find_user, values, (error, result, fields)=>{
        if (error) {
            console.log(error);
        }
        if (result[0]){
            result.forEach(async (user)=>{
                const token = uuidv4()
                const key = `auth_${token}`
                console.log(user.id)
                res.cookie("session_id", token)
                await redisClient.set(key, user.id, 60*60*240)
                res.status(201).json({token: token, user: user.id})
                return            
            })
        }else{
            res.status(401).json("invalid email or password")
        }

    })
}

async function logOut(req, res){
    const token = req.cookies.session_id
    const key = `auth_${token}`
    const deleted = await redisClient.delete(key)
    res.status(202).json("logout successful")
    
}

const UserController = {
    signUp,
    logIn,
    logOut
}

module.exports = UserController