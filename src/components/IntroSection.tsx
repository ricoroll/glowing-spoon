import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const partners = ['Luminary', 'Celestia', 'Vaulted', 'Prism', 'Aura', 'Nocturne'];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function IntroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      style={{
        background: 'black',
        paddingTop: '7rem',
        paddingBottom: '9rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        textAlign: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '70%',
          height: '70%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          objectFit: 'contain',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 75%)',
        }}
      >
        <source
          src="https://res.cloudinary.com/dgqsqiucd/video/upload/v1773990554/14967453_1920_1080_30fps_nrgzdo.mp4"
          type="video/mp4"
        />
      </video>

      {/* Content */}
      <div
        ref={ref}
        style={{
          maxWidth: '48rem',
          margin: '0 auto',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <span className="section-badge">Trusted by modern brands</span>
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
          Design that feels like
          <br />a world, not a template.
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            color: 'rgba(255,255,255,0.72)',
            fontSize: '1.05rem',
            lineHeight: 1.65,
            marginBottom: '3rem',
          }}
        >
          We build web experiences that transcend the ordinary —
          <br />
          immersive, cinematic, and unmistakably yours.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem 3rem',
          }}
        >
          {partners.map((p) => (
            <span
              key={p}
              style={{
                fontSize: '0.875rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 300,
                color: 'rgba(255,255,255,0.42)',
              }}
            >
              {p}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 3,
          height: 300,
          background: 'linear-gradient(to bottom, transparent, black)',
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
