import path from "path";
import fs from "fs";

const LOG_DIRECTORY = path.join(process.cwd(), "logs");
const MAX_LOG_SIZE = 5 * 1024 * 1024;

if (!fs.existsSync(LOG_DIRECTORY)) {
    fs.mkdirSync(LOG_DIRECTORY, { recursive : true })
};


function getLogFile() {
    const currentDate = new Date().toISOString().slice(0, 10);
    return path.join(LOG_DIRECTORY, `${currentDate}.log`);
}


function rotateLogs() {
    const files = fs.readdirSync(LOG_DIRECTORY);
    const currentFilePath = getLogFile();

    for (const file of files) {
        const filePath = path.join(LOG_DIRECTORY, file);
        if (filePath !== currentFilePath) {
            fs.rmSync(filePath, { force : true })
        }
    }

    if (fs.existsSync(currentFilePath)) {
        const stats = fs.statSync(currentFilePath);
        if (stats.size >= MAX_LOG_SIZE) {
            fs.rmSync(currentFilePath, { force : true })
        }
    }
}


function writeLog(message) {
    rotateLogs();
    const logFile = getLogFile();
    fs.appendFileSync(logFile, message + "\n", "utf-8");
    console.log(message);
}


export function loggerMiddleware(request, response, next) {
    const start = Date.now()

    const requestInfo = `[REQUEST] ${new Date().toISOString()} ${request.method} ${request.originalUrl} IP:${request.ip}`;
    writeLog(requestInfo);

    response.on("finish", () => {
        const duration = Date.now() - start;
        const responseInfo = `[RESPONCE] ${new Date().toISOString()} Status: ${response.statusCode} Duration: ${duration}ms`;
        writeLog(responseInfo);
    });

    next();
}