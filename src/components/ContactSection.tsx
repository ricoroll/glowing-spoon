import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CherryBlossomQR from './cherry-blossom-qr/CherryBlossomQR';
import { useIsMobile } from '../hooks/useIsMobile';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.13,
      duration: 0.85,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const qrSize = isMobile ? Math.min(280, window.innerWidth - 80) : 340;

  return (
    <section
      id="contact"
      style={{
        background: 'black',
        paddingRight: isMobile ? 0 : 0,
        overflow: 'hidden',
        position: 'relative',
        minHeight: isMobile ? 'auto' : '75vh',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <div
        ref={ref}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          alignItems: 'stretch',
        }}
      >
        {/* ── Text ───────────────────────────────────────────────── */}
        <div
          style={{
            padding: isMobile ? '4rem 1.5rem 2.5rem' : '6rem 3rem 6rem 6rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1.5rem',
          }}
        >
          <motion.h2
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              fontSize: isMobile ? 'clamp(2.2rem, 10vw, 3.2rem)' : 'clamp(2.8rem, 5vw, 5rem)',
              color: 'white',
              margin: 0,
            }}
          >
            Let's build
            <br />
            something{' '}
            <span style={{ color: 'rgba(240,150,180,1)' }}>beautiful!</span>
          </motion.h2>

          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              color: 'rgba(255,255,255,0.58)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              margin: 0,
              maxWidth: isMobile ? '100%' : '22rem',
            }}
          >
            Scan to say hi, collab, or just tell me what you think.
            <br />
            I respond fast — it's one of my few redeeming qualities.
          </motion.p>
        </div>

        {/* ── White card with QR ──────────────────────────────────── */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            background: '#f7f7f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: isMobile ? '2.5rem 1.5rem 3rem' : '3rem 2rem',
            // On desktop: only round left corners so it bleeds to the right edge
            // On mobile: round top corners so it feels like a card below the text
            borderRadius: isMobile ? '2rem 2rem 0 0' : '2rem 0 0 2rem',
          }}
        >
          <CherryBlossomQR size={qrSize} />
        </motion.div>
      </div>
    </section>
  );
}
