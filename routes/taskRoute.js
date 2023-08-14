const taskRouter = require("./index")
import taskController from "../controllers/taskController"
import auth from "../middlewares/auth"

taskRouter.post('/createtask', auth, taskController.createTask);
taskRouter.post('/deletetask', auth, taskController.deleteTask);
taskRouter.post('/updatetask', auth, taskController.updateTask);
taskRouter.get('/tasksbyproject', auth, taskController.tasksByProject);


module.exports = taskRouter