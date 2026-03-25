import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="process" style={{ background: 'black' }}>
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: '10rem',
          paddingBottom: '14rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
        }}
      >
        {/* Video background */}
        <iframe
          src="https://player.cloudinary.com/embed/?cloud_name=dgqsqiucd&public_id=Untitled_design_2_elcyul&autoplay=true&loop=true&muted=true&controls=false&showLogo=false&showJumpControls=false&hideContextMenu=true"
          allow="autoplay; fullscreen"
          style={{
            position: 'absolute',
            top: '-12%',
            left: 0,
            width: '100%',
            height: '124%',
            border: 'none',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Top + bottom fade */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: 'linear-gradient(to bottom, black 0%, transparent 45%, transparent 55%, black 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div
          ref={ref}
          style={{
            maxWidth: '64rem',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <span className="section-badge">How It Works</span>
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
              fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
              color: 'white',
              margin: '0 0 1.5rem',
            }}
          >
            You imagine it.
            <br />
            We shape it.
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
              maxWidth: '36rem',
              margin: '0 auto',
            }}
          >
            From concept to launch, our AI-guided process turns direction into a site
            that feels polished, cinematic, and alive.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
