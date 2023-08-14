import sendMail from "../utility/sendMail";
import dbClient from "../db/mysql";
import { v4 as uuidv4 } from "uuid";


async function registerProjectManager(req, res){
    const requestBody = req.body || {};  
    const managerData = {
        id: uuidv4(),
        manager_name: requestBody.manager_name || null,
        manager_website: requestBody.manager_website || null,
        manager_contact: requestBody.manager_contact || null,
        user_id: res.locals.user_id
    };

    const requiredFields = [
        "id",
        "manager_name",
        "manager_website",
        "manager_contact",
        "user_id"
    ];

    for (const field of requiredFields) {
        if (!managerData[field]) {
            delUserIfError(managerData.user_id)
            res.status(400).json({ error: `Missing ${field.replace("_", " ")}` });
            return;
        }
    }

    const insert_manager = `INSERT INTO project_manager (id, manager_name, manager_contact, manager_website, user_id) VALUES (?, ?, ?, ?, ?)`
    const values = [
        managerData.id,
        managerData.manager_name,
        managerData.manager_contact,
        managerData.manager_website,
        managerData.user_id,
    ];
    
    dbClient.db.query(insert_manager, values, (error, result, fields)=>{
        if (error) {
            console.log(error);
            delUserIfError(managerData.user_id)
            res.status(401).json("error inserting company")
        }
        else{
            res.status(201).json("company inserted")
        }
    })
}
async function inviteToProject(req, res){
    const email = req.body ? req.body.email : null;
    const project_id = req.body ? req.body.project_id : null;
}


async function addUserToProject(req, res){
    const role = req.body ? req.body.role : null;
    const project_id = req.body ? req.body.project_id : null;
    const user_id = req.body ? req.body.user_id : null;   
}

async function assignTaskToMember(req, res){
    const requestBody = req.body || {};  
    const taskData = {
        id: uuidv4(),
        project_id: requestBody.project_id || null,
        project_member_id: requestBody.project_member_id || null,
        task_info: requestBody.task_info || null,
    };

    const requiredFields = [
        "id",
        "project_id",
        "project_member_id",
        "task_info"
    ];

    for (const field of requiredFields) {
        if (!taskData[field]) {
            delUserIfError(managerData.user_id)
            res.status(400).json({ error: `Missing ${field.replace("_", " ")}` });
            return;
        }
    }
    const checkProjectManager = `SELECT id FROM project_manager WHERE project_manager.user_id =?`
    const insert_task = `INSERT INTO member_assignment (id, project_id, project_member_id, task_info) VALUES (?, ?, ?, ?)`
    const values = [
        taskData.id,
        taskData.project_id,
        taskData.project_member_id,
        taskData.task_info
    ];

    dbClient.db.query(insert_task, values, (error, result, fields)=>{
        if (error) {
            console.log(error);
            res.status(401).json("error assigning member")
        }
        else{
            res.status(201).json("member assigned")
        }
    })
}

async function projectByProjectManager(req, res){
    const user = JSON.parse(res.locals.user)

}



async function allProjectManagers(req, res) {
    const project_managers = `SELECT users.id, users.username FROM users
                              INNER JOIN project_manager
                              ON users.id = project_manager.user_id`
}

async function delUserIfError(user_id){
    const delete_user = `DELETE FROM users WHERE id= ?`
    dbClient.db.query(delete_user, user_id,(err, res)=>{
        if(err){
            console.log(err.message)
        }
    })
}

const projectManagerController = {
    registerProjectManager,
    assignTaskToMember
}

module.exports = projectManagerController;