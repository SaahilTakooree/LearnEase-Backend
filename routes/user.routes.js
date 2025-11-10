// Import dependencies.
import express, { Router } from "express"; // Import 'Express' framework and the router class to define route handlers.
import * as userController from "../controllers/user.controller.js"; // Import all user controller as 'userController'.

// Create a new router instance.
const userRouter = express.Router();

// Define a POST route for user login.
userRouter.post("/login", userController.login);

// Define a POST route for user signup.
userRouter.post("/signup", userController.signup);

// Define a POST route for user reset-password.
userRouter.post("/reset-password", userController.resetPassword);

// Export the router so it can be use in the main Express application.
export default userRouter;