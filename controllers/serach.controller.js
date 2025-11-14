// Import dependencies.
import { SearchService } from "../services/search.service.js"; // Import the 'SearchService' class to handle order related operation.
import { validateSearchQuery } from "../validators/search.validator.js"; // Import validation function to validate request.
import { sendSuccess, sendBadRequest, sendError } from "../utils/response.js"; // Import utility function to send formatted HTTP responses.


// Create an instance of SearchService.
const SEARCHSERVICE = new SearchService();


// Controller function to get .
export const searchLesson = async (request, response) => {
    try {
        // Get the query from the request.
        const keyword = request.query.q;

        // Validate the query. If not valid, send a bad request.
        const validation = validateSearchQuery(keyword);
        if (!validation.isValid) {
            return sendBadRequest(response, "Invalid search input", validation.errors);
        }

        // Get the field that matches
        const results = await SEARCHSERVICE.searchLesson(keyword);

        // Send a success response.
        return sendSuccess(response, results, "Search result successfuly retreived.");
        
    } catch (error) {
        // Log any errors that occured during the searching the lesson collections.
        console.error("Error in searching the lesson collection:", error);

        // Send an error responce.
        return sendError(response, error.message, 500);
    }
}