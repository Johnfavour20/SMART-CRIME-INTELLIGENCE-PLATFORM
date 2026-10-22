import React, { useState } from 'react';
import policeImage from './public/pexels-112-uttar-pradesh-2709195-13062240.jpg';

interface HeroSectionProps {
  onExploreAnalytics: () => void;
  onSeeHowItWorks: () => void;
  onSelectState?: (stateName: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreAnalytics,
  onSeeHowItWorks,
  onSelectState,
}) => {
  const [selectedHub, setSelectedHub] = useState<string>('Lagos');

  const hubs = [
    { name: 'Lagos', x: 180, y: 370, cases: '24,190', risk: '38.4', status: 'Moderate', trend: '-3.4%' },
    { name: 'FCT Abuja', x: 300, y: 280, cases: '11,200', risk: '35.6', status: 'Moderate', trend: '+0.4%' },
    { name: 'Kano', x: 320, y: 160, cases: '8,420', risk: '34.8', status: 'Moderate', trend: '-1.9%' },
    { name: 'Rivers', x: 260, y: 380, cases: '8,920', risk: '37.1', status: 'Moderate', trend: '-2.2%' },
    { name: 'Kaduna', x: 280, y: 210, cases: '7,110', risk: '36.2', status: 'Moderate', trend: '+2.4%' },
  ];

  const currentHub = hubs.find(h => h.name === selectedHub) || hubs[0];

  return (
    <section className="w-full px-4 sm:px-8 lg:px-10 py-10 lg:py-16 flex flex-col lg:flex-row items-center gap-12 bg-white" id="overview">
      {/* Left Column: Value Prop */}
      <div className="flex-1 flex flex-col items-start gap-5">
        <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
          National Crime Analytics Platform · 2026 Edition
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-slate-900 tracking-tight leading-tight max-w-xl">
          Understand Crime Patterns. Predict Risk. Make Smarter Decisions.
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
          Transform historical crime data into structured operational intelligence. Explore verified patterns across 36 states and the FCT, analyze spatial clusters, and generate reproducible risk projections.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={onExploreAnalytics}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            <span>Explore Analytics</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button
            onClick={onSeeHowItWorks}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-purple-700 text-[18px]">play_circle</span>
            <span>See How It Works</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-500 pt-2 text-xs">
         
          <span>
            Verified against certified National Bureau of Statistics (NBS) historical datasets
          </span>
        </div>
      </div>

      {/* Right Column: Image-Driven Public Safety Visual */}
      <div className="flex-1 w-full flex items-center justify-center min-h-[440px]">
        <div
          className="w-full max-w-xl h-full min-h-[440px] rounded-xl border border-slate-200 relative overflow-hidden shadow-sm"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.18), rgba(15, 23, 42, 0.42)), url(${policeImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/10 via-transparent to-slate-900/15" />

          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
            <div className="rounded-xl border border-white/20 bg-slate-900/55 backdrop-blur-sm p-3 text-white max-w-[70%]">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-200">Public Safety</div>
              <div className="mt-1 text-xl font-bold">Lagos Command Corridor</div>
            </div>

            <div className="rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-2 text-right text-white">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-200">Risk Index</div>
              <div className="text-2xl font-bold">38.4</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
