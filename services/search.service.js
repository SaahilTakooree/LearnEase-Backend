// Import depencies.
import { getCollection, COLLECTIONS } from "../config/database.js"; // Import helper function to access the database and collections.


export class SearchService {
    
    // Initialise the LESSONS collections to perform search.
    constructor() {
        this.lessonCollection = getCollection(COLLECTIONS.LESSONS);
    }

    
    //Function to search though the lesson collection.
    async searchLesson(keyword) {
        try {
            const regex = new RegExp(keyword, "i");
                const query = [
                { name: regex },
                { description: regex },
                { topic: regex },
                { location: regex }
            ];

            // If keyword is a number, also search numeric fields.
            if (!isNaN(keyword)) {
                const numKeyword = Number(keyword);
                query.push({ price: numKeyword });
                query.push({ space: numKeyword });
                query.push({ availableSpace: numKeyword });
            }

            const results = await this.lessonCollection.find({ $or: query }).toArray();

            console.log(`Search: '${keyword}'. returned ${results.length} results.`);

            return results;
        } catch (error) {
            console.error("Error in searching the lesson collection:", error);
            throw error;
        }
    }
}