import { v4 as uuidv4 } from "uuid";
import dbClient from "../db/mysql";



async function createProject(req, res) {
    const project_id = uuidv4()
    const project_name = req.body ? req.body.project_name: null;
    const project_description = req.body ? req.body.project_description: null;
    const start_date = req.body ? req.body.start_date: null;
    const end_date = req.body ? req.body.end_date: null;
    const admin_id = uuidv4()
    const user = JSON.parse(res.locals.user)
    const user_id = user.id
    const insert_project = `INSERT INTO projects (id, project_name, project_description, start_date, end_date) VALUES (?, ?, ?, ?, ?);
                            INSERT INTO project_manager (id, user_id, project_id) VALUES (?, ?, ?)`
    const values = [project_id, project_name, project_description, start_date, end_date, admin_id, user_id, project_id]
    
    console.log(user_id)
    dbClient.db.query(insert_project, values, (err, results)=> {
        if (err) {
            console.log(err.message)
            res.status(401).json({error: "error inserting project"})
        }

        if (results) {
            res.status(201).json({message: "project created"})
        }
    })
}

async function deleteProject(req, res) {
    const project_id = req.body ? req.body.project_id : null;
    if (!project_id){
        res.send("invalid id")
    } 

    const delete_project = `DELETE FROM projects WHERE projects.id = ?;
                            DELETE FROM project_manager WHERE project_manager.project_id=  ?`
    const values = [project_id, project_id]

    dbClient.db.query(delete_project, values, (err, results)=>{
        if (err) {
            console.log(err.message)
            res.send("error deleting project")
        }
        if (results) {
            console.log(results.message)
            res.status(202).json({message: "project deleted"})
        }
    })
}

async function allProjects(req, res){
    const allprojects = `SELECT projects.project_name FROM projects`

    dbClient.db.query(allprojects, (err, results)=>{
        if (err){
            console.log(err)
        }
        if (results.length > 0) {
            const projects_list = []
            results.forEach((projects) => {
                projects_list.push(projects)
            })
            res.status(201).json(projects_list)
        }
    })
}


const projectCountroller ={
    createProject,
    deleteProject,
    allProjects
}

module.exports = projectCountroller