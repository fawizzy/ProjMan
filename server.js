const dbClient = require("./db/mysql")
const express = require("express")
const index =require("./routes/index")
const userRoute = require("./routes/userRoute")
const projectRoute = require("./routes/projectRoute")
const taskRoute = require("./routes/taskRoute")
const projectManagerRoute = require("./routes/projectManagerRoute")
const teamMemberRoute = require("./routes/teamMemberRoute")
const companyRoute = require("./routes/companyRoute")
const cookieParser = require("cookie-parser")


const app = express();
const port = 5000;

app.use(express.json())

app.use(cookieParser())
app.use(userRoute);
app.use(projectRoute);
app.use(taskRoute);
app.use(projectManagerRoute)
app.use(teamMemberRoute)
app.use(companyRoute)
app.use(express.static('public'))

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/public/index.html")
})

app.post("/", (req, res)=>{
    console.log(req.body)
})

app.get("/createdb", (req, res)=>{
    const sql = 'CREATE DATABASE project_management'
    dbClient.db.query(sql, (error, result, fields)=>{
        if (error) throw error
        console.log(result)
        res.send("database created")
    })
})
app.listen(port, ()=>{
    console.log(`listening at port ${port}`)
})

