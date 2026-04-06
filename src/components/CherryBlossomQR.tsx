import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

// ── Tuning ────────────────────────────────────────────────────────────────────
const QR_URL = 'https://aether.design/contact';
const PETAL_COLORS = [
  'rgba(255,183,197,',   // soft pink
  'rgba(255,209,220,',   // blush
  'rgba(255,240,245,',   // near-white pink
  'rgba(255,145,164,',   // deeper rose
  'rgba(255,228,235,',   // pale petal
];
const AMBIENT_COUNT = 55;   // falling background petals
const QR_MODULE_SCALE = 0.72; // fraction of cell size a petal covers

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Draw a single 5-petal cherry blossom centred at (0,0), radius r */
function drawPetal(ctx: CanvasRenderingContext2D, r: number, color: string, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const petals = 5;
  for (let i = 0; i < petals; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / petals);
    ctx.beginPath();
    // Oval petal extending from centre
    ctx.ellipse(0, -r * 0.55, r * 0.28, r * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = color + alpha + ')';
    ctx.fill();
    ctx.restore();
  }
  // Centre dot
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,' + (alpha * 0.9) + ')';
  ctx.fill();
  ctx.restore();
}

// ── Ambient falling petal type ────────────────────────────────────────────────
interface FallingPetal {
  x: number; y: number;
  r: number;
  vx: number; vy: number;
  spin: number; angle: number;
  colorIdx: number;
  opacity: number;
  wobble: number; wobbleSpeed: number; wobbleAmp: number;
}

function makeFallingPetal(canvasW: number, canvasH: number, fromTop = false): FallingPetal {
  return {
    x: Math.random() * canvasW,
    y: fromTop ? -20 : Math.random() * canvasH,
    r: Math.random() * 7 + 4,
    vx: (Math.random() - 0.5) * 0.6,
    vy: Math.random() * 0.7 + 0.3,
    spin: (Math.random() - 0.5) * 0.04,
    angle: Math.random() * Math.PI * 2,
    colorIdx: Math.floor(Math.random() * PETAL_COLORS.length),
    opacity: Math.random() * 0.55 + 0.2,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.018 + 0.006,
    wobbleAmp: Math.random() * 0.8 + 0.2,
  };
}

// ── QR Module petal type ──────────────────────────────────────────────────────
interface QRPetal {
  tx: number; ty: number;   // target position
  x: number; y: number;     // current position
  vx: number; vy: number;
  r: number;
  angle: number; spin: number;
  colorIdx: number;
  opacity: number;
  settled: boolean;
  phase: number;
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function CherryBlossomQR() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let running = true;
    const fallingPetals: FallingPetal[] = [];
    const qrPetals: QRPetal[] = [];

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    // Spawn ambient petals
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      fallingPetals.push(makeFallingPetal(W, H, false));
    }

    // Build QR petal grid
    const buildQR = async () => {
      let matrix: boolean[][] = [];
      try {
        const qr = QRCode.create(QR_URL, { errorCorrectionLevel: 'M' });
        const size = qr.modules.size;
        const data = qr.modules.data;
        for (let r = 0; r < size; r++) {
          matrix[r] = [];
          for (let c = 0; c < size; c++) {
            matrix[r][c] = !!data[r * size + c];
          }
        }
      } catch {
        return;
      }

      if (!matrix.length) return;

      const size = matrix.length;
      const qrDisplaySize = Math.min(W, H) * 0.52;
      const cellSize = qrDisplaySize / size;
      const petalR = (cellSize * QR_MODULE_SCALE) / 2;
      const offsetX = (W - qrDisplaySize) / 2;
      const offsetY = (H - qrDisplaySize) / 2;

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (!matrix[row][col]) continue;
          const tx = offsetX + col * cellSize + cellSize / 2;
          const ty = offsetY + row * cellSize + cellSize / 2;

          // Start petals from random scatter positions
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * Math.min(W, H) * 0.55 + 60;
          qrPetals.push({
            tx, ty,
            x: W / 2 + Math.cos(angle) * dist,
            y: H / 2 + Math.sin(angle) * dist,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            r: petalR,
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.06,
            colorIdx: Math.floor(Math.random() * PETAL_COLORS.length),
            opacity: 0,
            settled: false,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const SPRING = 0.06;
    const FRICTION = 0.80;

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      // ── Falling ambient petals ──
      for (const p of fallingPetals) {
        p.wobble += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.wobble) * p.wobbleAmp;
        p.y += p.vy;
        p.angle += p.spin;
        if (p.y > H + 30) {
          Object.assign(p, makeFallingPetal(W, H, true));
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        drawPetal(ctx, p.r, PETAL_COLORS[p.colorIdx], p.opacity);
        ctx.restore();
      }

      // ── QR petals ──
      for (const p of qrPetals) {
        p.phase += 0.014;
        p.angle += p.spin;

        if (!p.settled) {
          p.vx += (p.tx - p.x) * SPRING;
          p.vy += (p.ty - p.y) * SPRING;
          p.vx *= FRICTION;
          p.vy *= FRICTION;
          p.x += p.vx;
          p.y += p.vy;
          if (p.opacity < 1) p.opacity = Math.min(1, p.opacity + 0.018);

          const d = Math.hypot(p.x - p.tx, p.y - p.ty);
          if (d < 0.8 && Math.hypot(p.vx, p.vy) < 0.3) {
            p.settled = true;
            p.x = p.tx;
            p.y = p.ty;
          }
        } else {
          // Gentle breathing
          p.x = p.tx + Math.sin(p.phase * 0.6) * 0.35;
          p.y = p.ty + Math.cos(p.phase * 0.45) * 0.35;
          p.angle += Math.sin(p.phase * 0.3) * 0.003;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        drawPetal(ctx, p.r, PETAL_COLORS[p.colorIdx], p.opacity);
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    buildQR().then(() => {
      if (running) draw();
    });

    return () => {
      running = false;
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'transparent',
      }}
    />
  );
}
