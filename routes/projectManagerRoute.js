const projectManagerRouter = require("./index")
import projectManagerController from "../controllers/projectManagerController"
import auth from "../middlewares/auth"

projectManagerRouter.post('/invitetoproject', auth, projectManagerController.inviteToProject);
projectManagerRouter.post('/addtoproject', auth, projectManagerController.addToProject);

module.exports = projectManagerRouter