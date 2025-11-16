// Import dependencies.
import express from "express"; // Import 'Express' framework and the router class to define route handlers.
import * as searchController from "../controllers/search.controller.js"; // Import all search controller as 'searchController'.


// Create a new router instance.
const searchRouter = express.Router();


// Get all search.
searchRouter.get("/", searchController.searchLesson);


// Export the router so it can be use in the main Express application.
export default searchRouter;