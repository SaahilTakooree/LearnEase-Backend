// Import dependencies.
import { getCollection, COLLECTIONS } from "../config/database.js"; // Import helper function to access the database and collections.
import { ObjectId } from "mongodb"; // Used to create and validate MongoDB Object IDs for documents
import { UserService } from "./user.service.js"; // Import user service to access the users service.
import { LessonService } from "./lesson.service.js"; // Import lesson service to access the lessons service.


export class OrderService {

    // Initialise the ORDER collections to perform database operations and orders service.
    constructor() {
        this.collection = getCollection(COLLECTIONS.ORDERS);
        this.userService = new UserService()
        this.lessonService = new LessonService()
    }


    // Helper function to validate all ID format.
    validateId(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid orders ID format.');
        }

        return new ObjectId(id)
    }

    
    // Get all orders form the collection.
    async getAllOrders() {
        try {
            const orders = await this.collection.find({}).toArray();
            console.log("Getting all orders");

            // return an array of all array of object for orders.
            return orders;
        } catch (error) {
            console.error ("Error in fetching all orders", error);
            throw error;
        }
    }


    // Function to get a orders by its id.
    async getOrdersById(id) {
        try {
            // Check if the orders id is valid.
            const ordersId = this.validateId(id);

            // Get the orders by its id.
            const orders = await this.collection.findOne({ _id: ordersId });

            console.log(`Getting orders with id: ${ordersId}`);

            // Return a orders object.
            return orders;
        } catch (error) {
            console.error(`Error in fetching orders with id: ${id}`, error);
            throw error
        }
    }


    // Function to create a new order.
    async createOrder(orderData) {
        // Allows multiple reads/writes.
        const session = this.collection.client.startSession();

        // Variable to store the total price of the lesson
        let totalPrice = 0;


        try {
            session.startTransaction();

            // if email is provided.. check it that user exist.
            if (orderData.email) {
                const user = await this.userService.findByEmail(orderData.email);
                if (!user) {
                    throw new Error(`User with email ${orderData.email} does not exist.`);
                }
            }

            // Fetch all ordered lesson info.
            const lessonsInfo = [];

            for (const lesson of orderData.lessonsData) {
                // Validat the lesson id then get its asscociated record.
                const lessonID = this.validateId(lesson.id);
                const lessonRecord = await this.lessonService.getLessonById(lessonID);
                if (!lessonRecord) {
                    throw new Error(`Lesson with id: ${lesson.id} not found.`)
                }

                // Check if there is space left.
                if (lessonRecord.availableSpace < lesson.spaces) {
                    throw new Error(
                        `Not enough space in lesson ${lessonRecord.topic}. Only ${lessonRecord.availableSpace} space(s) left.`
                    );
                }

                lessonsInfo.push({
                    id: lessonID,
                    spaceBooked: lesson.spaces
                });

                // Calculate the space count.
                totalPrice += lessonRecord.price * lesson.spaces;;
            }

            // Insert the order.
            const result = await this.collection.insertOne({
                name: orderData.name,
                phone: orderData.phone,
                email: orderData.email,
                lessons: lessonsInfo,
                totalPrice,
                createdAt: new Date()
            }, { session });

            await session.commitTransaction();
            session.endSession();

            console.log("Order created.");

            // Return order.
            return await this.getOrdersById(result.insertedId.toString());
            
        } catch (error) {
            console.info("Error. Reverting back changes.")
            await session.abortTransaction();
            session.endSession();
            console.error("Error in creating order.", error);
            throw error;
        }
    }
}