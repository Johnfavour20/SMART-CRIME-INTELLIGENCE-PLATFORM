import React, { useState } from 'react';
import { TEMPORAL_WAVE_DATA } from '../data/crimeData';

interface ExecutiveDashboardProps {
  onExploreDeep?: () => void;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ onExploreDeep }) => {
  const [activeQuarterIndex, setActiveQuarterIndex] = useState<number>(2); // Default to Q3 Seasonal Surge
  const [visibleCategory, setVisibleCategory] = useState<'all' | 'property' | 'persons' | 'authority'>('all');
  const [sandboxActive, setSandboxActive] = useState<boolean>(true);

  const activeQuarter = TEMPORAL_WAVE_DATA[activeQuarterIndex];

  return (
    <section className="w-full px-4 sm:px-8 lg:px-10 py-16 flex flex-col items-center gap-10 bg-[#faf0ff]/40" id="dashboard">
      <div className="text-center max-w-2xl flex flex-col items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-[#f0dbff] text-[#2c0051] text-[11px] font-bold uppercase tracking-wider">
          Executive Dashboard Preview
        </span>
        <h2 className="text-[28px] sm:text-[34px] font-bold text-[#1e1926] tracking-tight">
          Crime Intelligence at a Glance
        </h2>
        <p className="text-[14px] text-[#4c4354] leading-relaxed">
          A bird's-eye synthesis of empirical incident ratios, risk metrics, and multi-class distribution algorithms across Nigeria.
        </p>
      </div>

      {/* The Big Elevated Dashboard Preview Container */}
      <div className="w-full max-w-7xl rounded-3xl bg-[#ffffff] border border-[#e9dff2] p-6 md:p-8 lg:p-10 flex flex-col gap-8">
        
        {/* Top Operational KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#faf0ff] border border-[#e9dff2]/60 flex flex-col justify-between transition-colors">
            <span className="text-[12px] text-[#4c4354] uppercase font-bold tracking-wider">
              Total Validated Cases
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-[28px] font-bold text-[#1e1926] tabular-nums">
                134,663
              </span>
              <span className="text-[11px] font-bold text-[#6200a9] bg-[#f0dbff] px-2 py-0.5 rounded-full">
                100% NBS Rep
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf0ff] border border-[#e9dff2]/60 flex flex-col justify-between transition-colors">
            <span className="text-[12px] text-[#4c4354] uppercase font-bold tracking-wider">
              Top State Incident Share
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-[24px] xl:text-[26px] font-bold text-[#1e1926]">
                Lagos (17.9%)
              </span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                24,190 Cases
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf0ff] border border-[#e9dff2]/60 flex flex-col justify-between transition-colors">
            <span className="text-[12px] text-[#4c4354] uppercase font-bold tracking-wider">
              Dominant Category
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-[24px] xl:text-[26px] font-bold text-[#1e1926]">
                Property (50.9%)
              </span>
              <span className="text-[11px] font-bold text-[#6e3aca] bg-[#ebddff] px-2 py-0.5 rounded-full">
                68,579 Cases
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf0ff] border border-[#e9dff2]/60 flex flex-col justify-between transition-colors">
            <span className="text-[12px] text-[#4c4354] uppercase font-bold tracking-wider">
              Predictive ROC-AUC
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-[28px] font-bold text-[#1e1926] tabular-nums">
                0.92
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                High Precision
              </span>
            </div>
          </div>
        </div>

        {/* Dual Analytics Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Area Chart: Temporal Distribution */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-[#faf0ff]/50 border border-[#e9dff2] flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-[18px] font-bold text-[#1e1926]">
                  Multi-Year Temporal Distribution
                </h3>
                <p className="text-[13px] text-[#4c4354]">
                  Comparison curve of Property vs. Persons vs. Authority offences
                </p>
              </div>

              {/* Legend with interactive toggles */}
              <div className="flex items-center gap-3 text-[12px] font-semibold">
                <button
                  onClick={() => setVisibleCategory(visibleCategory === 'property' ? 'all' : 'property')}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                    visibleCategory === 'property' || visibleCategory === 'all' ? 'text-[#6200a9]' : 'text-gray-400'
                  }`}
                >
                  <span className="w-3 h-3 rounded-sm bg-[#6200a9]"></span>
                  <span>Property</span>
                </button>

                <button
                  onClick={() => setVisibleCategory(visibleCategory === 'persons' ? 'all' : 'persons')}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                    visibleCategory === 'persons' || visibleCategory === 'all' ? 'text-[#8856e5]' : 'text-gray-400'
                  }`}
                >
                  <span className="w-3 h-3 rounded-sm bg-[#8856e5]"></span>
                  <span>Persons</span>
                </button>

                <button
                  onClick={() => setVisibleCategory(visibleCategory === 'authority' ? 'all' : 'authority')}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                    visibleCategory === 'authority' || visibleCategory === 'all' ? 'text-[#7e7385]' : 'text-gray-400'
                  }`}
                >
                  <span className="w-3 h-3 rounded-sm bg-[#cfc2d6]"></span>
                  <span>Authority</span>
                </button>
              </div>
            </div>

            {/* Multi-line SVG chart with area fill */}
            <div className="w-full h-64 relative flex items-end">
              <svg className="w-full h-full" viewBox="0 0 500 200" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                {/* Gridlines */}
                <line x1="0" y1="50" x2="500" y2="50" stroke="#cfc2d6" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#cfc2d6" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.4" />
                <line x1="0" y1="150" x2="500" y2="150" stroke="#cfc2d6" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.4" />

                {/* Property offences (Highest) */}
                {(visibleCategory === 'all' || visibleCategory === 'property') && (
                  <>
                    <path
                      d="M0 160 Q 120 70, 250 110 T 500 40 L 500 200 L 0 200 Z"
                      fill="#6200a9"
                      fillOpacity="0.12"
                    />
                    <path
                      d="M0 160 Q 120 70, 250 110 T 500 40"
                      fill="none"
                      stroke="#6200a9"
                      strokeWidth="3"
                    />
                  </>
                )}

                {/* Against Persons (Mid) */}
                {(visibleCategory === 'all' || visibleCategory === 'persons') && (
                  <>
                    <path
                      d="M0 175 Q 120 120, 250 140 T 500 90 L 500 200 L 0 200 Z"
                      fill="#8856e5"
                      fillOpacity="0.1"
                    />
                    <path
                      d="M0 175 Q 120 120, 250 140 T 500 90"
                      fill="none"
                      stroke="#8856e5"
                      strokeWidth="2.5"
                    />
                  </>
                )}

                {/* Lawful Authority (Lowest) */}
                {(visibleCategory === 'all' || visibleCategory === 'authority') && (
                  <path
                    d="M0 190 Q 120 170, 250 175 T 500 160"
                    fill="none"
                    stroke="#7e7385"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Selected Quarter vertical guideline */}
                {activeQuarterIndex !== null && (
                  <line
                    x1={activeQuarterIndex * 150 + 25}
                    y1="10"
                    x2={activeQuarterIndex * 150 + 25}
                    y2="200"
                    stroke="#7e22ce"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                )}
              </svg>
            </div>

            {/* Quarter selectors */}
            <div className="flex justify-between text-[12px] font-semibold text-[#4c4354] pt-1">
              {TEMPORAL_WAVE_DATA.map((q, idx) => (
                <button
                  key={q.quarter}
                  onClick={() => setActiveQuarterIndex(idx)}
                  className={`px-2 py-1 rounded transition-colors ${
                    activeQuarterIndex === idx
                      ? 'bg-[#7e22ce] text-white font-bold'
                      : 'hover:text-[#6200a9]'
                  }`}
                >
                  {q.quarter}
                </button>
              ))}
            </div>

            {/* Quarter Snapshot tooltip card */}
            <div className="mt-2 p-3 rounded-xl bg-[#ffffff] border border-[#e9dff2] flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#6200a9]">{activeQuarter.quarter}:</span>
                <span className="text-[#4c4354]">Property: <strong>{activeQuarter.property.toLocaleString()}</strong></span>
                <span className="text-[#cfc2d6]">|</span>
                <span className="text-[#4c4354]">Persons: <strong>{activeQuarter.persons.toLocaleString()}</strong></span>
                <span className="text-[#cfc2d6]">|</span>
                <span className="text-[#4c4354]">Authority: <strong>{activeQuarter.authority.toLocaleString()}</strong></span>
              </div>
              <span className="font-bold text-[#1e1926]">Total: {activeQuarter.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Doughnut / Categorical Distribution breakdown */}
          <div className="p-6 rounded-2xl bg-[#faf0ff]/50 border border-[#e9dff2] flex flex-col justify-between">
            <div>
              <h3 className="text-[18px] font-bold text-[#1e1926]">
                Category Proportions
              </h3>
              <p className="text-[13px] text-[#4c4354] mb-5">
                Aggregate Nigerian distribution
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[15px] text-[#1e1926] mb-1.5 font-semibold">
                    <span>Property Offences</span>
                    <span className="font-bold text-[#6200a9]">50.9%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#e9dff2] overflow-hidden">
                    <div className="h-full bg-[#6200a9] rounded-full transition-all duration-500" style={{ width: '50.9%' }}></div>
                  </div>
                  <span className="text-[11px] text-[#4c4354] mt-1 block">
                    68,579 recorded incidents
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[15px] text-[#1e1926] mb-1.5 font-semibold">
                    <span>Against Persons</span>
                    <span className="font-bold text-[#8856e5]">39.8%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#e9dff2] overflow-hidden">
                    <div className="h-full bg-[#8856e5] rounded-full transition-all duration-500" style={{ width: '39.8%' }}></div>
                  </div>
                  <span className="text-[11px] text-[#4c4354] mt-1 block">
                    53,641 recorded incidents
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[15px] text-[#1e1926] mb-1.5 font-semibold">
                    <span>Against Lawful Authority</span>
                    <span className="font-bold text-[#7e7385]">9.3%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#e9dff2] overflow-hidden">
                    <div className="h-full bg-[#7e7385] rounded-full transition-all duration-500" style={{ width: '9.3%' }}></div>
                  </div>
                  <span className="text-[11px] text-[#4c4354] mt-1 block">
                    12,443 recorded incidents
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#e9dff2]">
              <div className="p-3 rounded-xl bg-[#ffffff] border border-[#e9dff2] flex items-center justify-between">
                <span className="text-[12px] text-[#1e1926] font-semibold">
                  Total Sampled Base
                </span>
                <span className="text-[16px] text-[#6200a9] font-bold tabular-nums">
                  134,663
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Interactive Control & Data Snapshot Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#e9dff2]/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-[#efe4f8] text-[11px] text-[#4c4354] font-semibold">
              Dataset: NBS-2017-OFFENCE-V1
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#efe4f8] text-[11px] text-[#4c4354] font-semibold">
              Coordinate Bounds: 4°N to 14°N
            </span>
            <span className="px-3 py-1 rounded-lg bg-[#efe4f8] text-[11px] text-[#4c4354] font-semibold">
              Classifier: Multimodal Ensemble
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSandboxActive(!sandboxActive)}
              className="flex items-center gap-2 text-[13px] font-semibold text-[#1e1926] hover:text-[#6200a9] transition-colors"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${sandboxActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
              <span>{sandboxActive ? 'Interactive Sandbox Active' : 'Sandbox Paused'}</span>
            </button>
            {onExploreDeep && (
              <button
                onClick={onExploreDeep}
                className="ml-2 text-[12px] font-bold text-[#6200a9] hover:underline"
              >
                Open Full Workbench →
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
