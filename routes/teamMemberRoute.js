const teamMemberRouter = require("./index")
import teamMemberController from "../controllers/teamMemberController"
import auth from "../middlewares/auth"

teamMemberRouter.get("/allteammembers", auth, teamMemberController.allTeamMembers)
teamMemberRouter.post("/projectteammembers", auth, teamMemberController.projectTeamMembers)
teamMemberRouter.post("/teambyprojectmanager", auth, teamMemberController.teamByProjectManager)

module.exports = teamMemberRouter