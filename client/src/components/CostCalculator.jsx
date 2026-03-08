import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer,
} from 'recharts';
import {
  PRICING, VOLUME_TIERS, DEFAULT_WORDS_PER_ARTICLE, DEFAULT_ARTICLES_PER_MONTH,
  calculateMonthlyCost, calculatePerArticleCost,
} from '../config/pricing.js';

const LANGUAGES = ['Hindi', 'Tamil', 'Telugu', 'Bengali', 'English (IN)'];

/**
 * Calculate costs for all three vendors given article parameters.
 *   - Sarvam  → pay-per-use (ratePer10kChars / ratePerCharacter / ratePerWord)
 *   - CAMB    → flat monthly subscription (monthlyFlatFee)
 *   - Local   → per-request range (minPerRequest … maxPerRequest × requests)
 */
function calcCosts(wordsPerArticle, articlesPerMonth) {
  const totalWords = wordsPerArticle * articlesPerMonth;
  const totalChars = totalWords * 6; // ~6 chars/word avg
  const charsPerArt = wordsPerArticle * 6;

  // ── Sarvam (usage-based) ──
  const sarvamMonthly = (totalChars / 10000) * PRICING.sarvam.ratePer10kChars;
  const sarvam = {
    perChar: PRICING.sarvam.ratePerCharacter,
    perWord: PRICING.sarvam.ratePerWord,
    perArticle: (charsPerArt / 10000) * PRICING.sarvam.ratePer10kChars,
    monthly: sarvamMonthly,
    annual: sarvamMonthly * 12,
    model: 'Pay-per-use',
  };

  // ── CAMB (flat subscription) ──
  const cambMonthly = PRICING.camb.monthlyFlatFee;   // ₹1,680 flat
  const camb = {
    perChar: PRICING.camb.ratePerCharacter,
    perWord: null,                                 // not applicable for flat plan
    perArticle: articlesPerMonth > 0 ? cambMonthly / articlesPerMonth : 0,
    monthly: cambMonthly,
    annual: cambMonthly * 12,
    model: 'Subscription',
  };

  // ── Local (per-request range) ──
  const localMonthlyMin = articlesPerMonth * PRICING.local.minPerRequest;
  const localMonthlyMax = articlesPerMonth * PRICING.local.maxPerRequest;
  const local = {
    perChar: null,
    perWord: null,
    perRequestMin: PRICING.local.minPerRequest,
    perRequestMax: PRICING.local.maxPerRequest,
    perArticleMin: PRICING.local.minPerRequest,
    perArticleMax: PRICING.local.maxPerRequest,
    monthlyMin: localMonthlyMin,
    monthlyMax: localMonthlyMax,
    monthly: (localMonthlyMin + localMonthlyMax) / 2, // midpoint for charts
    annualMin: localMonthlyMin * 12,
    annualMax: localMonthlyMax * 12,
    annual: ((localMonthlyMin + localMonthlyMax) / 2) * 12,
    model: 'Per-request',
  };

  return { sarvam, camb, local };
}

const fmt = (n) => {
  if (n === null || n === undefined) return 'N/A';
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  if (n < 0.01 && n > 0) return `₹${n.toExponential(2)}`;
  return `₹${n.toFixed(2)}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--navy-card)',
        border: '1px solid var(--navy-border)',
        borderRadius: '10px', padding: '12px 16px',
        fontFamily: 'DM Mono, monospace', fontSize: '12px',
      }}>
        <p style={{ color: 'var(--gold)', marginBottom: '6px' }}>{label}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {fmt(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function CostCalculator() {
  const [wordsPerArticle, setWordsPerArticle] = useState(DEFAULT_WORDS_PER_ARTICLE);
  const [articlesPerMonth, setArticlesPerMonth] = useState(DEFAULT_ARTICLES_PER_MONTH);
  const [selectedLang, setSelectedLang] = useState('Hindi');

  const costs = calcCosts(wordsPerArticle, articlesPerMonth);

  // ── Volume bar-chart data ──
  const barData = VOLUME_TIERS.map(vol => {
    const c = calcCosts(wordsPerArticle, vol);
    const candidates = [
      { name: 'Sarvam', val: c.sarvam.monthly },
      { name: 'CAMB', val: c.camb.monthly },
      { name: 'Local', val: c.local.monthly },
    ];
    const min = Math.min(...candidates.map(x => x.val));
    return {
      articles: vol.toLocaleString(),
      Sarvam: c.sarvam.monthly,
      CAMB: c.camb.monthly,
      Local: c.local.monthly,
      bestValue: candidates.find(x => x.val === min)?.name,
    };
  });

  // ── 12-month growth line-chart data ──
  const lineData = Array.from({ length: 12 }, (_, i) => {
    const scale = 1 + i * 0.1; // 10 % growth/month
    const c = calcCosts(wordsPerArticle, Math.round(articlesPerMonth * scale));
    return {
      month: `M${i + 1}`,
      Sarvam: c.sarvam.monthly,
      CAMB: c.camb.monthly,
      Local: c.local.monthly,
    };
  });

  // ── Best value helper ──
  const getBestMonthly = () => {
    const vals = { Sarvam: costs.sarvam.monthly, 'CAMB AI': costs.camb.monthly, 'Local': costs.local.monthly };
    return Object.entries(vals).sort((a, b) => a[1] - b[1])[0][0];
  };

  // ── Breakeven insight ──
  const totalCharsNow = wordsPerArticle * articlesPerMonth * 6;
  const breakevenInfo = calculateMonthlyCost(totalCharsNow, articlesPerMonth);

  const fmtRange = (min, max) => `${fmt(min)} – ${fmt(max)}`;

  const rows = [
    { label: 'Pricing model', sarvam: costs.sarvam.model, camb: costs.camb.model, local: costs.local.model },
    { label: 'Cost per character', sarvam: fmt(costs.sarvam.perChar), camb: fmt(costs.camb.perChar), local: 'N/A' },
    { label: 'Cost per word', sarvam: fmt(costs.sarvam.perWord), camb: 'Flat plan', local: 'N/A' },
    { label: 'Cost per request', sarvam: 'N/A', camb: 'N/A', local: fmtRange(costs.local.perRequestMin, costs.local.perRequestMax) },
    { label: 'Cost per article', sarvam: fmt(costs.sarvam.perArticle), camb: fmt(costs.camb.perArticle), local: fmtRange(costs.local.perArticleMin, costs.local.perArticleMax) },
    { label: 'Monthly cost', sarvam: fmt(costs.sarvam.monthly), camb: fmt(costs.camb.monthly), local: fmtRange(costs.local.monthlyMin, costs.local.monthlyMax) },
    { label: 'Annual projection', sarvam: fmt(costs.sarvam.annual), camb: fmt(costs.camb.annual), local: fmtRange(costs.local.annualMin, costs.local.annualMax) },
  ];

  return (
    <section id="cost" style={{ padding: '80px 0', position: 'relative' }}>
      <div className="bg-glow-sarvam" style={{ bottom: '-100px', left: '-100px' }} />
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '56px' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
            04 — Cost Calculator
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 600 }}>
            Financial <em style={{ fontWeight: 300 }}>Breakdown</em>
          </h2>
        </div>

        {/* Input controls */}
        <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Words per article</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', color: 'var(--gold)' }}>{wordsPerArticle.toLocaleString()}</span>
              </label>
              <input type="range" min="100" max="2000" step="50" value={wordsPerArticle} onChange={e => setWordsPerArticle(+e.target.value)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--white-dim)', marginTop: '4px' }}>
                <span>100</span><span>2,000</span>
              </div>
            </div>
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Articles per month</span>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', color: 'var(--gold)' }}>{articlesPerMonth.toLocaleString()}</span>
              </label>
              <input type="range" min="10" max="10000" step="10" value={articlesPerMonth} onChange={e => setArticlesPerMonth(+e.target.value)} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--white-dim)', marginTop: '4px' }}>
                <span>10</span><span>10,000</span>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                Language / Script
              </label>
              <select className="input-dark" value={selectedLang} onChange={e => setSelectedLang(e.target.value)}>
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--white-dim)', marginTop: '8px' }}>
                Affects Sarvam pricing for non-Latin scripts
              </p>
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                Local / Per-request cost
              </label>
              <div style={{
                background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.2)',
                borderRadius: '8px', padding: '12px 16px',
              }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', color: '#F5A623', marginBottom: '4px' }}>
                  ₹{PRICING.local.minPerRequest.toFixed(2)} – ₹{PRICING.local.maxPerRequest.toFixed(2)} / request
                </p>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--white-dim)' }}>
                  {fmt(costs.local.monthlyMin)} – {fmt(costs.local.monthlyMax)} / month at current volume
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Breakeven insight card */}
        <div className="glass-card" style={{ padding: '20px 28px', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '20px' }}>📊</span>
          <div>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--white-dim)', marginBottom: '4px' }}>
              At your current volume (<strong style={{ color: 'var(--gold)' }}>{(totalCharsNow).toLocaleString()} chars/mo</strong>), the cheaper option is{' '}
              <strong style={{ color: breakevenInfo.cheaper === 'sarvam' ? '#7C6AFA' : '#00D4FF' }}>
                {breakevenInfo.cheaper === 'sarvam' ? 'Sarvam AI' : 'CAMB AI'}
              </strong>.
            </p>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'var(--white-dim)' }}>
              Breakeven at ~{PRICING.breakeven.charsPerMonth.toLocaleString()} chars/mo ({PRICING.breakeven.wordsPerMonth.toLocaleString()} words). {breakevenInfo.breakevenReached ? 'You have crossed the breakeven — CAMB subscription is cheaper.' : 'Below breakeven — Sarvam pay-per-use is cheaper.'}
            </p>
          </div>
        </div>

        {/* Cost table */}
        <div className="glass-card" style={{ overflow: 'hidden', marginBottom: '32px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--navy-border)' }}>
                  <th style={{ padding: '16px 24px', textAlign: 'left', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 400 }}>
                    Metric
                  </th>
                  {[{ name: 'Sarvam AI', color: '#7C6AFA' }, { name: 'CAMB AI', color: '#00D4FF' }, { name: 'Local/Studio', color: '#F5A623' }].map(p => (
                    <th key={p.name} style={{ padding: '16px 24px', textAlign: 'right', fontFamily: 'Fraunces, serif', fontSize: '16px', color: p.color, fontWeight: 600 }}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} style={{ borderBottom: i < rows.length - 1 ? '1px solid rgba(30,45,69,0.5)' : 'none' }}>
                    <td style={{ padding: '14px 24px', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--white-dim)' }}>
                      {row.label}
                    </td>
                    <td style={{ padding: '14px 24px', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontSize: '14px', color: '#7C6AFA' }}>{row.sarvam}</td>
                    <td style={{ padding: '14px 24px', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontSize: '14px', color: '#00D4FF' }}>{row.camb}</td>
                    <td style={{ padding: '14px 24px', textAlign: 'right', fontFamily: 'DM Mono, monospace', fontSize: '14px', color: '#F5A623' }}>{row.local}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Best value banner */}
          <div style={{
            padding: '12px 24px', background: 'rgba(46,204,113,0.08)',
            borderTop: '1px solid rgba(46,204,113,0.2)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <span style={{ fontSize: '16px' }}>🏆</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--green)' }}>
              Best monthly value at current volume: <strong>{getBestMonthly()}</strong>
            </span>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {/* Bar chart */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
              Monthly Cost by Volume
            </h3>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)', marginBottom: '24px' }}>
              Sarvam scales with usage · CAMB stays flat at ₹{PRICING.camb.monthlyFlatFee.toLocaleString()}/mo
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis dataKey="articles" tick={{ fontFamily: 'DM Mono', fontSize: 11, fill: '#A8A89C' }} axisLine={false} tickLine={false} label={{ value: 'Articles/mo', position: 'insideBottom', offset: -5, style: { fontFamily: 'DM Mono', fontSize: 10, fill: '#A8A89C' } }} />
                <YAxis tickFormatter={v => fmt(v)} tick={{ fontFamily: 'DM Mono', fontSize: 10, fill: '#A8A89C' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontFamily: 'DM Mono', fontSize: 11, color: '#A8A89C' }} />
                <Bar dataKey="Sarvam" fill="#7C6AFA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="CAMB" fill="#00D4FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Local" fill="#F5A623" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line chart */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
              12-Month Cost Growth
            </h3>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--white-dim)', marginBottom: '24px' }}>
              Projected at 10% monthly volume growth
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
                <XAxis dataKey="month" tick={{ fontFamily: 'DM Mono', fontSize: 11, fill: '#A8A89C' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => fmt(v)} tick={{ fontFamily: 'DM Mono', fontSize: 10, fill: '#A8A89C' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontFamily: 'DM Mono', fontSize: 11, color: '#A8A89C' }} />
                <Line type="monotone" dataKey="Sarvam" stroke="#7C6AFA" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="CAMB" stroke="#00D4FF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Local" stroke="#F5A623" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
