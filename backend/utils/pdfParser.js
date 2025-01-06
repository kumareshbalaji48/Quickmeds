import { readFileSync } from "fs";
import pdfParser from "pdf-parse";

const extractTextFromPDF = async (filePath) => {
  try {
    const fileBuffer = readFileSync(filePath);
    const data = await pdfParser(fileBuffer);
    return data.text;  // Return the extracted text
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

export default extractTextFromPDF;
