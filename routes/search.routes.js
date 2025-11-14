// Import dependencies.
import express from "express"; // Import 'Express' framework and the router class to define route handlers.
import * as serachController from "../controllers/serach.controller.js"; // Import all serach controller as 'serachController'.


// Create a new router instance.
const searchRouter = express.Router();


// Get all search.
searchRouter.get("/", serachController.searchLesson);


// Export the router so it can be use in the main Express application.
export default searchRouter;