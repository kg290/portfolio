import fs from "fs";
import pdf from "pdf-parse";

const files = [
  "Resume/Old resume.pdf",
  "Resume/Latest Resume.pdf",
  "Certifications/CLOUDOBSPROFF.pdf",
  "Certifications/Generative AI.pdf",
  "Certifications/TY_B_59_Karnajeet_Gosavi_MD3121_2.pdf"
];

for (const file of files) {
  const dataBuffer = fs.readFileSync(file);
  const data = await pdf(dataBuffer);
  console.log("\n===== " + file + " =====\n");
  const cleaned = data.text.replace(/\r/g, "").replace(/\t/g, " ");
  console.log(cleaned.slice(0, 6000));
}
