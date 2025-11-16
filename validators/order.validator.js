// Import helper function.
import { validateStringField, validateEmailField } from "../utils/validationHelper.js";


// Function to validate a phone number.
function validatePhoneNumber(phone, errors) {
    // Check if phone field is empty,
    if(!phone || phone.trim() === "") {
        errors.push({ field: "phone", message: "Phone is required."});
    // Check if the phone number matches the specified format.
    } else if (!/^\+?\d{7,15}$/.test(phone)) {
        errors.push({ field: "phone", message: "Invalid phone number format." });
    }
}

// Function to validate lesson IDs.
function validateLessonsData(lessonsData, errors) {
    // Check if array is missing or empty.
    if (!Array.isArray(lessonsData) || lessonsData.length === 0) {
        errors.push({ field: "lessonsData", message: "At least one lesson ID is required." });
    } else {
        // Check if lesson object data is correct.
        lessonsData.forEach((lesson, index) => {
            if (!lesson.id || lesson.id.trim() === "") {
                errors.push({ field: `lessonsData[${index}].lessonId`, message: "Lesson ID is required." });
            }
            if (isNaN(lesson.spaces) || parseInt(lesson.spaces) <= 0) {
                errors.push({ field: `lessonsData[${index}].spaces`, message: "Spaces must be at least 1." });
            }
        })
    }
}


// Function to validate create order data.
export function validateCreateOrder(data = {}) {
    const errors = [];
    
    // Validate data.
    validateStringField(data.name, "name", errors);
    validatePhoneNumber(data.phone, errors);
    validateLessonsData(data.lessonsData, errors);
    validateEmailField(data.email, "email", errors);

    // Return a validation objects.
    return {
        isValid: errors.length === 0,
        errors
    }
}