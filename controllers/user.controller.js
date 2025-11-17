// Import dependencies.
import { UserService } from "../services/user.service.js"; // Import the 'UserService' class to handle user related operation.
import { validateLogin, validateSignup, validateResetPassword } from "../validators/user.validator.js"; // Import validation function to validate request.
import { sendSuccess, sendCreated, sendBadRequest, sendError } from "../utils/response.js"; // Import utility function to send formatted HTTP responses.


// Create an instance of UserService.
const USERSERVICE = new UserService();


// Controller function to handle user login request.
export const login = async (request, response) => {
    try {

        // Validate the request body. If validation fail, log the errors and a send a 400 Bad Request response.
        const validation = validateLogin(request.body);
        if (!validation.isValid) {
            console.error("Login validate failed: ", validation.errors);
            return sendBadRequest(response, "Login validation failed", validation.errors);
        }

        // Destructure email and password from the the request body.
        const { email, password } = request.body;

        // Attempt to login user.
        const user = await USERSERVICE.loginUser(email, password);

        // Log a success and send a 200 Ok response with user data.
        console.log(`User logged in successfully: ${email}`);
        sendSuccess(response, email, "Login Sucessfull");
    } catch (error) {

        // Log any errors that occurs during login.
        console.error("Login error:", error);
        
        // Handle specific login error for invalid credentials.
        if (error.message === "Invalid email or password.") {
            return sendError(response, error.message, 401);
        }
        
        // Handle general server errors.
        sendError(response, error.message, 500);
    }
}


// Controller function to handle user signup.
export const signup = async (request, response) => {
    try {

        // Validate the request body. If validation fail, log the errors and a send a 400 Bad Request response.
        const validation = validateSignup(request.body);
        if (!validation.isValid) {
            console.error("Signup validate failed: ", validation.errors);
            return sendBadRequest(response, "Signup validation failed", validation.errors);
        }

        // Destructure email and password from the the request body.
        const { email, password } = request.body;

        // Attempt to signup user.
        const user = await USERSERVICE.createUser(email, password);

        // Log a success and send a 200 Ok response with user data.
        console.log(`User signed up successfully: ${email}`);
        sendCreated(response, email, 'User signed up successfully');
    } catch (error) {
        // Log any errors that occurs during signup.
        console.error("Signup error:", error);
        
        // Handle specific signup error for invalid credentials.
        if (error.message === "A user with this email already exist.") {
            return sendError(response, error.message, 401);
        }
        
        // Handle general server errors.
        sendError(response, error.message, 500);
    }
}


// Controller function to handle reset password.
export const resetPassword = async (request, response) => {
    try {

        // Validate the request body. If validation fail, log the errors and a send a 400 Bad Request response.
        const validation = validateResetPassword(request.body);
        if (!validation.isValid) {
            console.error("Reset Password validate failed: ", validation.errors);
            return sendBadRequest(response, "Reset Password validation failed", validation.errors);
        }

        // Destructure email and password from the the request body.
        const { email, password } = request.body;

        // Attempt to reset the password of the user.
        const user = await USERSERVICE.resetPassword(email, password);

        // Log a success and send a 200 Ok response with user data.
        console.log(`User password reset was successful: ${email}`);
        sendSuccess(response, email, "Reset Password Sucessfull");
    } catch (error) {
        // Log any errors that occurs during reset password.
        console.error("Reset Password error:", error);
        
        // Handle specific reset password error for invalid credentials.
        if (error.message === "No user with this email.") {
            return sendError(response, error.message, 401);
        }
        
        // Handle general server errors.
        sendError(response, error.message, 500);
    }
}