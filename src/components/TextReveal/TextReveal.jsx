import { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

export default function TextReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.5,
  once = true,
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-10%" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [isInView, controls, once]);

  const words = typeof children === "string" ? children.split(" ") : [children];

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: "inline-flex", flexWrap: "wrap" }}
      initial="hidden"
      animate={controls}
      {...props}
    >
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            overflow: "hidden",
            marginRight: "0.25em",
          }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            variants={{
              hidden: { y: "100%", opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration,
                  delay: delay + i * 0.05,
                  ease: [0.33, 1, 0.68, 1],
                },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function TextRevealByChar({
  children,
  className = "",
  delay = 0,
  duration = 0.3,
  staggerChildren = 0.02,
  once = true,
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-10%" });

  const characters =
    typeof children === "string" ? children.split("") : [children];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay,
      },
    },
  };

  const charVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: "inline-block" }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      {...props}
    >
      {characters.map((char, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          variants={charVariants}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

export function TypewriterEffect({
  words = [],
  className = "",
  cursorClassName = "",
}) {
  const wordsArray = words.map((word) => ({
    ...word,
    text: word.text.split(""),
  }));

  return (
    <div
      className={className}
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      <motion.div style={{ overflow: "hidden" }}>
        {wordsArray.map((word, idx) => (
          <span key={`word-${idx}`} style={{ display: "inline-block" }}>
            {word.text.map((char, index) => (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.05,
                  delay: idx * 0.3 + index * 0.05,
                }}
                key={`char-${index}`}
                className={word.className || ""}
                style={{ color: "inherit" }}
              >
                {char}
              </motion.span>
            ))}
            &nbsp;
          </span>
        ))}
      </motion.div>

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className={cursorClassName}
        style={{
          display: "inline-block",
          borderRadius: 2,
          width: 4,
          height: "1em",
          background: "var(--primary, #6366f1)",
          marginLeft: 4,
          verticalAlign: "middle",
        }}
      />
    </div>
  );
}
