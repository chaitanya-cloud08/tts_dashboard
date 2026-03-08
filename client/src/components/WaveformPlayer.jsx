import React, { useEffect, useRef, useState } from 'react';

export default function WaveformPlayer({ audioBase64, audioUrl, color = '#C9A84C', label }) {
  const waveRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  const getAudioSrc = () => {
    if (audioUrl) return audioUrl;
    if (audioBase64) return `data:audio/wav;base64,${audioBase64}`;
    return null;
  };

  useEffect(() => {
    const src = getAudioSrc();
    if (!src || !waveRef.current) return;

    let ws;

    import('wavesurfer.js').then(({ default: WaveSurfer }) => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
      ws = WaveSurfer.create({
        container: waveRef.current,
        waveColor: `${color}60`,
        progressColor: color,
        cursorColor: color,
        barWidth: 2,
        barRadius: 2,
        barGap: 1,
        height: 60,
        responsive: true,
        normalize: true,
        backend: 'WebAudio',
      });

      ws.on('ready', () => {
        setIsReady(true);
        setDuration(ws.getDuration());
      });
      ws.on('audioprocess', () => setCurrentTime(ws.getCurrentTime()));
      ws.on('play', () => setIsPlaying(true));
      ws.on('pause', () => setIsPlaying(false));
      ws.on('finish', () => setIsPlaying(false));
      ws.on('error', (e) => setError('Audio load error'));

      ws.load(src);
      wavesurferRef.current = ws;
    }).catch(() => setError('WaveSurfer unavailable'));

    return () => {
      if (ws) ws.destroy();
    };
  }, [audioBase64, audioUrl, color]);

  const togglePlay = () => {
    if (wavesurferRef.current && isReady) {
      wavesurferRef.current.playPause();
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const src = getAudioSrc();

  if (!src) {
    return (
      <div className="waveform-container" style={{ padding: '20px', textAlign: 'center', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--white-dim)' }}>
          ── No audio generated ──
        </div>
      </div>
    );
  }

  return (
    <div className="waveform-container" style={{ padding: '16px' }}>
      {/* Waveform */}
      <div ref={waveRef} style={{ minHeight: '60px', marginBottom: '12px' }} />

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={togglePlay}
          disabled={!isReady}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: isReady ? color : 'var(--navy-border)',
            border: 'none', cursor: isReady ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', transition: 'all 0.2s',
            flexShrink: 0,
          }}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Progress bar */}
        <div style={{ flex: 1, height: '3px', background: 'var(--navy-border)', borderRadius: '2px', position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, height: '100%',
            width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%',
            background: color, borderRadius: '2px', transition: 'width 0.1s',
          }} />
        </div>

        {/* Time */}
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)', flexShrink: 0 }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {error && (
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#ff6b6b', marginTop: '8px' }}>
          {error}
        </p>
      )}
    </div>
  );
}
