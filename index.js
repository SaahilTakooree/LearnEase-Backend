// Import dependencies.
import 'dotenv/config' // Import and load environment variable from '.env' file into 'process.env'
import express from "express"; // Import 'Express.js' framework to create the server and handle HTTP requests.
import cors from "cors"; // Import 'CORS' middleware to allows the server to handle request from other domains.
import { loggerMiddleware } from "./middlewares/logger.js"; // Import 'loggerMiddleware' to log all request and responce.
import { staticFilesMiddlesware } from "./middlewares/staticFiles.js"; // Import 'staticFilesMiddlesware' to send static file to the frontend.
import { connectDatabase } from "./config/database.js"; // Import 'connectDatabase' function to handle the connection of the app to the server.


// Create an instance of Express application to define routes, middlesware and starting the server.
const app = express();

// Set the port that the server will listen on.
const port = process.env.PORT || 6969;


// Middleware.
app.use(cors()); // Enables CORS for all routes.
app.use(express.json()); // Allows for automatic parsing of incoming JSON payloads in request.
app.use(loggerMiddleware); // Allows for logging.
app.use(staticFilesMiddlesware); // Allows sending of static file to the front end.


// Asynchronous function to start the server.
async function startServer() {
    // Wait for the database to connect before starting the server.
    try {

        // Try to connect.
        await connectDatabase();

        // Dynamically import routes.
        const { default: routes } = await import('./routes/index.js');

        // Mount routes under '/api' path.
        app.use('/api', routes);

        // Start listening for incoming request on the specified port.
        app.listen(port, () => {
            console.log(`Server is running on port ${port}.`);
        });
    // If there is error when try to connect to the database, logs it then exit.
    } catch (error) {
        console.error("Fail to start server: ", error)
        process.exit(1);
    }
}


// Call function 'startServer' to inialise the database connection.
startServer();