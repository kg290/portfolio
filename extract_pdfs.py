import json
from pathlib import Path
from PyPDF2 import PdfReader

files = {
    "latest": "Resume/Latest Resume.pdf",
    "old": "Resume/Old resume.pdf",
    "certs": [
        "Certifications/CLOUDOBSPROFF.pdf",
        "Certifications/Generative AI.pdf",
        "Certifications/TY_B_59_Karnajeet_Gosavi_MD3121_2.pdf"
    ]
}

def extract_pdf_text(filepath):
    try:
        reader = PdfReader(filepath)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return ""

# Extract resumes
print("Extracting PDF data...\n")
latest_text = extract_pdf_text(files["latest"])
old_text = extract_pdf_text(files["old"])

# Extract certifications
certs_text = {}
for cert in files["certs"]:
    name = Path(cert).stem
    certs_text[name] = extract_pdf_text(cert)

print("=== LATEST RESUME ===")
print(latest_text[:4000])
print("\n\n=== OLD RESUME ===")
print(old_text[:4000])
print("\n\n=== CERTIFICATIONS ===")
for name, text in certs_text.items():
    print(f"\n--- {name} ---")
    print(text[:2000])
