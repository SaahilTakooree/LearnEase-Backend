// Import 'mongodb' to connect to and interact with a MongoDB database.
import { MongoClient } from "mongodb";


// Get the connection url from enviroment variable.
const URL = process.env.MONGO_URL;

// Create a new instance of MongoClient using the connection url to manage the connection to the MongoDB server.
const CLIENT = new MongoClient(URL);

// Initialise a variable to hold the connected database instance.
let database = null;

// Define the name of the collection use in the database.
const COLLECTIONS = {
    LESSONS : "lessons",
    ORDERS : "orders",
    USERS : "users"
}


// Function to connect to the MongoDB database
export async function connectDatabase() {
    try {
        // Connect the MongoClient to the server.
        await CLIENT.connect();

        // Select the 'LearnEase' database.
        database = CLIENT.db("LearnEase");

        // Ensure all collections exist in the database.
        await ensureCollections();
    } catch (error) {
        // Log any errors that might have occured.
        console.error("MongoDB connection error: ", error);
        throw error
    }
}


// Function to make sure that all the required collections exists in the datbase.
async function ensureCollections() {
    try {
        // Get a list all all the collection in the database.
        const existingCollections = await database.listCollections(
            {},
            { nameOnly: true}
        ).toArray();

        // Format the name of the collection into an array.
        const existingCollectionNames = existingCollections.map(collection => collection.name)

        // Loop thought all the required collection defined in COLLECTIONS, then create the collection if it does not exist.
        for (const collectionName of Object.values(COLLECTIONS)) {
            if (!existingCollectionNames.includes(collectionName.toLowerCase())) {
                await database.createCollection(collectionName);
            }
        }
    } catch (error) {
        // Log any errors that occurs while ensuring the collection exist.
        console.error("Error in ensuring collections: ", error);
        throw error;
    }
}


// Function to get the database instance after it has been initialised.
export function getDatabase(){
    try {
        // If the database is not initalise, throw an error.
        if (!database) {
            throw new Error("Database is not initialise.");
        }

        // return the database instance.
        return database;
    } catch (error) {
        // Log any error that might happen when trying to retrieve the database.
        console.error("Error in getting database: ", error);
        throw error;
    }
}


// Function to get a specific collection by name from the database.
export function getCollection(collectionName) {
    try {
        // Get the instance of the database.
        const database = getDatabase();

        // Return the collection from the database.
        return database.collection(collectionName.toLowerCase());
    } catch (error) {
        // Log any errors that might happen when try to get a specific collection.
        console.error(`Error in getting collection "${collectionName}": `, error)
        throw error;
    }
}