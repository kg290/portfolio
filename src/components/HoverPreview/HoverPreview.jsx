import { useState, useCallback, useRef, useEffect, createContext, useContext } from "react";
import "./HoverPreview.css";

const HoverPreviewContext = createContext(null);

/**
 * PreviewCard — floating card that follows the cursor
 */
function PreviewCard({ data, position, isVisible, cardRef }) {
  if (!data) return null;

  return (
    <div
      ref={cardRef}
      className={`hp-card ${isVisible ? "hp-card--visible" : ""}`}
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      <div className="hp-card-inner">
        <img
          src={data.image}
          alt={data.title}
          className="hp-card-image"
        />
        <div className="hp-card-title">{data.title}</div>
        {data.subtitle && <div className="hp-card-subtitle">{data.subtitle}</div>}
      </div>
    </div>
  );
}

/**
 * HoverPreviewProvider — wrap your app/section to enable hover previews.
 * Manages a single floating preview card.
 */
export function HoverPreviewProvider({ children }) {
  const [activePreview, setActivePreview] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const isTouchRef = useRef(false);

  useEffect(() => {
    isTouchRef.current = window.matchMedia("(hover: none)").matches;
  }, []);

  const updatePosition = useCallback((e) => {
    const cardWidth = 320;
    const cardHeight = 260;
    const offsetY = 20;

    let x = e.clientX - cardWidth / 2;
    let y = e.clientY - cardHeight - offsetY;

    if (x + cardWidth > window.innerWidth - 20) x = window.innerWidth - cardWidth - 20;
    if (x < 20) x = 20;
    if (y < 20) y = e.clientY + offsetY;

    setPosition({ x, y });
  }, []);

  const showPreview = useCallback(
    (data, e) => {
      if (isTouchRef.current) return;
      setActivePreview(data);
      setIsVisible(true);
      updatePosition(e);
    },
    [updatePosition]
  );

  const movePreview = useCallback(
    (e) => {
      updatePosition(e);
    },
    [updatePosition]
  );

  const hidePreview = useCallback(() => {
    setIsVisible(false);
  }, []);

  return (
    <HoverPreviewContext.Provider value={{ showPreview, movePreview, hidePreview }}>
      {children}
      <PreviewCard
        data={activePreview}
        position={position}
        isVisible={isVisible}
        cardRef={cardRef}
      />
    </HoverPreviewContext.Provider>
  );
}

/**
 * HoverPreviewTrigger — wrap any element to show a preview on hover.
 *
 * @param {object} preview  — { image, title, subtitle }
 * @param {React.ReactNode} children
 */
export function HoverPreviewTrigger({ children, preview }) {
  const ctx = useContext(HoverPreviewContext);

  if (!ctx || !preview) return children;

  return (
    <div
      className="hp-trigger"
      onMouseEnter={(e) => ctx.showPreview(preview, e)}
      onMouseMove={(e) => ctx.movePreview(e)}
      onMouseLeave={() => ctx.hidePreview()}
    >
      {children}
    </div>
  );
}
