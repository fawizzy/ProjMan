const companyRouter = require("./index")
import companyController from "../controllers/companyController"
import auth from "../middlewares/auth"

companyRouter.post("/createcategory",auth, companyController.createCategory)
companyRouter.get("/allcategories", auth, companyController.getAllCategories)
companyRouter.post("/createproject", auth, companyController.createProject)
companyRouter.post("/updateproject", auth, companyController.createProjectUpdate)

module.exports = companyRouter