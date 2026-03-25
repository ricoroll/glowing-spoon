export default function Footer() {
  return (
    <footer style={{ background: 'black', paddingLeft: '1.5rem', paddingRight: '1.5rem', paddingBottom: '2.5rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        {/* Rule */}
        <div
          style={{
            height: 1,
            width: '100%',
            marginBottom: '2rem',
            background: 'rgba(255,255,255,0.12)',
          }}
        />

        {/* Two-column row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontWeight: 300,
              color: 'rgba(255,255,255,0.38)',
              fontSize: '0.75rem',
              margin: 0,
            }}
          >
            © 2026 Aether Design. All rights reserved.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Contact'].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontWeight: 300,
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.38)',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.70)')}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.38)')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
