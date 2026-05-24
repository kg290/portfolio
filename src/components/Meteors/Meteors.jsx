import "./Meteors.css";

export default function Meteors({ number = 20, className = "" }) {
  const meteors = Array.from({ length: number }, (_, i) => i);

  return (
    <>
      {meteors.map((i) => (
        <span
          key={i}
          className={`meteor-particle ${className}`}
          style={{
            left: `${Math.floor(Math.random() * 800 - 400)}px`,
            animationDelay: `${(Math.random() * 0.6 + 0.2).toFixed(2)}s`,
            animationDuration: `${Math.floor(Math.random() * 8 + 2)}s`,
          }}
        />
      ))}
    </>
  );
}
