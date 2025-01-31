import { PdfReader } from "pdfreader";
import fs from "fs/promises";


const formatExtractedText = (rawText) => {
  
  return rawText
    .replace(/(\r\n|\n|\r)/gm, " ") 
    .replace(/([a-zA-Z])([A-Z])/g, "$1 $2") 
    .replace(/(\s{2,})/g, " ") 
    .replace(/(\d+)([a-zA-Z])/g, "$1 $2") 
    .replace(/([a-zA-Z])(\d+)/g, "$1 $2")
    .trim();
};

const extractTextFromPDF = async (filePath) => {
  try {
    
    const pdfBuffer = await fs.readFile(filePath);
    
    return new Promise((resolve, reject) => {
      const reader = new PdfReader();
      const textItems = [];
      let currentPage = 1;
      let lastY = null;
      let text = "";

      reader.parseBuffer(pdfBuffer, (err, item) => {
        if (err) {
          console.error("PDF parsing error:", err);
          reject(new Error("Failed to parse PDF file"));
          return;
        }

        if (!item) {
          
          const fullText = textItems.join("\n");
          resolve(formatExtractedText(fullText));
          return;
        }

        if (item.page) {
          
          currentPage = item.page;
        }

        if (item.text) {
          
          if (lastY !== item.y) {
            
            textItems.push("\n");
            lastY = item.y;
          }
          
          
          textItems.push(item.text);
        }
      });
    });
  } catch (error) {
    console.error("File reading error:", error);
    throw new Error("Failed to read PDF file");
  }
};

export default extractTextFromPDF;