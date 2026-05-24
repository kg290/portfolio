import "./BorderBeam.css";

export default function BorderBeam({
  className = "",
  size = 200,
  duration = 15,
  borderWidth = 1.5,
  anchor = 90,
  colorFrom = "#6366f1",
  colorTo = "#a855f7",
  delay = 0,
}) {
  return (
    <span
      className={`border-beam-wrapper ${className}`}
      style={{
        "--size": size,
        "--duration": duration,
        "--anchor": anchor,
        "--border-width": borderWidth,
        "--color-from": colorFrom,
        "--color-to": colorTo,
        "--delay": `-${delay}s`,
      }}
    />
  );
}

export function GlowingBorder({
  children,
  className = "",
  containerClassName = "",
  gradientClassName = "",
}) {
  return (
    <div style={{ position: "relative" }} className={containerClassName}>
      <div
        className={gradientClassName}
        style={{
          position: "absolute",
          inset: "-2px",
          background: "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
          borderRadius: "13px",
          filter: "blur(4px)",
          opacity: 0.3,
          transition: "opacity 0.5s",
        }}
      />
      <div
        className={className}
        style={{
          position: "relative",
          background: "rgba(12, 12, 20, 0.8)",
          borderRadius: "12px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
