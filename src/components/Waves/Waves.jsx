import { useEffect, useRef, useMemo, useCallback } from 'react';

const Waves = ({
  lineColor = 'rgba(255,255,255,0.15)',
  backgroundColor = '#000',
  waveSpeedX = 0.02,
  waveSpeedY = 0.01,
  waveAmpX = 40,
  waveAmpY = 20,
  friction = 0.9,
  tension = 0.01,
  maxCursorMove = 120,
  xGap = 12,
  yGap = 36,
  style = {},
  className = ''
}) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const boundRef = useRef({ width: 0, height: 0 });
  const linesRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000, lx: 0, ly: 0, sx: 0, sy: 0 });
  const rafRef = useRef(null);

  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    ctxRef.current = c.getContext('2d');
    ctxRef.current.scale(dpr, dpr);
    boundRef.current = { width: rect.width, height: rect.height };
    initLines();
  }, [xGap, yGap]);

  const initLines = useCallback(() => {
    const { width, height } = boundRef.current;
    const lines = [];
    const osc = { x: 0, y: 0, ix: 0, iy: 0 };

    const numYLines = Math.ceil(height / yGap) + 6;
    const numXPoints = Math.ceil(width / xGap) + 6;

    for (let j = 0; j < numYLines; j++) {
      const pts = [];
      for (let i = 0; i < numXPoints; i++) {
        pts.push({
          x: xGap * (i - 2),
          y: yGap * (j - 2),
          wave: { x: 0, y: 0 },
          cursor: { x: 0, y: 0, vx: 0, vy: 0 }
        });
      }
      lines.push(pts);
    }
    linesRef.current = lines;
  }, [xGap, yGap]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    const handleMouse = (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const el = canvasRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouse);
      el.addEventListener('mouseleave', () => {
        mouseRef.current.x = -1000;
        mouseRef.current.y = -1000;
      });
    }

    return () => {
      if (el) {
        el.removeEventListener('mousemove', handleMouse);
      }
    };
  }, []);

  useEffect(() => {
    let t = 0;
    const draw = () => {
      t++;
      const ctx = ctxRef.current;
      const { width, height } = boundRef.current;
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const m = mouseRef.current;
      let dx = m.x - m.lx;
      let dy = m.y - m.ly;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxD = maxCursorMove;
      if (dist > maxD) {
        dx = (dx / dist) * maxD;
        dy = (dy / dist) * maxD;
      }
      m.sx = m.sx * 0.92 + dx * 0.08;
      m.sy = m.sy * 0.92 + dy * 0.08;
      m.lx = m.x;
      m.ly = m.y;

      const lines = linesRef.current;
      for (let j = 0; j < lines.length; j++) {
        const pts = lines[j];
        for (let i = 0; i < pts.length; i++) {
          const p = pts[i];
          p.wave.x =
            Math.sin(p.y * 0.01 + t * waveSpeedX) *
            waveAmpX;
          p.wave.y =
            Math.sin(p.x * 0.01 + t * waveSpeedY) *
            waveAmpY;

          const pdx = p.x + p.wave.x - m.x;
          const pdy = p.y + p.wave.y - m.y;
          const pd = Math.sqrt(pdx * pdx + pdy * pdy);
          const maxInfluence = 200;

          if (pd < maxInfluence) {
            const power = (1 - pd / maxInfluence);
            p.cursor.vx += m.sx * power * 0.3;
            p.cursor.vy += m.sy * power * 0.3;
          }

          p.cursor.vx += (0 - p.cursor.x) * tension;
          p.cursor.vy += (0 - p.cursor.y) * tension;
          p.cursor.vx *= friction;
          p.cursor.vy *= friction;
          p.cursor.x += p.cursor.vx;
          p.cursor.y += p.cursor.vy;
        }

        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;

        for (let i = 0; i < pts.length - 1; i++) {
          const p = pts[i];
          const nx = p.x + p.wave.x + p.cursor.x;
          const ny = p.y + p.wave.y + p.cursor.y;

          if (i === 0) {
            ctx.moveTo(nx, ny);
          } else {
            const pp = pts[i - 1];
            const ppx = pp.x + pp.wave.x + pp.cursor.x;
            const ppy = pp.y + pp.wave.y + pp.cursor.y;
            ctx.quadraticCurveTo(
              ppx,
              ppy,
              (ppx + nx) / 2,
              (ppy + ny) / 2
            );
          }
        }
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [lineColor, backgroundColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, friction, tension, maxCursorMove]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        ...style
      }}
    />
  );
};

export default Waves;
