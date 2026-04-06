import { useEffect, useRef } from 'react';

const REPEL_RADIUS = 90;
const REPEL_STRENGTH = 7;
const SPRING = 0.055;
const FRICTION = 0.82;
const CANVAS_HEIGHT = 230;

interface TitleParticle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  r: number;
  opacity: number;
  phase: number;
  settled: boolean;
}

export default function ParticleTitle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<TitleParticle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const buildParticles = (targets: { x: number; y: number }[]) => {
      particlesRef.current = targets.map(({ x, y }) => {
        const fromBelow = Math.random() < 0.5;
        return {
          x: Math.random() * canvas.width,
          y: fromBelow ? canvas.height + 40 : -40,
          tx: x,
          ty: y,
          vx: 0,
          vy: 0,
          r: Math.random() * 0.85 + 0.45,
          opacity: 0,
          phase: Math.random() * Math.PI * 2,
          settled: false,
        };
      });
    };

    const sampleText = (w: number): { x: number; y: number }[] => {
      const offscreen = document.createElement('canvas');
      const H = CANVAS_HEIGHT;
      offscreen.width = w;
      offscreen.height = H;
      const oc = offscreen.getContext('2d')!;

      const fontSize = Math.min(w * 0.086, 90);
      const leading = fontSize * 1.08;
      oc.fillStyle = 'white';
      oc.font = `italic ${fontSize}px 'Instrument Serif'`;
      oc.textAlign = 'center';
      oc.textBaseline = 'middle';

      const lines = ['Chaos, but make', 'it UX.'];
      oc.fillText(lines[0], w / 2, H / 2 - leading * 0.5);
      oc.fillText(lines[1], w / 2, H / 2 + leading * 0.5);

      const imageData = oc.getImageData(0, 0, w, H);
      const points: { x: number; y: number }[] = [];
      const stride = 3;
      for (let y = 0; y < H; y += stride) {
        for (let x = 0; x < w; x += stride) {
          const alpha = imageData.data[(y * w + x) * 4 + 3];
          if (alpha > 100) {
            points.push({ x, y });
          }
        }
      }
      return points;
    };

    const setup = async () => {
      await document.fonts.load("italic 80px 'Instrument Serif'");
      const w = canvas.offsetWidth;
      canvas.width = w;
      canvas.height = CANVAS_HEIGHT;
      const targets = sampleText(w);
      buildParticles(targets);
    };

    const draw = () => {
      if (!running) return;
      const w = canvas.width;
      const H = CANVAS_HEIGHT;
      ctx.clearRect(0, 0, w, H);

      const cx = cursorRef.current.x;
      const cy = cursorRef.current.y;

      for (const p of particlesRef.current) {
        p.phase += 0.012;

        // Cursor repulsion
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Spring toward target
        p.vx += (p.tx - p.x) * SPRING;
        p.vy += (p.ty - p.y) * SPRING;

        // Friction
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        // Breathing drift when settled
        const distToTarget = Math.sqrt((p.x - p.tx) ** 2 + (p.y - p.ty) ** 2);
        if (distToTarget < 2 && !p.settled) p.settled = true;
        if (p.settled && dist >= REPEL_RADIUS) {
          p.x = p.tx + Math.sin(p.phase * 0.7) * 0.4;
          p.y = p.ty + Math.cos(p.phase * 0.5) * 0.4;
        } else {
          p.x += p.vx;
          p.y += p.vy;
        }

        // Opacity
        if (p.opacity < 1) p.opacity = Math.min(1, p.opacity + 0.022);

        // Near cursor glow
        if (dist < REPEL_RADIUS) {
          const nearFactor = 1 - dist / REPEL_RADIUS;
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          glowGrad.addColorStop(0, `rgba(255,255,255,${nearFactor * 0.6 * p.opacity})`);
          glowGrad.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    setup().then(() => {
      if (running) draw();
    });

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      cursorRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: `${CANVAS_HEIGHT}px`,
        cursor: 'none',
        background: 'transparent',
        display: 'block',
      }}
    />
  );
}
