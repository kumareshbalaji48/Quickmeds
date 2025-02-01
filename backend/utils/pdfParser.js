import { PdfReader } from "pdfreader";
import fs from "fs/promises";

const formatExtractedText = (rawText) => {
  // Advanced medical text formatting
  return rawText
    .replace(/(\w)\s+(?=\w)/g, "$1") 
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2") 
    .replace(/([.:,])([A-Za-z])/g, "$1 $2") 
    .replace(/(\d+)([A-Za-z])/g, "$1 $2") 
    .replace(/([A-Za-z])(\d+)/g, "$1 $2")
    .replace(/(\s{2,})/g, " ") 
    .replace(/- /g, "-") 
    .replace(/(\S)-\s/g, "$1-") 
    .replace(/([A-Z]{2,})/g, " $1 ") 
    .replace(/(\b(mg|mL|pg|IU)\b)/gi, " $1 ") 
    .replace(/(\r\n|\n|\r)/gm, "\n") 
    .replace(/(\S)\n(\S)/g, "$1\n\n$2") 
    .trim();
};

const extractTextFromPDF = async (filePath) => {
  try {
    const pdfBuffer = await fs.readFile(filePath);
    
    return new Promise((resolve, reject) => {
      const reader = new PdfReader();
      let textContent = "";
      let lastY = null;
      let lastXEnd = 0;
      const lineThreshold = 5; // Pixel threshold for new words

      reader.parseBuffer(pdfBuffer, (err, item) => {
        if (err) return reject(err);

        if (!item) {
          // Final cleanup and formatting
          const formattedText = formatExtractedText(textContent)
            .replace(/(\b\w+\b)(?=\s*\()/g, "$1 ") // Space before parentheses
            .replace(/(\d+)(%)/g, "$1$2 "); // Handle percentages

          resolve(formattedText);
          return;
        }

        if (item.text) {
          // Calculate word spacing using X coordinates
          const wordSpacing = item.x - lastXEnd > item.width * 0.5 ? " " : "";
          
          // New line detection
          if (lastY !== null && Math.abs(item.y - lastY) > lineThreshold) {
            textContent += "\n";
            lastXEnd = 0;
          }

          // Add word with appropriate spacing
          textContent += `${wordSpacing}${item.text}`;
          
          // Update position trackers
          lastY = item.y;
          lastXEnd = item.x + item.width;
        }
      });
    });
  } catch (error) {
    console.error("PDF Processing Error:", error);
    throw new Error("Failed to process PDF file");
  }
};

export default extractTextFromPDF;