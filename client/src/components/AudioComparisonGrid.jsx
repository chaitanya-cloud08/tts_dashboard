import React, { useState } from 'react';
import WaveformPlayer from './WaveformPlayer';

const PLATFORMS = [
  { id: 'sarvam', name: 'Sarvam AI',   color: '#7C6AFA', icon: '🇮🇳' },
  { id: 'camb',   name: 'CAMB AI',     color: '#00D4FF', icon: '🎭' },
  { id: 'local',  name: 'In-House AI', color: '#F5A623', icon: '🧠' },
];

export default function AudioComparisonGrid({ results }) {
  const [notes, setNotes] = useState({ sarvam: '', camb: '', local: '' });
  const [reGenerating, setReGenerating] = useState(false);

  const getResult = (id) => results?.[id] || null;

  // Local always has audio (static file), so the grid is never fully empty
  const hasAnyResult = true;

  return (
    <section id="compare" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="bg-glow-local" style={{ top: '0', right: '-100px' }} />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>

        {/* Section header */}
        <div style={{ marginBottom: '56px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{
              fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--gold)',
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px',
            }}>03 — Audio Comparison</div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600 }}>
              Side-by-Side <em style={{ fontWeight: 300 }}>Analysis</em>
            </h2>
          </div>
          <button
            className="btn-outline"
            onClick={() => {
              // Emit re-generate event — handled by parent via onResultsUpdate
              window.dispatchEvent(new CustomEvent('regenerate-all'));
            }}
          >
            ↻ Re-generate All
          </button>
        </div>

        {/* 3-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {PLATFORMS.map(p => {
            const r = getResult(p.id);
            return (
              <div key={p.id} className="glass-card" style={{ overflow: 'hidden', borderColor: `${p.color}22` }}>

                {/* Column header */}
                <div style={{
                  padding: '20px 24px', borderBottom: '1px solid var(--navy-border)',
                  background: `linear-gradient(135deg, ${p.color}15, transparent)`,
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ fontSize: '20px' }}>{p.icon}</span>
                  <div>
                    <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 600, color: 'var(--white)' }}>
                      {p.name}
                    </h3>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: p.color, letterSpacing: '0.1em' }}>
                      {p.id === 'local'
                        ? 'SAMPLE READY'
                        : r?.mock ? 'MOCK MODE' : r ? 'RESULT READY' : 'AWAITING GENERATION'}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  {/* Row 1: Audio Player */}
                  <div style={{ marginBottom: '20px' }}>
                    <SectionLabel>Audio Output</SectionLabel>
                    {p.id === 'local' ? (
                      <WaveformPlayer
                        audioUrl="/tts_output.wav"
                        color={p.color}
                        label="In-House AI Output"
                      />
                    ) : (
                      <WaveformPlayer
                        audioBase64={r?.audioBase64}
                        color={p.color}
                        label={p.name}
                      />
                    )}
                  </div>

                  {/* Row 3: Quality metadata */}
                  <div style={{ marginBottom: '20px' }}>
                    <SectionLabel>Quality Metadata</SectionLabel>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <MetaStat label="Latency"    value={p.id === 'local' ? 'Offline'    : r ? `${r.latencyMs}ms` : '—'} color={p.color} />
                      <MetaStat label="Characters" value={p.id === 'local' ? '—'          : r?.charCount ?? '—'}           color={p.color} />
                      <MetaStat
                        label="Sample Rate"
                        value={p.id === 'local' ? '22 kHz' : r?.sampleRate ? `${(r.sampleRate / 1000).toFixed(0)}kHz` : '—'}
                        color={p.color}
                      />
                      <MetaStat
                        label="Status"
                        value={p.id === 'local' ? 'On-Premise' : r?.mock ? 'Mock' : r ? 'Live' : 'Pending'}
                        color={p.id === 'local' ? p.color : r?.mock ? 'var(--gold)' : r ? 'var(--green)' : 'var(--white-dim)'}
                      />
                    </div>
                  </div>

                  {/* Row 4: Notes */}
                  <div>
                    <SectionLabel>Analyst Notes</SectionLabel>
                    <textarea
                      className="input-dark"
                      value={notes[p.id]}
                      onChange={e => setNotes(prev => ({ ...prev, [p.id]: e.target.value }))}
                      rows={3}
                      placeholder={`Add notes about ${p.name}...`}
                      style={{ resize: 'vertical', fontSize: '13px' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!hasAnyResult && (
          <div style={{
            textAlign: 'center', marginTop: '40px', padding: '60px 20px',
            border: '1px dashed var(--navy-border)', borderRadius: '16px',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎧</div>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: 'var(--white-dim)' }}>
              Generate audio from the playground above to populate this comparison grid
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'DM Mono, monospace', fontSize: '10px',
      color: 'var(--white-dim)', textTransform: 'uppercase',
      letterSpacing: '0.1em', marginBottom: '10px',
    }}>{children}</div>
  );
}

function MetaStat({ label, value, color }) {
  return (
    <div className="stat-box">
      <div className="stat-value" style={{ color, fontSize: '15px' }}>{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
