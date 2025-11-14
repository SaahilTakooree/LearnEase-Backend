// Import depencies.
import { availableMemory } from "process";
import { getCollection, COLLECTIONS} from "../config/database.js"; // Import helper function to access the database and collections.
import { ObjectId } from "mongodb"; // Used to create and validate MongoDB Object IDs for documents. 


export class LessonService {

    // Initialise the LESSONS collections to perform database operations.
    constructor() {
        this.collection = getCollection(COLLECTIONS.LESSONS);
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

            // Insert new lesson to the lesson collection.
            const result = await this.collection.insertOne({
                name: lessonData.name,
                description: lessonData.description,
                topic: lessonData.topic,
                location: lessonData.location,
                space: parseInt(lessonData.space),
                avaliableSpace: parseInt(lessonData.space),
                price: parseFloat(lessonData.price),
                students: [],
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

            // Calculate total booked space by summing all students' space.
            const bookedSpace = lesson.students
                ? lesson.students.reduce((total, student) => total + (student.space || 0), 0)
                : 0;

            // Map all updated date to their correspondinf field.
            const updateFields = {};

            for (const [key, value] of Object.entries(updateData)) {
                if (key === "space") {
                    const newSpace = parseInt(value);
                    if (newSpace < bookedSpace) {
                        throw new Error(`Space cannot be less than the number of booked spaces: ${bookedSpace}`);
                    }
                    updateFields.space = newSpace;
                    updateFields.avaliableSpace = newSpace - bookedSpace;
                } else if (key === "price") {
                    updateFields.price = parseFloat(value);
                } else {
                    updateFields[key] = value;
                }
            }
            
            // Update the updated time at field.
            updateFields.updatedAt = new Date();

            // Update the lesson collection.
            const result = await this.collection.findOneAndUpdate(
                { _id: lessonId },
                { $set: updateFields },
                { returnDocument: 'after'}
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


    // Function to add a student to a lessons.
    async addStudentToLesson(lessonId, studentEmail, space = 1, session = null) {
        try {
            // Check if the lesson id is valid.
            const id = this.validateId(lessonId);

            // Check if the lesson exist.
            const lesson = await this.getLessonById(id);
            if (!lesson) {
                throw new Error("Lesson not found.");
            }

            // Check if there is space in this lesson.
            if (lesson.avaliableSpace <= 0) {
                throw new Error("No space Avaliable in this lesson.")
            }

            // Check if there is enought space for the the amount of space being orders.
            if (lesson.avaliableSpace < space) {
                throw new Error("Space cannot be ordered lesson than the number of avaliable space.");
            }

            // Check if student already enrolled
            const existingStudent = lesson.students.find(s => s.email === studentEmail);

            // Variable to store the update data.
            let updatedLesson

            const options = { returnDocument: "after" };
            if (session) options.session = session;

            // if student allready exist, increse their space
            if (existingStudent) {
                updatedLesson = await this.collection.findOneAndUpdate(
                    {
                        _id: id,
                        "students.email": studentEmail
                    },
                    {
                        $inc: {
                            "students.$.space": space,
                            avaliableSpace: -space
                        },
                        $set: { updatedAt: new Date() }
                    },
                    options
                );
            } else {
                // Update the lesson collection with new student.
                updatedLesson = await this.collection.findOneAndUpdate(
                    { _id: id },
                    { 
                        $push: { students: { email: studentEmail, space: space } },
                        $set: {
                            avaliableSpace: lesson.avaliableSpace - space,
                            updatedAt: new Date()
                        }
                    },
                    options
                );
            }

            console.log(`Add student to lesson with id: ${id}`);

            // Return lesson object.
            return updatedLesson;
        } catch (error) {
            console.error(`Error in adding student to lesson: ${lessonId}`, error);
            throw error;
        }   
    }


    // Function to remove a student form a lesson.
    async removeStudentFromLesson(lessonId, studentEmail, space = 1) {
        try {
            // Check if the lesson id is valid.
            const id = this.validateId(lessonId);

            // Check if student is enrolled in that lesson.
            const lesson = await this.collection.findOne({ 
                _id: id, 
                "students.email": studentEmail 
            });
            if (!lesson) {
                throw new Error(`No student with this email is enrolled in this lesson: LessonID: ${lessonId}, email: ${studentEmail}`)
            }

            // Check if space being add exceed the the number of space
            if (lesson.space <= lesson.avaliableSpace + space) {
                throw new Error("Space cannot be ordered lesson than the number of avaliable space.");
            }

            // Remove student from lesson.
            const result = await this.collection.findOneAndUpdate(
                { _id: id },
                { 
                    $pull: { students: { email: studentEmail } },
                    $set: {
                        avaliableSpace: lesson.avaliableSpace + space,
                        updatedAt: new Date()
                    }
                },
                { returnDocument: 'after'}
            );
            
            console.log(`Student remove from lesson: ${id}`);

            // Return the updated lesson object.
            return result
        } catch (error) {
            console.error(`Error in remove student from lesson: ${lessonId}`, error);
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
}