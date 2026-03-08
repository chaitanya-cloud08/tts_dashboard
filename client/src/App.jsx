import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import HeroSection from './components/HeroSection';
import PlaygroundGrid from './components/PlaygroundGrid';
import AudioComparisonGrid from './components/AudioComparisonGrid';
import CostCalculator from './components/CostCalculator';

export default function App() {
  const [results, setResults] = useState({ sarvam: null, camb: null, local: null });
  const [visibleSections, setVisibleSections] = useState(new Set());

  // Section reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((s) => observer.observe(s));
    return () => sections.forEach((s) => observer.unobserve(s));
  }, []);

  const handleResultsUpdate = (newResults) => {
    setResults((prev) => ({
      sarvam: newResults?.sarvam ?? prev.sarvam,
      camb: newResults?.camb ?? prev.camb,
      local: newResults?.local ?? prev.local,
    }));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      <Nav />

      {/* Decorative gradient orbs */}
      <div style={{
        position: 'fixed', top: '-300px', right: '-200px',
        width: '800px', height: '800px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,106,250,0.04) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: '-400px', left: '-200px',
        width: '900px', height: '900px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.03) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <main style={{ position: 'relative', zIndex: 1 }}>
        <HeroSection />
        <div className="gold-divider" style={{ maxWidth: '1400px', margin: '0 auto' }} />
        <PlaygroundGrid onResultsUpdate={handleResultsUpdate} />
        <div className="gold-divider" style={{ maxWidth: '1400px', margin: '0 auto' }} />
        <AudioComparisonGrid results={results} />
        <div className="gold-divider" style={{ maxWidth: '1400px', margin: '0 auto' }} />
        <CostCalculator />
      </main>
    </div>
  );
}
