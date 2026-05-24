export default function OrbitingCircles({
  className = "",
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 50,
  path = true,
}) {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <circle
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 4"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      <div
        style={{
          "--duration": duration,
          "--radius": radius,
          "--delay": -delay,
          position: "absolute",
          display: "flex",
          width: "100%",
          height: "100%",
          transform: "translateZ(0)",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "9999px",
          animationDirection: reverse ? "reverse" : "normal",
        }}
        className={`animate-orbit ${className}`}
      >
        {children}
      </div>
    </>
  );
}

export function TechOrbit({ icons, radius = 130, className = "" }) {
  const count = icons.length;
  return (
    <div
      style={{ position: "relative", width: 300, height: 300 }}
      className={className}
    >
      {/* Center */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 64,
          height: 64,
          borderRadius: "9999px",
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 20,
          fontWeight: 900,
          boxShadow: "0 0 32px rgba(99, 102, 241, 0.4)",
        }}
      >
        KG
      </div>
      {icons.map((icon, i) => (
        <OrbitingCircles
          key={i}
          duration={20 + i * 4}
          delay={i * (20 / count)}
          radius={radius}
          path={i === 0}
        >
          <div
            style={{
              display: "flex",
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "9999px",
              border: "1px solid rgba(99, 102, 241, 0.25)",
              background: "rgba(8, 8, 20, 0.9)",
              color: "#fff",
              boxShadow: "0 0 12px rgba(99, 102, 241, 0.15)",
            }}
          >
            {icon}
          </div>
        </OrbitingCircles>
      ))}
    </div>
  );
}
