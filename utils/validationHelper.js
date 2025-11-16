// Capitalise the first letter of a field name.
function formatFieldName(fieldName) {
    return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
}


// Function to validate a string field.
export function validateStringField(fieldValue, fieldName, errors) {
    // Check if field is missing or empty.
    if (!fieldValue || fieldValue.toString().trim() === "") {
        errors.push({ field: fieldName, message: `${formatFieldName(fieldName)} is required.`})
    }
}


// Function to validate a number field.
export function validateNumberField(fieldValue, fieldName, minimum = 0, errors) {
    // Check if field is missing or empty.
    if (fieldValue == null || fieldValue === "") {
        errors.push({ field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.` });
    // If field is number and is not less than mininum.
    } else if (isNaN(fieldValue) || parseInt(fieldValue) < minimum) {
        errors.push({ field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be  at least ${minimum}.` });
    }
}

// Function to validate the email field.
export function validateEmailField(fieldValue, fieldName = "email", errors) {
    // Check if email is missing or empty.
    if (!fieldValue || fieldValue.trim() === "") {
        errors.push({ field: fieldName, message: `${formatFieldName(fieldName)} is required.` });
    // Check if email format is invalid using a regex pattern.
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
        errors.push({ field: fieldName, message: `Invalid ${fieldName} format.` });
    }
}