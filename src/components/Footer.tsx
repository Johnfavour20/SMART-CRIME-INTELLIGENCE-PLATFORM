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

          {/* Col 3: Platform */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase font-bold text-slate-900 tracking-wider">
              Platform
            </span>
            <button onClick={() => onNavigate && onNavigate('auth')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              Analyst Sign In
            </button>
            <button onClick={() => onNavigate && onNavigate('dashboard')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              Analytics Dashboard
            </button>
            <button onClick={() => onNavigate && onNavigate('how-it-works')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              Clustering Hotspots
            </button>
            <button onClick={() => onNavigate && onNavigate('engines')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              Predictive Modeling
            </button>
            <button onClick={() => onNavigate && onNavigate('nigerian-data')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              Geopolitical Matrix
            </button>
          </div>

          {/* Col 4: Reference Data */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase font-bold text-slate-900 tracking-wider">
              Reference Data
            </span>
            <button onClick={() => onNavigate && onNavigate('nigerian-data')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              NBS 2017 Dataset
            </button>
            <button onClick={() => onNavigate && onNavigate('engines')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              K-Means Parameters
            </button>
            <button onClick={() => onNavigate && onNavigate('engines')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              Decision Tree Schema
            </button>
            <button onClick={() => onNavigate && onNavigate('engines')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              Random Forest ROC-AUC
            </button>
          </div>

          {/* Col 5: Ethics & Policy */}
          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase font-bold text-slate-900 tracking-wider">
              Ethics & Policy
            </span>
            <button onClick={() => onOpenDoc && onOpenDoc('Responsible AI Framing')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              Responsible AI Framing
            </button>
            <button onClick={() => onOpenDoc && onOpenDoc('Zero-Surveillance Charter')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              Zero-Surveillance Charter
            </button>
            <button onClick={() => onOpenDoc && onOpenDoc('Data Privacy Guarantee')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              Data Privacy Guarantee
            </button>
            <button onClick={() => onOpenDoc && onOpenDoc('Academic Citation Guide')} className="text-left text-[13px] text-slate-600 hover:text-purple-700 transition-colors">
              Academic Citation Guide
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
