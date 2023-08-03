const projectRouter = require("./index")
import projectController from "../controllers/projectController"
import auth from "../middlewares/auth"

projectRouter.post('/createproject', auth, projectController.createProject);
projectRouter.post('/deleteproject', auth, projectController.deleteProject);

module.exports = projectRouter