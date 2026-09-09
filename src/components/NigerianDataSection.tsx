import React, { useState } from 'react';
import { GEOPOLITICAL_ZONES, NIGERIAN_STATES_DATA } from '../data/crimeData';

interface NigerianDataSectionProps {
  onSelectState?: (stateName: string) => void;
}

export const NigerianDataSection: React.FC<NigerianDataSectionProps> = ({ onSelectState }) => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const activeZoneData = selectedZone
    ? GEOPOLITICAL_ZONES.find((z) => z.name === selectedZone)
    : null;

  const statesInZone = selectedZone
    ? NIGERIAN_STATES_DATA.filter((s) => s.zone === selectedZone)
    : [];

  return (
    <section className="w-full px-4 sm:px-8 lg:px-10 py-16 bg-[#faf0ff]/40 flex flex-col gap-10" id="nigerian-data">
      <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-2">
        <span className="px-3.5 py-1 rounded-full bg-[#efe4f8] text-[#6200a9] text-[11px] font-bold uppercase tracking-wider">
          Certified Benchmark
        </span>
        <h2 className="text-[28px] sm:text-[34px] font-bold text-[#1e1926] tracking-tight">
          Built Around Nigerian Crime Data
        </h2>
        <p className="text-[14px] text-[#4c4354] leading-relaxed">
          Standardized upon historical crime statistics validated across 36 states and the Federal Capital Territory (FCT).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-7xl mx-auto w-full">
        {/* Left: Interactive Geo-Canvas & Zone Matrix */}
        <div className="lg:col-span-7 rounded-3xl bg-[#ffffff] p-6 md:p-8 border border-[#e9dff2] flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-[#1e1926]">
                Geopolitical Regional Matrix
              </h3>
              <span className="text-[11px] text-[#6200a9] font-bold bg-[#f0dbff] px-2.5 py-0.5 rounded-full">
                6 Zones Mapped
              </span>
            </div>
            <p className="text-[13px] text-[#4c4354]">
              Aggregated distribution by official political zoning to support equitable cross-jurisdictional policy analysis.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
            {GEOPOLITICAL_ZONES.map((zone) => {
              const isSelected = selectedZone === zone.name;
              return (
                <div
                  key={zone.name}
                  onClick={() => setSelectedZone(isSelected ? null : zone.name)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#f0dbff] border-[#7e22ce]'
                      : 'bg-[#faf0ff] border-[#e9dff2] hover:bg-[#efe4f8]'
                  }`}
                >
                  <span className="text-[11px] text-[#4c4354] uppercase font-bold tracking-wide">
                    {zone.name}
                  </span>
                  <div className="text-[20px] font-bold text-[#1e1926] mt-1 tabular-nums">
                    {zone.total.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-[#6200a9] font-semibold block truncate mt-0.5">
                    {zone.keyStates}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Expanded Zone State Breakdown Drawer */}
          {activeZoneData && (
            <div className="mb-4 p-4 rounded-2xl bg-[#faf0ff] border border-[#e9dff2] animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-bold text-[#6200a9]">
                  {activeZoneData.name} Breakdown ({statesInZone.length} Commands):
                </span>
                <button
                  onClick={() => setSelectedZone(null)}
                  className="text-[11px] text-[#4c4354] hover:text-[#1e1926] underline"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                {statesInZone.map((s) => (
                  <button
                    key={s.state}
                    onClick={() => onSelectState && onSelectState(s.state)}
                    className="p-2 rounded-lg bg-white border border-[#cfc2d6]/40 text-left hover:border-[#7e22ce] transition-colors"
                  >
                    <div className="text-[12px] font-bold text-[#1e1926] flex justify-between">
                      <span>{s.state}</span>
                      <span className="text-[#6200a9]">{s.totalCases.toLocaleString()}</span>
                    </div>
                    <div className="text-[10px] text-[#4c4354]">
                      Risk: {s.riskScore} • Prop: {Math.round((s.propertyCases / s.totalCases) * 100)}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-[#faf0ff] border border-[#e9dff2] flex items-center justify-between text-[#4c4354] text-[12px]">
            <span>Total Normalized Incidents Across 37 Commands</span>
            <span className="font-bold text-[#1e1926] text-[15px] tabular-nums">
              134,663
            </span>
          </div>
        </div>

        {/* Right: Official NBS Specification Card */}
        <div className="lg:col-span-5 rounded-3xl bg-[#ffffff] p-6 md:p-8 border border-[#e9dff2] flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6200a9] text-[24px]">verified</span>
              <span className="text-[16px] text-[#1e1926] font-bold">
                NBS Dataset Specification
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#faf0ff] text-[13px]">
                <span className="text-[#4c4354]">Dataset Title</span>
                <span className="font-semibold text-[#1e1926] text-right">
                  Reported Offences by State, 2017
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#faf0ff] text-[13px]">
                <span className="text-[#4c4354]">Publishing Body</span>
                <span className="font-semibold text-[#1e1926]">
                  National Bureau of Statistics
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#faf0ff] text-[13px]">
                <span className="text-[#4c4354]">Validated Cases</span>
                <span className="font-bold text-[#6200a9] tabular-nums">
                  134,663
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#faf0ff] text-[13px]">
                <span className="text-[#4c4354]">Top Offence Category</span>
                <span className="font-semibold text-[#1e1926]">
                  Property (68,579)
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-[#faf0ff] text-[13px]">
                <span className="text-[#4c4354]">Geographic Coordinates</span>
                <span className="font-semibold text-[#1e1926]">
                  Standard Lat/Lon WGS84
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#faf0ff] border border-[#e9dff2] mt-4">
            <p className="text-[12px] text-[#4c4354] leading-relaxed">
              <strong className="text-[#1e1926]">Analytical Caveat:</strong> Data is utilized purely as an empirical historical baseline for machine learning demonstration and spatial modeling. It is not connected to real-time police emergency dispatch systems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
