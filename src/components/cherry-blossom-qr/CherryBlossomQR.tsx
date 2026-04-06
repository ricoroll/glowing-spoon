import { useRef, useState } from 'react';
import { useWebGPU } from './use-webgpu';
import { DEFAULT_QR_CONTENT } from './constants';

interface Props {
  /** URL or text to encode. Defaults to the Aether contact URL. */
  content?: string;
  size?:    number;
}

export default function CherryBlossomQR({ content = DEFAULT_QR_CONTENT, size = 380 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isFlatRef = useRef(false);
  const [isFlat, setIsFlat] = useState(false);
  const [gpuUnavailable, setGpuUnavailable] = useState(false);

  // Sync the ref that the render-loop reads
  isFlatRef.current = isFlat;

  useWebGPU({
    canvasRef,
    canvasWidth:  size,
    canvasHeight: size,
    qrContent:    content,
    isFlat:       isFlatRef,
  });

  const toggle = () => {
    if (!navigator.gpu) { setGpuUnavailable(true); return; }
    setIsFlat((v) => !v);
  };

  if (gpuUnavailable) {
    return (
      <div
        style={{
          width: size, height: size,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '0.75rem',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 300,
          fontSize: '0.8rem',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <span style={{ fontSize: '2rem' }}>🌸</span>
        WebGPU isn't available in this browser.
        <br />
        Try Chrome 113+ or Edge 113+.
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <canvas
        ref={canvasRef}
        onClick={toggle}
        title={isFlat ? 'Click to view in 3D' : 'Click to scan QR code'}
        style={{
          width:   size,
          height:  size,
          display: 'block',
          cursor:  'pointer',
          borderRadius: '1.25rem',
        }}
      />
      {/* View toggle hint */}
      <div
        style={{
          position:   'absolute',
          bottom:     '0.75rem',
          left:       '50%',
          transform:  'translateX(-50%)',
          background: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(6px)',
          borderRadius: 9999,
          padding:    '0.2rem 0.75rem',
          fontSize:   '0.65rem',
          fontFamily: "'Barlow', sans-serif",
          fontWeight: 400,
          color:      'rgba(255,255,255,0.55)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          letterSpacing: '0.04em',
        }}
      >
        {isFlat ? 'Tap to go 3D' : 'Tap to scan'}
      </div>
    </div>
  );
}
