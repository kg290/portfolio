import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";

import TargetCursor from "./components/TargetCursor/TargetCursor";
import StaggeredMenu from "./components/StaggeredMenu/StaggeredMenu";
import GooeyNav from "./components/GooeyNav/GooeyNav";

import BlurFade, {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "./components/BlurFade/BlurFade";
import { TextRevealByChar } from "./components/TextReveal/TextReveal";

import Terminal from "./components/Terminal/Terminal";
import ProfileCard from "./components/ProfileCard/ProfileCard";
import ScrollStack from "./components/ScrollStack/ScrollStack";
import NumberCounter from "./components/NumberCounter/NumberCounter";
import StarBorder from "./components/StarBorder/StarBorder";
import MagneticButton from "./components/MagneticButton/MagneticButton";
import Meteors from "./components/Meteors/Meteors";
import ContactForm from "./components/ContactForm/ContactForm";
import ParticleTextPreloader from "./components/ParticleTextEffect/ParticleTextEffect";
import SplineDecor from "./components/SplineDecor/SplineDecor";
import { HoverPreviewProvider, HoverPreviewTrigger } from "./components/HoverPreview/HoverPreview";

import {
  FaCertificate,
  FaCogs,
  FaDatabase,
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaServer,
} from "react-icons/fa";

import "./App.css";

const AVATAR_URL = "/profile-picture.jpg";

const NAV_ITEMS = [
  { label: "Home", link: "#hero" },
  { label: "Tech Stack", link: "#skills" },
  { label: "Projects", link: "#projects" },
  { label: "Achievements", link: "#achievements" },
  { label: "Contact", link: "#contact" },
];

const RESUME_OPTIONS = [
  {
    label: "Full Stack Resume",
    href: "/resume/Karnajeet_Gosavi_Full_Stack_Resume.pdf",
  },
  {
    label: "Agentic Python Resume",
    href: "/resume/Karnajeet_Gosavi_Agentic_Python_Resume.pdf",
  },
];

const RESUME_LINK = RESUME_OPTIONS[0].href;

const MENU_ITEMS = [
  { label: "Download Resume", link: RESUME_LINK },
  { label: "GitHub Profile", link: "https://github.com/kg290", external: true },
  {
    label: "LinkedIn",
    link: "https://www.linkedin.com/in/karnajeet-gosavi",
    external: true,
  },
  { label: "Email", link: "mailto:karnajeet.gosavi23@vit.edu", external: true },
  { label: "View Certifications", link: "#certifications" },
];

const CONTRIBUTION_SNAKE_URL =
  "https://raw.githubusercontent.com/kg290/kg290/output/github-contribution-grid-snake-dark.svg";

const STATS = [
  { value: 8.98, suffix: "/10", label: "CGPA", decimalPlaces: 2 },
  { value: 3, suffix: "", label: "Publications", decimalPlaces: 0 },
  { value: 3, suffix: "", label: "Certifications", decimalPlaces: 0 },
];

const SKILL_CATEGORIES = [
  {
    title: "Programming",
    icon: <FaCogs size={15} />,
    items: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C++",
      "C#",
      "PowerShell 7",
    ],
  },
  {
    title: "Frontend",
    icon: <FaServer size={15} />,
    items: [
      "React.js",
      "Next.js",
      "Vite",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
      "Three.js",
      "D3.js",
      "Recharts",
    ],
  },
  {
    title: "Backend",
    icon: <FaServer size={15} />,
    items: [
      "FastAPI",
      "Flask",
      "Django",
      "Express.js",
      "ASP.NET Core",
      "Spring Boot",
      "REST APIs",
      "GraphQL API Design",
      "JWT",
    ],
  },
  {
    title: "Databases",
    icon: <FaDatabase size={15} />,
    items: [
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Redis",
      "SQLAlchemy",
    ],
  },
  {
    title: "DevOps/Cloud",
    icon: <FaCogs size={15} />,
    items: [
      "Git",
      "Docker",
      "AWS",
      "GCP",
      "Azure",
      "Vercel",
      "GitLab",
    ],
  },
  {
    title: "OS",
    icon: <FaServer size={15} />,
    items: [
      "Windows Server",
      "Kali Linux",
      "Ubuntu",
    ],
  },
];

const PROJECTS = [
  {
    title: "Offroad Terrain Segmentation System",
    description:
      "Semantic segmentation system for unstructured off-road terrain using DeepLabV3+ with ResNet-101 backbone and mIoU-based evaluation.",
    tech: ["Python", "PyTorch", "DeepLabV3+", "Computer Vision"],
    link: "https://github.com/kg290/hack-for-green-bharat_TEAM_DDOS_ME",
    preview: { image: "/previews/gh-offroad.png", title: "Offroad Terrain Segmentation", subtitle: "github.com/kg290/hack-for-green-bharat_TEAM_DDOS_ME" },
  },
  {
    title: "Narrative Consistency Verification System",
    description:
      "Hybrid rule-based, retrieval, and LLM reasoning pipeline for narrative consistency checks with evidence-backed outputs.",
    tech: ["Python", "NLP", "LLMs", "Pathway RAG"],
    link: "https://github.com/kg290/Narrative-Consistency-Verification-System",
    preview: { image: "/previews/gh-narrative.png", title: "Narrative Consistency Verification", subtitle: "github.com/kg290/Narrative-Consistency-Verification-System" },
  },
  {
    title: "Real-Time GPU Visualization and Orbit Sonification",
    description:
      "GPU-accelerated fractal explorer with real-time visual and audio rendering pipeline.",
    tech: ["GPU", "Visualization", "Audio", "Realtime Systems"],
    link: "https://github.com/kg290",
  },
  {
    title: "SAP CI Technical Specification Generator",
    description:
      "Parses SAP CPI integration flow projects (iFlow BPMN/XML) from ZIPs or folders, resolves externalized parameters, and generates formatted technical specification .docx documents plus sender, receiver, and exception-flow diagrams, with Gemini AI summaries and deterministic fallback content.",
    tech: ["Python", "SAP CPI", "BPMN/XML", "Gemini API", "python-docx"],
    link: "https://github.com/kg290/SAP-CI-Technical-Specification-Generator",
  },
  {
    title: "Anti-Fingerprint Instruction Shuffler (AFIS)",
    description:
      "C++17 compiler-backend toolkit for code diversification of three-address IR: dependency-safe instruction shuffling, CFG-aware block reordering, register renaming, fingerprint metrics, and runtime semantic equivalence verification.",
    tech: ["C++17", "Compilers", "CFG Analysis", "IR Optimization", "CLI"],
    link: "https://github.com/kg290/anti-fingerprint-instruction-shuffler",
  },
];

const PUBLICATIONS = [
  {
    title: "ML Algorithm Benchmarking for Weather Prediction Across India",
    venue: "ICCPCT 2024 (IEEE)",
    link: "https://ieeexplore.ieee.org/document/10673211/",
    preview: { image: "/previews/pub-weather.png", title: "ML Algorithm Benchmarking for Weather Prediction", subtitle: "IEEE ICCPCT 2024" },
  },
  {
    title: "Smart Retail Shelf for Effective Inventory Management",
    venue: "RTET 2024 (The Grenze)",
    link: "https://thegrenze.com/index.php?display=page&view=journalabstract&absid=4066&id=8",
    preview: { image: "/previews/pub-retail.png", title: "Smart Retail Shelf for Inventory Management", subtitle: "The Grenze RTET 2024" },
  },
  {
    title:
      "Perspective-Powered Personalized News Aggregator: Multi-Dimensional News Analysis and Adaptation",
    venue: "ICONAT 2025 (IEEE)",
    link: "https://ieeexplore.ieee.org/document/11362604/",
    preview: { image: "/previews/pub-news.png", title: "Personalized News Aggregator", subtitle: "IEEE ICONAT 2025" },
  },
];

const CERTIFICATIONS = [
  {
    title: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
    link: "/certifications/generative-ai.pdf",
    preview: { image: "/previews/cert-genai.png", title: "OCI Generative AI Professional", subtitle: "Oracle Cloud Infrastructure 2025" },
  },
  {
    title: "Oracle Cloud Infrastructure 2025 Certified Observability Professional",
    link: "/certifications/cloudobsproff.pdf",
    preview: { image: "/previews/cert-obs.png", title: "OCI Observability Professional", subtitle: "Oracle Cloud Infrastructure 2025" },
  },
  {
    title: "IBM DevOps and Software Engineering Professional Certificate",
    link: "/certifications/md3121.pdf",
    preview: { image: "/previews/cert-devops.png", title: "DevOps & Software Engineering", subtitle: "IBM Professional Certificate" },
  },
];

const ABOUT_PARAGRAPHS = [
  "I am Karnajeet Gosavi, a B.Tech Computer Science student at VIT Pune (2023-2027) with a CGPA of 8.98, focused on applied AI/ML engineering.",
  "My work centers on production-minded AI systems: NLP pipelines, computer vision models, and reliable API services that are designed to be measurable, maintainable, and deployment-ready.",
  "I hold two Oracle Cloud Infrastructure certifications (Generative AI Professional and Observability Professional) and the IBM DevOps and Software Engineering Professional Certificate.",
];

const HACKATHON_PHOTOS = [
  { title: "Innerve X", image: "/Innerve%20X.jpg" },
  { title: "Morpheus", image: "/Morpheus.jpg" },
  { title: "Rift 2026", image: "/rift.jpg" },
];

const HACKATHON_HIGHLIGHTS = [
  "Finalist: Bajaj HackRX 2025, Innerve X, Project Morpheus, Rift 2026",
  "Qualified: SIH, Ctrl+Space, Genesis 5",
  "Participation: E-Rakshya IITD, GameTrade, NextGenAI, VoyageHack",
];

function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isResumeMenuOpen, setIsResumeMenuOpen] = useState(false);
  const sectionsRef = useRef([]);
  const resumeMenuRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const sections = sectionsRef.current.filter(Boolean);
    if (!sections.length) return;

    let rafId = 0;

    const updateActiveSection = () => {
      const anchorY = window.innerHeight * 0.28;
      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section, idx) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= anchorY && rect.bottom >= anchorY) {
          bestIndex = idx;
          bestDistance = 0;
          return;
        }

        const distance = Math.abs(rect.top - anchorY);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = idx;
        }
      });

      setActiveSection((prev) => (prev === bestIndex ? prev : bestIndex));
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  useEffect(() => {
    if (!isResumeMenuOpen) return;

    const closeOnOutsideClick = (event) => {
      if (!resumeMenuRef.current?.contains(event.target)) {
        setIsResumeMenuOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsResumeMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isResumeMenuOpen]);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <HoverPreviewProvider>
      {!isIntroComplete && (
        <ParticleTextPreloader
          onComplete={() => setIsIntroComplete(true)}
        />
      )}

      <div className="app">
        <motion.div className="scroll-progress-bar" style={{ scaleX }} />

        <div className="background-layer" />

      <TargetCursor targetSelector="button, a, .cursor-target, .cta-btn, .nav-card-link, .sm-panel-item, .star-border-container, .contact-anchor, .menu__item-link, .terminal-wrapper, .hero-flashcard, .scroll-stack-card" />

      <StaggeredMenu
        items={MENU_ITEMS}
        displaySocials={false}
        displayItemNumbering={false}
        colors={["#000000", "#171717"]}
        accentColor="#ffffff"
        menuButtonColor="#ffffff"
        openMenuButtonColor="#ffffff"
        isFixed
        closeOnClickAway
      />

      <GooeyNav
        items={NAV_ITEMS.map((item) => ({ label: item.label, href: item.link }))}
        initialActiveIndex={activeSection}
      />

      <section
        id="hero"
        className="section hero-section"
        ref={(el) => (sectionsRef.current[0] = el)}
      >
        <div className="hero-content">
          <FadeIn direction="right" className="hero-left" delay={0.1}>
            <p className="hero-greeting">Portfolio</p>

            <h1 className="hero-name">
              <TextRevealByChar delay={0.1} duration={0.04} staggerChildren={0.02}>
                Karnajeet Gosavi
              </TextRevealByChar>
            </h1>

            <div className="hero-tagline-row">
              <p className="hero-tagline">
                AI/ML Engineer | B.Tech CSE at VIT Pune | CGPA 8.98
              </p>

              <div className="hero-socials hero-socials-inline">
                <a
                  href="https://github.com/kg290"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  aria-label="GitHub"
                >
                  <FaGithub size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/in/karnajeet-gosavi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-social-link"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={16} />
                </a>
                <a
                  href="mailto:karnajeet.gosavi23@vit.edu"
                  className="hero-social-link"
                  aria-label="Email"
                >
                  <FaEnvelope size={16} />
                </a>
              </div>
            </div>

            <div className="hero-terminal-inline">
              <Terminal className="hero-terminal" />
            </div>

            <p className="hero-summary">
              Professional portfolio snapshot covering capabilities, selected
              work, credentials, and ways to connect.
            </p>

            <div className="hero-kpis">
              {STATS.map((stat, i) => (
                <div key={stat.label} className="kpi-card">
                  <p className="kpi-value">
                    <NumberCounter
                      value={stat.value}
                      decimalPlaces={stat.decimalPlaces}
                      suffix={stat.suffix}
                      delay={0.2 + i * 0.08}
                    />
                  </p>
                  <p className="kpi-label">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="hero-cta">
              <MagneticButton strength={24}>
                <StarBorder
                  as="button"
                  color="#ffffff"
                  speed="6s"
                  className="cta-btn"
                  onClick={() => scrollTo("#projects")}
                >
                  View Projects
                </StarBorder>
              </MagneticButton>

              <div className="resume-download-wrap" ref={resumeMenuRef}>
                <MagneticButton strength={24}>
                  <StarBorder
                    as="button"
                    color="#ffffff"
                    speed="6s"
                    className="cta-btn"
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isResumeMenuOpen}
                    onClick={() => setIsResumeMenuOpen((open) => !open)}
                  >
                    <FaDownload style={{ marginRight: 8 }} />
                    Download Resume
                  </StarBorder>
                </MagneticButton>

                {isResumeMenuOpen && (
                  <div className="resume-menu" role="menu" aria-label="Resume downloads">
                    {RESUME_OPTIONS.map((resume) => (
                      <a
                        key={resume.href}
                        className="resume-menu-link"
                        href={resume.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        role="menuitem"
                        onClick={() => setIsResumeMenuOpen(false)}
                      >
                        {resume.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2} className="hero-right">
            <div className="hero-profile-row">
              <div className="hero-flashcard-wrap">
                <ProfileCard
                  className="hero-flashcard"
                  name="Karnajeet Gosavi"
                  title="AI/ML Engineer"
                  handle="kg290"
                  avatarUrl={AVATAR_URL}
                  miniAvatarUrl={AVATAR_URL}
                  showUserInfo={false}
                  showDetails={false}
                  enableTilt
                  behindGlowEnabled
                  behindGlowColor="rgba(255, 255, 255, 0.2)"
                  behindGlowSize="44%"
                  innerGradient="linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)"
                />
              </div>

              <div className="hero-side-column">
                <a
                  className="hero-snake-card"
                  href="https://github.com/kg290"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub contribution snake"
                >
                  <p className="hero-snake-title">GitHub Contributions</p>
                  <div className="hero-snake-visual">
                    <img
                      src={CONTRIBUTION_SNAKE_URL}
                      alt="Contribution snake"
                      className="hero-snake-image"
                      loading="lazy"
                    />
                  </div>
                </a>

                <div id="certifications" className="hero-cert-compact">
                  <p className="hero-cert-title">
                    <FaCertificate size={12} />
                    <span>Certifications</span>
                  </p>
                  <ol className="hero-cert-list">
                    {CERTIFICATIONS.map((cert, index) => (
                      <li key={cert.title} className="hero-cert-item">
                        <HoverPreviewTrigger preview={cert.preview}>
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hero-cert-link"
                          >
                            <span className="hero-cert-index">{index + 1}.</span>
                            <span>{cert.title}</span>
                          </a>
                        </HoverPreviewTrigger>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div id="about" className="hero-about-compact">
              <h2>About Me</h2>
              {ABOUT_PARAGRAPHS.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="spline-scroll-region">
        <div className="spline-scroll-content">
          <section
            id="skills"
            className="section skills-section"
            ref={(el) => (sectionsRef.current[1] = el)}
          >
            <BlurFade delay={0.1} inView>
              <h2 className="section-title">Tech Stack</h2>
              <p className="section-lead">
                Core technologies grouped for fast recruiter scanning.
              </p>
            </BlurFade>

            <div className="skills-panel skills-panel-full">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.title} className="hero-tech-row skills-tech-row">
                  <p className="hero-tech-label">
                    {cat.icon}
                    <span>{cat.title}</span>
                  </p>
                  <div className="hero-tech-values">
                    {cat.items.map((item) => (
                      <span key={item} className="hero-tech-item">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            id="projects"
            className="section projects-section"
            ref={(el) => (sectionsRef.current[2] = el)}
          >
            <BlurFade delay={0.1} inView>
              <h2 className="section-title">Projects</h2>
              <p className="section-lead">
                Scroll to stack each project on top of the last, like tabs.
              </p>
            </BlurFade>

            <ScrollStack items={PROJECTS} />
          </section>
        </div>

        <div className="spline-sidebar">
          <div className="spline-sticky-inner">
            {isIntroComplete && <SplineDecor />}
          </div>
        </div>
      </div>

      <section
        id="achievements"
        className="section achievements-section"
        ref={(el) => (sectionsRef.current[3] = el)}
      >
        <BlurFade delay={0.1} inView>
          <h2 className="section-title">Achievements</h2>
          <p className="section-lead">
            Compact summary of hackathon performance and publication record.
          </p>
        </BlurFade>

        <div className="achievements-grid">
          <div className="achievement-compact-block">
            <h3>Hackathons</h3>
            <ul className="achievement-compact-list">
              {HACKATHON_HIGHLIGHTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="achievement-image-row">
              {HACKATHON_PHOTOS.map((photo) => (
                <a
                  key={photo.title}
                  href={photo.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="achievement-image-item"
                >
                  <img src={photo.image} alt={`${photo.title} Hackathon`} loading="lazy" decoding="async" />
                  <span>{photo.title}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="achievement-compact-block">
            <h3>Publications</h3>
            <ol className="achievement-publication-list">
              {PUBLICATIONS.map((pub) => (
                <li key={pub.link}>
                  <HoverPreviewTrigger preview={pub.preview}>
                    <a href={pub.link} target="_blank" rel="noopener noreferrer">
                      {pub.title}
                    </a>
                  </HoverPreviewTrigger>
                  <span>{pub.venue}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="section contact-section"
        ref={(el) => (sectionsRef.current[4] = el)}
      >
        <div className="meteors-container">
          <Meteors number={10} />
        </div>

        <BlurFade delay={0.1} inView>
          <h2 className="section-title">Contact</h2>
          <p className="contact-subtitle">
            Open to internships, full-time roles, and project collaboration.
          </p>
        </BlurFade>

        <ContactForm />

        <StaggerContainer className="contact-links" staggerDelay={0.1}>
          <StaggerItem>
            <a
              href="https://github.com/kg290"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-anchor"
            >
              <MagneticButton strength={20}>
                <StarBorder as="div" color="#ffffff" speed="5s">
                  <span className="contact-link-inner">
                    <FaGithub size={18} /> GitHub
                  </span>
                </StarBorder>
              </MagneticButton>
            </a>
          </StaggerItem>

          <StaggerItem>
            <a
              href="https://www.linkedin.com/in/karnajeet-gosavi"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-anchor"
            >
              <MagneticButton strength={20}>
                <StarBorder as="div" color="#ffffff" speed="6s">
                  <span className="contact-link-inner">
                    <FaLinkedin size={18} /> LinkedIn
                  </span>
                </StarBorder>
              </MagneticButton>
            </a>
          </StaggerItem>

          <StaggerItem>
            <a href="mailto:karnajeet.gosavi23@vit.edu" className="contact-anchor">
              <MagneticButton strength={20}>
                <StarBorder as="div" color="#ffffff" speed="7s">
                  <span className="contact-link-inner">
                    <FaEnvelope size={18} /> Email
                  </span>
                </StarBorder>
              </MagneticButton>
            </a>
          </StaggerItem>
        </StaggerContainer>

        <p className="contact-email-line">
          <a href="mailto:karnajeet.gosavi23@vit.edu" className="contact-email-link">
            karnajeet.gosavi23@vit.edu
          </a>
        </p>
      </section>

        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Karnajeet Gosavi. All rights reserved.</p>
        </footer>
      </div>
      <Analytics />
      </HoverPreviewProvider>
    </>
  );
}

export default App;
