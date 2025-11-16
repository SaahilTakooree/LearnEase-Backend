// Function to add validate query.
export function validateSearchQuery(query = "") {
    const errors = [];

    // Check to see if there is not query or is empty.
    if (!query || query.trim() === "") {
        errors.push({ field: "query", message: "Search query is required." });
    }

    // Return a validation object.
    return {
        isValid: errors.length === 0,
        errors
    }
}