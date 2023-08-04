import sendMail from "../utility/sendMail";
import dbClient from "../db/mysql";
import { v4 as uuidv4 } from "uuid";

async function inviteToProject(req, res){
    const email = req.body ? req.body.email : null;
    const project_id = req.body ? req.body.project_id : null;
    const sql = `SELECT * FROM users 
                INNER JOIN project_manager
                ON users.id = project_manager.user_id AND project_manager.project_id = ?
                WHERE users.email = ?
                UNION
                SELECT * FROM users 
                INNER JOIN team_member
                ON users.id = team_member.user_id AND team_member.project_id = ?
                WHERE users.email = ?`;
    const values = [project_id, email, project_id, email];
    const user = JSON.parse(res.locals.user)
    if (!email){
        res.status(401).json({error: "email is null"})
        return
    }

    dbClient.db.query(sql, values, (err, results)=>{
        if (err){
            console.log(err.message);
            res.send("invite error");
            return
        }
        if (results.length > 0){
            res.status(403).json({error: "user already in the team"})
            return
        } else {
            const mailOptions = {
                from: "oduolafawaz@gmail.com",
                to: email,
                subject: `Invitation to join ${user.name}'s team`,
                text: `you've been invited to join ${user.name}'s team`
            }
            results.forEach(user => {
                res.send(user)
                //sendMail(mailOptions);
            });
            
        }
    })
}


async function addToProject(req, res){
    const role = req.body ? req.body.role : null;
    const project_id = req.body ? req.body.project_id : null;
    const user_id = req.body ? req.body.user_id : null;

    if (!role){
        res.send("role is null")
        return
    }
    if (!project_id){
        res.send("project_id is null")
        return
    }
    if (!user_id){
        res.send("user_id is null")
        return
    }

    const checkUser = `SELECT * FROM projects
                       INNER JOIN team_member
                       ON projects.id = team_member.project_id
                       WHERE projects.id = ?`

    const addtoproject = `INSERT INTO ${role} (id, user_id, project_id) VALUES (?, ?, ?)`
    const values = [uuidv4(), user_id, project_id]

    dbClient.db.query(checkUser, project_id, (err, results)=>{
        if (err){
            console.log(err.message)
        }
        if (results.length == 0) {
             dbClient.db.query(addtoproject, values, (err1, results1)=>{
            if (err1) {
                console.log(err1.message)
                res.status(400).json({error: "error inserting"})
                return
            }
            if (results1.affectedRows > 0) {
                res.status(200).json({message: "user added to project successfully"})
                return
            }
        })
        } else {
            res.status(403).json({error: "user already in team"})
            return
        }
    })
   
}

const projectManagerController = {
    inviteToProject,
    addToProject
}

module.exports = projectManagerController;