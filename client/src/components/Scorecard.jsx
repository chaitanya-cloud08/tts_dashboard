import React from 'react';

const SCORECARD_DATA = [
  {
    criteria: 'Cost Efficiency',
    sarvam: 5,
    camb: 3,
    local: 2,
    note: 'Sarvam offers the lowest per-character API cost',
  },
  {
    criteria: 'Language Support',
    sarvam: 5,
    camb: 3,
    local: 1,
    note: 'Sarvam covers 11+ Indian languages natively',
  },
  {
    criteria: 'Voice Naturalness',
    sarvam: 3,
    camb: 5,
    local: 4,
    note: 'CAMB AI leads with emotional synthesis',
  },
  {
    criteria: 'Latency',
    sarvam: 4,
    camb: 3,
    local: 5,
    note: 'Local has zero API round-trip overhead',
  },
  {
    criteria: 'Scalability',
    sarvam: 5,
    camb: 5,
    local: 2,
    note: 'Studio sessions cannot scale to thousands of articles',
  },
  {
    criteria: 'Integration Ease',
    sarvam: 4,
    camb: 4,
    local: 2,
    note: 'APIs integrate in hours; studio needs custom pipeline',
  },
];

const MAX_STARS = 5;

function Stars({ count, color }) {
  return (
    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <span
          key={i}
          style={{
            fontSize: '14px',
            color: i < count ? color : 'var(--navy-border)',
            filter: i < count ? `drop-shadow(0 0 4px ${color}80)` : 'none',
            transition: 'all 0.2s',
          }}
        >★</span>
      ))}
    </div>
  );
}

function ScoreTotal({ scores }) {
  const total = scores.reduce((a, b) => a + b, 0);
  const max = MAX_STARS * SCORECARD_DATA.length;
  return (
    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '24px', fontWeight: 500 }}>
      {total}<span style={{ fontSize: '14px', color: 'var(--white-dim)' }}>/{max}</span>
    </div>
  );
}

export default function Scorecard() {
  const sarvamScores = SCORECARD_DATA.map(d => d.sarvam);
  const cambScores = SCORECARD_DATA.map(d => d.camb);
  const localScores = SCORECARD_DATA.map(d => d.local);

  const sarvamTotal = sarvamScores.reduce((a, b) => a + b, 0);
  const cambTotal = cambScores.reduce((a, b) => a + b, 0);
  const localTotal = localScores.reduce((a, b) => a + b, 0);
  const winner = sarvamTotal >= cambTotal && sarvamTotal >= localTotal ? 'Sarvam AI'
    : cambTotal >= localTotal ? 'CAMB AI' : 'Local/Studio';

  const platforms = [
    { name: 'Sarvam AI', color: '#7C6AFA', scores: sarvamScores, total: sarvamTotal },
    { name: 'CAMB AI', color: '#00D4FF', scores: cambScores, total: cambTotal },
    { name: 'Local / Studio', color: '#F5A623', scores: localScores, total: localTotal },
  ];

  return (
    <section id="scorecard" style={{ padding: '80px 0 120px', position: 'relative' }}>
      <div className="bg-glow-camb" style={{ bottom: 0, left: '20%' }} />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '56px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
            05 — Executive Summary
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(28px, 4vw, 56px)', fontWeight: 700 }}>
            Decision <em style={{ fontWeight: 300 }}>Scorecard</em>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '16px', color: 'var(--white-dim)', maxWidth: '500px', margin: '16px auto 0' }}>
            Objective evaluation across six criteria weighted for enterprise deployment
          </p>
        </div>

        {/* Scorecard table */}
        <div className="glass-card" style={{ overflow: 'hidden', marginBottom: '40px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--navy-border)', background: 'rgba(10,15,30,0.5)' }}>
                  <th style={{ padding: '20px 24px', textAlign: 'left', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 400, width: '30%' }}>
                    Criteria
                  </th>
                  {platforms.map(p => (
                    <th key={p.name} style={{ padding: '20px 24px', textAlign: 'center', fontFamily: 'Fraunces, serif', fontSize: '18px', color: p.color, fontWeight: 600 }}>
                      {p.name}
                    </th>
                  ))}
                  <th style={{ padding: '20px 24px', textAlign: 'left', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 400 }}>
                    Note
                  </th>
                </tr>
              </thead>
              <tbody>
                {SCORECARD_DATA.map((row, i) => {
                  const maxScore = Math.max(row.sarvam, row.camb, row.local);
                  return (
                    <tr key={row.criteria} style={{ borderBottom: i < SCORECARD_DATA.length - 1 ? '1px solid rgba(30,45,69,0.5)' : 'none' }}>
                      <td style={{ padding: '18px 24px', fontFamily: 'Inter', fontSize: '14px', color: 'var(--white)', fontWeight: 500 }}>
                        {row.criteria}
                      </td>
                      {platforms.map(p => {
                        const score = row[p.name.toLowerCase().split(' ')[0]];
                        const isMax = score === maxScore;
                        return (
                          <td key={p.name} style={{ padding: '18px 24px', textAlign: 'center' }}>
                            <div style={{ position: 'relative' }}>
                              <Stars count={score} color={p.color} />
                              {isMax && (
                                <span style={{
                                  position: 'absolute', top: '-8px', right: '20px',
                                  fontFamily: 'DM Mono, monospace', fontSize: '8px',
                                  color: 'var(--green)', background: 'rgba(46,204,113,0.15)',
                                  border: '1px solid rgba(46,204,113,0.3)',
                                  padding: '1px 5px', borderRadius: '3px',
                                  letterSpacing: '0.05em',
                                }}>BEST</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                      <td style={{ padding: '18px 24px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)', lineHeight: 1.5 }}>
                        {row.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Totals row */}
              <tfoot>
                <tr style={{ borderTop: '2px solid var(--navy-border)', background: 'rgba(10,15,30,0.5)' }}>
                  <td style={{ padding: '20px 24px', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    TOTAL SCORE
                  </td>
                  {platforms.map(p => (
                    <td key={p.name} style={{ padding: '20px 24px', textAlign: 'center' }}>
                      <ScoreTotal scores={p.scores} />
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--white-dim)', marginTop: '4px' }}>
                        {((p.total / (MAX_STARS * SCORECARD_DATA.length)) * 100).toFixed(0)}%
                      </div>
                    </td>
                  ))}
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Recommendation banner */}
        <div className="recommendation-banner" style={{ padding: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px', flexShrink: 0,
              background: 'linear-gradient(135deg, #C9A84C, #8B6E2E)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px',
            }}>🏆</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Management Recommendation
              </div>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, marginBottom: '16px' }}>
                Lead with <span className="gold-text">{winner}</span> for primary TTS infrastructure
              </h3>
              <p style={{ fontFamily: 'Inter', fontSize: '15px', color: 'var(--white-dim)', maxWidth: '700px', lineHeight: 1.7, marginBottom: '20px' }}>
                Based on aggregate scoring across cost, language coverage, latency, and scalability,{' '}
                <strong style={{ color: 'var(--white)' }}>{winner}</strong> is the strongest choice for deploying
                high-volume Indian-language TTS infrastructure. CAMB AI is recommended as a premium supplement
                for emotionally-rich, high-visibility content. Local/Studio recordings should be phased out as
                a primary pipeline in favor of API-driven solutions.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span className="badge" style={{ background: 'rgba(46,204,113,0.15)', color: 'var(--green)', border: '1px solid rgba(46,204,113,0.3)', padding: '6px 16px' }}>
                  ✓ Primary: Sarvam AI
                </span>
                <span className="badge" style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.3)', padding: '6px 16px' }}>
                  ✓ Premium Tier: CAMB AI
                </span>
                <span className="badge" style={{ background: 'rgba(255,107,107,0.1)', color: '#FF6B6B', border: '1px solid rgba(255,107,107,0.3)', padding: '6px 16px' }}>
                  ↓ Phase Out: Studio
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '80px', textAlign: 'center' }} className="gold-divider" />
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)' }}>
            TTS Vendor Evaluation Dashboard · Generated {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · Confidential — For Management Use Only
          </p>
        </div>

      </div>
    </section>
  );
}
