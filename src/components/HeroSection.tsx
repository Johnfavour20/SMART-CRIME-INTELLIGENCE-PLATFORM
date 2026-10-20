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
    <section className="w-full px-4 sm:px-8 lg:px-10 py-10 lg:py-16 flex flex-col lg:flex-row items-center gap-12 bg-white" id="overview">
      {/* Left Column: Value Prop */}
      <div className="flex-1 flex flex-col items-start gap-5">
        <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
          National Crime Analytics Platform · 2026 Edition
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-slate-900 tracking-tight leading-tight max-w-xl">
          Understand Crime Patterns. Identify Risk Hotspots. Support Evidence-Based Policy.
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
          <span className="material-symbols-outlined text-purple-700 text-[16px]">verified</span>
          <span>
            Verified against certified National Bureau of Statistics (NBS) historical datasets
          </span>
        </div>
      </div>

      {/* Right Column: Abstract Crime Intelligence Composition */}
      <div className="flex-1 w-full flex items-center justify-center min-h-[440px]">
        <div className="w-full max-w-xl h-full p-6 rounded-xl bg-slate-50 border border-slate-200 relative overflow-hidden flex flex-col justify-between">
          
          {/* Abstract Nigeria Geo & Node Canvas (SVG) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-85 pointer-events-auto">
            <svg className="w-full h-full" viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Simplified Nigeria outline polygon */}
              <path
                d="M120 180L180 110L280 80L380 95L480 130L510 220L490 320L440 370L380 430L260 440L190 410L140 360L90 310L95 240Z"
                fill="#f1f5f9"
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              
              {/* Connection lines between hubs */}
              <path d="M180 370 L 300 280 L 320 160 L 420 190" stroke="#64748b" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M300 280 L 260 380" stroke="#64748b" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M280 210 L 300 280" stroke="#64748b" strokeOpacity="0.4" strokeWidth="1.5" />

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
                    <circle cx={hub.x} cy={hub.y} r={isSelected ? 26 : 20} fill="#6200a9" fillOpacity={isSelected ? 0.15 : 0.05} className="transition-all duration-200" />
                    <circle cx={hub.x} cy={hub.y} r={isSelected ? 14 : 10} fill="#6200a9" fillOpacity={isSelected ? 0.35 : 0.15} />
                    <circle cx={hub.x} cy={hub.y} r={isSelected ? 6 : 4} fill={isSelected ? '#6200a9' : '#475569'} />
                    <text 
                      x={hub.x} 
                      y={hub.y - (isSelected ? 18 : 14)} 
                      textAnchor="middle" 
                      fill="#0f172a" 
                      fontSize="11" 
                      fontWeight="600"
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
          <div className="relative z-20 self-start p-3.5 rounded-lg bg-white border border-slate-200 max-w-xs transition-transform hover:-translate-y-0.5 duration-150">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                K-Means Cluster #{currentHub.name === 'Lagos' ? '2' : '1'}
              </span>
              <span className="text-xs font-semibold text-purple-700">
                91.8% Confidence
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-700">
              <div>
                <span className="text-slate-500">Radius:</span> <strong className="font-semibold">14.2 km</strong>
              </div>
              <div>
                <span className="text-slate-500">Density:</span> <strong className="font-semibold">84.2%</strong>
              </div>
            </div>
          </div>

          {/* Floating Card 2: Center-Right Predicted Risk Index */}
          <div className="relative z-20 self-end p-3.5 rounded-lg bg-white border border-slate-200 max-w-xs transition-transform hover:-translate-y-0.5 duration-150 my-2">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-slate-900">
                {currentHub.name} Jurisdiction Corridor
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-amber-800 font-semibold">
                Moderate Risk ({currentHub.risk})
              </span>
              <span className="text-emerald-700 font-medium">
                {currentHub.trend} YoY
              </span>
            </div>
          </div>

          {/* Floating Card 3: Wave + Quick Readout Bottom */}
          <div className="relative z-20 p-3.5 rounded-lg bg-white border border-slate-200 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase text-slate-500 font-semibold">
                Quarterly Incident Wave Spectrum
              </span>
              <span className="text-xs text-purple-700 font-semibold tabular-nums">
                134,663 Historical Baseline
              </span>
            </div>

            {/* Sparkline Wave SVG */}
            <svg className="w-full h-8" viewBox="0 0 300 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 30 Q 30 10, 60 25 T 120 15 T 180 28 T 240 8 T 300 18"
                stroke="#6200a9"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <div className="flex items-center justify-between text-slate-500 text-xs font-normal pt-1 border-t border-slate-100">
              <span>Lagos: 24,190 cases</span>
              <span>FCT Abuja: 11,200 cases</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
