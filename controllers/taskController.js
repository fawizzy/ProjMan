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

    const user = JSON.parse(res.locals.user)

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

    // Check if user is the project manager
    let checkProjectManager = `
                SELECT * FROM tasks
                INNER JOIN project_manager
                ON tasks.project_id = project_manager.project_id
                WHERE project_manager.user_id=?`
    let checkvalues = [user.id]
    
    const insert_task = `INSERT INTO tasks (id, task_name, task_description, priority, status, start_date, due_date) VALUES (?, ?, ?, ?, ?, ?, ?);`
    const values = [task_id, task_name, task_description, priority, status, start_date, due_date]
    dbClient.db.query(checkProjectManager, checkvalues, (err, results)=> {
        if (err) {
            console.log(err.message)
            res.status(401).json({error: "error inserting tasks"})
        }

        if (results.length>0) {
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
        } else {
            res.status(403).json({message: "only project manager for this project can create tasks"})
        }
    })
   
}

async function deleteTask(req, res) {
    const user = JSON.parse(res.locals.user)
    const project_id = req.body ? req.body.project_id : null;
    if (!project_id){
        res.send("invalid id")
    } 


    // Check if user is the project manager
    let checkProjectManager = `
                SELECT * FROM tasks
                INNER JOIN project_manager
                ON project_manager.task_id = tasks.id
                WHERE project_manager.user_id=?`
    let checkvalues = [user.id, user.id]

    const delete_task = `DELETE FROM tasks WHERE projects.id = ?;`
    const values = [task]

    dbClient.db.query(delete_task, values, (err, results)=>{
        if (err) {
            console.log(err.message)
            res.send("error deleting task")
        }
        if (results) {
            console.log(results.message)
            res.status(202).json({message: "task deleted"})
        }
    })
}

async function updateTask(req, res) {
    const status = req.body ? req.body.status : null;
    const task_id = req.body ? req.body.task_id : null;
    if (!status){
        res.status(401).json({error: "status is null"})
    }
    if (!task_id){
        res.status(401).json({error: "task_id is null"})
    }
    const user = JSON.parse(res.locals.user)
    const checkTeamMember = `SELECT * FROM tasks
                INNER JOIN team_member
                ON team_member.task_id = tasks.id
                WHERE team_member.user_id=?
                UNION
                SELECT * FROM tasks
                INNER JOIN project_manager
                ON project_manager.task_id = tasks.id
                WHERE project_manager.user_id=?`
    let values = [user.id, user.id]

    const updatetask = `UPDATE tasks
                        SET status=?
                        WHERE tasks.id=?`
    const updateValues = [status, task_id]
    console.log(values)
    dbClient.db.query(checkTeamMember, values, (err, results)=>{
        if (err) {
            console.log(err.message)
        }

        if (results.length > 0){
            dbClient.db.query(updatetask, updateValues, (err, results)=>{
                if (err) {
                    console.log(err.message)
                } 
                if (results.affectedRow > 0) {
                    console.log(results.message)
                    res.status(202).json({message: "update done successfully"})
                }
            })
        }else {
            console.log(results)
        }
    })
}


async function tasksByProject(req, res){
    const project_id = req.body ? req.body.project_id : null;
    const tasks = `SELECT * FROM tasks
                   WHERE tasks.project_id = ?`
    const value = project_id

    if (!project_id){
        res.status(401).json({error: "project_id is null"})
    }

    dbClient.db.query(tasks, value, (err, results)=>{
        if (err) {
            console.log(err.message)
            res.status(401).json({error: err.message})
        }

        if (results.length > 0) {
            const tasks_list = []
            results.forEach((task) => {
                tasks_list.push(task)
            })
            res.status(201).json(tasks_list)
        } else {
            res.status(401).json("tasks not found")
        }
    })
}


const taskCountroller ={
    createTask,
    deleteTask,
    updateTask,
    tasksByProject
}

module.exports = taskCountroller