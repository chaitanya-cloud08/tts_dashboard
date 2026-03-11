import React from 'react';

const PLATFORMS = [
  {
    id: 'sarvam',
    name: 'Sarvam AI',
    color: '#7C6AFA',
    verbosity: 'Medium',
    controls: ['Language', 'Speaker'],
    bestFor: ['Indian-language coverage', 'Low-to-mid volume usage'],
    watchFor: ['Usage-based cost at high volume'],
  },
  {
    id: 'camb',
    name: 'CAMB AI',
    color: '#00D4FF',
    verbosity: 'High',
    controls: ['Voice', 'Language', 'Speed', 'Pitch'],
    bestFor: ['Maximum tuning/control', 'Stable monthly cost at scale', 'A/B voice experiments'],
    watchFor: ['Subscription cost at low volume'],
  },
  {
    id: 'local',
    name: 'In-House AI',
    color: '#F5A623',
    verbosity: 'Low–Medium',
    controls: ['Host/Publication'],
    bestFor: ['On-prem + compliance needs', 'LLM summarization → shorter reads'],
    watchFor: [ 'Hallucination risk (summarization quality)', 'Engineering effort for deployment and maintenance' ],
  },
];

const SCENARIOS = [
  {
    title: 'Prototype / low volume',
    pick: 'Sarvam AI',
    why: 'Pay-per-use is simplest when traffic is small and bursty.',
    color: '#7C6AFA',
  },
  {
    title: 'High volume with predictable billing',
    pick: 'CAMB AI',
    why: 'Subscription can be cheaper after breakeven and is easier to forecast.',
    color: '#00D4FF',
  },
  {
    title: 'Need speed/pitch/voice tuning',
    pick: 'CAMB AI',
    why: 'Most control knobs in this dashboard (speed + pitch).',
    color: '#00D4FF',
  },
  {
    title: 'Indian languages + multiple speakers',
    pick: 'Sarvam AI',
    why: 'Good language coverage with simple speaker selection.',
    color: '#7C6AFA',
  },
  {
    title: 'Long articles → concise narration',
    pick: 'In-House AI',
    why: 'Summarization step helps reduce “too verbose” reads without manual edits.',
    color: '#F5A623',
  },
];

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'DM Mono, monospace', fontSize: '10px',
      color: 'var(--white-dim)', textTransform: 'uppercase',
      letterSpacing: '0.1em', marginBottom: '10px',
    }}>{children}</div>
  );
}

function BulletList({ items }) {
  return (
    <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--white-dim)', fontFamily: 'Inter', fontSize: '13px', lineHeight: 1.6 }}>
      {items.map((t) => <li key={t} style={{ marginBottom: '6px' }}>{t}</li>)}
    </ul>
  );
}

export default function SelectionGuide() {
  return (
    <section id="guide" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="bg-glow-sarvam" style={{ top: '-80px', left: '-100px' }} />
      <div className="bg-glow-camb" style={{ bottom: '-80px', right: '-100px' }} />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>

        {/* Section header */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--gold)',
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px',
          }}>05 — Selection Guide</div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, marginBottom: '12px' }}>
            Which platform should we <em style={{ fontWeight: 300 }}>choose</em>?
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '16px', color: 'var(--white-dim)', maxWidth: '720px' }}>
            A quick, practical comparison across Sarvam, CAMB, and In-House — including “verbosity” (how many knobs you can tune, and whether the pipeline shortens long text).
          </p>
        </div>

        {/* Platform summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          {PLATFORMS.map((p) => (
            <div key={p.id} className="glass-card" style={{ padding: '24px', borderColor: `${p.color}22` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: p.color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Platform
                  </div>
                  <div style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 600, color: 'var(--white)' }}>
                    {p.name}
                  </div>
                </div>
                <span style={{
                  fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: p.color,
                  background: `${p.color}15`, border: `1px solid ${p.color}35`,
                  padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap',
                }}>
                  Verbosity: {p.verbosity}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div className="stat-box">
                  <div className="stat-value" style={{ color: p.color, fontSize: '14px' }}>{p.controls.length}</div>
                  <div className="stat-label">control knobs</div>
                </div>
                <div className="stat-box">
                  <div className="stat-value" style={{ color: p.color, fontSize: '14px' }}>{p.controls.join(', ')}</div>
                  <div className="stat-label">controls</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                <div>
                  <SectionLabel>Best For</SectionLabel>
                  <BulletList items={p.bestFor} />
                </div>
                <div>
                  <SectionLabel>Watch For</SectionLabel>
                  <BulletList items={p.watchFor} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scenario picker */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 600, marginBottom: '6px' }}>
                What to choose in different scenarios
              </h3>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)', margin: 0 }}>
                Use this as a default decision matrix — then validate with the playground + cost breakeven.
              </p>
            </div>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--white-dim)',
              border: '1px solid var(--navy-border)', padding: '6px 10px', borderRadius: '8px',
            }}>
              Tip: Start with Sarvam → scale to CAMB → prefer In-House for compliance
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {SCENARIOS.map((s) => (
              <div key={s.title} style={{
                background: 'rgba(10, 15, 30, 0.6)',
                border: '1px solid var(--navy-border)',
                borderRadius: '12px',
                padding: '14px 16px',
              }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--white-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Scenario
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '14px', color: 'var(--white)', marginBottom: '10px' }}>
                  {s.title}
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  fontFamily: 'DM Mono, monospace', fontSize: '10px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: s.color, background: `${s.color}15`, border: `1px solid ${s.color}35`,
                  padding: '4px 10px', borderRadius: '20px', marginBottom: '10px',
                }}>
                  Choose: {s.pick}
                </div>
                <div style={{ fontFamily: 'Inter', fontSize: '13px', color: 'var(--white-dim)', lineHeight: 1.6 }}>
                  {s.why}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

