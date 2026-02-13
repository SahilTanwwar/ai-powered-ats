const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse/lib/pdf-parse");
const mammoth = require("mammoth");

async function extractResumeText(filePath) {
  try {
    if (!filePath) {
      throw new Error("File path is undefined");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error("Resume file not found");
    }

    const ext = path.extname(filePath).toLowerCase();
    const buffer = fs.readFileSync(filePath);

    let text = "";

    if (ext === ".pdf") {
      const data = await pdfParse(buffer);
      text = data.text;
    } 
    else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } 
    else {
      throw new Error("Unsupported file format. Only PDF and DOCX allowed.");
    }

    text = text
      .replace(/\r\n/g, " ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!text || text.length < 20) {
      throw new Error("Resume extraction failed or empty content");
    }

    return text;

  } catch (error) {
    console.error("Resume Extraction Error:", error.message);
    throw error;
  }
}

module.exports = { extractResumeText };
