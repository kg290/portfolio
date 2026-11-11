import { useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { FaAws, FaDownload, FaEnvelope, FaGithub, FaJava, FaLinkedin } from "react-icons/fa";
import {
  SiCplusplus,
  SiDjango,
  SiDocker,
  SiFastapi,
  SiFlutter,
  SiGooglecloud,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedis,
  SiSpringboot,
  SiTypescript,
} from "react-icons/si";

// React Bits (reactbits.dev), copied in as source.
import ClickSpark from "./components/ClickSpark/ClickSpark";
import ElectricBorder from "./components/ElectricBorder/ElectricBorder";
import GlareHover from "./components/GlareHover/GlareHover";
import LogoLoop from "./components/LogoLoop/LogoLoop";
import SpotlightCard from "./components/SpotlightCard/SpotlightCard";

import ContactForm from "./components/ContactForm/ContactForm";
import useCinematics, { scrollToId as scrollTo } from "./useCinematics";

import "./App.css";

const AVATAR_URL = "/profile-picture.jpg";
const EMAIL = "karnajeet.gosavi23@vit.edu";
const GITHUB = "https://github.com/kg290";
const LINKEDIN = "https://www.linkedin.com/in/karnajeet-gosavi";

// One painting per chapter, in scroll order after the hero's: a school, a harvest, a tower, the instruments, a spring, two hands that reach.
const SCENES = ["about", "experience", "projects", "stack", "achievements", "contact"];
const art = (name) => ({
  src: `/art/${name}-1920.jpg`,
  srcSet: `/art/${name}-960.jpg 960w, /art/${name}-1920.jpg 1920w`,
  sizes: "100vw",
});

const COMMONS = "https://commons.wikimedia.org/wiki/File:";
const CREDITS = [
  { name: "Claude Lorrain", license: "public domain", href: COMMONS + "Claude_Lorrain_-_Seaport_with_the_Embarkation_of_the_Queen_of_Sheba_-_WGA05002.jpg" },
  { name: "Raphael", license: "public domain", href: COMMONS + "%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg" },
  { name: "Pieter Bruegel the Elder", license: "public domain", href: COMMONS + "Pieter_Bruegel_the_Elder-_The_Harvesters_-_Google_Art_Project.jpg" },
  { name: "Pieter Bruegel the Elder", license: "public domain", href: COMMONS + "Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_(Vienna)_-_Google_Art_Project_-_edited.jpg" },
  { name: "Hans Holbein the Younger", license: "public domain", href: COMMONS + "Hans_Holbein_the_Younger_-_The_Ambassadors_-_Google_Art_Project.jpg" },
  { name: "Sandro Botticelli", license: "public domain", href: COMMONS + "Sandro_Botticelli_-_La_Primavera_-_Google_Art_Project.jpg" },
  { name: "Michelangelo", license: "public domain", href: COMMONS + "'Adam's_Creation_Sistine_Chapel_ceiling'_by_Michelangelo_JBU33cut.jpg" },
];

const NAV_ITEMS = [
  { label: "About", link: "#about" },
  { label: "Experience", link: "#experience" },
  { label: "Projects", link: "#projects" },
  { label: "Achievements", link: "#achievements" },
];

const RESUME_OPTIONS = [
  { label: "AI/ML Resume", href: "/resume/Karnajeet_Gosavi_AI_ML_Resume.pdf" },
  { label: "Full Stack Resume", href: "/resume/Karnajeet_Gosavi_Full_Stack_Resume.pdf" },
  { label: "Security and Systems Resume", href: "/resume/Karnajeet_Gosavi_Security_Systems_Resume.pdf" },
];

// The hero card: what is running now, as an account list.
const NOW = [
  { title: "Syngenta", detail: "Software Development Intern", value: "Since Apr 2026" },
  { title: "Open source", detail: "Kornia, OpenMS and jj", value: "60+ merged PRs" },
  { title: "Research", detail: "IEEE and Springer venues", value: "5 papers" },
  { title: "Hackathons", detail: "National level", value: "2 wins" },
];

const EXPERIENCE = [
  {
    org: "Syngenta",
    role: "Software Development Intern",
    when: "Apr 2026 to present",
    where: "Pune, Maharashtra",
    now: true,
    points: ["7 artifact groups", "5 integration layers", "4-step workflow", "80 text artifacts a package"],
    line: "Automated a SAP CPI documentation generator that turns 7 artifact groups into one structured DOCX, through a 4-step workflow of discovery, parsing, AI summarization and formatting.",
  },
  {
    org: "Kornia, OpenMS and jj",
    role: "Open Source Contributor",
    when: "Sep 2026 to present",
    where: "Remote",
    now: true,
    points: ["60+ merged pull requests", "3 repositories", "Python, C++ and Rust"],
    line: "60+ merged pull requests across PyTorch computer vision, C++ mass spectrometry and a Rust version control system: bug fixes, numerical stability patches and new API features.",
  },
  {
    org: "Amazon ML School 2026",
    role: "Participant",
    when: "Jul to Aug 2026",
    where: "Taught live by Amazon Scientists",
    points: ["8 modules", "Jul 1 to Aug 1, 2026"],
    line: "Completed an 8-module curriculum on supervised and unsupervised learning, deep neural networks, reinforcement learning and generative AI.",
  },
];

const PROJECTS = [
  {
    title: "Honey Proxy Deception Firewall",
    description:
      "A deception-first firewall that forwards live traffic through a Flask proxy and routes suspicious sessions into monitored honeypot flows, with a live SOC dashboard.",
    figures: [
      { value: "16", label: "behavioral signals scored" },
      { value: "3", label: "Dockerized services" },
      { value: "900ms", label: "dashboard polling" },
    ],
    tech: ["Python", "Flask", "React", "TypeScript", "SQLAlchemy", "Docker"],
    link: "https://github.com/kg290/honey-proxy-deception-firewall",
  },
  {
    title: "Whistlechain",
    description:
      "A decentralized whistleblower protection platform on Algorand, with anonymous wallets, encrypted evidence bundles and commit-reveal verification.",
    figures: [
      { value: "44", label: "FastAPI routes" },
      { value: "12", label: "backend services" },
      { value: "964", label: "lines of PyTEAL registry" },
    ],
    tech: ["Python", "TypeScript", "FastAPI", "React", "Algorand SDK"],
    link: "https://github.com/kg290/Whistlechain",
  },
  {
    title: "InvoX Invoice Financing Platform",
    description:
      "A full-stack invoice financing marketplace for vendors, lenders and admins, with Razorpay payments and invoice intake over OCR, Gmail and Telegram.",
    figures: [
      { value: "21", label: "Next.js pages" },
      { value: "22", label: "FastAPI route modules" },
      { value: "26", label: "SQLAlchemy models" },
    ],
    tech: ["Next.js", "React", "TypeScript", "FastAPI", "PostgreSQL", "Razorpay", "Docker"],
    link: "https://github.com/kg290/invox-invoice-financing-platform",
  },
  {
    title: "Anti-Fingerprint Instruction Shuffler",
    description:
      "A C++17 compiler-backend pipeline that diversifies three-address IR by shuffling instructions, reordering blocks and renaming registers, then verifies the variants behave the same.",
    figures: [
      { value: "22", label: "equivalence checks passed" },
      { value: "0", label: "failed" },
      { value: "54", label: "files in the pipeline" },
    ],
    tech: ["C++17", "Compiler Backend", "Register Renaming", "Security"],
    link: "https://github.com/kg290/anti-fingerprint-instruction-shuffler",
  },
  {
    title: "Offroad Semantic Scene Segmentation",
    description:
      "Pixel-wise segmentation of synthetic desert terrain with DeepLabV3+ on a ResNet-101 backbone, trained in two phases over 50 epochs with test-time augmentation.",
    figures: [
      { value: "0.65", label: "mIoU on the 7 present classes" },
      { value: "4,176", label: "images" },
      { value: "10", label: "semantic classes" },
    ],
    tech: ["Python", "PyTorch", "DeepLabV3+", "ResNet-101", "CUDA"],
    link: "https://github.com/kg290/Offroad-Semantic-Scene-Segmentation",
  },
];

const MARQUEE = ["Syngenta", "Kornia", "OpenMS", "jj", "Amazon ML School", "IEEE", "VIT Pune"];

const LOGOS = [
  [<SiPython />, "Python"],
  [<SiTypescript />, "TypeScript"],
  [<SiJavascript />, "JavaScript"],
  [<FaJava />, "Java"],
  [<SiCplusplus />, "C++"],
  [<SiPytorch />, "PyTorch"],
  [<SiReact />, "React"],
  [<SiNextdotjs />, "Next.js"],
  [<SiFlutter />, "Flutter"],
  [<SiNodedotjs />, "Node.js"],
  [<SiDjango />, "Django"],
  [<SiFastapi />, "FastAPI"],
  [<SiSpringboot />, "Spring Boot"],
  [<SiPostgresql />, "PostgreSQL"],
  [<SiMysql />, "MySQL"],
  [<SiMongodb />, "MongoDB"],
  [<SiRedis />, "Redis"],
  [<FaAws />, "AWS"],
  [<SiGooglecloud />, "GCP"],
  [<SiDocker />, "Docker"],
].map(([node, title]) => ({ node, title }));

// The WebGL and canvas components need plain rgb values, so a theme token is painted to one pixel and read back.
function token(name) {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue(name);
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

const TECH_ICON = {
  Python: <SiPython />,
  TypeScript: <SiTypescript />,
  JavaScript: <SiJavascript />,
  Java: <FaJava />,
  "C++": <SiCplusplus />,
  "React.js": <SiReact />,
  "Next.js": <SiNextdotjs />,
  Flutter: <SiFlutter />,
  "Node.js": <SiNodedotjs />,
  Django: <SiDjango />,
  "Spring Boot": <SiSpringboot />,
  PostgreSQL: <SiPostgresql />,
  MySQL: <SiMysql />,
  MongoDB: <SiMongodb />,
  Redis: <SiRedis />,
  "AWS (EC2, S3, Lambda)": <FaAws />,
  GCP: <SiGooglecloud />,
  "Docker Compose": <SiDocker />,
};

const SKILL_CATEGORIES = [
  { title: "Programming", items: ["Python", "TypeScript", "JavaScript", "Java", "C++"] },
  { title: "Frontend", items: ["React.js", "Next.js", "Flutter"] },
  { title: "Backend", items: ["Node.js", "Django", "Spring Boot", "REST API Development"] },
  { title: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"] },
  { title: "Cloud and DevOps", items: ["AWS (EC2, S3, Lambda)", "GCP", "Docker Compose"] },
];

const TALLY = [
  { value: "8.98", unit: "/10", label: "CGPA at VIT Pune" },
  { value: "60+", unit: "", label: "merged open-source pull requests" },
  { value: "5", unit: "", label: "research papers published" },
  { value: "2", unit: "", label: "national-level hackathons won" },
];

const PUBLICATIONS = [
  {
    title: "ML Algorithm Benchmarking for Weather Prediction Across India",
    venue: "ICCPCT 2024 (IEEE)",
    link: "https://ieeexplore.ieee.org/document/10673211/",
  },
  {
    title: "Smart Retail Shelf for Effective Inventory Management",
    venue: "RTET 2024 (The Grenze)",
    link: "https://thegrenze.com/index.php?display=page&view=journalabstract&absid=4066&id=8",
  },
  {
    title:
      "Perspective-Powered Personalized News Aggregator: Multi-Dimensional News Analysis and Adaptation",
    venue: "ICONAT 2025 (IEEE)",
    link: "https://ieeexplore.ieee.org/document/11362604/",
  },
];

const CERTIFICATIONS = [
  {
    issuer: "Oracle",
    title: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional",
    link: "/certifications/generative-ai.pdf",
  },
  {
    issuer: "Oracle",
    title: "Oracle Cloud Infrastructure 2025 Certified Observability Professional",
    link: "/certifications/cloudobsproff.pdf",
  },
  {
    issuer: "IBM",
    title: "IBM DevOps and Software Engineering Professional Certificate",
    link: "/certifications/md3121.pdf",
  },
];

const ABOUT_PARAGRAPHS = [
  "I am Karnajeet Gosavi, a B.Tech Computer Science student at VIT Pune (2023-2027) with a CGPA of 8.98, focused on software engineering.",
  "My work centers on production-minded AI systems: NLP pipelines, computer vision models, and reliable API services that are designed to be measurable, maintainable, and deployment-ready.",
];

const HACKATHON_PHOTOS = [
  { title: "Innerve X", image: "/Innerve%20X.jpg", thumb: "/thumbs/innerve-x.jpg" },
  { title: "Morpheus", image: "/Morpheus.jpg", thumb: "/thumbs/morpheus.jpg" },
  { title: "Rift 2026", image: "/rift.jpg", thumb: "/thumbs/rift.jpg" },
];

const HACKATHON_HIGHLIGHTS = [
  { label: "Finalist", items: ["Bajaj HackRX 2025", "Innerve X", "Project Morpheus", "Rift 2026"] },
  { label: "Qualified", items: ["SIH", "Ctrl+Space", "Genesis 5"] },
  { label: "Participation", items: ["E-Rakshya IITD", "GameTrade", "NextGenAI", "VoyageHack"] },
];

function App() {
  const [isResumeMenuOpen, setIsResumeMenuOpen] = useState(false);
  const [resumeMenuUp, setResumeMenuUp] = useState(false);
  const resumeMenuRef = useRef(null);

  useCinematics();

  const [{ apricot, periwinkle }] = useState(() => ({
    apricot: token("--color-accent-2"),
    periwinkle: token("--color-accent"),
  }));

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

  return (
    <ClickSpark sparkColor={apricot} sparkCount={10} sparkRadius={28} sparkSize={12}>
      <div className="scene" aria-hidden="true">
        <div className="scene__cam">
          <img className="scene__shot" {...art("hero")} width="1920" height="1460" alt="" fetchPriority="high" />
          <div className="scene__sun" />
          {SCENES.map((name) => (
            <div key={name} className="scene__shot">
              <img className="scene__ghost" src={`/art/${name}-ghost.jpg`} alt="" decoding="async" fetchPriority="low" />
              <img className="scene__color" {...art(name)} alt="" decoding="async" fetchPriority="low" />
            </div>
          ))}
        </div>
        <div className="scene__grade" />
      </div>

      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className="nav">
        <div className="nav__bar glass">
          <a className="nav__mark" href="#hero" aria-label="Karnajeet Gosavi, back to top">
            Karnajeet Gosavi
          </a>
          <nav aria-label="Sections">
            <ul className="nav__links">
              {NAV_ITEMS.map((item) => (
                <li key={item.link}>
                  <a href={item.link}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <a className="btn btn--small" href="#contact">
            Contact
          </a>
          <span className="nav__progress" aria-hidden="true" />
        </div>
      </header>

      <main id="main" className="day">
        <section id="hero" className="hero">
          <div className="hero__scrim" aria-hidden="true" />

          <div className="container hero__grid">
            <div className="hero__text">
              <p className="eyebrow">Software Engineer</p>
              <h1>
                <span className="line">Karnajeet Gosavi</span> <span className="line">builds systems</span>{" "}
                <span className="line line--accent">that ship.</span>
              </h1>
              <p className="lead">
                Software Development Intern at Syngenta, B.Tech CSE student at VIT Pune.
              </p>

              <div className="hero__cta">
                <button type="button" className="btn" onClick={() => scrollTo("#projects")}>
                  View Projects
                </button>

                <div className="resume-download-wrap" ref={resumeMenuRef}>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    aria-haspopup="menu"
                    aria-expanded={isResumeMenuOpen}
                    onClick={(event) => {
                      // Opens upward only when the menu (about 170px) would run off the bottom of the screen.
                      setResumeMenuUp(window.innerHeight - event.currentTarget.getBoundingClientRect().bottom < 170);
                      setIsResumeMenuOpen((open) => !open);
                    }}
                  >
                    <FaDownload aria-hidden="true" />
                    Download Resume
                  </button>

                  {isResumeMenuOpen && (
                    <div className={`resume-menu${resumeMenuUp ? " resume-menu--up" : ""}`} role="menu" aria-label="Resume downloads">
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
            </div>

            <aside className="now glass" aria-label="Current work">
              <div className="now__head">
                <img src={AVATAR_URL} alt="" width="708" height="718" />
                <div>
                  <p className="now__name">Karnajeet Gosavi</p>
                  <p className="now__place">Pune, Maharashtra</p>
                </div>
                <div className="now__socials">
                  <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <FaGithub size={18} aria-hidden="true" />
                  </a>
                  <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <FaLinkedin size={18} aria-hidden="true" />
                  </a>
                  <a href={`mailto:${EMAIL}`} aria-label="Email">
                    <FaEnvelope size={18} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <ul className="now__rows">
                {NOW.map((row) => (
                  <li key={row.title}>
                    <span className="now__initial" aria-hidden="true">
                      {row.title[0]}
                    </span>
                    <span className="now__what">
                      <b>{row.title}</b>
                      <span>{row.detail}</span>
                    </span>
                    <span className="now__value num">{row.value}</span>
                  </li>
                ))}
              </ul>

              <p className="now__open">
                <span className="now__status">Open to internships and full-time roles</span>
                <a href="#contact">Get in touch</a>
              </p>
            </aside>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container about panel">
            <div className="about__text">
              <h2 className="visually-hidden">About Me</h2>
              <p className="statement">
                {ABOUT_PARAGRAPHS[0].split(" ").map((word, idx) => (
                  <span className="w" key={idx}>
                    {word}{" "}
                  </span>
                ))}
              </p>
              <p className="lead" data-rise>
                {ABOUT_PARAGRAPHS[1]}
              </p>
            </div>

            <figure className="about__portrait" data-clip>
              <img
                src={AVATAR_URL}
                alt="Karnajeet Gosavi"
                width="708"
                height="718"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </section>

        <section className="section seq night" aria-labelledby="seq-title">
          <div className="seq__pin">
            <div className="container">
              <h2 id="seq-title" className="visually-hidden">
                In numbers
              </h2>
              <dl className="seq__stage">
                {TALLY.map((item) => (
                  <div key={item.label} className="seq__item">
                    <dt>{item.label}</dt>
                    <dd className="num">
                      {item.value}
                      {item.unit && <small>{item.unit}</small>}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section id="experience" className="section">
          <div className="container split panel">
            <div className="split__head" data-rise>
              <h2>Experience</h2>
              <p className="lead">An internship, open source and one summer school, all in 2026.</p>
            </div>

            <div className="timeline">
              <div className="timeline__rail" aria-hidden="true">
                <span />
              </div>
              <ol className="rows">
                {EXPERIENCE.map((job) => (
                  <li key={job.org} className={`spot${job.now ? " is-now" : ""}`} data-rise>
                    <div className="rows__meta">
                      <time>{job.when}</time>
                      <span>{job.where}</span>
                      {job.now && <span className="rows__now">Current</span>}
                    </div>
                    <div className="rows__body">
                      <h3>{job.org}</h3>
                      <p className="rows__role">{job.role}</p>
                      <p>{job.line}</p>
                      <ul className="tags">
                        {job.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <div className="marquee night" aria-hidden="true">
          {[0, 1].map((row) => (
            <div key={row} className="marquee__row">
              {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((name, idx) => (
                <span key={idx}>{name}</span>
              ))}
            </div>
          ))}
        </div>

        <section id="projects" className="section work">
          <div className="work__pin">
            <div className="container work__grid panel">
              <div className="work__side">
                <h2 data-rise>Projects</h2>
                <ol className="work__list">
                  {PROJECTS.map((project, idx) => (
                    <li key={project.title}>
                      <button type="button" data-index={idx} aria-current={idx === 0 ? "true" : undefined}>
                        {project.title}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>

              <ElectricBorder
                className="work__frame"
                color={apricot}
                borderRadius={18}
                thickness={1}
                glow={0.3}
                intensity={0.55}
                chaos={0.35}
                speed={0.7}
              >
              <div className="work__panes">
                {PROJECTS.map((project, idx) => (
                  <SpotlightCard
                    key={project.title}
                    className={`pane${idx === 0 ? " is-active" : ""}`}
                    spotlightColor={periwinkle}
                    intensity={0.22}
                    spotlightSize={320}
                  >
                    <h3>{project.title}</h3>
                    <p className="lead">{project.description}</p>

                    <dl className="pane__figures">
                      {project.figures.map((figure) => (
                        <div key={figure.label}>
                          <dt>{figure.label}</dt>
                          <dd className="num">{figure.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="pane__foot">
                      <ul className="tags">
                        {project.tech.map((tech) => (
                          <li key={tech}>{tech}</li>
                        ))}
                      </ul>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--ghost"
                      >
                        <FaGithub aria-hidden="true" />
                        View on GitHub
                      </a>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
              </ElectricBorder>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="container split stack panel">
            <div className="split__head" data-rise>
              <h2>Tech Stack</h2>
            </div>
            <dl className="stack__rows">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.title} data-rise>
                  <dt>{cat.title}</dt>
                  <dd>
                    <ul className="chips">
                      {cat.items.map((item) => (
                        <li key={item}>
                          {TECH_ICON[item]}
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="stack__loop" data-rise>
            <LogoLoop
              logos={LOGOS}
              speed={70}
              logoHeight={34}
              gap={64}
              pauseOnHover
              scaleOnHover
              ariaLabel="Technologies"
            />
          </div>
        </section>

        <section id="achievements" className="section">
          <div className="container record panel">
            <div className="record__head" data-rise>
              <h2>Achievements</h2>
              <p className="lead">
                Technical and Associate Secretary of MLSC and the Student Development Club, 2025.
              </p>
            </div>

            <div className="record__block">
              <h3 data-rise>Publications</h3>
              <ol className="links links--cards">
                {PUBLICATIONS.map((pub) => (
                  <li key={pub.link} data-rise>
                    <span className="eyebrow">{pub.venue}</span>
                    <a href={pub.link} target="_blank" rel="noopener noreferrer" data-cursor="Read paper">
                      {pub.title}
                    </a>
                    <span className="cert__open" aria-hidden="true">
                      Read paper <b>↗</b>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="record__block">
              <h3 data-rise>Hackathons</h3>
              <ul className="highlights" data-rise>
                {HACKATHON_HIGHLIGHTS.map((group) => (
                  <li key={group.label}>
                    <span className="eyebrow">{group.label}</span>
                    <ul className="tags">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <div className="shots">
                {HACKATHON_PHOTOS.map((photo) => (
                  <a
                    key={photo.title}
                    href={photo.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shot"
                    data-cursor="View photo"
                    data-rise
                  >
                    <span className="shot__frame" data-clip>
                      <GlareHover width="100%" height="100%" borderRadius="0" glareOpacity={0.4}>
                        <img
                          src={photo.thumb}
                          alt={`${photo.title} Hackathon`}
                          loading="lazy"
                          decoding="async"
                        />
                      </GlareHover>
                    </span>
                    <span>{photo.title}</span>
                  </a>
                ))}
              </div>
            </div>

            <div id="certifications" className="record__block">
              <h3 data-rise>Certifications</h3>
              <ol className="links links--cards">
                {CERTIFICATIONS.map((cert) => (
                  <li key={cert.title} data-rise>
                    <span className="eyebrow">{cert.issuer}</span>
                    <a href={cert.link} target="_blank" rel="noopener noreferrer" data-cursor="Open PDF">
                      {cert.title}
                    </a>
                    <span className="cert__open" aria-hidden="true">
                      View certificate <b>↗</b>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact night">
          <div className="contact__scrim" aria-hidden="true" />
          <div className="container contact__grid">
            <div className="contact__head">
              <h2 data-rise>Contact</h2>
              <p className="lead" data-rise>
                Open to internships, full-time roles, and project collaboration.
              </p>

              <p data-rise>
                <a href={`mailto:${EMAIL}`} className="contact-email-link">
                  {EMAIL}
                </a>
              </p>

              <div className="contact__links" data-rise>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  <FaGithub aria-hidden="true" /> GitHub
                </a>
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  <FaLinkedin aria-hidden="true" /> LinkedIn
                </a>
              </div>
            </div>

            <div className="contact__form" data-rise>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__grid">
          <p className="footer__mark">Karnajeet Gosavi</p>
          <p>&copy; {new Date().getFullYear()} Karnajeet Gosavi. All rights reserved.</p>
          <p data-credits>
            Paintings:{" "}
            {CREDITS.map((credit, idx) => (
              <span key={credit.href}>
                {idx > 0 && ", "}
                <a href={credit.href} target="_blank" rel="noopener noreferrer">
                  {credit.name}
                </a>{" "}
                ({credit.license})
              </span>
            ))}
            , Wikimedia Commons
          </p>
        </div>
      </footer>

      <div className="cursor" aria-hidden="true">
        <span />
      </div>

      <Analytics />
    </ClickSpark>
  );
}

export default App;
