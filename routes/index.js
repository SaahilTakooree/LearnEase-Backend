// Import dependencies.
import express from "express"; // Import 'Express' framework and the router class to define route handlers.
import userRouter from "./user.routes.js"; // Import ther user routes module.
import lessonRouter from "./lesson.routes.js"; // Import the lesson routes model.


// Create a new router instance.
const routes = express.Router();


// Mount the user routes under the "/users" path.
routes.use("/users", userRouter);

// Mount the lesson routes under the "/lessons" path.
routes.use("/lessons", lessonRouter);


// Export the router so it can be use in the main Express application.
export default routes;