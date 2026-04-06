import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CherryBlossomQR from './cherry-blossom-qr/CherryBlossomQR';

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
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="contact"
      style={{
        background: 'black',
        paddingRight: 0,           // card bleeds to right edge
        overflow: 'hidden',
        position: 'relative',
        minHeight: '75vh',
        display: 'flex',
        alignItems: 'stretch',
      }}
    >
      <div
        ref={ref}
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'stretch',
        }}
      >
        {/* ── Left — text ─────────────────────────────────────── */}
        <div
          style={{
            padding: '6rem 3rem 6rem 6rem',
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
              fontSize: 'clamp(2.8rem, 5vw, 5rem)',
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
              maxWidth: '22rem',
            }}
          >
            Scan the code to book a free strategy call, or reach out directly.
            <br />
            We respond within one business day.
          </motion.p>
        </div>

        {/* ── Right — tall white card, flush to edge ───────────── */}
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
            padding: '3rem 2rem',
            borderRadius: '2rem 0 0 2rem',  // only round left corners
          }}
        >
          <CherryBlossomQR size={340} />
        </motion.div>
      </div>
    </section>
  );
}
