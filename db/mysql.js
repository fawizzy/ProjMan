const mysql = require("mysql");

class DBClient{
    constructor(){
        this.db = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            multipleStatements : true,
            //password : '@Oduola1999',
            database: "project_management"
          });

        this.db.connect((err)=>{
            if (err){
                throw err
            }
            console.log("mysql connected")
          });
    }
  }

  

  const dbClient = new DBClient()

  module.exports = dbClient