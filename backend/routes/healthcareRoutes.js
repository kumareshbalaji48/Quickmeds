import express from "express";
import multer from "multer";
import { uploadFileAndSummarize } from "../controllers/healthcareController.js";
import path from "path";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: path.resolve("uploads/"),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true); // Accept the file
    } else {
      cb(new Error("Only PDF files are allowed"), false); // Reject other files
    }
  },
});

// Route for uploading files and summarizing
router.post(
  "/upload",
  (req, res, next) => {
    upload.single("pdfFile")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Handle multer-specific errors
        return res.status(400).json({ error: `Multer error: ${err.message}` });
      } else if (err) {
        // Handle other errors
        return res.status(400).json({ error: err.message });
      }
      next(); // Proceed to the next middleware
    });
  },
  uploadFileAndSummarize
);

export default router;
