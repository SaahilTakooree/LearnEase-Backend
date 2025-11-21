import path from "path";
import { fileURLToPath } from "url";
import express from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve all images from public/images folder.
export function staticFilesMiddleware(app) {
    try {
        const imagesPath = path.join(__dirname, "../public/images");
        
        app.use("/images", express.static(imagesPath, {
            maxAge: "1d"
        }));

        console.log(`[StaticFilesMiddleware] Serving images from: ${imagesPath}`);
    } catch (error) {
        console.error("[StaticFilesMiddleware] Failed to mount static images:", error);
    }
}