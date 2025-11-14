// Import dependencies.
import express from "express"; // Import 'Express' framework and the router class to define route handlers.
import userRouter from "./user.routes.js"; // Import ther user routes module.
import lessonRouter from "./lesson.routes.js"; // Import the lesson routes.
import orderRouter from "./order.routes.js"; // Import the order routes.
import searchRouter from "./search.routes.js"; // Import the search routes.


// Create a new router instance.
const routes = express.Router();


// Mount the user routes under the "/users" path.
routes.use("/users", userRouter);

// Mount the lesson routes under the "/lessons" path.
routes.use("/lessons", lessonRouter);

// Mount the order routes under the "/orders" path.
routes.use("/orders", orderRouter);

// Mount the search routes under the "/search" path.
routes.use("/search", searchRouter);


// Export the router so it can be use in the main Express application.
export default routes;