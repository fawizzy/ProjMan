const projectRouter = require("./index")
import projectController from "../controllers/projectController"
import auth from "../middlewares/auth"

//projectRouter.post('/createproject', auth, projectController.createProject);
projectRouter.post('/deleteproject', auth, projectController.deleteProject);
projectRouter.get('/allprojects', auth, projectController.allProjects);

module.exports = projectRouter