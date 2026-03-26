'use client';
import { useEffect, useState } from 'react';

// WHY: Aplos introduced an "Oversight Dashboard" in 2025 with consolidated
// views and color-coded task status. We adapted this into a circular
// Compliance Health Score gauge — the single most important metric for
// nonprofits. Green (80-100%), Yellow (50-79%), Red (0-49%).
// This gives volunteer treasurers instant confidence about their status.

interface ComplianceGaugeProps {
  score: number; // 0-100
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ComplianceGauge({ score, label = 'Compliance Score', size = 'lg' }: ComplianceGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const sizeMap = { sm: 80, md: 120, lg: 180 };
  const s = sizeMap[size];
  const stroke = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const radius = (s - stroke) / 2;
  const circumference = radius * Math.PI * 2;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 80) return { stroke: '#10b981', bg: '#d1fae5', text: 'text-emerald-600', label: 'Excellent' };
    if (score >= 50) return { stroke: '#f59e0b', bg: '#fef3c7', text: 'text-amber-600', label: 'Needs Attention' };
    return { stroke: '#ef4444', bg: '#fee2e2', text: 'text-red-600', label: 'At Risk' };
  };

  const c = getColor(animatedScore);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: s, height: s }}>
        <svg width={s} height={s} className="-rotate-90">
          <circle cx={s/2} cy={s/2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
          <circle cx={s/2} cy={s/2} r={radius} fill="none" stroke={c.stroke} strokeWidth={stroke}
            strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            className="transition-all duration-1000 ease-out" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold font-['Montserrat'] ${size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-lg'} ${c.text}`}>{animatedScore}%</span>
          {size === 'lg' && <span className="text-xs text-gray-400 mt-1">{c.label}</span>}
        </div>
      </div>
      <p className="text-sm text-gray-600 font-medium mt-2">{label}</p>
    </div>
  );
}
