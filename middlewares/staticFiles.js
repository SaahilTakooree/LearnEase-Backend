// Import dependencies.
import { fileURLToPath } from "url"; // Import 'fileURLToPath' to convert ES module URL to file path.
import path from "path"; // Import 'path' to handle file path.
import fs from "fs"; // Import 'fs' to interact with the file system.


// Get the full path to 'staticFiles.js' 
const FILENAME = fileURLToPath(import.meta.url);

// Get the directory of this file.
const DIRECTORYNAME = path.dirname(FILENAME)


// Express middleware to serve static image file from 'public/images/lessons'.
export function staticFilesMiddlesware(request, responce, next) {

    // Only handle request that start with 'images/lessons'.
    if (request.url.startsWith("/images/lessons/")) {

        // Extract the image file name from the URL.
        const imageName = path.basename(request.url);

        // Create the full path to the image in the 'public/images/lessons' directory.
        const imagePath = path.join(DIRECTORYNAME, "../public", request.url);

        // Check if the file exist.
        fs.access(imagePath, fs.constants.F_OK, (error) => {

            // If the file does not exist, log an error and return a 404 json responce.
            if (error) {
                console.error(`Image not found: ${imageName}`)
                return responce.status(404).json({
                    status: "error",
                    message: `Image not found: ${imageName}`,
                    path: request.url
                });
            }

            // Get the image file extension.
            const extension = path.extname(imagePath).toLowerCase();

            // Map the file extensions to correct MIME types.
            const contentTypes = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif',
                '.webp': 'image/webp',
                '.svg': 'image/svg+xml'
            };

            // Default to 'application/octet-stream' if unknown.
            const contentType = contentTypes[extension] || 'application/octet-stream';

            // Read the file content.
            fs.readFile(imagePath, (error, data) => {

                // If reading the file fails, log and error and return 500 JSON responce.
                if (error) {
                    console.error(`Could not read image: ${imageName}`, error)
                    return responce.status(500).json({
                        status: "error",
                        message: `Could not read image: ${imageName}`
                    });
                }

                // Set the appropriate content type for the responce.
                responce.setHeader("Content-Type", contentType);

                // Set the cache control heade to cache the image in the browswer for 1 day.
                responce.setHeader("Cache-Control", 'public, max-age=86400');

                // Send the image in the responce.
                responce.send(data);
            })
        })
    } else {

        // If the url does not match, pass control to the next middleware.
        next();
    }
}