import { Router } from "express";
const router = Router();
import { uploadFileAndSummarize } from "../controllers/healthcareController.js";

// POST route to handle file uploads and summarization
router.post("/backend", uploadFileAndSummarize);

export default router;
