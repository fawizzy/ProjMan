import UserController from "../controllers/userController"
import auth from "../middlewares/auth"
const userRoute = require("./index")
const companyController = require("../controllers/companyController")
const projectManagerController = require("../controllers/projectManagerController")
const projectMemberController = require("../controllers/projectMemberController")



// API endpoint for user registration
userRoute.post('/registerCompany', UserController.signUp, companyController.registerCompany);
userRoute.post('/registermanager', UserController.signUp, projectManagerController.registerProjectManager);
userRoute.post('/registermember', UserController.signUp, projectMemberController.registerProjectMember)

// API endpoint for user login
userRoute.post('/login', UserController.logIn);
userRoute.post("/auth", auth)
userRoute.delete("/logout", UserController.logOut)
userRoute.post("/resetpassword", UserController.resetPassword)
userRoute.post("/forgotpassword", UserController.forgotPassword)
userRoute.get("/currentuser", auth, UserController.currentUser)

// // API endpoint for getting user profile
// userRoute.get('/profile/:userId', UserController.getUserProfile);

// // API endpoint for updating user profile
// userRoute.put('/profile/:userId', UserController.updateUserProfile);

// // API endpoint for changing user password
// userRoute.put('/change-password/:userId', UserController.changePassword);

// // API endpoint for deleting a user account
// userRoute.delete('/delete/:userId', UserController.deleteUserAccount);

module.exports = userRoute;