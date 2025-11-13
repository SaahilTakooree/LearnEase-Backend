// Import dependencies.
import express from "express"; // Import 'Express' framework and the router class to define route handlers.
import * as orderController from "../controllers/order.controller.js"; // Import all user controller as 'userController'.


// Create a new router instance.
const orderRouter = express.Router();


// Define a get route to get all orders.
orderRouter.get("/", orderController.getAllOrders);

// Define a POST route for order creatopm.
orderRouter.post("/", orderController.createOrder);



// Export the router so it can be use in the main Express application.
export default orderRouter;