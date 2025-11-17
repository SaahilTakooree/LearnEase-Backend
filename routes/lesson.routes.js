// Import dependencies.
import express from "express"; // Import 'Express' framework and the router class to define route handlers.
import * as lessonController from "../controllers/lesson.controller.js"; // Import all lesson controller as 'lessonController'.


// Create a new router instance.
const lessonRouter = express.Router();


// Static routes.

// Get a lessons taught be a teacher.
lessonRouter.post("/taught", lessonController.getLessonByTeacher);

// Get a lessons a student is enrolled in.
lessonRouter.post("/enrolled", lessonController.getEnrolledLesson);


// CRUD routes. 
// Get all lesson.
lessonRouter.get("/", lessonController.getAllLessons);

// Create a new lesson.
lessonRouter.post("/", lessonController.createLesson);


// Dynamic routes.

// Get a specific lesson.
lessonRouter.get("/:id", lessonController.getLessonByID);

// Update an existing lesson.
lessonRouter.put("/:id", lessonController.updateLesson);

// Delete a lesson.
lessonRouter.delete("/:id", lessonController.deleteLesson);


// Export the router so it can be use in the main Express application.
export default lessonRouter; 