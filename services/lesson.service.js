// Import depencies.
import { getCollection, COLLECTIONS} from "../config/database.js"; // Import helper function to access the database and collections.
import { UserService } from "./user.service.js"; // Import user service to access the users service.
import { ObjectId } from "mongodb"; // Used to create and validate MongoDB Object IDs for documents.


export class LessonService {

    // Initialise the LESSONS collections to perform database operations.
    constructor() {
        this.collection = getCollection(COLLECTIONS.LESSONS);
        this.userService = new UserService();
    }


    // Helper function to validate all ID format.
    validateId(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error('Invalid lesson ID format.');
        }

        return new ObjectId(id)
    }


    // Function to get all lessons.
    async getAllLessons() {
        try {
            const lessons = await this.collection.find({}).toArray();
            console.log("Getting all lesson.");

            // return an array of all lessons object.
            return lessons;
        } catch (error) {
            console.error ("Error in fetching all lessons", error);
            throw error;
        }
    }


    // Function to get a lesson by its id.
    async getLessonById(id) {
        try {
            // Check if the lesson id is valid.
            const lessonId = this.validateId(id);

            // Get the lesson by its id.
            const lesson = await this.collection.findOne({ _id: lessonId });

            console.log(`Getting lesson with id: ${lessonId}`);

            // Return a lesson object.
            return lesson;
        } catch (error) {
            console.error(`Error in fetching lesson with id: ${id}`, error);
            throw error
        }
    }


    // Function to create a new lesson.
    async createLesson(lessonData) {
        try {
            // if created by lesson createdby is provided.. check it that user exist.
            if (lessonData.createdBy) {
                const user = await this.userService.findByEmail(lessonData.createdBy);
                if (!user) {
                    throw new Error(`User with email ${lessonData.createdBy} does not exist.`);
                }
            }

            // Check if lesson already exist.
            await this.duplicateCheck(lessonData);

            // Insert new lesson to the lesson collection.
            const result = await this.collection.insertOne({
                name: lessonData.name,
                description: lessonData.description,
                topic: lessonData.topic,
                location: lessonData.location,
                space: parseInt(lessonData.space),
                availableSpace: parseInt(lessonData.space),
                price: parseFloat(lessonData.price),
                students: [],
                image: lessonData.image ? `/images/lessons/${lessonData.image}` : "/images/lessons/other.jpeg",
                createdBy: lessonData.createdBy,
                createdAt: new Date(),
                updatedAt: new Date()
            });

            console.log("Lesson Created.");

            // Return the created lesson object.
            return await this.getLessonById(result.insertedId.toString());
        } catch (error) {
            console.error("Error in creating lesson.", error);
            throw error;
        }       
    }


    // Function to update a lesson data.
    async updateLesson(id, updateData) {
        try {
            // Check if the lesson id is valid.
            const lessonId = this.validateId(id);
            const lesson = await this.getLessonById(lessonId);

            // Check if lesson already exist.
            await this.duplicateCheck(updateData, lessonId);

            // Calculate total booked space by summing all students' space.
            const bookedSpace = lesson.students
                ? lesson.students.reduce((total, student) => total + (student.space || 0), 0)
                : 0;

            // Prepare temp variables if both are provided.
            let newSpace = null;
            let newAvailableSpace = null;
            let studentAction = null;
            let email = null;
            let space = null

            // Map all updated date to their correspondinf field.
            const updateFields = {};

            // List of al fields that be updated.
            const allowedFields = ["name", "description", "topic", "location", "space", "availableSpace", "price", "students", "image", "createdBy", "createdAt", "updatedAt"];

            for (const [key, value] of Object.entries(updateData)) {
                // check if key is allows to be modify.
                if (!allowedFields.includes(key)) {
                    throw new Error(`Field '${key}' is not a recognised field. Allowed fields are: ${allowedFields.join(", ")}`);
                }

                if (key === "space") {
                    newSpace = parseInt(value);
                } else if (key === "availableSpace") {
                    newAvailableSpace = parseInt(value);
                    if (newAvailableSpace < 0) {
                        throw new Error(`Available space cannot be less than zero.`);
                    }
                } else if (key === "price") {
                    updateFields.price = parseFloat(value);
                } else if (key === "createdBy") {
                    // if lesson createdby is provided.. check it that user exist.
                    const user = await this.userService.findByEmail(value);
                    if (!user) {
                        throw new Error(`User with email ${value} does not exist.`);
                    }
                } else if (key === "students") {
                    // Get the action and student info from body.
                    const { action, student } = value;

                    // Validate action object
                    if (!action || typeof action !== "string") {
                        throw new Error("Invalid or missing 'action' field inside 'students'. Must be 'add' or 'remove'.");
                    }

                    studentAction = action.trim().toLowerCase();

                    if (studentAction !== "add" && studentAction !== "remove") {
                        throw new Error("Invalid 'action' value. Must be 'add' or 'remove'.");
                    }

                    // Validate student object
                    if (!student) {
                        throw new Error("Missing 'student' object inside 'students'. Must include email and optionally space.");
                    }

                    email = student.email;
                    space = parseInt(student.space);

                    if (!email) {
                        throw new Error ("Missing 'email' field inside 'student' object.");
                    }

                    // if lesson createdby is provided.. check it that user exist.
                    const user = await this.userService.findByEmail(email);
                    if (!user) {
                        throw new Error(`User with email ${email} does not exist.`);
                    }

                    // Only require 'space' if adding a student.
                    if (studentAction === "add" && !space ) {
                        throw new Error("Missing 'space' field inside 'student' object.");
                    // If Action is to remove a student.
                    } else if (studentAction === "remove") {
                        // Get the student record.
                        const existingStudent = lesson.students.find(s => s.email === email);

                        // If student record does not exist.
                        if (!existingStudent) {
                            throw new Error(`Student with email ${email} is not enrolled in lesson with id: ${lessonId}`);
                        }

                        space = existingStudent.space
                    }
                } else {
                    updateFields[key] = value;
                }
            }

            // Determine final booked space after action.
            let futureBookedSpace = Number(bookedSpace);
            let studentSpace = Number(space);
            
            if (studentAction === "add") {
                futureBookedSpace += studentSpace;
            } else if (studentAction === "remove") {
                futureBookedSpace -= studentSpace;
            }

            // Validate space vs booked space.
            if (newSpace !== null && newSpace < futureBookedSpace) {
                throw new Error(`Space cannot be less than the number of booked spaces after this operation: ${futureBookedSpace}.`);
            }

            // Determine final available space.
            let finalAvailableSpace = null;
            let finalSpace = null;

            if (newSpace !== null && newAvailableSpace !== null) {
                // Validate consistency.
                finalSpace = newSpace;
                finalAvailableSpace = newSpace - futureBookedSpace;
                if (finalAvailableSpace !== newAvailableSpace) {
                    throw new Error(`Invalid space/availableSpace combination. After action, expected availableSpace=${finalAvailableSpace}, but got ${newAvailableSpace}`);
                }
            } else if (newSpace !== null) {
                // if only space is provided, calculate availableSpace.
                finalSpace = newSpace;
                finalAvailableSpace = newSpace - futureBookedSpace;
            } else if (newAvailableSpace !== null) {
                // If only avaliable space is provided, calculate space.
                finalSpace = futureBookedSpace + newAvailableSpace;
                finalAvailableSpace = newAvailableSpace;
            } else if (studentAction !== null) {
                // Student action but no explicit space/availableSpace, then recalculate based on current lesson space.
                finalSpace = lesson.space;
                finalAvailableSpace = lesson.space - futureBookedSpace;
            }

            // Validate adding student does not exceed lesson space.
            const totalSpace = newSpace !== null ? newSpace : lesson.space;
            if (studentAction === "add" && futureBookedSpace > totalSpace) {
                throw new Error(`Cannot add student. Requested space (${studentSpace}) exceeds available space (${totalSpace - bookedSpace}).`);
            }

            // Only assign space/availableSpace to updateFields if they were calculated.
            if (finalSpace !== null) {
                updateFields.space = finalSpace;
            }
            if (finalAvailableSpace !== null) {
                updateFields.availableSpace = finalAvailableSpace;
            }

            // Update the updated time at field.
            updateFields.updatedAt = new Date();

            // Update the lesson collection.
            const result = await this.collection.findOneAndUpdate(
                { _id: lessonId },
                {
                    $set: {
                        ...updateFields,
                        // Update the students array.
                        students: (() => {
                            // Clone existing students array or empty if none.
                            const currentStudents = Array.isArray(lesson.students) ? [...lesson.students] : [];

                            if (studentAction === "add" && email) {
                                // Check if student already exists.
                                const existing = currentStudents.find(s => s.email === email);
                                if (existing) {
                                    // Increment space if student exists.
                                    existing.space = Number(existing.space) + Number(space);
                                } else {
                                    // Add new student.
                                    currentStudents.push({ email, space: Number(space) });
                                }
                            } else if (studentAction === "remove" && email) {
                                // Remove student from array.
                                const index = currentStudents.findIndex(s => s.email === email);
                                if (index > -1) {
                                    currentStudents.splice(index, 1);
                                }
                            }

                            return currentStudents;
                        })()
                    },
                },
                { returnDocument: 'after' }
            );

            console.log(`Update lesson with id: ${lessonId}`);

            // Return the update lesson object.
            return result;
        } catch (error) {
            console.error(`Error in updating lesson with id: ${id}`);
            throw error;
        }
    }

    
    // Function to deleteLesson by its id.
    async deleteLesson(id) {
        try {
            // Check if the lesson id is valid.
            const lessonId = this.validateId(id);

            // Check to see if the lesson exist first.
            const lesson = await this.getLessonById(lessonId)
            if (!lesson) {
                throw new Error(`Error in deleting lesson. Lesson with id ${lessonId} does not exist.`);
            }

            // Delete the lesson from the collection.
            const result = await this.collection.deleteOne({ _id: lessonId });

            console.log("Lesson deleted.");

            // return a success.
            return result.deletedCount > 0;
        } catch (error) {
            console.error(`Error in deleting lesson with id: ${id}`, error)
            throw error;
        }
        
    }


    // Function to get all lesson that someone teaches.
    async getLessonByTeacher(email) {
        try {
            // Fetch all lesson of a teacher.
            const lessons = await this.collection.find({
                createdBy: email
            }).toArray();

            console.log(`Return all lesson for teacher: ${email}`);

            // Return all lesson that a teacher provides.
            return lessons;
        } catch (error) {
            console.error(`Error in fetching lesson for teacher: ${email}`, error);
            throw error;
        }
        
    }

    
    // Function to get the lesson someone is enrolled in.
    async getEnrolledLesson(email) {
        try {
            // Fetch all lesson that someone is enrolled in.
            const lessons = await this.collection.find({
                "students.email" : email
            }).toArray();

            console.log(`Return all lesson that someone is enrolled in: ${email}`);

            // Return all lessonthat someone is enrolled in.
            return lessons
        } catch (error) {
            console.error(`Error in fetching enrolled lessons for: ${email}`, error);
            throw error;
        }
    }


    // Function to check if lesson already exist.
    async duplicateCheck(lessonData) {
        // Check if lesson with lesson data already exist. if yes throw an error.
        const query = {
            name: lessonData.name,
            topic: lessonData.topic,
            location: lessonData.location,
            space: parseInt(lessonData.space),
            price: parseFloat(lessonData.price),
            image: `/images/lessons/${lessonData.image}`
        };

        const existingLesson = await this.collection.findOne(query);
        if (existingLesson) {
            throw new Error("Lesson already exists.");
        }
    }
}