const projectManagerRouter = require("./index")
import projectManagerController from "../controllers/projectManagerController"
import auth from "../middlewares/auth"

// projectManagerRouter.post('/invitetoproject', auth, projectManagerController.inviteToProject);
// projectManagerRouter.post('/addusertoproject', auth, projectManagerController.addUserToProject);
// projectManagerRouter.put("/assignuser", auth, projectManagerController.assignTaskToUser)
// projectManagerRouter.get("/allprojectmanagers", auth, projectManagerController.allProjectManagers)
// projectManagerRouter.get("/projectbyprojectmanager", auth, projectManagerController.projectByProjectManager)
module.exports = projectManagerRouter