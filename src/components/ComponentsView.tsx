import React from 'react';

interface ComponentsViewProps {
  onBackToOverview?: () => void;
}

export const ComponentsView: React.FC<ComponentsViewProps> = ({ onBackToOverview }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-purple-700">
            <span>DESIGN SYSTEM SPECIFICATION</span>
            <span>•</span>
            <span className="text-slate-500">Component Catalog v1.0</span>
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-bold text-slate-900 tracking-tight mt-1">
            Smart Crime Component Primitives
          </h1>
          <p className="text-[14px] text-slate-600 max-w-2xl">
            Atomic cards, metrics, operational indicators, and risk badges styled under the Light Mode Constitution.
          </p>
        </div>

        {onBackToOverview && (
          <button
            onClick={onBackToOverview}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-[13px] font-semibold transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Overview</span>
          </button>
        )}
      </div>

      {/* Component Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Section 1: KPI Cards */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col gap-4">
          <span className="text-[12px] font-bold text-purple-700 uppercase tracking-wider">
            Operational KPI Cards
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 uppercase font-bold">Total Cases</span>
              <div className="text-[24px] font-bold text-slate-900 mt-1 tabular-nums">134,663</div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full inline-block mt-1">100% NBS</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 uppercase font-bold">Top Jurisdiction</span>
              <div className="text-[24px] font-bold text-slate-900 mt-1">Lagos (17.9%)</div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full inline-block mt-1">24,190 Incidents</span>
            </div>
          </div>
        </div>

        {/* Section 2: Semantic Risk Pills */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col gap-4">
          <span className="text-[12px] font-bold text-purple-700 uppercase tracking-wider">
            Risk Classification Badges
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[12px]">
              Low Risk (Score &lt; 25)
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[12px]">
              Moderate Risk (Score 25-50)
            </span>
            <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200 font-bold text-[12px]">
              High Risk (Score 50-75)
            </span>
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-bold text-[12px]">
              Critical Risk (Score &gt; 75)
            </span>
          </div>
        </div>

        {/* Section 3: Buttons */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col gap-4">
          <span className="text-[12px] font-bold text-purple-700 uppercase tracking-wider">
            Button Hierarchy
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <button className="px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-[14px] shadow-xs transition-colors">
              Primary Action
            </button>
            <button className="px-6 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-[14px] border border-slate-200 transition-colors">
              Secondary Action
            </button>
            <button className="px-4 py-2 rounded-xl text-purple-700 hover:bg-slate-50 font-semibold text-[13px] transition-colors">
              Tertiary Link
            </button>
          </div>
        </div>

        {/* Section 4: Hotspot Node Badges */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col gap-4">
          <span className="text-[12px] font-bold text-purple-700 uppercase tracking-wider">
            Spatial Centroid Envelopes
          </span>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-purple-700 animate-ping"></span>
              <span className="font-bold text-slate-900 text-[13px]">Spatial Hotspot Cluster #2</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
              Radius: 14.2 km
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
