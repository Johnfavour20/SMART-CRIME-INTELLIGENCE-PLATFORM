import React, { useState } from 'react';

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
    <section className="w-full px-4 sm:px-8 lg:px-10 py-10 lg:py-16 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden bg-white" id="overview">
      {/* Background ambient blurs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-100/30 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] rounded-full bg-purple-50/40 blur-3xl pointer-events-none"></div>

      {/* Left Column: Value Prop */}
      <div className="flex-1 flex flex-col items-start gap-5 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200">
          <span className="w-2 h-2 rounded-full bg-purple-700 animate-pulse"></span>
          <span className="text-[11px] text-purple-700 font-bold tracking-wide">
            SMART CRIME INTELLIGENCE PLATFORM • 2026 EDITION
          </span>
        </div>

        <h1 className="text-[36px] sm:text-[44px] lg:text-[48px] font-bold text-slate-900 tracking-tight leading-[1.15]">
          Understand Crime Patterns.{' '}
          <span className="text-purple-700">
            Predict Risk.
          </span>{' '}
          Make Smarter Decisions.
        </h1>

        <p className="text-[16px] text-slate-600 leading-relaxed max-w-xl">
          Turn historical crime data into meaningful insights. Explore crime patterns, identify potential spatial hotspots, and generate data-driven predictions through an objective analytical framework.
        </p>

        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          <button
            onClick={onExploreAnalytics}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-[15px] transition-all transform active:scale-95 cursor-pointer shadow-sm"
          >
            <span>Explore Analytics</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button
            onClick={onSeeHowItWorks}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-[15px] border border-slate-200 transition-all transform active:scale-95 cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-purple-700 text-[20px]">play_circle</span>
            <span>See How It Works</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-600 pt-2">
          <span className="material-symbols-outlined text-purple-700 text-[18px]">verified_user</span>
          <span className="text-[13px] font-medium">
            Verified against certified National Bureau of Statistics (NBS) historical datasets
          </span>
        </div>
      </div>

      {/* Right Column: Abstract Crime Intelligence Composition */}
      <div className="flex-1 w-full relative z-10 flex items-center justify-center min-h-[460px]">
        <div className="w-full max-w-xl h-full p-6 rounded-3xl bg-[#faf0ff]/80 backdrop-blur-xl border border-[#e9dff2] relative overflow-hidden flex flex-col justify-between">
          
          {/* Abstract Nigeria Geo & Node Canvas (SVG) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-85 pointer-events-auto">
            <svg className="w-full h-full" viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simplified Nigeria outline polygon */}
              <path
                d="M120 180L180 110L280 80L380 95L480 130L510 220L490 320L440 370L380 430L260 440L190 410L140 360L90 310L95 240Z"
                fill="#f0dbff"
                fillOpacity="0.35"
                stroke="#cfc2d6"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              
              {/* Connection lines between hubs */}
              <path d="M180 370 L 300 280 L 320 160 L 420 190" stroke="#7e22ce" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M300 280 L 260 380" stroke="#7e22ce" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M280 210 L 300 280" stroke="#6e3aca" strokeOpacity="0.35" strokeWidth="2" />

              {/* Hotspot Nodes with Click & Hover Interactivity */}
              {hubs.map((hub) => {
                const isSelected = selectedHub === hub.name;
                return (
                  <g 
                    key={hub.name} 
                    className="cursor-pointer transition-all"
                    onClick={() => {
                      setSelectedHub(hub.name);
                      if (onSelectState) onSelectState(hub.name);
                    }}
                  >
                    <circle cx={hub.x} cy={hub.y} r={isSelected ? 32 : 24} fill="#6200a9" fillOpacity={isSelected ? 0.22 : 0.08} className="transition-all duration-300" />
                    <circle cx={hub.x} cy={hub.y} r={isSelected ? 16 : 12} fill="#6200a9" fillOpacity={isSelected ? 0.4 : 0.2} />
                    <circle cx={hub.x} cy={hub.y} r={isSelected ? 7 : 5} fill={isSelected ? '#7e22ce' : '#6200a9'} />
                    <text 
                      x={hub.x} 
                      y={hub.y - (isSelected ? 20 : 15)} 
                      textAnchor="middle" 
                      fill="#1e1926" 
                      fontSize="11" 
                      fontWeight="bold"
                      className="select-none font-sans"
                    >
                      {hub.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Floating Card 1: Spatial Cluster Top */}
          <div className="relative z-20 self-start p-3.5 rounded-2xl bg-[#ffffff] border border-[#e9dff2] max-w-xs transition-transform hover:-translate-y-1">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-[11px] uppercase tracking-wider text-[#4c4354] font-bold">
                K-Means Spatial Cluster #{currentHub.name === 'Lagos' ? '2' : '1'}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#f0dbff] text-[#6200a9] text-[11px] font-bold">
                91.8% Conf.
              </span>
            </div>
            <div className="flex items-center gap-4 text-[13px] text-[#1e1926]">
              <div>
                <span className="text-[#4c4354]">Radius:</span> <strong>14.2 km</strong>
              </div>
              <div>
                <span className="text-[#4c4354]">Density:</span> <strong>84.2%</strong>
              </div>
            </div>
          </div>

          {/* Floating Card 2: Center-Right Predicted Risk Index */}
          <div className="relative z-20 self-end p-3.5 rounded-2xl bg-[#ffffff] border border-[#e9dff2] max-w-xs transition-transform hover:-translate-y-1 my-2">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-[14px] text-[#1e1926] font-bold">
                {currentHub.name} Command Corridor
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                Moderate Risk ({currentHub.risk})
              </span>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center">
                ↓ {currentHub.trend} YoY
              </span>
            </div>
          </div>

          {/* Floating Card 3: Wave + Quick Readout Bottom */}
          <div className="relative z-20 p-3.5 rounded-2xl bg-[#ffffff] border border-[#e9dff2] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase text-[#4c4354] font-bold">
                Quarterly Incident Wave Spectrum
              </span>
              <span className="text-[11px] text-[#6200a9] font-bold">
                134,663 Historical Base
              </span>
            </div>

            {/* Sparkline Wave SVG */}
            <svg className="w-full h-10" viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#7e22ce" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 30 Q 30 10, 60 25 T 120 15 T 180 28 T 240 8 T 300 18 L 300 40 L 0 40 Z"
                fill="url(#waveGradient)"
              />
              <path
                d="M0 30 Q 30 10, 60 25 T 120 15 T 180 28 T 240 8 T 300 18"
                stroke="#7e22ce"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            <div className="flex items-center justify-between text-[#4c4354] text-[11px] font-medium pt-1 border-t border-[#f5eafd]">
              <span>LAGOS COMMAND: 24,190 logged</span>
              <span>FCT ABUJA: 11,200 logged</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
