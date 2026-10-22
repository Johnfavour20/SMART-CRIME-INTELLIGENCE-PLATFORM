import React from 'react';

interface ReportsViewProps {
  onBackToOverview?: () => void;
  onLaunchDashboard?: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  onBackToOverview,
  onLaunchDashboard,
}) => {
  const reportCards = [
    {
      title: 'Executive Summary',
      value: '12.4%',
      detail: 'Average uplift in hotspot visibility and resource allocation confidence',
      accent: 'bg-[#f0dbff] text-[#6200a9]',
      icon: 'summarize',
    },
    {
      title: 'State Coverage',
      value: '37',
      detail: 'Nigerian jurisdictions included in the current analytical baseline',
      accent: 'bg-[#e6f7ed] text-[#106a43]',
      icon: 'travel_explore',
    },
    {
      title: 'Prediction Confidence',
      value: '91.3%',
      detail: 'Ensemble model confidence across high-risk output zones',
      accent: 'bg-[#eef2ff] text-[#3b5bdb]',
      icon: 'insights',
    },
  ];

  const findings = [
    'Property-related offences remain the dominant category, accounting for the largest share of reported incidents.',
    'Lagos, Kano, Rivers, and FCT Abuja continue to show elevated analytical risk concentration and operational demand.',
    'Model outputs are framed as decision-support insight, not certainty, and reinforce fair, evidence-led planning.',
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-10 sm:py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-[#6200a9]">
              <span className="material-symbols-outlined text-[16px]">description</span>
              <span>Report Center</span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Crime Intelligence Reports
            </h1>
            <p className="mt-2 max-w-2xl text-sm sm:text-[15px] text-slate-600 leading-relaxed">
              Snapshot summaries, operational findings, and evidence-based briefings generated from the current NBS-aligned crime dataset.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onLaunchDashboard && (
              <button
                type="button"
                onClick={onLaunchDashboard}
                className="inline-flex items-center gap-2 rounded-xl bg-[#6200a9] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#50008d] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                Open Dashboard
              </button>
            )}
            {onBackToOverview && (
              <button
                type="button"
                onClick={onBackToOverview}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Overview
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportCards.map((report) => (
            <div key={report.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{report.title}</p>
                </div>
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${report.accent}`}>
                  <span className="material-symbols-outlined text-[18px]">{report.icon}</span>
                </span>
              </div>

              <div className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{report.value}</div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{report.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,0.9fr] gap-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Operational brief</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Current intelligence summary</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                Updated this week
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {findings.map((finding, index) => (
                <div key={finding} className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                  <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#6200a9] text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{finding}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Download options</p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">Ready-to-share report package</h2>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl bg-[#6200a9] px-4 py-3 text-left text-sm font-semibold text-white hover:bg-[#50008d] transition-colors cursor-pointer"
              >
                <span>Export PDF brief</span>
                <span className="material-symbols-outlined text-[18px]">download</span>
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span>Export JSON summary</span>
                <span className="material-symbols-outlined text-[18px]">article</span>
              </button>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Report metadata</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Baseline: NBS 2017</li>
                <li>Coverage: 36 states + FCT Abuja</li>
                <li>Generated: 22 Oct 2026</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
