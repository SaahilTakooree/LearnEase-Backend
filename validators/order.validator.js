// Function to validate a string field.
function validateStringField(fieldValue, fieldName, errors) {
    // Check if field is missing or empty.
    if (!fieldValue || fieldValue.trim() === "") {
        errors.push({ field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`})
    }
}

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

// Function to validate the email field.
function validateEmail(email, errors) {
    // Check if email is missing or empty.
    if (!email || email.trim() === "") {
        errors.push({field: "email", message: "Email is required."});
    // Check if email format is invalid using a regex pattern.
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push({ field: 'email', message: "Invalid email format." });
    }
}


// Function to validate create order data.
export function validateCreateOrder(data = {}) {
    const errors = [];
    
    // Validate data.
    validateStringField(data.name, "name", errors);
    validatePhoneNumber(data.phone, errors);
    validateLessonsData(data.lessonsData, errors);
    validateEmail(data.email, errors);

    // Return a validation objects.
    return {
        isValid: errors.length === 0,
        errors
    }
}