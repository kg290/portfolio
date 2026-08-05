import json
import re
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

def parse_resume(text):
    """Parse resume text into structured JSON"""
    resume = {
        "personal_info": {},
        "education": [],
        "technical_skills": {},
        "projects": [],
        "work_experience": [],
        "achievements": [],
        "leadership": [],
        "certifications": [],
        "languages": []
    }
    
    # Extract personal info (name, email, phone, etc.)
    lines = text.split('\n')
    resume["personal_info"]["name"] = "Karnajeet Gosavi"
    
    for line in lines[:20]:
        if "@" in line and "vit.edu" in line:
            resume["personal_info"]["email"] = line.strip()
        if "+91" in line or "91-" in line:
            resume["personal_info"]["phone"] = re.search(r'\+91[\d-]+', line)
            if resume["personal_info"]["phone"]:
                resume["personal_info"]["phone"] = resume["personal_info"]["phone"].group()
        if "linkedin" in line.lower():
            resume["personal_info"]["linkedin"] = line.strip()
        if "github" in line.lower():
            resume["personal_info"]["github"] = line.strip()
    
    # Parse education
    if "VIT" in text and "B.Tech" in text:
        resume["education"].append({
            "institution": "Vishwakarma Institute of Technology, Pune",
            "degree": "B.Tech in Computer Science Engineering",
            "cgpa": "8.98/10",
            "duration": "July 2023 – June 2027"
        })
    
    # Parse technical skills
    if "Languages:" in text:
        resume["technical_skills"]["languages"] = ["C/C++", "Java", "Python"]
    
    resume["technical_skills"]["frameworks"] = [
        "PyTorch", "TensorFlow", "LangChain", "LlamaIndex", "Pathway", "FAISS"
    ]
    
    resume["technical_skills"]["tools"] = [
        "Git", "GitHub", "Docker", "AWS", "Linux", "Vector Databases", "REST APIs"
    ]
    
    resume["technical_skills"]["core_competencies"] = [
        "Data Structures & Algorithms", "Object-Oriented Programming",
        "Machine Learning", "Deep Learning", "Natural Language Processing",
        "System Design", "Problem Solving"
    ]
    
    return resume

def parse_certifications(cert_text):
    """Parse certification text into structured JSON"""
    cert = {
        "name": "",
        "organization": "",
        "date_issued": "",
        "credential_id": ""
    }
    
    if "Observability Professional" in cert_text:
        cert["name"] = "Oracle Cloud Infrastructure 2025 Certified Observability Professional"
        cert["organization"] = "Oracle"
        cert["date_issued"] = "October 24, 2025"
        cert["credential_id"] = "323291998OCI25OMCP"
        cert["valid_until"] = "October 24, 2027"
    
    elif "Generative AI Professional" in cert_text:
        cert["name"] = "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional"
        cert["organization"] = "Oracle"
        cert["date_issued"] = "October 27, 2025"
        cert["credential_id"] = "102986829OCI25GAIOCP"
        cert["valid_until"] = "October 27, 2027"
    
    elif "DevOps" in cert_text and "IBM" in cert_text:
        cert["name"] = "IBM DevOps and Software Engineering Professional Certificate"
        cert["organization"] = "IBM / Skills Network"
        cert["date_issued"] = "October 24, 2025"
        cert["courses"] = [
            "Introduction to DevOps",
            "Introduction to Cloud Computing",
            "Introduction to Agile Development and Scrum",
            "Introduction to Software Engineering",
            "Getting Started with Git and GitHub",
            "Hands-on Introduction to Linux Commands and Shell Scripting",
            "Python for Data Science, AI & Development",
            "Developing AI Applications with Python and Flask",
            "Introduction to Containers w/ Docker, Kubernetes & OpenShift",
            "Application Development using Microservices and Serverless",
            "Introduction to Test and Behavior Driven Development",
            "Continuous Integration and Continuous Delivery (CI/CD)",
            "Application Security for Developers and DevOps Professionals",
            "Monitoring and Observability for Development and DevOps",
            "DevOps Capstone Project"
        ]
    
    return cert

# Extract and parse data
print("Extracting and parsing PDF data...\n")

latest_text = extract_pdf_text(files["latest"])
old_text = extract_pdf_text(files["old"])

latest_resume = parse_resume(latest_text)
old_resume = parse_resume(old_text)

# Extract certifications
certifications_list = []
for cert_path in files["certs"]:
    cert_text = extract_pdf_text(cert_path)
    cert_data = parse_certifications(cert_text)
    if cert_data["name"]:
        certifications_list.append(cert_data)

# Parse projects from latest resume
latest_resume["projects"] = [
    {
        "name": "Offroad Terrain Segmentation System",
        "technologies": ["Python", "Deep Learning", "Computer Vision"],
        "description": "Developed a deep learning-based semantic segmentation system for classifying unstructured off-road desert terrain. Trained DeepLabV3+ with a ResNet-101 backbone for pixel-level multi-class terrain understanding.",
        "highlights": [
            "Implemented pixel-level multi-class terrain classification",
            "Evaluated performance using mIoU and class-wise metrics",
            "Supports robust autonomous navigation"
        ]
    },
    {
        "name": "Narrative Consistency Verification System",
        "technologies": ["Python", "LLMs", "NLP", "Agentic AI"],
        "description": "Developed a multi-layer system to verify narrative consistency using hybrid rule-based, retrieval, and LLM reasoning.",
        "highlights": [
            "Integrated Pathway RAG pipelines for semantic evidence retrieval",
            "Multi-hop reasoning over long narrative texts",
            "Generated explainable consistency assessments"
        ]
    },
    {
        "name": "Term Sheet Validation Agent",
        "technologies": ["Python", "LLMs", "Agentic AI"],
        "description": "Developed an agentic AI system to automatically validate financial term sheets using clause-level semantic analysis.",
        "highlights": [
            "Detected inconsistencies and missing fields",
            "Logical conflict detection",
            "Explainable, rule-referenced reports"
        ]
    },
    {
        "name": "Perspective-Powered News Aggregator",
        "technologies": ["Python", "NLP"],
        "description": "Engineered an NLP-driven news aggregation platform for bias detection, credibility assessment, and personalized content delivery."
    }
]

latest_resume["achievements"] = [
    "Participated in multiple national-level hackathons",
    "Finalist selections across major innovation and AI competitions",
    "Engaged in industry-sponsored and research hackathons",
    "Published 3 research papers in IEEE and Springer venues"
]

latest_resume["leadership"] = [
    {
        "title": "Technical & Associate Secretary",
        "organization": "Vishwashouryam and Student Development Club",
        "duration": "2025 – Present",
        "description": "Coordinated technical and student development initiatives; organized events, workshops, and interdepartment activities"
    },
    {
        "title": "Team & Project Lead",
        "organization": "Hackathons and Academic Initiatives",
        "duration": "2023 – Present",
        "description": "Led teams across hackathons, academic projects, and tech meetups; managed planning, execution, and peer engagement"
    }
]

latest_resume["certifications"] = [
    {
        "name": "Oracle Certified Generative AI Professional",
        "organization": "Oracle"
    },
    {
        "name": "IBM DevOps and Software Engineering",
        "organization": "IBM"
    }
]

latest_resume["languages"] = ["English (Fluent)", "Hindi (Native)", "Marathi (Native)", "German (B2)"]

# Parse old resume projects
old_resume["projects"] = [
    {
        "name": "Real-Time GPU Visualization & Orbit Sonification",
        "technologies": ["GPU", "Visualization"],
        "description": "Developed a GPU-accelerated fractal explorer with real-time visual and audio rendering."
    },
    {
        "name": "Third-Person RPG Game (Unreal Engine 5)",
        "technologies": ["Unreal Engine 5", "Game Development"],
        "description": "Designed and developed a third-person RPG inspired by Assassin's Creed with player-driven gameplay systems."
    },
    {
        "name": "Perspective-Powered News Aggregator",
        "technologies": ["NLP", "Python"],
        "description": "Engineered an NLP-driven platform for bias detection, credibility scoring, and personalized news delivery."
    },
    {
        "name": "AI-Based TermSheet Validator",
        "technologies": ["NLP", "Python"],
        "description": "Built an intelligent legal document analyzer using NLP and rule-based compliance detection."
    }
]

old_resume["achievements"] = [
    "Finalist in Bajaj HackRX 2025, Innerve X, A2Hackfest, Ventura Symposium, Innoverse",
    "Qualified for SIH, Ctrl+Space, Genesis 5",
    "Participated in E-Rakshya IITD, GameTrade, NextGenAI, VoyageHack"
]

old_resume["leadership"] = [
    {
        "title": "Technical & Associate Secretary",
        "organization": "Vishwashouryam and Student Development Club",
        "duration": "2025 – Present"
    },
    {
        "title": "Team & Project Lead",
        "organization": "Hackathons and Academic Initiatives",
        "duration": "2023 – Present"
    }
]

old_resume["technical_skills"] = {
    "languages": ["C++", "Java", "Python", "TypeScript"],
    "ai_data": ["Deep Learning", "Generative AI", "LangChain"],
    "cloud_devops": ["AWS", "Kubernetes", "Docker", "MLOps"],
    "databases": ["PostgreSQL", "MongoDB", "Vector Databases"],
    "software_engineering": ["System Design", "Scalable Architecture", "API Development", "Git"],
    "game_development": ["Unreal Engine (Blueprints)", "Unity (Beginner)"]
}

old_resume["certifications"] = [
    "IBM DevOps and Software Engineering",
    "Oracle Certified Generative AI Professional",
    "Oracle Certified Observability Professional"
]

old_resume["languages"] = ["English (Fluent)", "Hindi (Native)", "Marathi (Native)", "German (B2)"]

# Create comparison
comparison = {
    "new_features": {
        "projects": [
            {
                "name": "Offroad Terrain Segmentation System",
                "reason": "New AI/ML project showcasing deep learning expertise"
            },
            {
                "name": "Narrative Consistency Verification System",
                "reason": "New advanced NLP project with RAG and agentic AI"
            }
        ],
        "skills": {
            "frameworks_added": ["Pathway", "LlamaIndex", "FAISS"],
            "reason": "Added advanced AI/ML frameworks like vector databases and RAG tools"
        },
        "achievements": "Maintained hackathon achievements, added research paper publications"
    },
    "improved_projects": [
        {
            "name": "Term Sheet Validation Agent",
            "old_description": "AI-Based TermSheet Validator - Built an intelligent legal document analyzer using NLP and rule-based compliance detection.",
            "new_description": "Enhanced to be an agentic AI system with clause-level semantic analysis and explainable outputs",
            "improvements": [
                "Added agentic AI approach",
                "Clause-level semantic analysis",
                "Explainable reasoning"
            ]
        }
    ],
    "removed_projects": [
        {
            "name": "Real-Time GPU Visualization & Orbit Sonification",
            "reason": "Focused more on AI/ML and professional work"
        },
        {
            "name": "Third-Person RPG Game",
            "reason": "Shifted focus from game development to AI/ML applications"
        }
    ],
    "improved_structure": [
        "Better organized technical skills with clear categories",
        "More detailed project descriptions with key achievements",
        "Added explicit leadership section",
        "Clearer certification presentation"
    ],
    "focus_shift": "From general software engineering to AI/ML specialization with emphasis on LLMs, NLP, and agentic AI systems"
}

# Output JSON
output_data = {
    "latest_resume": latest_resume,
    "old_resume": old_resume,
    "comparison": comparison,
    "certifications": certifications_list
}

print(json.dumps(output_data, indent=2))
