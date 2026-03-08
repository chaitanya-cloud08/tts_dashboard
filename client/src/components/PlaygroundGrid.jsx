import React, { useState, useCallback } from 'react';
import axios from 'axios';
import WaveformPlayer from './WaveformPlayer';

const API_BASE = import.meta.env.VITE_API_URL || '';

const SARVAM_LANGUAGES = [
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'te-IN', label: 'Telugu' },
  { code: 'bn-IN', label: 'Bengali' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'gu-IN', label: 'Gujarati' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'pa-IN', label: 'Punjabi' },
  { code: 'or-IN', label: 'Odia' },
  { code: 'en-IN', label: 'English (India)' },
];

const SARVAM_SPEAKERS = [
  { code: 'shubh',  label: 'Shubh (M) — Default' },
  { code: 'priya',  label: 'Priya (F)' },
  { code: 'neha',   label: 'Neha (F)' },
  { code: 'ritu',   label: 'Ritu (F)' },
  { code: 'aditya', label: 'Aditya (M)' },
  { code: 'rahul',  label: 'Rahul (M)' },
  { code: 'kavya',  label: 'Kavya (F)' },
  { code: 'dev',    label: 'Dev (M)' },
  { code: 'simran', label: 'Simran (F)' },
  { code: 'amit',   label: 'Amit (M)' },
];

const CAMB_VOICES = [
  { code: 147320, label: 'Default Voice', lang: 'en-us' },
];

const CAMB_LANGUAGES = [
  { code: 'en-us', label: 'English (US)' },
  { code: 'hi-in', label: 'Hindi' },
  { code: 'es-es', label: 'Spanish' },
  { code: 'fr-fr', label: 'French' },
  { code: 'de-de', label: 'German' },
  { code: 'ja-jp', label: 'Japanese' },
];

const DEFAULT_TEXT = 'आज हम एक नई यात्रा पर निकल रहे हैं। प्रौद्योगिकी हमारे जीवन को बदल रही है और हम इसका स्वागत करते हैं।';

// Static file served from client/public/
const LOCAL_AUDIO_URL = '/tts_output.wav';

// ─────────────────────────────────────────────────────────────────────────────
export default function PlaygroundGrid({ onResultsUpdate }) {
  const [sharedText, setSharedText]     = useState(DEFAULT_TEXT);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  // Sarvam state
  const [sarvamLang, setSarvamLang]       = useState('hi-IN');
  const [sarvamSpeaker, setSarvamSpeaker] = useState('shubh');
  const [sarvamResult, setSarvamResult]   = useState(null);
  const [sarvamLoading, setSarvamLoading] = useState(false);

  // CAMB state
  const [cambVoice, setCambVoice]   = useState(147320);
  const [cambLang, setCambLang]     = useState('en-us');
  const [cambSpeed, setCambSpeed]   = useState(1.0);
  const [cambPitch, setCambPitch]   = useState(0);
  const [cambResult, setCambResult] = useState(null);
  const [cambLoading, setCambLoading] = useState(false);

  const generateSarvam = useCallback(async () => {
    setSarvamLoading(true);
    setSarvamResult(null);
    try {
      const { data } = await axios.post(`${API_BASE}/api/sarvam/tts`, {
        text: sharedText, language: sarvamLang, speaker: sarvamSpeaker,
      });
      setSarvamResult(data);
      if (onResultsUpdate) onResultsUpdate({ sarvam: data });
      return data;
    } catch (e) {
      const errResult = { error: e.message, latencyMs: 0, charCount: sharedText.length };
      setSarvamResult(errResult);
      return errResult;
    } finally {
      setSarvamLoading(false);
    }
  }, [sharedText, sarvamLang, sarvamSpeaker, onResultsUpdate]);

  const generateCamb = useCallback(async () => {
    setCambLoading(true);
    setCambResult(null);
    try {
      const { data } = await axios.post(`${API_BASE}/api/camb/tts`, {
        text: sharedText, voice: cambVoice, speed: cambSpeed, pitch: cambPitch, language: cambLang,
      });
      setCambResult(data);
      if (onResultsUpdate) onResultsUpdate({ camb: data });
      return data;
    } catch (e) {
      const errResult = { error: e.message, latencyMs: 0, charCount: sharedText.length };
      setCambResult(errResult);
      return errResult;
    } finally {
      setCambLoading(false);
    }
  }, [sharedText, cambVoice, cambSpeed, cambPitch, cambLang, onResultsUpdate]);

  const generateAll = async () => {
    setIsGeneratingAll(true);
    const [sarvamData, cambData] = await Promise.all([generateSarvam(), generateCamb()]);
    setIsGeneratingAll(false);
    if (onResultsUpdate) onResultsUpdate({ sarvam: sarvamData, camb: cambData });
  };

  return (
    <section id="playground" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="bg-glow-camb" style={{ bottom: 0, left: '40%' }} />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>

        {/* Section header */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{
            fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--gold)',
            letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px',
          }}>02 — TTS Playground</div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600, marginBottom: '12px' }}>
            Generate & <em style={{ fontWeight: 300 }}>Compare</em>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '16px', color: 'var(--white-dim)', maxWidth: '500px' }}>
            Enter text below — all three platforms generate audio simultaneously for instant A/B/C comparison.
          </p>
        </div>

        {/* Shared text input */}
        <div className="glass-card" style={{ padding: '28px', marginBottom: '32px' }}>
          <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            Shared Input Text
          </label>
          <textarea
            className="input-dark"
            value={sharedText}
            onChange={e => setSharedText(e.target.value)}
            rows={3}
            placeholder="Enter text to synthesize across all platforms..."
            style={{ resize: 'vertical', fontSize: '15px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)' }}>
              {sharedText.length} characters · {sharedText.split(/\s+/).filter(Boolean).length} words
            </span>
            <button
              className="btn-gold"
              onClick={generateAll}
              disabled={isGeneratingAll || !sharedText.trim()}
              style={{ fontSize: '13px', padding: '12px 32px' }}
            >
              {isGeneratingAll ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="spin" style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid rgba(10,15,30,0.3)', borderTopColor: 'var(--navy)' }} />
                  Generating All…
                </span>
              ) : '⚡ Generate All Platforms'}
            </button>
          </div>
        </div>

        {/* Three-column playground */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

          {/* Panel A — Sarvam */}
          <PlaygroundPanel
            title="Sarvam AI"
            index="A"
            color="#7C6AFA"
            loading={sarvamLoading}
            result={sarvamResult}
            audioColor="#7C6AFA"
            onGenerate={generateSarvam}
            controls={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="panel-label">Language</label>
                  <select className="input-dark" value={sarvamLang} onChange={e => setSarvamLang(e.target.value)}>
                    {SARVAM_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="panel-label">Speaker / Voice</label>
                  <select className="input-dark" value={sarvamSpeaker} onChange={e => setSarvamSpeaker(e.target.value)}>
                    {SARVAM_SPEAKERS.map(s => <option key={s.code} value={s.code}>{s.label}</option>)}
                  </select>
                </div>
              </div>
            }
          />

          {/* Panel B — CAMB AI */}
          <PlaygroundPanel
            title="CAMB AI"
            index="B"
            color="#00D4FF"
            loading={cambLoading}
            result={cambResult}
            audioColor="#00D4FF"
            onGenerate={generateCamb}
            controls={
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="panel-label">Voice</label>
                  <select className="input-dark" value={cambVoice} onChange={e => setCambVoice(parseInt(e.target.value))}>
                    {CAMB_VOICES.map(v => <option key={v.code} value={v.code}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="panel-label">Language</label>
                  <select className="input-dark" value={cambLang} onChange={e => setCambLang(e.target.value)}>
                    {CAMB_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="panel-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Speed <span style={{ color: '#00D4FF' }}>{cambSpeed.toFixed(1)}×</span>
                  </label>
                  <input type="range" min="0.5" max="2.0" step="0.1" value={cambSpeed} onChange={e => setCambSpeed(parseFloat(e.target.value))} />
                </div>
                <div>
                  <label className="panel-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Pitch <span style={{ color: '#00D4FF' }}>{cambPitch > 0 ? '+' : ''}{cambPitch}</span>
                  </label>
                  <input type="range" min="-10" max="10" step="1" value={cambPitch} onChange={e => setCambPitch(parseInt(e.target.value))} />
                </div>
              </div>
            }
          />

          {/* Panel C — In-House AI (static showcase) */}
          <LocalShowcasePanel />

        </div>
      </div>
    </section>
  );
}

// ── Static In-House AI Showcase Panel ────────────────────────────────────────
function LocalShowcasePanel() {
  const COLOR = '#F5A623';

  return (
    <div className="glass-card" style={{ padding: '24px', borderColor: `${COLOR}22`, display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 500,
          color: COLOR, background: `${COLOR}20`, border: `1px solid ${COLOR}40`,
          padding: '4px 10px', borderRadius: '6px',
        }}>C</span>
        <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 600, color: 'var(--white)' }}>
          In-House AI
        </h3>
        <span style={{
          marginLeft: 'auto',
          fontFamily: 'DM Mono, monospace', fontSize: '9px', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: COLOR,
          background: `${COLOR}15`, border: `1px solid ${COLOR}35`,
          padding: '3px 8px', borderRadius: '20px', whiteSpace: 'nowrap',
        }}>
          Internal Model
        </span>
      </div>

      {/* Info pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {[
          { icon: '🧠', text: 'Custom-trained' },
          { icon: '🌐', text: 'Hindi (hi-IN)' },
          { icon: '🔒', text: 'On-premise' },
        ].map(({ icon, text }) => (
          <span key={text} style={{
            fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--white-dim)',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            padding: '5px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            {icon} {text}
          </span>
        ))}
      </div>

      {/* Description */}
      <p style={{
        fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)',
        lineHeight: 1.7, marginBottom: '20px',
        padding: '12px 14px',
        background: `${COLOR}08`, borderLeft: `2px solid ${COLOR}50`,
        borderRadius: '0 6px 6px 0',
      }}>
        Trained in-house on a proprietary Hindi news audio corpus. No external API — audio generated offline and served here as a reference sample.
      </p>

      {/* Waveform player — hardcoded to public/tts_output.wav */}
      <div style={{ flex: 1 }}>
        <style>{`.panel-label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--white-dim); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 6px; }`}</style>
        <WaveformPlayer audioUrl={LOCAL_AUDIO_URL} color={COLOR} label="In-House AI Output" />
      </div>

      {/* Static stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '16px' }}>
        <div className="stat-box">
          <div className="stat-value" style={{ color: COLOR, fontSize: '14px' }}>Offline</div>
          <div className="stat-label">Generation</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: COLOR, fontSize: '14px' }}>Custom</div>
          <div className="stat-label">Voice model</div>
        </div>
        <div className="stat-box">
          <div className="stat-value" style={{ color: COLOR, fontSize: '14px' }}>WAV</div>
          <div className="stat-label">Format</div>
        </div>
      </div>

    </div>
  );
}

// ── Reusable Playground Panel (Sarvam / CAMB) ────────────────────────────────
function PlaygroundPanel({ title, index, color, loading, result, onGenerate, controls, audioColor }) {
  return (
    <div className="glass-card" style={{ padding: '24px', borderColor: `${color}22` }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 500,
            color, background: `${color}20`, border: `1px solid ${color}40`,
            padding: '4px 10px', borderRadius: '6px',
          }}>{index}</span>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '18px', fontWeight: 600, color: 'var(--white)' }}>
            {title}
          </h3>
        </div>
        {loading && (
          <div className="spin" style={{
            width: '20px', height: '20px', borderRadius: '50%',
            border: `2px solid ${color}30`, borderTopColor: color,
          }} />
        )}
      </div>

      {/* Controls */}
      <div style={{ marginBottom: '16px' }}>
        <style>{`.panel-label { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--white-dim); text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 6px; }`}</style>
        {controls}
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={loading}
        style={{
          width: '100%',
          background: loading ? `${color}20` : `linear-gradient(135deg, ${color}30, ${color}15)`,
          border: `1px solid ${color}50`,
          borderRadius: '8px', padding: '12px',
          color: loading ? `${color}70` : color,
          fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 500,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s', marginBottom: '16px',
        }}
      >
        {loading ? 'Generating…' : `Generate with ${title}`}
      </button>

      {/* Waveform player */}
      <WaveformPlayer
        audioBase64={result?.audioBase64}
        color={audioColor}
        label={title}
      />

      {/* Stats */}
      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginTop: '16px' }}>
          <div className="stat-box">
            <div className="stat-value" style={{ color, fontSize: '16px' }}>{result.latencyMs || 0}</div>
            <div className="stat-label">ms latency</div>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ color, fontSize: '16px' }}>{result.charCount || 0}</div>
            <div className="stat-label">characters</div>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ color, fontSize: '16px' }}>
              {result.sampleRate ? `${(result.sampleRate / 1000).toFixed(0)}k` : 'N/A'}
            </div>
            <div className="stat-label">sample rate</div>
          </div>
        </div>
      )}

      {result?.mock && (
        <div style={{
          marginTop: '12px', padding: '8px 12px', borderRadius: '6px',
          background: 'rgba(201, 168, 76, 0.08)', border: '1px solid rgba(201, 168, 76, 0.2)',
        }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--gold)' }}>
            ⚠ Mock mode — add API key to server/.env for real audio
          </p>
        </div>
      )}
    </div>
  );
}
