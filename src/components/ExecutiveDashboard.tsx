import React, { useState } from 'react';
import { TEMPORAL_WAVE_DATA } from '../data/crimeData';
import { LiveDashboardData } from '../mockRealtimeData';
import temporalImage from './public/pexels-cottonbro-8382286.jpg';

interface ExecutiveDashboardProps {
  onExploreDeep?: () => void;
  liveData: LiveDashboardData;
}

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ onExploreDeep, liveData }) => {
  const [activeQuarterIndex, setActiveQuarterIndex] = useState<number>(2); // Default to Q3 Seasonal Surge
  const [visibleCategory, setVisibleCategory] = useState<'all' | 'property' | 'persons' | 'authority'>('all');
  const [sandboxActive, setSandboxActive] = useState<boolean>(true);

  const activeQuarter = TEMPORAL_WAVE_DATA[activeQuarterIndex];
  const livePropertyCases = Math.round((liveData.totalCases * liveData.dominantPercent) / 100);
  const livePersonsCases = Math.round((liveData.totalCases * 0.39) + (liveData.pulse || 0));
  const liveAuthorityCases = Math.round((liveData.totalCases * 0.09) + (liveData.pulse || 0) * 1.5);

  return (
    <section className="w-full px-4 sm:px-8 lg:px-10 py-16 flex flex-col items-center gap-10 bg-slate-50 border-b border-slate-200" id="dashboard">
      <div className="text-center max-w-2xl flex flex-col items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold uppercase tracking-wider">
          Executive Dashboard Preview
        </span>
        <h2 className="text-[28px] sm:text-[34px] font-bold text-slate-900 tracking-tight">
          Crime Intelligence at a Glance
        </h2>
        <p className="text-[14px] text-slate-600 leading-relaxed">
          A bird's-eye synthesis of empirical incident ratios, risk metrics, and multi-class distribution algorithms across Nigeria.
        </p>
      </div>

      {/* The Big Elevated Dashboard Preview Container */}
      <div className="w-full max-w-7xl rounded-xl bg-white border border-slate-200 shadow-sm p-6 md:p-8 lg:p-10 flex flex-col gap-8">
        
        {/* Top Operational KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between transition-colors">
            <span className="text-[12px] text-slate-500 uppercase font-bold tracking-wider">
              Total Validated Cases
            </span>
            <div className="flex items-baseline justify-between mt-2 gap-2">
              <span className="text-[28px] font-bold text-slate-900 tabular-nums">
                {liveData.totalCases.toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                Live
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between transition-colors">
            <span className="text-[12px] text-slate-500 uppercase font-bold tracking-wider">
              Top State Incident Share
            </span>
            <div className="flex items-baseline justify-between mt-2 gap-2">
              <span className="text-[24px] xl:text-[26px] font-bold text-slate-900">
                Lagos ({((liveData.topStateCount / liveData.totalCases) * 100).toFixed(1)}%)
              </span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                {liveData.topStateCount.toLocaleString()} Cases
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between transition-colors">
            <span className="text-[12px] text-slate-500 uppercase font-bold tracking-wider">
              Dominant Category
            </span>
            <div className="flex items-baseline justify-between mt-2 gap-2">
              <span className="text-[24px] xl:text-[26px] font-bold text-slate-900">
                Property ({liveData.dominantPercent.toFixed(1)}%)
              </span>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                {livePropertyCases.toLocaleString()} Cases
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between transition-colors">
            <span className="text-[12px] text-slate-500 uppercase font-bold tracking-wider">
              Predictive ROC-AUC
            </span>
            <div className="flex items-baseline justify-between mt-2 gap-2">
              <span className="text-[28px] font-bold text-slate-900 tabular-nums">
                0.92
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                High Precision
              </span>
            </div>
          </div>
        </div>

        {/* Dual Analytics Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Area Chart: Temporal Distribution */}
          <div
            className="lg:col-span-2 rounded-2xl border border-slate-200 relative overflow-hidden min-h-[420px]"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.25), rgba(15, 23, 42, 0.6)), url(${temporalImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-slate-950/25" />

            <div className="relative z-10 h-full flex flex-col justify-between p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="max-w-md rounded-xl border border-white/15 bg-slate-900/40 backdrop-blur-sm p-3 text-white">
                  <div className="text-[11px] uppercase tracking-[0.2em] text-slate-200">Multi-Year Temporal Distribution</div>
                  <div className="mt-2 text-[18px] font-bold">Property vs Persons vs Authority</div>
                </div>

                <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm px-3 py-2 text-right text-white">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-200">Q3</div>
                  <div className="text-lg font-bold">Seasonal Surge</div>
                </div>
              </div>

              <div className="rounded-xl border border-white/20 bg-slate-950/50 backdrop-blur-sm p-4 text-white max-w-lg">
                <div className="text-[11px] uppercase tracking-[0.2em] text-slate-200">Quarter Snapshot</div>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] font-medium">
                  <span>Property: <strong className="text-white">19,100</strong></span>
                  <span className="text-slate-400">|</span>
                  <span>Persons: <strong className="text-white">14,900</strong></span>
                  <span className="text-slate-400">|</span>
                  <span>Authority: <strong className="text-white">3,340</strong></span>
                </div>
                <div className="mt-3 text-sm font-semibold text-slate-200">
                  Total: {(livePropertyCases + livePersonsCases + liveAuthorityCases).toLocaleString()}
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.2em] text-emerald-300">
                  Live update · {liveData.lastUpdated}
                </div>
              </div>
            </div>
          </div>

          {/* Doughnut / Categorical Distribution breakdown */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="text-[18px] font-bold text-slate-900">
                Category Proportions
              </h3>
              <p className="text-[13px] text-slate-600 mb-5">
                Aggregate Nigerian distribution
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[15px] text-slate-900 mb-1.5 font-semibold">
                    <span>Property Offences</span>
                    <span className="font-bold text-purple-700">{liveData.dominantPercent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-purple-700 rounded-full transition-all duration-500" style={{ width: `${liveData.dominantPercent}%` }}></div>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {livePropertyCases.toLocaleString()} recorded incidents
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[15px] text-slate-900 mb-1.5 font-semibold">
                    <span>Against Persons</span>
                    <span className="font-bold text-purple-500">{(liveData.totalCases > 0 ? (livePersonsCases / liveData.totalCases) * 100 : 0).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${(livePersonsCases / liveData.totalCases) * 100}%` }}></div>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {livePersonsCases.toLocaleString()} recorded incidents
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[15px] text-slate-900 mb-1.5 font-semibold">
                    <span>Against Lawful Authority</span>
                    <span className="font-bold text-slate-600">{(liveData.totalCases > 0 ? (liveAuthorityCases / liveData.totalCases) * 100 : 0).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full transition-all duration-500" style={{ width: `${(liveAuthorityCases / liveData.totalCases) * 100}%` }}></div>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    {liveAuthorityCases.toLocaleString()} recorded incidents
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-[12px] text-slate-900 font-semibold">
                  Total Sampled Base
                </span>
                <span className="text-[16px] text-purple-700 font-bold tabular-nums">
                  134,663
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Interactive Control & Data Snapshot Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-[11px] text-slate-600 font-semibold">
              Dataset: NBS-2017-OFFENCE-V1
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-[11px] text-slate-600 font-semibold">
              Coordinate Bounds: 4°N to 14°N
            </span>
            <span className="px-3 py-1 rounded-lg bg-slate-100 text-[11px] text-slate-600 font-semibold">
              Classifier: Multimodal Ensemble
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSandboxActive(!sandboxActive)}
              className="flex items-center gap-2 text-[13px] font-semibold text-slate-800 hover:text-purple-700 transition-colors"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${sandboxActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
              <span>{sandboxActive ? 'Interactive Sandbox Active' : 'Sandbox Paused'}</span>
            </button>
            {onExploreDeep && (
              <button
                onClick={onExploreDeep}
                className="ml-2 text-[12px] font-bold text-purple-700 hover:underline"
              >
                Open Full Workbench →
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.9fr] gap-4 pt-2 border-t border-slate-200">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Live Operations Feed</div>
                <h3 className="mt-1 text-[18px] font-bold text-slate-900">Event log</h3>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Stream live
              </div>
            </div>

            <div className="space-y-3">
              {liveData.events.map((event) => (
                <div key={event.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                  <span
                    className={`mt-1 h-2.5 w-2.5 rounded-full ${
                      event.severity === 'critical'
                        ? 'bg-red-500'
                        : event.severity === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }`}
                  ></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold text-slate-900">{event.title}</p>
                      <span className="text-[10px] font-medium text-slate-500">{event.time}</span>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-slate-600">{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Live Pulse</div>
              <div className="mt-3 flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[16px] font-bold">Telemetry active</span>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/80 p-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Refresh interval</div>
              <div className="mt-2 text-[24px] font-bold tabular-nums">4s</div>
              <div className="mt-1 text-[12px] text-slate-300">Last sync: {liveData.lastUpdated}</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
