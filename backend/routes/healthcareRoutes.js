import express from "express";
import multer from "multer";
import { uploadFileAndSummarize } from "../controllers/healthcareController.js";
import path from "path";

const router = express.Router();


const upload = multer({
  dest: path.resolve("uploads/"),
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true); 
    } else {
      cb(new Error("Only PDF files are allowed"), false); 
    }
  },
});

router.post(
  "/upload",
  (req, res, next) => {
    upload.single("pdfFile")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        
        return res.status(400).json({ error: `Multer error: ${err.message}` });
      } else if (err) {
        
        return res.status(400).json({ error: err.message });
      }
      next(); 
    });
  },
  uploadFileAndSummarize
);

export default router;