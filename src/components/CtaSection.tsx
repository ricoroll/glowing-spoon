import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      style={{
        background: 'black',
        paddingTop: '7rem',
        paddingBottom: '10rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
      }}
    >
      <div
        ref={ref}
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <span className="section-badge">Let's work</span>
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
            lineHeight: 0.9,
            fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
            color: 'white',
            margin: '0 0 1.5rem',
          }}
        >
          Your next project
          <br />
          starts with a yes.
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            color: 'rgba(255,255,255,0.70)',
            fontSize: '1.05rem',
            lineHeight: 1.65,
            maxWidth: '28rem',
            margin: '0 auto 2.5rem',
          }}
        >
          Whether you have a brief, a vibe, or just a feeling that something could be better — I'm listening.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}
        >
          <a
            href="#"
            className="liquid-glass-strong"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: 9999,
              paddingLeft: '2rem',
              paddingRight: '2rem',
              paddingTop: '0.875rem',
              paddingBottom: '0.875rem',
              color: 'white',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              fontSize: '0.95rem',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Get in Touch
            <ArrowUpRight style={{ width: '1rem', height: '1rem' }} />
          </a>
          <a
            href="#"
            className="liquid-glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: 9999,
              paddingLeft: '2rem',
              paddingRight: '2rem',
              paddingTop: '0.875rem',
              paddingBottom: '0.875rem',
              color: 'rgba(255,255,255,0.80)',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: '0.95rem',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            See My Work
            <ChevronRight style={{ width: '1rem', height: '1rem' }} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
