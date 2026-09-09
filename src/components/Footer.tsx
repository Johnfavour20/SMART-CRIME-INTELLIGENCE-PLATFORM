import React from 'react';

interface FooterProps {
  onNavigate?: (id: string) => void;
  onOpenDoc?: (docName: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDoc }) => {
  return (
    <footer className="w-full bg-white border-t border-slate-200">
      {/* Primary 5-Column SaaS Footer */}
      <div className="w-full max-w-7xl mx-auto py-14 px-4 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">security</span>
              </div>
              <span className="text-[18px] text-slate-900 font-bold tracking-tight">
                SMART CRIME
              </span>
            </div>

            <p className="text-[13px] text-slate-600 leading-relaxed max-w-sm">
              Data-driven crime analysis and predictive geospatial intelligence built for evidence-based resource planning, academic research, and policy insight in Nigeria.
            </p>

            <div className="flex items-center gap-2 text-slate-500 text-[12px] font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Status: Fully Operational (NBS v1.0)</span>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase font-bold text-slate-900 tracking-wider">
              Quick Navigation
            </span>
            <button onClick={() => onNavigate && onNavigate('dashboard')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors cursor-pointer">
              Executive Dashboard
            </button>
            <button onClick={() => onNavigate && onNavigate('hotspots')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors cursor-pointer">
              Crime Hotspots Map
            </button>
            <button onClick={() => onNavigate && onNavigate('prediction')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors cursor-pointer">
              Crime Risk Predictor
            </button>
            <button onClick={() => onNavigate && onNavigate('crime-data')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors cursor-pointer">
              NBS Crime Records
            </button>
            <button onClick={() => onNavigate && onNavigate('auth')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors cursor-pointer">
              Analyst Sign In
            </button>
          </div>

          {/* Col 4: Key Capabilities */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase font-bold text-slate-900 tracking-wider">
              Capabilities
            </span>
            <button onClick={() => onNavigate && onNavigate('hotspots')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors cursor-pointer">
              High-Risk Hotspot Discovery
            </button>
            <button onClick={() => onNavigate && onNavigate('prediction')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors cursor-pointer">
              Offence Risk Forecasting
            </button>
            <button onClick={() => onNavigate && onNavigate('dashboard')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors cursor-pointer">
              Geopolitical State Analytics
            </button>
            <button onClick={() => onNavigate && onNavigate('crime-data')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors cursor-pointer">
              National Crime Data Tables
            </button>
          </div>

          {/* Col 5: Data & Verification */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase font-bold text-slate-900 tracking-wider">
              Data Governance
            </span>
            <div className="text-[13px] text-slate-600">
              National Bureau of Statistics (NBS)
            </div>
            <div className="text-[13px] text-slate-600">
              Reported Offences: 134,663 Cases
            </div>
            <div className="text-[13px] text-slate-600">
              Coverage: 36 States + FCT Abuja
            </div>
            <div className="text-[13px] text-purple-700 font-semibold">
              Proactive Security Intelligence
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
