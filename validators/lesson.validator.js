import { error } from "console";

// Function to validate the name field.
function validateName(name, errors) {
    // Check if name is missing or empty.
    if (!name || name.trim() === "") {
        errors.push({ field: "name", message: "Name is required." })
    }
}

// Function to validate the description field.
function validateDescription(description, errors) {
    // Check if description is missing or empty.
    if (!description || description.trim() === "") {
        errors.push({ field: "description", message: "Description is required." })
    }
}

// Function to validate the topic field.
function validateTopic(topic, errors) {
    // Check if topic is missing or empty.
    if (!topic || topic.trim() === "") {
        errors.push({ field: "topic", message: "Topic is required." })
    }
}

// Function to validate the location field.
function validateLocation(location, errors) {
    // Check if location is missing or empty.
    if (!location || location.trim() === "") {
        errors.push({ field: "location", message: "Location is required." })
    }
}

// Function to validate the space field.
function validateSpace(space, errors) {
    // Check if space is missing or empty.
    if (space == null || space === "") {
        errors.push({ field: "space", message: "Space is required." });
    // Check if space is a number and is not less than 5.
    } else if (isNaN(space) || parseInt(space) < 5) {
        errors.push({ field: "space", message: "Space must be a number and at a least 5." });
    }
}

// Function to validate the price field.
function validatePrice(price, errors) {
    // Check if price is missing or empty.
    if (price == null || price === "") {
        errors.push({ field: "price", message: "Price is required." });
    // if price is number and is not less than zero.
    } else if (isNaN(price) || parseInt(price) < 0) {
        errors.push({ field: "price", message: "Price must be a valid positive number." });
    }
}

// Function to validate the email field.
function validateStudentEmail(email, errors) {
    // Check if email is missing or empty.
    if (!email || email.trim() === "") {
        errors.push({field: "email", message: "Email is required."});
    // Check if email format is invalid using a regex pattern.
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push({ field: 'email', message: "Invalid email format." });
    }
}


// Function to validate create lesson data.
export function validateCreateLesson(data) {
    const errors = [];

    // Validate data.
    validateName(data.name, errors);
    validateDescription(data.description, errors);
    validateTopic(data.topic, errors);
    validateLocation(data.location, errors);
    validateSpace(data.space, errors);
    validatePrice(data.price, errors);

    // Return a validation result object.
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Function to validate update lesson data.
export function validateUpdateLesson(data) {
    const errors = [];

    // Validate data.
    if (data.name !== undefined) {
        validateName(data.name, errors);
    }

    if (data.description !== undefined) {
        validateDescription(data.description, errors);
    }

    if (data.topic !== undefined) {
        validateTopic(data.topic, errors);
    }

    if (data.location !== undefined) {
        validateLocation(data.location, errors);
    }

    if (data.space !== undefined) {
        validateSpace(data.space, errors);

    }

    if (data.price !== undefined) {
        validatePrice(data.price, errors);
    }
    
    // Return a validation result object.
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Function to add validate add lesson data.
export function validateAddStudent(data){
    const errors = [];

    // Validate data.
    validateStudentEmail(data.email, errors);

    // Return a validation object.
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Function to remove validate remove lesson data.
export function validateRemoveStudent(data) {
    const errors = [];

    // Validate data.
    validateStudentEmail(data.email, errors);

    // Return a validation object.
    return {
        isValid: errors.length === 0,
        errors
    };
}