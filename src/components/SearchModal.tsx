import React, { useState } from 'react';
import { NIGERIAN_STATES_DATA, GEOPOLITICAL_ZONES } from '../data/crimeData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (type: 'state' | 'zone' | 'tab' | 'section', value: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectResult }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredStates = NIGERIAN_STATES_DATA.filter((s) =>
    s.state.toLowerCase().includes(query.toLowerCase()) ||
    s.capital.toLowerCase().includes(query.toLowerCase()) ||
    s.zone.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredZones = GEOPOLITICAL_ZONES.filter((z) =>
    z.name.toLowerCase().includes(query.toLowerCase())
  );

  const topics = [
    { title: 'Executive Spatial Dashboard (Console)', type: 'tab' as const, value: 'dashboard' },
    { title: 'K-Means Spatial Clustering', type: 'section' as const, value: 'engines' },
    { title: 'Decision Tree Heuristics', type: 'section' as const, value: 'engines' },
    { title: 'Random Forest Ensemble', type: 'section' as const, value: 'engines' },
    { title: 'Temporal Wave Spectrum (Q1-Q4)', type: 'section' as const, value: 'dashboard' },
    { title: 'Light Mode Constitution Tokens', type: 'tab' as const, value: 'foundation' },
    { title: 'Interactive Prediction Engine', type: 'tab' as const, value: 'machine-learning-and-prediction' },
    { title: 'Analyst Authentication Portal (Sign In)', type: 'tab' as const, value: 'auth' },
  ].filter(t => t.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/35 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-xl rounded-3xl bg-white border border-[#e9dff2] overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 p-4 border-b border-[#e9dff2]">
          <span className="material-symbols-outlined text-[#6200a9] text-[22px]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search states, zones, tokens, or ML algorithms..."
            className="w-full bg-transparent border-none outline-none text-[15px] text-[#1e1926] placeholder:text-[#7e7385]"
          />
          <button
            onClick={onClose}
            className="px-2 py-1 text-[12px] font-semibold text-[#4c4354] hover:text-[#1e1926] bg-[#faf0ff] rounded-lg border border-[#e9dff2]"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* States */}
          {filteredStates.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7e7385] px-2 mb-1 block">
                Nigerian State Commands
              </span>
              <div className="space-y-1">
                {filteredStates.map((s) => (
                  <button
                    key={s.state}
                    onClick={() => {
                      onSelectResult('state', s.state);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#faf0ff] text-left flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="font-bold text-[13px] text-[#1e1926]">{s.state} State</span>
                      <span className="text-[11px] text-[#4c4354] block">Capital: {s.capital} • {s.zone}</span>
                    </div>
                    <span className="text-[12px] font-bold text-[#6200a9]">{s.totalCases.toLocaleString()} cases</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Zones */}
          {filteredZones.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7e7385] px-2 mb-1 block">
                Geopolitical Zones
              </span>
              <div className="space-y-1">
                {filteredZones.map((z) => (
                  <button
                    key={z.name}
                    onClick={() => {
                      onSelectResult('zone', z.name);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#faf0ff] text-left flex items-center justify-between transition-colors"
                  >
                    <span className="font-bold text-[13px] text-[#1e1926]">{z.name} Zone</span>
                    <span className="text-[12px] font-bold text-[#6e3aca]">{z.total.toLocaleString()} total</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          {topics.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7e7385] px-2 mb-1 block">
                Platform Intelligence & Models
              </span>
              <div className="space-y-1">
                {topics.map((t) => (
                  <button
                    key={t.title}
                    onClick={() => {
                      onSelectResult(t.type, t.value);
                      onClose();
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-[#faf0ff] text-left flex items-center justify-between transition-colors"
                  >
                    <span className="font-semibold text-[13px] text-[#1e1926]">{t.title}</span>
                    <span className="material-symbols-outlined text-[16px] text-[#7e7385]">arrow_forward</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredStates.length === 0 && filteredZones.length === 0 && topics.length === 0 && (
            <div className="py-8 text-center text-[#4c4354] text-[13px]">
              No results found for "{query}". Try "Lagos", "K-Means", or "Tokens".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
