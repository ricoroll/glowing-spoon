import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';
import ParticleTitle from './ParticleTitle';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, 45]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      style={{
        height: '100vh',
        minHeight: 600,
        background: 'black',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Video background */}
      <iframe
        src="https://player.cloudinary.com/embed/?cloud_name=dgqsqiucd&public_id=Untitled_design_ydxlbl&autoplay=true&loop=true&muted=true&controls=false&showLogo=false&showJumpControls=false&hideContextMenu=true"
        allow="autoplay; fullscreen"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '56.25vw',
          border: 'none',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Darkening overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'rgba(0,0,0,0.05)',
        }}
      />

      {/* Particle dust */}
      <ParticleCanvas />

      {/* Content */}
      <motion.div
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: 110,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          y: contentY,
          opacity: contentOpacity,
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
          className="liquid-glass"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            borderRadius: 9999,
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            marginBottom: '2rem',
          }}
        >
          <span
            style={{
              background: 'white',
              color: 'black',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 9999,
              paddingLeft: '0.5rem',
              paddingRight: '0.5rem',
              paddingTop: '0.1rem',
              paddingBottom: '0.1rem',
            }}
          >
            New
          </span>
          <span
            style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '0.82rem',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
            }}
          >
            Introducing AI-powered web design.
          </span>
        </motion.div>

        {/* Particle Title */}
        <div style={{ maxWidth: 960, width: '100%', paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
          <ParticleTitle />
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, filter: 'blur(8px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.8, duration: 1, ease: 'easeOut' }}
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontWeight: 300,
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.65)',
            marginTop: '1.5rem',
            marginBottom: '2.5rem',
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          Stunning design. Blazing performance. Built by AI, refined by experts.{' '}
          This is web design, wildly reimagined.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
        >
          <a
            href="#"
            className="liquid-glass-strong"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: 9999,
              paddingLeft: '1.75rem',
              paddingRight: '1.75rem',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              color: 'white',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 400,
              fontSize: '0.95rem',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Get Started
            <ArrowUpRight style={{ width: '1rem', height: '1rem' }} />
          </a>
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderRadius: 9999,
              paddingLeft: '1.25rem',
              paddingRight: '1.25rem',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              fontSize: '0.95rem',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Watch the Film
            <Play style={{ width: '0.9rem', height: '0.9rem' }} />
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div
        style={{
          position: 'absolute',
          zIndex: 5,
          top: 'calc(56.25vw - 280px)',
          left: 0,
          right: 0,
          height: 280,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.9) 80%, black 100%)',
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
