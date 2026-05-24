import { FaExternalLinkAlt } from "react-icons/fa";
import { HoverPreviewTrigger } from "../HoverPreview/HoverPreview";
import "./ScrollStack.css";

export default function ScrollStack({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="scroll-stack-list" style={{ "--stack-count": items.length }}>
      {items.map((project, index) => (
        <article
          key={project.title}
          className="scroll-stack-item"
          style={{ "--stack-index": index }}
        >
          <HoverPreviewTrigger preview={project.preview}>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="scroll-stack-card"
            >
              <div className="scroll-stack-head">
                <h3>{project.title}</h3>
                <FaExternalLinkAlt size={14} />
              </div>

              <p>{project.description}</p>

              <div className="scroll-stack-tech-list">
                {project.tech.map((tech) => (
                  <span key={tech} className="scroll-stack-tech-badge">
                    {tech}
                  </span>
                ))}
              </div>
            </a>
          </HoverPreviewTrigger>
        </article>
      ))}
    </div>
  );
}
