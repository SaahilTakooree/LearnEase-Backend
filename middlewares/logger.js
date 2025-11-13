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


// Function to write a message to the log file.
function writeLog(level, message) {
    try {
        // Rotate the file before writing the new message.
        rotateLogs();

        // Get the current log file path.
        const logFile = getLogFile();

        // Get the current time.
        const timestamp = new Date().toISOString();
        
        // Format the data before inserting it.
        const formatted = `[${level}] ${timestamp} ${message}\n`;

        // Write the message the file.
        fs.appendFileSync(logFile, formatted, "utf-8");
    } catch (error) {
        console.error("Logger failed:", error);
    }
}


// Helper function to strignify object and hide sentive data.
function strignifyObject(object) {
    try {
        // Return if the passin argument if it is not of type of object or empty.
        if (!object || typeof object !== "object") {
            return object
        }

        // Get a copy of the object being passed in
        const copyObject = {...object};

        // Hide sentive data
        const sensitiveKeys = ["password", "confirmPassword"];
        for (const key of Object.keys(copyObject)) {
            if (sensitiveKeys.includes(key.toLowerCase())) {
                copyObject[key] = "**HIDDEN FOR PRIVACY**";
            }
        }

        // return a stringify of the clone object.
        return JSON.stringify(copyObject, null, 2);
    } catch {
        return "[Unserialisable data.]"
    }
}


// Override the console method to log console log to the file.
const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
};

console.log = (...args) => {
    const message = args.map(a => (typeof a === "object" ? strignifyObject(a) : a)).join(" ");
    writeLog("LOG", message);
    originalConsole.log(...args);
}

console.info = (...args) => {
    const message = args.map(a => (typeof a === "object" ? strignifyObject(a) : a)).join(" ");
    writeLog("INFO", message);
    originalConsole.info(...args);
}

console.warn = (...args) => {
    const message = args.map(a => (typeof a === "object" ? strignifyObject(a) : a)).join(" ");
    writeLog("WARN", message);
    originalConsole.warn(...args);
}

console.error = (...args) => {
    const message = args.map(a => (typeof a === "object" ? strignifyObject(a) : a)).join(" ");
    writeLog("ERROR", message);
    originalConsole.error(...args);
}


// Express the middleware function to log all incoming request and outgoing responce.
export function loggerMiddleware(request, response, next) {

    // Record the start time of the request.
    const start = Date.now()

    // Mask sensitive info in the request body
    const maskedSensitveInfo = request.body && Object.keys(request.body).length ? strignifyObject(request.body) : "{}";

    // Format and write the request information to the log.
    const requestInfo = `${request.method} ${request.originalUrl} IP:${request.ip} Body: ${maskedSensitveInfo}`;
    writeLog("REQUEST", requestInfo);

    // Get the original response send functio to log the payloads.
    const originalSend = response.send;
    response.send = function (body) {
        const duration = Date.now() - start;

        const responseBody = typeof body === "object" ? strignifyObject(body) : String(body);

        const responseInfo = `${request.method} ${request.originalUrl} Status: ${response.statusCode} Duration: ${duration}ms Body: ${responseBody}`;
        writeLog("RESPONSE", responseInfo);

        return originalSend.call(this, body);
    }

    // Pass the control to the next middleware.
    next();
}