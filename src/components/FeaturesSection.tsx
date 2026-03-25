import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Eye, Sparkles, Zap, Package } from 'lucide-react';

const cards = [
  {
    icon: Eye,
    title: 'Cinematic Visual Systems',
    description:
      'Immersive layouts, motion, and atmosphere that feel authored, not assembled. Every pixel placed with intent.',
    num: '01',
  },
  {
    icon: Sparkles,
    title: 'AI-Led Creative Direction',
    description:
      'We turn prompts, references, and brand signals into cohesive visual experiences that feel unmistakably yours.',
    num: '02',
  },
  {
    icon: Zap,
    title: 'Fast Iteration',
    description:
      'Explore ambitious directions quickly without losing polish. Rapid cycles, high fidelity, always.',
    num: '03',
  },
  {
    icon: Package,
    title: 'Production-Ready Output',
    description:
      'Refined front-end builds designed for responsiveness, clarity, and launch. No handoff headaches.',
    num: '04',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="services"
      style={{
        background: 'black',
        paddingTop: '7rem',
        paddingBottom: '9rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
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
          width: '60%',
          height: '60%',
          transform: 'translate(-50%, -50%)',
          zIndex: 0,
          objectFit: 'cover',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 15%, transparent 72%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 15%, transparent 72%)',
        }}
      >
        <source
          src="https://res.cloudinary.com/dgqsqiucd/video/upload/v1773990554/14967453_1920_1080_30fps_nrgzdo.mp4"
          type="video/mp4"
        />
      </video>

      <div
        ref={ref}
        style={{
          maxWidth: '56rem',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <span className="section-badge">Capabilities</span>
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
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: 'white',
              margin: 0,
            }}
          >
            Built with beauty
            <br />
            and performance in balance.
          </motion.h2>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            maxWidth: '48rem',
            margin: '0 auto',
          }}
        >
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.num}
                custom={i + 2}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -6 }}
                className="group"
                style={{
                  borderRadius: '1.5rem',
                  padding: '1.75rem',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  backdropFilter: 'blur(40px)',
                  WebkitBackdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  boxShadow: '0 1px 0 rgba(255,255,255,0.08) inset, 0 20px 60px rgba(0,0,0,0.5)',
                }}
              >
                {/* Shimmer line */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '1.5rem',
                    right: '1.5rem',
                    height: 1,
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)',
                  }}
                />

                {/* Number */}
                <span
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.75rem',
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 300,
                    color: 'rgba(255,255,255,0.20)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {card.num}
                </span>

                {/* Icon */}
                <div
                  style={{
                    width: '2.75rem',
                    height: '2.75rem',
                    borderRadius: '0.75rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.09), rgba(255,255,255,0.03))',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  <Icon style={{ width: '1.1rem', height: '1.1rem' }} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    color: 'white',
                    margin: '0 0 0.625rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {card.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontWeight: 300,
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
