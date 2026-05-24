import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TEXT_GAP = 5;
const CONNECT_DISTANCE = 22;
const RAY_COUNT = 170;
const STAR_COUNT = 220;
const POINTER_RADIUS = 120;
const MAX_TEXT_PARTICLES = 2800;

export default function Preloader({
  onComplete,
  minDuration = 1400,
  text = "Hi, I am Karnajeet",
}) {
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef(null);
  const animationRef = useRef(0);
  const textParticlesRef = useRef([]);
  const raysRef = useRef([]);
  const starsRef = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const canSkipRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let maxRadius = 0;

    const buildStars = () => {
      starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.55 + Math.random() * 1.1,
        alpha: 0.08 + Math.random() * 0.2,
        twinkle: 0.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const buildRays = () => {
      raysRef.current = Array.from({ length: RAY_COUNT }, () => ({
        angle: Math.random() * Math.PI * 2,
        depth: Math.random(),
        speed: 0.005 + Math.random() * 0.011,
      }));
    };

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
      maxRadius = Math.hypot(width, height) * 0.54;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
      buildRays();
      buildParticles();
    };

    const buildParticles = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = Math.max(1, Math.floor(width));
      offscreen.height = Math.max(1, Math.floor(height));
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      let fontSize = Math.max(40, Math.min(110, width * 0.1));
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";

      do {
        offCtx.font = `900 ${fontSize}px Inter, Segoe UI, sans-serif`;
        if (offCtx.measureText(text).width <= width * 0.82 || fontSize <= 34) {
          break;
        }
        fontSize -= 4;
      } while (fontSize > 34);

      offCtx.clearRect(0, 0, width, height);
      offCtx.fillStyle = "#fff";
      offCtx.font = `900 ${fontSize}px Inter, Segoe UI, sans-serif`;
      offCtx.fillText(text, width / 2, height / 2);

      const imageData = offCtx.getImageData(0, 0, width, height).data;
      const points = [];

      for (let y = 0; y < height; y += TEXT_GAP) {
        for (let x = 0; x < width; x += TEXT_GAP) {
          const alpha = imageData[(y * width + x) * 4 + 3];
          if (alpha > 36) {
            points.push({ x, y });
          }
        }
      }

      const stride = Math.max(1, Math.ceil(points.length / MAX_TEXT_PARTICLES));
      const sampledPoints = stride === 1 ? points : points.filter((_, idx) => idx % stride === 0);

      textParticlesRef.current = sampledPoints.map((point) => ({
        x: centerX + (Math.random() - 0.5) * maxRadius * 0.35,
        y: centerY + (Math.random() - 0.5) * maxRadius * 0.35,
        tx: point.x,
        ty: point.y,
        vx: 0,
        vy: 0,
        size: 1 + Math.random() * 1.1,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const drawRays = () => {
      for (const ray of raysRef.current) {
        ray.depth -= ray.speed;

        if (ray.depth <= 0.001) {
          ray.depth = 1;
          ray.angle = Math.random() * Math.PI * 2;
          ray.speed = 0.005 + Math.random() * 0.011;
        }

        const radius = Math.pow(1 - ray.depth, 1.7) * maxRadius;
        const endX = centerX + Math.cos(ray.angle) * radius;
        const endY = centerY + Math.sin(ray.angle) * radius;
        const segments = Math.max(6, Math.floor(radius / 16));

        for (let i = 0; i < segments; i++) {
          const t = i / segments;
          const x = centerX + (endX - centerX) * t;
          const y = centerY + (endY - centerY) * t;
          const alpha = (1 - t) * (1 - ray.depth) * 0.28;

          context.fillStyle = `rgba(255,255,255,${alpha})`;
          context.fillRect(x, y, 1.25, 1.25);
        }
      }
    };

    const drawStars = (time) => {
      for (const star of starsRef.current) {
        const alpha = star.alpha * (0.5 + 0.5 * Math.sin(time * star.twinkle + star.phase));
        context.fillStyle = `rgba(255,255,255,${alpha})`;
        context.fillRect(star.x, star.y, star.size, star.size);
      }
    };

    const drawConnections = () => {
      const particles = textParticlesRef.current;
      const thresholdSq = CONNECT_DISTANCE * CONNECT_DISTANCE;

      context.lineWidth = 0.7;

      for (let i = 0; i < particles.length; i += 2) {
        const first = particles[i];
        const maxJ = Math.min(i + 18, particles.length);

        for (let j = i + 1; j < maxJ; j++) {
          const second = particles[j];
          const dx = second.x - first.x;
          const dy = second.y - first.y;
          const distSq = dx * dx + dy * dy;

          if (distSq > thresholdSq) continue;

          const alpha = (1 - distSq / thresholdSq) * 0.18;
          context.strokeStyle = `rgba(255,255,255,${alpha})`;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
        }
      }
    };

    const render = () => {
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);
      const time = performance.now() * 0.001;

      drawStars(time);
      drawRays();

      const pointer = pointerRef.current;
      const distortionRadius = Math.min(width, height) * 0.16;

      for (const particle of textParticlesRef.current) {
        let targetX = particle.tx;
        let targetY = particle.ty;

        const cdx = particle.tx - centerX;
        const cdy = particle.ty - centerY;
        const cdist = Math.hypot(cdx, cdy);

        if (cdist < distortionRadius) {
          const influence = 1 - cdist / distortionRadius;
          const swirl = Math.sin(time * 4.2 + cdx * 0.07) * influence;
          const direction = cdx === 0 ? 1 : Math.sign(cdx);
          targetX += direction * swirl * 24;
          targetY += Math.cos(time * 3.5 + cdx * 0.08) * influence * 11;
        }

        const dx = targetX - particle.x;
        const dy = targetY - particle.y;

        particle.vx += dx * 0.033;
        particle.vy += dy * 0.033;
        particle.vx *= 0.79;
        particle.vy *= 0.79;

        if (pointer.active) {
          const pdx = particle.x - pointer.x;
          const pdy = particle.y - pointer.y;
          const dist = Math.hypot(pdx, pdy);
          if (dist < POINTER_RADIUS && dist > 0.001) {
            const force = (1 - dist / POINTER_RADIUS) * 0.75;
            particle.vx += (pdx / dist) * force * 2.8;
            particle.vy += (pdy / dist) * force * 2.8;
          }
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        const alpha = 0.66 + 0.34 * Math.sin(time * 3 + particle.twinkle);

        context.beginPath();
        context.fillStyle = `rgba(255,255,255,${alpha})`;
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }

      drawConnections();

      animationRef.current = requestAnimationFrame(render);
    };

    const handleResize = () => setCanvasSize();
    const handlePointerMove = (event) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      pointerRef.current.active = true;
    };
    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setCanvasSize();
    render();

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      document.body.style.overflow = previousOverflow;
    };
  }, [text]);

  useEffect(() => {
    canSkipRef.current = false;

    const skipEnableTimer = window.setTimeout(() => {
      canSkipRef.current = true;
    }, 500);

    const timer = window.setTimeout(() => {
      setVisible(false);
    }, minDuration);

    const handleSkip = () => {
      if (!canSkipRef.current) return;
      setVisible(false);
    };

    window.addEventListener("pointerdown", handleSkip);
    window.addEventListener("keydown", handleSkip);

    return () => {
      window.clearTimeout(skipEnableTimer);
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", handleSkip);
      window.removeEventListener("keydown", handleSkip);
    };
  }, [minDuration]);

  return (
    <AnimatePresence onExitComplete={() => onComplete?.()}>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 20000,
            background: "#000",
            display: "grid",
            placeItems: "center",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
