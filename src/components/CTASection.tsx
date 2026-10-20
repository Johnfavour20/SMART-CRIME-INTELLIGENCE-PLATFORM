import React from 'react';

interface CTASectionProps {
  onLaunch: () => void;
  onReadDocs: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onLaunch, onReadDocs }) => {
  return (
    <section className="w-full px-4 sm:px-8 lg:px-10 py-16">
      <div className="w-full max-w-7xl mx-auto rounded-xl bg-slate-900 border border-slate-800 text-white p-8 md:p-12 flex flex-col items-center text-center gap-6">
        <div className="max-w-2xl flex flex-col items-center gap-3">
          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
            Operational Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            Turn Historical Incident Data Into Decision Support
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Explore state-level incident breakdowns, analyze verified spatial clusters, and evaluate explainable predictive risk projections across Nigerian states.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onLaunch}
            className="px-5 py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>Open Crime Analytics Dashboard</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button
            onClick={onReadDocs}
            className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors border border-slate-700"
          >
            Technical Documentation
          </button>
        </div>
      </div>
    </section>
  );
};
