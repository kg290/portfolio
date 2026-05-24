import "./GradientText.css";

export default function GradientText({
  children,
  className = "",
  colors = ["#6366f1", "#a855f7", "#ec4899"],
  animationSpeed = 8,
}) {
  return (
    <span
      className={`gradient-text-anim ${className}`}
      style={{
        backgroundImage: `linear-gradient(to right, ${colors.join(", ")}, ${colors[0]})`,
        animationDuration: `${animationSpeed}s`,
      }}
    >
      {children}
    </span>
  );
}
