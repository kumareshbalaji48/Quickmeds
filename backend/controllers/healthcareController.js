import { google } from "googleapis";
import fetch from "node-fetch";
import pdfParser from "../utils/pdfParser.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google Generative AI Client
const genAI = new GoogleGenerativeAI("YOUR_GOOGLE_GEMINI_API_KEY"); // Replace with valid Gemini API Key

// Analyze Entities in a document and summarize using Gemini
export async function uploadFileAndSummarize(req, res) {
  try {
    handleCors(req, res);

    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    // Step 1: Parse PDF to extract text
    const filePath = req.file.path;
    const extractedText = await pdfParser(filePath);

    if (!extractedText || extractedText.trim() === "") {
      return res.status(400).send({ message: "No valid text found in the PDF." });
    }
    console.log("Extracted Text:", extractedText);

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
    res.status(200).json({ summary });
  } catch (error) {
    console.error("Error in processing file:", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

// Helper Function: Call Google Healthcare NLP API
const analyzeEntitiesUsingHealthcareNLP = async (documentContent) => {
  try {
    const url = `https://healthcare.googleapis.com/v1/projects/YOUR_PROJECT_ID/locations/us-central1/services/nlp:analyzeEntities`;

    const auth = new google.auth.GoogleAuth({
      keyFile: "./key.json", // Path to your Google Service Account key
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

    const jsonResponse = await response.json();
    console.log("Google Healthcare NLP Response:", jsonResponse);

    // Extract and format entities
    const entities = jsonResponse.entities?.map(
      (entity) => `${entity.type}: ${entity.value}`
    );

    return entities.join(", "); // Return a string representation of the entities
  } catch (error) {
    console.error("Error calling Google Healthcare NLP API:", error.message);
    throw new Error("Failed to analyze entities.");
  }
};

// Helper Function: Summarize text using Google Gemini
const summarizeTextUsingGemini = async (text) => {
  try {
    const response = await genAI.summarizeText(text);
    console.log("Gemini Summarization Response:", response);
    return response?.summary || "Summary not available.";
  } catch (error) {
    console.error("Error calling Google Gemini API:", error.message);
    throw new Error("Failed to generate summary.");
  }
};

/**
 * Sets up CORS headers to allow cross-origin requests
 */
const handleCors = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Max-Age", "3600");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
  }
};
