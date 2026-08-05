import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Terminal.css";

const COMMANDS = {
  help: {
    action: () => `Available commands:
  help     - Show this help message
  about    - Learn about me
  skills   - View my technical skills
  projects - See my projects
  certs    - View certifications
  pubs     - View publications
  contact  - Get my contact info
  clear    - Clear the terminal
  whoami   - Who am I?
  date     - Current date and time
  echo     - Echo a message`,
  },
  about: {
    action: () => `
╔══════════════════════════════════════════════════════════╗
║                    KARNAJEET GOSAVI                      ║
║                    AI/ML ENGINEER                        ║
╠══════════════════════════════════════════════════════════╣
║  B.Tech CSE @ VIT Pune | CGPA: 8.98/10                  ║
║                                                          ║
║  Focus:                                                  ║
║  • Applied AI systems and production-ready ML pipelines ║
║  • NLP, Computer Vision, LLM workflows                  ║
║  • API-first backend engineering and cloud tooling      ║
║  • Research, prototyping, and rapid iteration           ║
╚══════════════════════════════════════════════════════════╝`,
  },
  skills: {
    action: () => `
┌─────────────────────────────────────────────────────┐
│                  TECHNICAL SKILLS                   │
├─────────────────────────────────────────────────────┤
│  LANGUAGES:   Python, C/C++, Java, TypeScript       │
│                                                     │
│  AI/ML:       PyTorch, TensorFlow, NLP, LLMs        │
│               LangChain, LlamaIndex, Deep Learning  │
│                                                     │
│  CLOUD/ENG:   AWS, Docker, Kubernetes, Linux        │
│               FastAPI, MongoDB, PostgreSQL, Git     │
└─────────────────────────────────────────────────────┘`,
  },
  projects: {
    action: () => `
┌──────────────────────────────────────────────────────────┐
│                     MY PROJECTS                          │
├──────────────────────────────────────────────────────────┤
│  1. Offroad Terrain Segmentation                         │
│     DeepLabV3+ with ResNet-101 backbone                  │
│     Tech: Python, PyTorch, CV                            │
│                                                          │
│  2. Narrative Consistency Verification                   │
│     Hybrid rule-based + retrieval + LLM reasoning        │
│     Tech: Python, NLP, Pathway RAG                       │
│                                                          │
│  3. Real-Time GPU Visualization & Sonification           │
│     GPU-accelerated fractal exploration engine           │
│     Tech: GPU, Visualization, Audio, Realtime Systems    │
│                                                          │
│  4. SAP CI Technical Specification Generator             │
│     iFlow parser -> tech spec .docx + diagrams           │
│     Tech: Python, SAP CPI, BPMN/XML, Gemini API          │
│                                                          │
│  5. Anti-Fingerprint Instruction Shuffler (AFIS)         │
│     Compiler-backend code diversification toolkit        │
│     Tech: C++17, Compilers, CFG Analysis, IR             │
│                                                          │
│  Visit: github.com/kg290                                 │
└──────────────────────────────────────────────────────────┘`,
  },
  certs: {
    action: () => `
┌─────────────────────────────────────────────────────┐
│                  CERTIFICATIONS                     │
├─────────────────────────────────────────────────────┤
│  OCI 2025 Generative AI Professional               │
│  OCI 2025 Observability Professional               │
│  IBM DevOps and Software Engineering Professional  │
└─────────────────────────────────────────────────────┘`,
  },
  pubs: {
    action: () => `
┌─────────────────────────────────────────────────────┐
│                   PUBLICATIONS                      │
├─────────────────────────────────────────────────────┤
│  1. IEEE ICCPCT 2024                                │
│     Weather Prediction in India                     │
│  2. Smart Retail Shelf (The Grenze)                │
│  3. IEEE Publication 2025                          │
└─────────────────────────────────────────────────────┘`,
  },
  contact: {
    action: () => `
╔════════════════════════════════════════════════════════╗
║                     CONTACT ME                         ║
╠════════════════════════════════════════════════════════╣
║                                                        ║
║   📧  karnajeet.gosavi23@vit.edu                      ║
║   💼  github.com/kg290                                ║
║   🔗  linkedin.com/in/karnajeet-gosavi                ║
║   📞  +91-9322075441                                  ║
║                                                        ║
║   Always open to interesting projects and              ║
║   collaboration opportunities!                         ║
║                                                        ║
╚════════════════════════════════════════════════════════╝`,
  },
  whoami: {
    action: () =>
      'You’re a visitor checking things out. Type “help” to navigate.',
  },
  date: {
    action: () => new Date().toString(),
  },
  echo: {
    action: (args) => args || "(nothing to echo)",
  },
  clear: {
    action: () => "CLEAR",
  },
};

export default function Terminal({ className = "" }) {
  const [history, setHistory] = useState([
    {
      type: "output",
      content:
        'Welcome! Explore skills, certifications, projects, and contact details. Type "help" for commands.',
    },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [history]);

  const runCommand = (raw) => {
    const trimmed = raw.trim().toLowerCase();
    const [cmd, ...rest] = trimmed.split(" ");
    const args = rest.join(" ");

    setCmdHistory((prev) => (raw.trim() ? [...prev, raw.trim()] : prev));
    setHistoryIdx(-1);

    if (!cmd) {
      setHistory((prev) => [...prev, { type: "input", content: raw }]);
      return;
    }

    if (COMMANDS[cmd]) {
      const out = COMMANDS[cmd].action(args);
      if (out === "CLEAR") {
        setHistory([]);
      } else {
        setHistory((prev) => [
          ...prev,
          { type: "input", content: raw },
          { type: "output", content: out },
        ]);
      }
    } else {
      setHistory((prev) => [
        ...prev,
        { type: "input", content: raw },
        {
          type: "error",
          content: `Command not found: "${cmd}". Type "help" for available commands.`,
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length && historyIdx < cmdHistory.length - 1) {
        const idx = historyIdx + 1;
        setHistoryIdx(idx);
        setInput(cmdHistory[cmdHistory.length - 1 - idx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const idx = historyIdx - 1;
        setHistoryIdx(idx);
        setInput(cmdHistory[cmdHistory.length - 1 - idx]);
      } else {
        setHistoryIdx(-1);
        setInput("");
      }
    }
  };

  return (
    <motion.div
      className={`terminal-wrapper ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      viewport={{ once: true }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span className="terminal-dot terminal-dot-red" />
          <span className="terminal-dot terminal-dot-yellow" />
          <span className="terminal-dot terminal-dot-green" />
        </div>
        <span className="terminal-title">karnajeet@portfolio — bash</span>
      </div>

      {/* Output body */}
      <div className="terminal-body" ref={bodyRef}>
        <AnimatePresence initial={false}>
          {history.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={`terminal-line terminal-line--${item.type}`}
            >
              {item.type === "input" && (
                <span className="terminal-prompt-symbol">❯</span>
              )}
              {item.content}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Active input row */}
        <div className="terminal-input-row">
          <span className="terminal-prompt-symbol">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="terminal-cursor" />
        </div>
      </div>

      {/* Hint footer */}
      <div className="terminal-hint">type "help" · ↑↓ history</div>
    </motion.div>
  );
}
