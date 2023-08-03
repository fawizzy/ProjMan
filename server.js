const dbClient = require("./db/mysql")
const express = require("express")
const index =require("./routes/index")
const userRoute = require("./routes/userRoute")
const projectRoute = require("./routes/projectRoute")
const cookieParser = require("cookie-parser")


const app = express();
const port = 5000;

app.use(express.json())

app.use(cookieParser())
app.use("/", userRoute);
app.use(projectRoute);

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

