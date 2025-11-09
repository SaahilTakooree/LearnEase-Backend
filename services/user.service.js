// Import dependencies.
import { getCollection, COLLECTIONS } from "../config/database.js"; // Import helper function to access the database and collections.
import crypto from "crypto"; // Import crypto model to hash password


export class UserService {

    // Initialise the USERS collections to perform database operations.
    constructor() {
        this.collection = getCollection(COLLECTIONS.USERS);
    }


    // Function to hash a plain-text password using sha256.
    hashPassword(password) {
        return crypto.createHash("sha256").update(password).digest("hex");
    }


    // Function to find a user by email in the database.
    async findByEmail(email) {
        try {
            const user = await this.collection.findOne({
                email: email.toLowerCase()
            });
            return user
        } catch (error) {
            console.error(`Error in finding user by email: ${email}`, error);
            throw error;
        }
        
    }


    // Function to create a new user in the database.
    async createUser(email, password) {
        try {

            // Check if a user already exists with the provided email. Thorw an error if it does not.
            const existingUser = await this.findByEmail(email);
            if (existingUser) {
                throw new Error("A user with this email already exist.");
            }

            // Hash the password before storing it in the database.
            const hashPassword = this.hashPassword(password);

            // Insert the new user into the database.
            const result = await this.collection.insertOne({
                email: email.toLowerCase(),
                password: hashPassword,
                createdAt: new Date(),
                updatedAT: new Date()
            })

            // Return a user object.
            return {
                id: result.insertedId,
                email: result.email
            }
        } catch (error) {
            console.error(`Error in creating user: ${email}`, error);
            throw error;
        }
    }


    // Function to login a user by check email and password.
    async loginUser(email, password) {
        try {
            // Check if a user already exists with the provided email. Thorw an error if it does not.
            const user = await this.findByEmail(email);
            if (!user) {
                throw new Error("Invalid email or password.");
            }

            // Hash the password before comparing it with stored hash.
            const hashPassword = this.hashPassword(password);
            if (user.password !== hashPassword) {
                throw new Error("Invalid email or password.");
            }

            // Return a user object.
            return {
                id: user.id,
                email: user.email
            }
        } catch (error) {
            console.error(`Error in login user: ${email}`, error);
            throw error;
        }
    }


    // Function to reset a user's passwor.
    async resetPassword(email, password) {
        try {
            // Check if a user already exists with the provided email. Thorw an error if it does not.
            const user = await this.findByEmail(email);
            if (!user) {
                throw new Error("No user with this email.");
            }

            // Hash the new password before updating.
            const hashPassword = this.hashPassword(password);

            // Update the user's password and the timestamp in the database.
            await this.collection.updateOne(
                { email: email.toLowerCase() },
                {
                    $set: {
                        password: hashPassword,
                        updatedAT: new Date()
                    }
                }
            )
        } catch (error) {
            console.error(`Error in reseting user's password: ${email}`, error);
            throw error;
        }
    }
}