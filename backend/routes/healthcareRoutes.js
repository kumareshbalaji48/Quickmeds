import express from "express"; 
import multer from "multer"; 
import { uploadFileAndSummarize } from "../controllers/healthcareController.js";
import path from "path";


const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: path.resolve("backend/uploads/"), 
  limits: { fileSize: 10 * 1024 * 1024 }, 
});


router.post("/upload", upload.single("pdfFile"), uploadFileAndSummarize);


export default router;
