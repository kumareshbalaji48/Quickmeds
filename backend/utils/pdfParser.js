import fs from "fs";
import PDFParser from "pdf2json"; 

// Helper function to clean and format the extracted text
const formatExtractedText = (rawText) => {
  // Replace sequences of missing spaces between words
  const formattedText = rawText.replace(/([a-zA-Z])([A-Z])/g, "$1 $2");
  
  // Replace other problematic patterns as needed (e.g., remove redundant newlines)
  return formattedText.replace(/\s{2,}/g, " ").trim();
};


const extractTextFromPDF = async (filePath) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1);

    
    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error("Error parsing PDF:", errData.parserError);
      reject(new Error("Failed to extract text from PDF."));
    });

    
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        
        const rawText = pdfParser.getRawTextContent();

        
        const cleanedText = formatExtractedText(rawText);

        resolve(cleanedText); 
      } catch (error) {
        console.error("Error processing PDF data:", error.message);
        reject(new Error("Failed to extract text from PDF."));
      }
    });

    
    pdfParser.loadPDF(filePath);
  });
};

export default extractTextFromPDF;
