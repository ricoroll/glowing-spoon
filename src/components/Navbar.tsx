import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const links = ['Work', 'About', 'Process', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 2rem)',
        maxWidth: '56rem',
        zIndex: 50,
      }}
    >
      <motion.div
        className="liquid-glass"
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        style={{
          borderRadius: 9999,
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          height: '3.5rem',
          display: 'flex',
          alignItems: 'center',
          boxShadow: scrolled
            ? 'inset 0 1px 1px rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.6)'
            : 'inset 0 1px 1px rgba(255,255,255,0.10)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Logo */}
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              color: 'white',
              fontSize: '1.25rem',
              letterSpacing: '-0.025em',
            }}
          >
            rico.
          </span>
        </div>

        {/* Nav links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.75rem',
            flexShrink: 0,
          }}
        >
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              style={{
                fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 400,
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'white')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.75)')}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <a
            href="#"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              background: 'white',
              color: 'black',
              borderRadius: 9999,
              paddingLeft: '1.25rem',
              paddingRight: '1.25rem',
              paddingTop: '0.375rem',
              paddingBottom: '0.375rem',
              fontSize: '0.875rem',
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 500,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Hire Me
            <ArrowUpRight style={{ width: '0.875rem', height: '0.875rem' }} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
