import fs from "fs";
import PDFParse from "pdf-parse";
import path from "path";

const files = {
  latest: "Resume/Latest Resume.pdf",
  old: "Resume/Old resume.pdf",
  certs: [
    "Certifications/CLOUDOBSPROFF.pdf",
    "Certifications/Generative AI.pdf",
    "Certifications/TY_B_59_Karnajeet_Gosavi_MD3121_2.pdf"
  ]
};

async function extractPdfText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await PDFParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return "";
  }
}

async function main() {
  console.log("Extracting PDF data...\n");
  
  // Extract resumes
  const latestText = await extractPdfText(files.latest);
  const oldText = await extractPdfText(files.old);
  
  // Extract certifications
  const certsText = {};
  for (const cert of files.certs) {
    const name = path.basename(cert, ".pdf");
    certsText[name] = await extractPdfText(cert);
  }
  
  console.log("=== LATEST RESUME ===");
  console.log(latestText.substring(0, 3000));
  console.log("\n\n=== OLD RESUME ===");
  console.log(oldText.substring(0, 3000));
  console.log("\n\n=== CERTIFICATIONS ===");
  for (const [name, text] of Object.entries(certsText)) {
    console.log(`\n--- ${name} ---`);
    console.log(text.substring(0, 1500));
  }
}

main().catch(console.error);
