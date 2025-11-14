// Import dependencies.
import { OrderService } from "../services/order.service.js"; // Import the 'OrderService' class to handle order related operation.
import { validateCreateOrder } from "../validators/order.validator.js"; // Import validation function to validate request.
import { sendSuccess, sendCreated, sendBadRequest, sendError } from "../utils/response.js"; // Import utility function to send formatted HTTP responses.


// Create an instance of OrderService.
const ORDERSERVICE = new OrderService();


// Controller function to get all order request.
export const getAllOrders = async (request, response) => {
    try {
        // Get all user.
        const orders = await ORDERSERVICE.getAllOrders();
        sendSuccess(response, orders, "All orders retrieved successfully.");
    } catch (error) {
        // Log any errors that might happen when when getting all order.
        console.error("Failed to retrieve all orders", error)

        // Send an error responce.
        sendError(response, error.message, 500);
    }
}


// Controller function to handle order creation request.
export const createOrder = async (request, response) => {
    try{
        // Validate if the order data being passed in is correct. If not validate send a bad request responce.
        const validation = validateCreateOrder(request.body);
        if (!validation.isValid) {
            return sendBadRequest(response, "Order Validation failed", validation.errors);
        }

        // Create the order.
        const order = await ORDERSERVICE.createOrder(request.body);

        // Send a success response.
        sendCreated(response, order, "Order created successfully.");  
    } catch (error) {
        // Log any errors that occurs during order the creation of a order.
        console.error("Fail to create order", error);

        // Send an error responce.
        sendError(response, error.message, 500);
    }
}