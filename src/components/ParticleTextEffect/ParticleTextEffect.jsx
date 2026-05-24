import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };
    this.closeEnoughTarget = 100;
    this.maxSpeed = 1.0;
    this.maxForce = 0.1;
    this.particleSize = 10;
    this.isKilled = false;
    this.startColor = { r: 0, g: 0, b: 0 };
    this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0;
    this.colorBlendRate = 0.01;
  }

  move(timeScale = 1) {
    let proximityMult = 1;
    const dist = Math.hypot(this.pos.x - this.target.x, this.pos.y - this.target.y);
    if (dist < this.closeEnoughTarget) proximityMult = dist / this.closeEnoughTarget;

    const toT = { x: this.target.x - this.pos.x, y: this.target.y - this.pos.y };
    const m = Math.hypot(toT.x, toT.y);
    if (m > 0) { toT.x = (toT.x / m) * this.maxSpeed * proximityMult; toT.y = (toT.y / m) * this.maxSpeed * proximityMult; }

    const steer = { x: toT.x - this.vel.x, y: toT.y - this.vel.y };
    const sm = Math.hypot(steer.x, steer.y);
    if (sm > 0) { steer.x = (steer.x / sm) * this.maxForce; steer.y = (steer.y / sm) * this.maxForce; }

    this.acc.x += steer.x * timeScale; this.acc.y += steer.y * timeScale;
    this.vel.x += this.acc.x; this.vel.y += this.acc.y;
    this.pos.x += this.vel.x * timeScale; this.pos.y += this.vel.y * timeScale;
    this.acc.x = 0; this.acc.y = 0;
  }

  draw(ctx, timeScale = 1) {
    if (this.colorWeight < 1) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate * timeScale, 1);
    }
    const c = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };
    ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
    ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
  }

  kill(w, h) {
    if (this.isKilled) return;
    const rp = randomPos(w / 2, h / 2, (w + h) / 2, w, h);
    this.target.x = rp.x; this.target.y = rp.y;
    this.startColor = blended(this);
    this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0;
    this.isKilled = true;
  }
}

function blended(p) {
  return {
    r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
    g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
    b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
  };
}

function randomPos(cx, cy, mag, w, h) {
  const rx = Math.random() * w, ry = Math.random() * h;
  const dir = { x: rx - cx, y: ry - cy };
  const m = Math.hypot(dir.x, dir.y);
  if (m > 0) { dir.x = (dir.x / m) * mag; dir.y = (dir.y / m) * mag; }
  return { x: cx + dir.x, y: cy + dir.y };
}

const INTRO_TEXT = "Hello";
const SHOW_DURATION_MS = 2500;
const DISPERSE_DURATION_MS = 900;
const MIN_SKIP_DELAY_MS = 2200;
const BASE_PIXEL_STEP = 6;
const LOW_POWER_PIXEL_STEP = 8;

function resolvePixelStep() {
  const cores = navigator.hardwareConcurrency || 4;
  const smallScreen = window.innerWidth <= 768;
  return cores <= 4 || smallScreen ? LOW_POWER_PIXEL_STEP : BASE_PIXEL_STEP;
}

export default function ParticleTextPreloader({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef(null);
  const animRef = useRef(0);
  const ptsRef = useRef([]);
  const phaseRef = useRef("showing");
  const canSkipRef = useRef(false);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;

    const vw = window.innerWidth, vh = window.innerHeight;
    const ratio = vh / vw;
    const W = Math.min(vw, 1200);
    const H = Math.floor(W * ratio);
    const pixelStep = resolvePixelStep();
    const maxParticles = pixelStep >= LOW_POWER_PIXEL_STEP ? 2300 : 4200;
    cvs.width = W; cvs.height = H;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    if (prefersReducedMotion) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, W, H);

      let fs = Math.min(W * 0.1, 100);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      do {
        ctx.font = `700 ${fs}px Inter, Segoe UI, Arial, sans-serif`;
        if (ctx.measureText(INTRO_TEXT).width <= W * 0.85 || fs <= 30) break;
        fs -= 4;
      } while (fs > 30);

      ctx.fillStyle = "#ffffff";
      ctx.fillText(INTRO_TEXT, W / 2, H / 2);

      const reducedTimer = setTimeout(() => setVisible(false), 1800);
      return () => {
        clearTimeout(reducedTimer);
        document.body.style.overflow = prev;
      };
    }

    const pts = ptsRef.current;

    const buildWord = (word) => {
      const off = document.createElement("canvas");
      off.width = W; off.height = H;
      const oc = off.getContext("2d");
      let fs = Math.min(W * 0.1, 100);
      oc.textAlign = "center"; oc.textBaseline = "middle";
      do {
        oc.font = `bold ${fs}px Inter, Segoe UI, Arial, sans-serif`;
        if (oc.measureText(word).width <= W * 0.85 || fs <= 30) break;
        fs -= 4;
      } while (fs > 30);
      oc.fillStyle = "#fff";
      oc.fillText(word, W / 2, H / 2);
      const data = oc.getImageData(0, 0, W, H).data;
      const col = { r: 170 + Math.floor(Math.random() * 85), g: 170 + Math.floor(Math.random() * 85), b: 170 + Math.floor(Math.random() * 85) };
      const idxs = [];
      for (let i = 0; i < data.length; i += pixelStep * 4) idxs.push(i);
      for (let i = idxs.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idxs[i], idxs[j]] = [idxs[j], idxs[i]]; }
      let pi = 0;
      let selected = 0;
      for (const ci of idxs) {
        if (data[ci + 3] <= 0) continue;
        if (selected >= maxParticles) break;
        const x = (ci / 4) % W, y = Math.floor(ci / 4 / W);
        let p;
        if (pi < pts.length) { p = pts[pi]; p.isKilled = false; pi++; }
        else {
          p = new Particle();
          const rp = randomPos(W / 2, H / 2, (W + H) / 2, W, H);
          p.pos.x = rp.x; p.pos.y = rp.y;
          p.maxSpeed = Math.random() * 6 + 4;
          p.maxForce = p.maxSpeed * 0.05;
          p.particleSize = Math.random() * 6 + 6;
          p.colorBlendRate = Math.random() * 0.0275 + 0.0025;
          pts.push(p);
        }
        p.startColor = blended(p);
        p.targetColor = col;
        p.colorWeight = 0;
        p.target.x = x; p.target.y = y;
        selected++;
      }
      for (let i = pi; i < pts.length; i++) pts[i].kill(W, H);
    };

    const killAll = () => { for (const p of pts) p.kill(W, H); };

    buildWord(INTRO_TEXT);

    const startTime = performance.now();
    let lastFrameTime = startTime;
    let hasStartedClosing = false;

    const animate = (now) => {
      const elapsed = now - startTime;
      const frameDelta = Math.min(40, Math.max(10, now - lastFrameTime));
      const timeScale = Math.min(1.85, Math.max(0.75, frameDelta / 16.6667));
      lastFrameTime = now;

      const fadeStrength = Math.min(0.2, Math.max(0.06, 0.1 * timeScale));
      ctx.fillStyle = `rgba(0,0,0,${fadeStrength})`;
      ctx.fillRect(0, 0, W, H);

      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i];
        p.move(timeScale); p.draw(ctx, timeScale);
        if (p.isKilled && (p.pos.x < -50 || p.pos.x > W + 50 || p.pos.y < -50 || p.pos.y > H + 50)) pts.splice(i, 1);
      }

      if (!hasStartedClosing && elapsed >= SHOW_DURATION_MS && phaseRef.current === "showing") {
        hasStartedClosing = true;
        phaseRef.current = "closing";
        killAll();
      }

      if (elapsed >= SHOW_DURATION_MS + DISPERSE_DURATION_MS && phaseRef.current === "closing") {
        phaseRef.current = "done";
        setVisible(false);
        return;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(animRef.current); document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { canSkipRef.current = true; }, MIN_SKIP_DELAY_MS);
    const skip = () => { if (canSkipRef.current) setVisible(false); };
    window.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    return () => { clearTimeout(t); window.removeEventListener("pointerdown", skip); window.removeEventListener("keydown", skip); };
  }, []);

  return (
    <AnimatePresence onExitComplete={() => onComplete?.()}>
      {visible && (
        <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.55, ease: "easeInOut" }}
          style={{ position: "fixed", inset: 0, zIndex: 20000, background: "#000", display: "grid", placeItems: "center" }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
