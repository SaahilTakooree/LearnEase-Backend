// Import 'path' and 'fs' to handle file paths and file system operations.
import path from "path";
import fs from "fs";


// Define the directory of where the log file will be store.
const LOG_DIRECTORY = path.join(process.cwd(), "logs");

// Set the maximum size of a single log file.
const MAX_LOG_SIZE = 5 * 1024 * 1024;


// Create the directory if it does not exist.
if (!fs.existsSync(LOG_DIRECTORY)) {
    fs.mkdirSync(LOG_DIRECTORY, { recursive : true })
};


// Function to get the path of the current day's log file.
function getLogFile() {
    // Format the current date as YYYY-MM-DD.
    const currentDate = new Date().toISOString().slice(0, 10);
    return path.join(LOG_DIRECTORY, `${currentDate}.log`);
}


// Function to rotate log file for space saving.
function rotateLogs() {

    // Get the list of all files in the log directory.
    const files = fs.readdirSync(LOG_DIRECTORY);

    // Get the current day's log file path.
    const currentFilePath = getLogFile();

    // Delete all the log that is not the current day's log file.
    for (const file of files) {
        const filePath = path.join(LOG_DIRECTORY, file);
        if (filePath !== currentFilePath) {
            fs.rmSync(filePath, { force : true })
        }
    }

    // Delete the current log file, if it exceeds the max size.
    if (fs.existsSync(currentFilePath)) {
        const stats = fs.statSync(currentFilePath);
        if (stats.size >= MAX_LOG_SIZE) {
            fs.rmSync(currentFilePath, { force : true })
        }
    }
}


// Function to write a message to the log file and the console.
function writeLog(message) {

    // Rotate the file before writing the new message.
    rotateLogs();

    // Get the current log file path.
    const logFile = getLogFile();

    // Write the message the file and the console.
    fs.appendFileSync(logFile, message + "\n", "utf-8");
    console.log(message);
}


// Express the middleware function to log all incoming request and outgoing responce.
export function loggerMiddleware(request, response, next) {

    // Record the start time of the request.
    const start = Date.now()

    // Format and write the request information to the log.
    const requestInfo = `[REQUEST] ${start.toString()} ${request.method} ${request.originalUrl} IP:${request.ip}`;
    writeLog(requestInfo);

    // Log when the responses finishes.
    response.on("finish", () => {
        const duration = Date.now() - start;
        const responseInfo = `[RESPONCE] ${new Date().toISOString()} Status: ${response.statusCode} Duration: ${duration}ms`;
        writeLog(responseInfo);
    });

    // Pass the control to the next middleware.
    next();
}