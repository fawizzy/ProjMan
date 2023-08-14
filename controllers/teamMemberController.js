import dbClient from "../db/mysql";
import redisClient from "../db/redis"


async function allTeamMembers(req, res) {
    const team_members = `SELECT users.id, users.username FROM users
                              INNER JOIN team_member
                              ON users.id = team_member.user_id`
    dbClient.db.query(team_members, (err, results)=>{
        if (err){
            console.log(err.message)
        }

        if (results.length > 0) {
            const team_member_list = []
            results.forEach((team_member) => {
                team_member_list.push(team_member)
            })
            res.status(201).json(team_member_list)
        }
    })
}

async function projectTeamMembers(req, res) {
    const project_id = req.body ? req.body.project_id : null;
    const team_members = `SELECT * FROM users
                          INNER JOIN team_member
                          ON users.id = team_member.user_id
                          WHERE team_member.project_id = ?`
    dbClient.db.query(team_members, project_id, (err, results)=>{
        if (err){
            console.log(err.message)
        }
        if (results) {
            if (results.length > 0) {
                const team_member_list = []
                results.forEach((team_member) => {
                    team_member_list.push(team_member)
                })
                res.status(201).json(team_member_list)
            } else {
                res.status(201).json("no team member")
            }
        }
        
    })
}

async function teamByProjectManager(req, res){
    const user = JSON.parse(res.locals.user)
    let teams = `
                SELECT u.* FROM users u
                JOIN team_member tm ON u.id =  tm.user_id
                JOIN projects p ON tm.project_id = p.id
                JOIN project_manager pm ON p.id = pm.project_id
                WHERE pm.user_id = ?;`
    console.log(user.id)
    if (!user.id || user.id === undefined){
        res.send("user id is null")
        return
    }
                dbClient.db.query(teams, user.id, (err, results)=>{
                    if (err){
                        console.log(err.message)
                    }
                    if (results) {
                        console.log(results)
                        if (results.length > 0) {
                            const team_member_list = []
                            results.forEach((team_member) => {
                                team_member_list.push(team_member)
                            })
                            res.status(201).json(team_member_list)
                        } else {
                            res.status(201).json("no team member")
                        }
                    }
                    
                })          
}

const teamMemeberController = {
    allTeamMembers,
    projectTeamMembers,
    teamByProjectManager
}

module.exports = teamMemeberController