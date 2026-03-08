import React, { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Platforms',  href: '#hero' },
  { label: 'Playground', href: '#playground' },
  { label: 'Compare',    href: '#compare' },
  { label: 'Cost',       href: '#cost' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="sticky-nav" style={{ opacity: 1 }}>
      <div style={{
        maxWidth: '1400px', margin: '0 auto', padding: '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #C9A84C, #8B6E2E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px',
          }}>🔊</div>
          <span style={{
            fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 600,
            background: 'linear-gradient(135deg, #E8C96A, #C9A84C)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>TTS Eval</span>
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: '10px',
            color: 'var(--white-dim)', letterSpacing: '0.1em',
            padding: '2px 8px', border: '1px solid var(--navy-border)',
            borderRadius: '4px',
          }}>DASHBOARD</span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '32px' }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                fontFamily: 'DM Mono, monospace', fontSize: '12px',
                color: 'var(--white-dim)', textDecoration: 'none',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--gold)'}
              onMouseLeave={e => e.target.style.color = 'var(--white-dim)'}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px #2ECC71' }} />
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)' }}>LIVE</span>
        </div>
      </div>
    </nav>
  );
}
