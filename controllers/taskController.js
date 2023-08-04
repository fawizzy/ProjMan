import { v4 as uuidv4 } from "uuid";
import dbClient from "../db/mysql";

async function createTask(req, res) {
    const task_id = uuidv4()
    const task_name = req.body ? req.body.task_name: null;
    const project_id = req.body ? req.body.project_id: null;
    const task_description = req.body ? req.body.task_description: null;
    const priority = req.body ? req.body.priority: null;
    const status = req.body ? req.body.status: null;
    const start_date = req.body ? req.body.start_date: null;
    const due_date = req.body ? req.body.due_date: null;

    if (!task_name){
        res.status(401).json({error: "task name is null"})
        return
    }
    if (!task_description){
        res.status(401).json({error: "task description is null"})
        return
    }
    if (!priority){
        res.status(401).json({error: "priority is null"})
        return
    }
    if (!status){
        res.status(401).json({error: "status is null"})
        return
    }
    if (!start_date){
        res.status(401).json({error: "start date is null"})
        return
    }
    if (!due_date){
        res.status(401).json({error: "due date is error"})
        return
    }


    
    const insert_task = `INSERT INTO tasks (id, task_name, task_description, priority, status, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?);`
    const values = [task_id, task_name, task_description, priority, status, start_date, due_date]
    console.log(values)

    dbClient.db.query(insert_task, values, (err, results)=> {
        if (err) {
            console.log(err.message)
            res.status(401).json({error: "error inserting tasks"})
        }

        if (results) {
            console.log(results.message)
            res.status(201).json({message: "task created"})
        }
    })
}

async function deleteTask(req, res) {
    const project_id = req.body ? req.body.project_id : null;
    if (!project_id){
        res.send("invalid id")
    } 

    const delete_project = `DELETE FROM projects WHERE projects.id = ?;
                            DELETE FROM Admin WHERE Admin.project_id=  ?`
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


const taskCountroller ={
    createTask,
    deleteTask
}

module.exports = taskCountroller