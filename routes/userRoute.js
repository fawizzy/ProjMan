import { Router } from "express";
import UserController from "../controllers/userController"
import auth from "../middlewares/auth"



const userRoute = Router();

// API endpoint for user registration
userRoute.post('/register', UserController.signUp);

// API endpoint for user login
userRoute.post('/login', UserController.logIn);
userRoute.post("/auth", auth)
userRoute.delete("/logout", UserController.logOut)

// // API endpoint for getting user profile
// userRoute.get('/profile/:userId', UserController.getUserProfile);

// // API endpoint for updating user profile
// userRoute.put('/profile/:userId', UserController.updateUserProfile);

// // API endpoint for changing user password
// userRoute.put('/change-password/:userId', UserController.changePassword);

// // API endpoint for deleting a user account
// userRoute.delete('/delete/:userId', UserController.deleteUserAccount);

module.exports = userRoute;