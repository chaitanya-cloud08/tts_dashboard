import React from 'react';

const platforms = [
  {
    id: 'sarvam',
    icon: '🇮🇳',
    name: 'Sarvam AI',
    tagline: 'India\'s native-language voice engine',
    description: 'Purpose-built for Indian languages with state-of-the-art multilingual TTS across 11+ regional languages. The default choice for Bharat-first content.',
    color: '#7C6AFA',
    glowClass: 'sarvam-glow',
    strengths: ['11+ Indian Languages', 'Low Latency', 'Hindi-First', 'REST API'],
    href: '#playground',
    ctaLabel: 'Open Playground →',
  },
  {
    id: 'camb',
    icon: '🎭',
    name: 'CAMB AI',
    tagline: 'Enterprise emotional voice synthesis',
    description: 'Premium TTS with emotional depth, pitch control, and voice cloning capabilities. Ideal for high-production content where voice naturalness is critical.',
    color: '#00D4FF',
    glowClass: 'camb-glow',
    strengths: ['Emotional Tones', 'Voice Cloning', 'Pitch & Speed', 'Enterprise SLA'],
    href: '#playground',
    ctaLabel: 'Open Playground →',
  },
  {
    id: 'local',
    icon: '🧠',
    name: 'In-House AI',
    tagline: 'Custom-trained in-house voice model',
    description: 'Built in-house on a proprietary Hindi news audio corpus. No external API — runs fully on-premise with zero vendor lock-in. The internal baseline against which all API vendors are evaluated.',
    color: '#F5A623',
    glowClass: 'local-glow',
    strengths: ['Custom-Trained', 'On-Premise', 'Zero Vendor Lock-in', 'Hindi-First'],
    href: '#compare',
    ctaLabel: 'Listen to Sample →',
  },
];

export default function HeroSection() {
  return (
    <section id="hero" style={{ paddingTop: '120px', paddingBottom: '100px', position: 'relative', overflow: 'hidden' }}>
      {/* Background decorations */}
      <div className="bg-glow-sarvam" style={{ top: '-100px', left: '-100px' }} />
      <div className="bg-glow-camb" style={{ top: '0px', right: '-100px' }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            display: 'inline-block',
            fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 500,
            color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase',
            border: '1px solid rgba(201, 168, 76, 0.3)',
            padding: '6px 16px', borderRadius: '20px',
            marginBottom: '32px', background: 'rgba(201, 168, 76, 0.05)',
          }}>
            Vendor Evaluation — Q1 2026
          </div>
          <h1 style={{
            fontFamily: 'Fraunces, serif', fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 700, lineHeight: 1.1, marginBottom: '24px',
          }}>
            <span className="gold-text">The Three Platforms</span><br />
            <span style={{ color: 'var(--white)', fontStyle: 'italic', fontWeight: 300 }}>for TTS Infrastructure</span>
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '18px', color: 'var(--white-dim)',
            maxWidth: '600px', margin: '0 auto', lineHeight: 1.7,
          }}>
            A comprehensive evaluation of text-to-speech platforms to inform our infrastructure investment decision.
          </p>
        </div>

        {/* Platform Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '28px',
        }}>
          {platforms.map((p, i) => (
            <PlatformCard key={p.id} platform={p} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformCard({ platform: p, delay }) {
  return (
    <div
      className="glass-card glass-card-hover reveal"
      style={{
        padding: '36px', position: 'relative', overflow: 'hidden',
        animationDelay: `${delay}ms`,
        borderColor: `${p.color}22`,
      }}
    >
      {/* Corner glow */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '200px', height: '200px',
        background: `radial-gradient(circle at top right, ${p.color}15 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      {/* Top row: icon + platform */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: `${p.color}20`,
            border: `1px solid ${p.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px',
          }}>
            {p.icon}
          </div>
          <div>
            <h3 style={{
              fontFamily: 'Fraunces, serif', fontSize: '22px', fontWeight: 600,
              color: 'var(--white)', marginBottom: '2px',
            }}>{p.name}</h3>
            <p style={{
              fontFamily: 'DM Mono, monospace', fontSize: '11px',
              color: p.color, letterSpacing: '0.05em',
            }}>{p.tagline}</p>
          </div>
        </div>
        {/* Index number */}
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: '36px', fontWeight: 300,
          color: `${p.color}30`, lineHeight: 1,
        }}>0{['sarvam','camb','local'].indexOf(p.id) + 1}</span>
      </div>

      {/* Description */}
      <p style={{
        fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'var(--white-dim)',
        lineHeight: 1.7, marginBottom: '28px',
      }}>
        {p.description}
      </p>

      {/* Strengths badges */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
        {p.strengths.map((s) => (
          <span key={s} className="badge" style={{
            background: `${p.color}15`, color: p.color,
            border: `1px solid ${p.color}30`,
          }}>{s}</span>
        ))}
      </div>

      {/* Gold divider */}
      <div className="gold-divider" style={{ marginBottom: '24px' }} />

      {/* CTA */}
      <a href={p.href} style={{ textDecoration: 'none' }}>
        <button style={{
          width: '100%',
          background: `linear-gradient(135deg, ${p.color}22, ${p.color}10)`,
          border: `1px solid ${p.color}50`,
          borderRadius: '10px',
          padding: '14px',
          color: p.color,
          fontFamily: 'DM Mono, monospace',
          fontSize: '12px', fontWeight: 500,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => { e.target.style.background = `${p.color}30`; e.target.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.target.style.background = `linear-gradient(135deg, ${p.color}22, ${p.color}10)`; e.target.style.transform = 'translateY(0)'; }}
        >
          {p.ctaLabel}
        </button>
      </a>
    </div>
  );
}
