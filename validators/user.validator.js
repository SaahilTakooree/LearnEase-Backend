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

// Functin to vlidate the password field.
function validatePassword(password, errors) {
    // Check if password is missing or empyty.
    if (!password || password.trim() === "") {
        errors.push({field: "password", message: "Password is required."});
    // Check if the password meets the minium length requirement.
    } else if (password.length < 6) {
        errors.push({ field: 'password', message: "Password must be at least 6 chracters." });
    }
}

// Functiont to validate login data.
function validateConfirmPassword(password, confirmPassword, errors) {
    // Check if confirmPassword is missing or empty.
    if (!confirmPassword || confirmPassword.trim() === "") {
        errors.push({field: "confirmPassword", message: "Please confirm password."});
    // Check if confirmPassword matches the original password.
    } else if (password !== confirmPassword) {
        errors.push({ field: 'confirmPassword', message: "Password do not match." });
    }
}


// Function to validate login data.
export function validateLogin(data) {
    const errors = []
    
    // Validate email and password for login.
    validateEmail(data.email, errors);
    validatePassword(data.password, errors);

    // Return a validation result object.
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Function to validate signup data.
export function validateSignup(data) {
    const errors = []
    
    // Validate email, password and confirm password for signup.
    validateEmail(data.email, errors);
    validatePassword(data.password, errors);
    validateConfirmPassword(data.password, data.confirmPassword, errors);

    // Return a validation result object.
    return {
        isValid: errors.length === 0,
        errors
    };
}

// Function to validate reset password data.
export function validateResetPassword(data) {
    const errors = []
    
    // Validate email, password and confirm password for password reset.
    validateEmail(data.email, errors);
    validatePassword(data.password, errors);
    validateConfirmPassword(data.password, data.confirmPassword, errors);

    // Return a validation result object.
    return {
        isValid: errors.length === 0,
        errors
    };
}