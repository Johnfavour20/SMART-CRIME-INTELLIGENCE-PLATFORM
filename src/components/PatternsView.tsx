import React from 'react';

interface PatternsViewProps {
  onBackToOverview?: () => void;
}

export const PatternsView: React.FC<PatternsViewProps> = ({ onBackToOverview }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-purple-700">
            <span>STATISTICAL & ETHICAL ARCHITECTURE</span>
            <span>•</span>
            <span className="text-slate-500">Patterns Guide</span>
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-bold text-slate-900 tracking-tight mt-1">
            Data Patterns & Civic Governance
          </h1>
          <p className="text-[14px] text-slate-600 max-w-2xl">
            Methodological patterns governing empirical crime analysis, historical dataset normalization, and civil safety policy.
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

      <div className="space-y-6">
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <span className="material-symbols-outlined text-[20px]">dataset</span>
            </div>
            <h2 className="text-[18px] font-bold text-slate-900">
              Pattern 1: NBS Dataset Normalization & Integrity
            </h2>
          </div>
          <p className="text-[14px] text-slate-600 leading-relaxed">
            All crime incident entries are cross-referenced across 36 State Commands and FCT Abuja. Incident types are collapsed into the standard three primary legal classifications: <strong>Property Offences</strong> (theft, burglary, damage), <strong>Offences Against Persons</strong> (assault, grievous harm), and <strong>Offences Against Lawful Authority</strong> (contempt, breach of peace).
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
            <h2 className="text-[18px] font-bold text-slate-900">
              Pattern 2: Geospatial Hotspot Clustering
            </h2>
          </div>
          <p className="text-[14px] text-slate-600 leading-relaxed">
            Rather than relying on arbitrary administrative borders, continuous incidents are partitioned into spatial density envelopes using unsupervised K-Means (k=5). This detects natural urban-rural transit corridors, such as the Lagos-Ibadan expressway or Kano-Kaduna rail corridor.
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <span className="material-symbols-outlined text-[20px]">gavel</span>
            </div>
            <h2 className="text-[18px] font-bold text-slate-900">
              Pattern 3: Zero-Surveillance Ethical Charter
            </h2>
          </div>
          <p className="text-[14px] text-slate-600 leading-relaxed">
            All predictive classifiers are probabilistic and designed for resource allocation (e.g. lighting corridors, civic patrol staffing, emergency logistics). The system explicitly rejects biometric tracking, facial recognition, individual suspect scoring, and automated penal actions.
          </p>
        </div>
      </div>
    </div>
  );
};
