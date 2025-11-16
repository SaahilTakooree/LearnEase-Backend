// Function to validate a string field.
function validateStringField(fieldValue, fieldName, errors) {
    // Check if field is missing or empty.
    if (!fieldValue || fieldValue.toString().trim() === "") {
        errors.push({ field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`})
    }
}

// Function to validate a number field.
function validateNumberField(fieldValue, fieldName, minimum = 0, errors) {
    // Check if field is missing or empty.
    if (fieldValue == null || fieldValue === "") {
        errors.push({ field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.` });
    // if field is number and is not less than min.
    } else if (isNaN(fieldValue) || parseInt(fieldValue) < minimum) {
        errors.push({ field: fieldName, message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be  at least ${minimum}.` });
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

// Function to validate image.
function validateImage(image, errors) {
    // List of image allowed
    const allowedImages = [
        "art.jpeg",
        "biology.jpeg",
        "chemistry.jpeg",
        "computer.jpeg",
        "default.jpeg",
        "english.jpeg",
        "history.jpeg",
        "math.jpeg",
        "music.jpeg",
        "pe.jpeg",
        "physics.jpeg"
    ];

    // Validate image.
    if (typeof image !== "string" || !allowedImages.includes(image)) {
        errors.push({ field: "image", message: `Invalid image. Must be one of: ${allowedImages.join(", ")}.` });
    }
}

// Function to validate students field.
function validateStudents(students = {}, errors) {
    // Validate "action".
    if (!students.action || !["add", "remove"].includes(students.action)) {
        errors.push({ field: "students.action", message: "Object 'action' is required. Action must be either 'add' or 'remove'." });
    }

    // Validate "student" object.
    if (!students.student || typeof students.student !== "object") {
        errors.push({ field: "students.student", message: "Object 'student' is required." });
    } else {
        const student = students.student;

        // Validate student email.
        validateStudentEmail(student.email, errors);

        // Validate student space only if action is add
        if (students.action === "add") {
            validateNumberField(student.space, "space", 1, errors);
        }
    }
}


// Function to validate create lesson data.
export function validateCreateLesson(data = {}) {
    const errors = [];

    // Validate data.
    validateStringField(data.name, "name", errors);
    validateStringField(data.description, "description", errors);
    validateStringField(data.topic, "topic", errors);
    validateStringField(data.location, "location", errors);
    validateNumberField(data.space, "space", 5, errors);
    validateNumberField(data.price, "price", 0, errors);
    validateStudentEmail(data.createdBy, errors);
    if (data.image !== undefined) {
        validateImage(data.image, errors);
    }

    // Return a validation result object.
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Function to validate update lesson data.
export function validateUpdateLesson(data = {}) {
    const errors = [];

    // Validate data.
    if (data.name !== undefined) {
        validateStringField(data.name, "name", errors);
    }

    if (data.description !== undefined) {
        validateStringField(data.description, "description", errors);
    }

    if (data.topic !== undefined) {
        validateStringField(data.topic, "topic", errors);
    }

    if (data.location !== undefined) {
        validateStringField(data.location, "location", errors);
    }

    if (data.space !== undefined) {
        validateNumberField(data.space, "space", 5, errors);
    }

    if (data.availableSpace !== undefined) {
        validateNumberField(data.availableSpace, "availableSpace", 0, errors);
    }

    if (data.price !== undefined) {
        validateNumberField(data.price, "price", 0, errors);
    }

    if (data.students !== undefined) {
        validateStudents(data.students, errors);
    }

    if (data.createdBy !== undefined) {
        validateStudentEmail(data.createdBy, errors);
    }

    if (data.image !== undefined) {
        validateImage(data.image, errors);
    }
    
    // Return a validation result object.
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Function to validate email for getTeacher.
export function validationForTeacher(data = {}) {
    const errors = [];

    // Validate email.
    validateStudentEmail(data.email, errors);

    // Return a validation object.
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Function to validate email for getEnrolled.
export function validationForEnrolled(data = {}) {
    const errors = [];

    // Validate email.
    validateStudentEmail(data.email, errors);

    // Return a validation object.
    return {
        isValid: errors.length === 0,
        errors
    };
}