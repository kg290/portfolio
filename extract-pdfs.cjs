const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const files = [
  "Resume/Old resume.pdf",
  "Resume/Latest Resume.pdf",
  "Certifications/CLOUDOBSPROFF.pdf",
  "Certifications/Generative AI.pdf",
  "Certifications/TY_B_59_Karnajeet_Gosavi_MD3121_2.pdf"
];

(async () => {
  for (const file of files) {
    const parser = new PDFParse({ data: fs.readFileSync(file) });
    const result = await parser.getText();
    await parser.destroy();
    const text = (result.text || "").replace(/\r/g, "").replace(/\t/g, " ");
    console.log("\n===== " + file + " =====\n");
    console.log(text.slice(0, 12000));
  }
})();
