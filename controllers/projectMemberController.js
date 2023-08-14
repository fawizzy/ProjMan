import sendMail from "../utility/sendMail";
import dbClient from "../db/mysql";
import { v4 as uuidv4 } from "uuid";

async function registerProjectMember(req, res){
    const requestBody = req.body || {};  
    const memberData = {
        id: uuidv4(),
        member_name: requestBody.member_name || null,
        member_contact: requestBody.member_contact || null,
        user_id: res.locals.user_id
    };

    const requiredFields = [
        "id",
        "member_name",
        "member_contact",
        "user_id"
    ];

    for (const field of requiredFields) {
        if (!memberData[field]) {
            delUserIfError(memberData.user_id)
            res.status(400).json({ error: `Missing ${field.replace("_", " ")}` });
            return;
        }
    }

    const insert_member = `INSERT INTO project_member (id, member_name, member_contact,  user_id) VALUES (?, ?, ?, ?)`
    const values = [
        memberData.id,
        memberData.member_name,
        memberData.member_contact,
        memberData.user_id,
    ];
    
    dbClient.db.query(insert_member, values, (error, result, fields)=>{
        if (error) {
            console.log(error);
            delUserIfError(memberData.user_id)
            res.status(401).json("error inserting member")
        }
        else{
            res.status(201).json("member inserted")
        }
    })
}

async function delUserIfError(user_id){
    const delete_user = `DELETE FROM users WHERE id= ?`
    dbClient.db.query(delete_user, user_id,(err, res)=>{
        if(err){
            console.log(err.message)
        }
    })
}

const projectMember = {
    registerProjectMember
}

module.exports = projectMember;