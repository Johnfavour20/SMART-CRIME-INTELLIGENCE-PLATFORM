import React from 'react';

interface CTASectionProps {
  onLaunch: () => void;
  onReadDocs: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onLaunch, onReadDocs }) => {
  return (
    <section className="w-full px-4 sm:px-8 lg:px-10 py-16">
      <div className="w-full max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#6200a9] via-[#6e3aca] to-[#7e22ce] text-white p-8 md:p-14 relative overflow-hidden flex flex-col items-center text-center gap-6">
        {/* Decorative light blurs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#8856e5]/30 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#f0dbff]/20 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl flex flex-col items-center gap-3">
          <span className="px-3.5 py-1 rounded-full bg-white/15 text-purple-200 text-[11px] font-bold uppercase tracking-wider">
            Start Analyzing Now
          </span>
          <h2 className="text-[32px] sm:text-[42px] font-bold tracking-tight text-white leading-tight">
            Turn Crime Data Into Intelligence
          </h2>
          <p className="text-[16px] text-white/90 leading-relaxed max-w-xl">
            Explore historical patterns, analyze spatial hotspots, and generate data-driven predictive insights across Nigerian jurisdictions today.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onLaunch}
            className="px-6 py-3 rounded-xl bg-white text-purple-700 text-[15px] font-bold hover:bg-slate-100 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Launch Smart Crime</span>
            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
          </button>

          <button
            onClick={onReadDocs}
            className="px-6 py-3 rounded-xl bg-transparent hover:bg-white/10 text-white text-[15px] font-semibold transition-all border border-white/30"
          >
            Read Technical Documentation
          </button>
        </div>
      </div>
    </section>
  );
};
