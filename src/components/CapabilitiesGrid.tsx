import React from 'react';

interface CapabilitiesGridProps {
  onSelectCapability?: (capability: string) => void;
}

export const CapabilitiesGrid: React.FC<CapabilitiesGridProps> = ({ onSelectCapability }) => {
  const capabilities = [
    {
      id: 'trends',
      title: 'Crime Trends',
      icon: 'trending_up',
      bgIcon: 'bg-[#f0dbff]',
      textIcon: 'text-[#6200a9]',
      description: 'Explore crime frequencies, seasonal variations, and multi-period longitudinal shifts across all 37 Nigerian jurisdictions.',
      action: 'View longitudinal trends →',
    },
    {
      id: 'hotspots',
      title: 'Crime Hotspots',
      icon: 'radar',
      bgIcon: 'bg-[#ebddff]',
      textIcon: 'text-[#6e3aca]',
      description: 'Leverage unsupervised K-Means clustering to discover geospatial concentration bands, centroid shifts, and incident density.',
      action: 'Inspect cluster envelopes →',
    },
    {
      id: 'prediction',
      title: 'Crime Prediction',
      icon: 'account_tree',
      bgIcon: 'bg-[#f0dbff]',
      textIcon: 'text-[#7e22ce]',
      description: 'Generate predictive probability forecasts using trained Decision Tree heuristics and multi-tree Random Forest ensembles.',
      action: 'Simulate risk classifiers →',
    },
    {
      id: 'intelligence',
      title: 'Data Intelligence',
      icon: 'analytics',
      bgIcon: 'bg-[#d3bbff]',
      textIcon: 'text-[#250059]',
      description: 'Transform high-dimensional raw tables into easily interpretable civic insight reports, charts, and spatial heatmaps.',
      action: 'Export structured findings →',
    },
  ];

  return (
    <section className="w-full px-4 sm:px-8 lg:px-10 py-16 flex flex-col items-center gap-10 bg-white">
      <div className="text-center max-w-2xl flex flex-col items-center gap-2">
        <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold uppercase tracking-wider">
          Core Capabilities
        </span>
        <h2 className="text-[28px] sm:text-[34px] font-bold text-slate-900 tracking-tight">
          From Crime Data to Actionable Intelligence
        </h2>
        <p className="text-[14px] text-slate-600 leading-relaxed">
          Engineered specifically for security researchers, public policy analysts, and regional commands requiring objective statistical clarity.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {capabilities.map((cap) => (
          <div
            key={cap.id}
            onClick={() => onSelectCapability && onSelectCapability(cap.id)}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
          >
            <div className="flex flex-col gap-3.5">
              <div className={`w-12 h-12 rounded-xl ${cap.bgIcon} flex items-center justify-center ${cap.textIcon} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined text-[26px]">{cap.icon}</span>
              </div>
              <h3 className="text-[18px] font-bold text-slate-900">
                {cap.title}
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed">
                {cap.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100">
              <span className="text-[12px] text-purple-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                {cap.action}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
