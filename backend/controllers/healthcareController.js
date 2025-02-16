import multer from "multer";
import fs from "fs";
import path from "path";
import { google } from "googleapis";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";
import extractTextFromPDF from "../utils/pdfParser.js";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Google Generative AI Client
const genAI =  new GoogleGenerativeAI("AIzaSyACMtNwHUMbGt_SoTuttjcQ7K0RSyxFTIM");


// Configure Multer to store files in the uploads directory
const upload = multer({
  dest: path.resolve(__dirname, "../uploads/"), // Use absolute path
  limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Set a file size limit (10 MB)
});

// Analyze Entities in a document and summarize using Gemini
export async function uploadFileAndSummarize(req, res) {
  try {
    handleCors(req, res);

    // Check if the request contains a file or text
    const { text } = req.body;
    const file = req.file;

    if (!file && !text) {
      return res.status(400).send({ message: "No file or text provided for processing." });
    }

    let extractedText = "";

    // If a PDF file is provided, extract text from it
    if (file) {
      const filePath = file.path; // Path to the uploaded file
      console.log("Uploaded file path:", filePath);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return res.status(400).send({ message: "Uploaded file does not exist." });
      }

      // Step 1: Parse PDF to extract text
      extractedText = await extractTextFromPDF(filePath);

      if (!extractedText || extractedText.trim() === "") {
        return res.status(400).send({ message: "No valid text found in the PDF." });
      }

      console.log("Extracted Text from PDF:", extractedText);
    }

    // If text is provided, use it directly
    if (text) {
      extractedText = text;
      console.log("Text provided directly:", extractedText);
    }

    // Step 2: Analyze Entities using Google Healthcare NLP API
    const entities = await analyzeEntitiesUsingHealthcareNLP(extractedText);

    if (!entities || entities.length === 0) {
      return res.status(500).send({ message: "No entities extracted from the text." });
    }

    console.log("Extracted Entities:", entities);

    // Step 3: Generate summary using Google Gemini
    const summary = await summarizeTextUsingGemini(entities);

    if (!summary) {
      return res.status(500).send({ message: "Failed to generate summary." });
    }

    // Step 4: Return the final summary to the client
    console.log("Sending summary to frontend:", summary);
    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error in processing file or text:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

// Helper Function: Call Google Healthcare NLP API
const analyzeEntitiesUsingHealthcareNLP = async (documentContent) => {
  try {
    const url = `https://healthcare.googleapis.com/v1/projects/quickmeds-447010/locations/asia-south1/services/nlp:analyzeEntities`;

    const auth = new google.auth.GoogleAuth({
      keyFile: path.resolve(__dirname, "../key.json"), // Absolute path to service account key
      scopes: ["https://www.googleapis.com/auth/cloud-healthcare"],
    });

    const accessToken = await auth.getAccessToken();

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ document_content: documentContent }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log("Google Healthcare NLP Response:", jsonResponse);

      // Safely map and structure the entities from the response
      const entityMentions = jsonResponse.entityMentions?.map((mention) => ({
        id: mention.mentionId || "Unknown ID",
        type: mention.type || "Unknown Type",
        text: mention.text?.content || "Unknown Text",
        linkedEntities: mention.linkedEntities?.map((entity) => entity.entityId || "Unknown Entity") || [],
        confidence: (mention.confidence || 0).toFixed(2), // Format confidence to 2 decimal places
      }));

      const entities = jsonResponse.entities?.map((entity) => ({
        id: entity.entityId || "Unknown Entity ID",
        term: entity.preferredTerm || "Unknown Term",
        vocabulary: entity.vocabularyCodes || [],
      }));

      console.log("Formatted Entity Mentions:", entityMentions);
      console.log("Formatted Entities:", entities);

      // Combine and structure results for clear interpretation
      const formattedEntities = entityMentions.map((mention) => {
        const linkedEntitiesText = mention.linkedEntities.length
          ? `Linked Entities: ${mention.linkedEntities.join(", ")}`
          : "No linked entities";

        return `
          - ID: ${mention.id}
          - Type: ${mention.type}
          - Text: "${mention.text}"
          - ${linkedEntitiesText}
          - Confidence: ${mention.confidence}
        `;
      });

      const structuredEntities = `
        Extracted Entities:
        ${formattedEntities.join("\n")}
      `;

      console.log("Structured Entities for Gemini:", structuredEntities);

      return structuredEntities; // Return the formatted and structured entities
    } else {
      throw new Error(`API request failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error calling Google Healthcare NLP API:", error.message);
    throw new Error("Failed to analyze entities.");
  }
};

// Helper Function: Summarize text using Google Gemini
const summarizeTextUsingGemini = async (structuredEntities) => {
  try {
    // Refined prompt for Gemini
    const prompt = `
The following data contains key medical entities extracted from a patient’s document. Each entity includes its type, description, associated medical concepts, and confidence levels:

Extracted Medical Entities:
${structuredEntities}

Task:
Summarize the above medical details in a clear, patient-friendly manner.
Explain all medical terms in simple language, ensuring that a non-medical person can understand their condition, symptoms, and treatment options.
Present the summary in a well-structured, professional, and empathetic tone to help the patient grasp their health status effectively.
Highlight critical findings and their implications while keeping the explanation concise yet comprehensive.
Provide actionable insights or next steps where relevant, ensuring that the patient understands potential treatments, risks, or lifestyle adjustments.
Avoid any formatting such as bold or special characters in the response. The output should be plain text and well-structured.
Use bullet points for clarity and readability, making it easy for the patient to follow along.
The goal is to transform complex medical information into an intuitive and engaging summary that impresses the reader with its clarity, coherence, and depth of analysis.
    `;

    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the refined prompt
    const result = await model.generateContent(prompt);

    // Extract and return the summary
    console.log("Gemini Summarization Response:", JSON.stringify(result, null, 2));

    // Extract summary content from response
    const summary = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "Summary not available.";

    if (summary === "Summary not available.") {
      console.error("Failed to extract summary. Check the Gemini response format.");
    }

    return summary;
  } catch (error) {
    console.error("Error calling Google Gemini API:", error.message);
    throw new Error("Failed to generate summary.");
  }
};

// Sets up CORS headers to allow cross-origin requests
const handleCors = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
  }
};