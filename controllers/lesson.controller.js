// Import dependencies.
import { LessonService } from "../services/lesson.service.js"; // Import the 'LessonService' class to handle lesson related operation.
import { validateCreateLesson, validateUpdateLesson, validationForTeacher, validationForEnrolled } from "../validators/lesson.validator.js"; // Import validation function to validate request.
import { sendSuccess, sendCreated, sendBadRequest, sendNotFound, sendError } from "../utils/response.js"; // Import utility function to send formatted HTTP responses.


// Create an instance of LessonService.
const LESSONSERVICE = new LessonService();


// Controller function to get all lesson request.
export const getAllLessons = async (request, response) => {
    try {
        // Get all user.
        const lessons = await LESSONSERVICE.getAllLessons();
        sendSuccess(response, lessons, "All lessons retrieved successfully.");
    } catch (error) {
        // Log any errors that might happen when when getting all lesson.
        console.error("Failed to retrieve all lessons", error)

        // Send an error responce.
        sendError(response, error.message, 500);
    }
}


// Controller function to get a specific lesson.
export const getLessonByID = async (request, response) => {
    try{
        // Get the lesson.
        const lesson = await LESSONSERVICE.getLessonById(request.params.id);

        // Send a not found reponse if no lesson is exist.
        if (!lesson) {
            return sendNotFound(response, `Lesson not found.`);
        }

        // Send a success response.
        sendSuccess(response, lesson, "Lesson retrieved successfully.")
    } catch (error) {
        // Log any errors that might happen when when getting a specific lesson.
        console.error("Fail to retrieve specific lesson", error);
        
        // Send an error responce.
        sendError(response, error.message, 400)
    }
}


// Controller function to handle lesson creation request.
export const createLesson = async (request, response) => {
    try{
        // Validate if the lesson data being passed in is correct. If not validate send a bad request responce.
        const validation = validateCreateLesson(request.body);
        if (!validation.isValid) {
            return sendBadRequest(response, "Lesson Validation failed", validation.errors);
        }

        // Create the lesson.
        const lesson = await LESSONSERVICE.createLesson(request.body);

        // Send a success response.
        sendCreated(response, lesson, "Lesson created successfully.");  
    } catch (error) {
        // Log any errors that occurs during lesson the creation of a lesson.
        console.error("Fail to create lesson", error);

        // Send an error responce.
        sendError(response, error.message, 500);
    }
}


// Controller function to the update of lesson request.
export const updateLesson = async (request, response) => {
    try{
        // Get the updateData from the body.
        const updateData = request.body;

        // Check if the updateData is empty.
        if (!updateData || Object.keys(updateData).length === 0) {
            return sendBadRequest(response, "No data provided to update.");
        }

        // Validate if the lesson data being passed in is correct. If not validate send a bad request responce.
        const validation = validateUpdateLesson(updateData);
        if (!validation.isValid) {
            return sendBadRequest(response, "Lesson validation failed", validation.errors);
        }

        // Get the lesson we trying to update. Send a not found responce if the lesson is not found.
        const lesson = await LESSONSERVICE.getLessonById(request.params.id);
        if (!lesson) {
            return sendNotFound(response, `Lesson not found for update.`);
        }

        // Update the data.
        const updatedLesson = await LESSONSERVICE.updateLesson(request.params.id, updateData);

        // Send a success response.
        sendSuccess(response, updatedLesson, "Lesson updated successfully.");
    } catch (error) {
        // Log any errors that occurs during lesson the update of a lesson.
        console.error("Fail to update lesson", error);

        // Send an error responce.
        sendError(response, `Failed to update lesson, ${error}`, 500);
    }
}


// Controller function to the deletion of lesson request.
export const deleteLesson = async (request, response) => {
    try{
        // Try to delete the lesson.
        const result = await LESSONSERVICE.deleteLesson(request.params.id);

        // If the the delete was not able to delete, send an error responce.
        if (!result) {
            return sendError(response, "Failed to delete lesson", 404);
        }

        // Send a success response.
        sendSuccess(response, result, "Lesson deleted successfully.");
    } catch (error) {
        // Log any errors that occurs during lesson deletion of a lesson.
        console.error("Fail to delete lesson", error);

        // Send an error responce.
        sendError(response, error.message, 400);
    }
}


// Controller function to get the lessons that someone taught.
export const getLessonByTeacher = async (request, response) => {
    try{
        // Validate if the email being passed in is valid. If not validate send a bad request responce.
        const validation = validationForTeacher(request.body);
        if (!validation.isValid) {
            return sendBadRequest(response, "Email validation failed.", validation.errors);
        }

        // Get all lessons that someone teaches.
        const lessons = await LESSONSERVICE.getLessonByTeacher(request.body.email);

        // Send a success response.
        sendSuccess(response, lessons, "Taught lessons retrieved successfully.");
    } catch (error) {
        // Log any errors that occurs during lesson taught lesson.
        console.error("Fail to get taught lesson", error);

        // Send an error responce.
        sendError(response, error.message, 500);
    }
}


// Controller function to get the lessons that someone is enrolled in.
export const getEnrolledLesson = async (request, response) => {
    try{
        // Validate if the email being passed in is valid. If not validate send a bad request responce.
        const validation = validationForEnrolled(request.body);
        if (!validation.isValid) {
            return sendBadRequest(response, "Email validation failed.", validation.errors);
        }

        // Get all lessons that someone is enrolled in
        const lessons = await LESSONSERVICE.getEnrolledLesson(request.body.email);

        // Send a success response.
        sendSuccess(response, lessons, "Enrolled lessons retrieved successfully.");
    } catch (error) {
        // Log any errors that occurs during lesson getting enrolled lesson.
        console.error("Fail to get enrolled in lesson", error);

        // Send an error responce.
        sendError(response, error.message, 500);
    }
}