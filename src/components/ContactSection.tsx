import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, ArrowUpRight } from 'lucide-react';
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
        paddingTop: '7rem',
        paddingBottom: '7rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Soft pink ambient bloom behind the canvas */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 560,
          height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(255,183,197,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        ref={ref}
        style={{
          maxWidth: '36rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Badge + heading + sub */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <span className="section-badge">Contact</span>
        </motion.div>

        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            letterSpacing: '-0.04em',
            lineHeight: 0.92,
            fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
            color: 'white',
            margin: '0 0 1.25rem',
          }}
        >
          Let's build something{' '}
          <span style={{ color: 'rgba(255,183,197,0.9)' }}>beautiful.</span>
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            color: 'rgba(255,255,255,0.60)',
            fontSize: '1rem',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
          }}
        >
          Scan the code to book a free strategy call, or reach out directly.
          We respond within one business day.
        </motion.p>

        {/* Cherry blossom QR — taller box */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem 2rem',
              width: '100%',
              boxShadow: '0 0 60px rgba(255,183,197,0.08), 0 32px 80px rgba(0,0,0,0.5)',
              borderRadius: '2rem',
              border: '1px solid rgba(255,183,197,0.14)',
              background: 'rgba(255,255,255,0.01)',
            }}
          >
            <CherryBlossomQR size={340} />
          </div>

          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Hover to view in 3D · Scan to book a call
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <a
            href="mailto:hello@aether.design"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(255,183,197,0.85)',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,183,197,1)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,183,197,0.85)')}
          >
            <Mail style={{ width: '0.9rem', height: '0.9rem' }} />
            hello@aether.design
          </a>

          <a
            href="#"
            className="liquid-glass-strong"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: 9999,
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem',
              paddingTop: '0.7rem',
              paddingBottom: '0.7rem',
              color: 'white',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            Book a Call
            <ArrowUpRight style={{ width: '0.9rem', height: '0.9rem' }} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
