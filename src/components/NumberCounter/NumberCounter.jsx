import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

export default function NumberCounter({
  value,
  direction = "up",
  delay = 0,
  className = "",
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
}) {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const [displayValue, setDisplayValue] = useState(
    direction === "down" ? value : 0,
  );

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(parseFloat(latest.toFixed(decimalPlaces)));
    });
    return unsubscribe;
  }, [springValue, decimalPlaces]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}

export function StatCard({
  value,
  label,
  prefix = "",
  suffix = "",
  className = "",
  delay = 0,
  style = {},
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={className}
      style={{
        textAlign: "center",
        padding: "32px 24px",
        borderRadius: "20px",
        border: "1px solid rgba(99, 102, 241, 0.15)",
        background: "rgba(8, 8, 20, 0.85)",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Subtle top glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(99,102,241,0.6), transparent)",
        }}
      />

      <div
        style={{
          fontSize: "clamp(36px, 5vw, 52px)",
          fontWeight: 900,
          color: "#fff",
          marginBottom: 8,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          background: "linear-gradient(135deg, #fff 40%, rgba(99,102,241,0.8))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        <NumberCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          delay={delay + 0.2}
          decimalPlaces={Number.isInteger(value) ? 0 : 2}
        />
      </div>

      <div
        style={{
          fontSize: 12,
          color: "rgba(255, 255, 255, 0.45)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}
