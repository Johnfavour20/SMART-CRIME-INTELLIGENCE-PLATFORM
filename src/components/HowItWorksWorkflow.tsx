import React from 'react';

export const HowItWorksWorkflow: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Collect',
      icon: 'folder_open',
      bgIcon: 'bg-[#f0dbff]',
      textIcon: 'text-[#6200a9]',
      description: 'Historical crime reports are ingested directly from official repositories including the National Bureau of Statistics and state police records.'
    },
    {
      num: '02',
      title: 'Prepare',
      icon: 'cleaning_services',
      bgIcon: 'bg-[#ebddff]',
      textIcon: 'text-[#6e3aca]',
      description: 'Records are scrubbed, deduplicated, geocoded to standardized administrative coordinates, and normalized for mining engines.'
    },
    {
      num: '03',
      title: 'Analyze',
      icon: 'psychology',
      bgIcon: 'bg-[#ddb8ff]',
      textIcon: 'text-[#6200a9]',
      description: 'K-Means clustering and predictive ML models evaluate spatial centroids, risk coefficients, and seasonal correlations.'
    },
    {
      num: '04',
      title: 'Understand',
      icon: 'insights',
      bgIcon: 'bg-[#8856e5]',
      textIcon: 'text-white',
      description: 'Insights surface via choropleth maps, confidence envelopes, and transparent classification metrics for evidence-based decisions.'
    },
  ];

  return (
    <section className="w-full px-4 sm:px-8 lg:px-10 py-16 bg-slate-50 border-y border-slate-200 flex flex-col items-center gap-10" id="how-it-works">
      <div className="text-center max-w-2xl flex flex-col items-center gap-2">
        <span className="px-3.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold uppercase tracking-wider">
          Algorithmic Workflow
        </span>
        <h2 className="text-[28px] sm:text-[34px] font-bold text-slate-900 tracking-tight">
          How Smart Crime Works
        </h2>
        <p className="text-[14px] text-slate-600 leading-relaxed">
          A strictly verified four-step pipeline transitioning from raw administrative police reports into explainable statistical models.
        </p>
      </div>

      {/* Stepped Horizontal Timeline */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col gap-3 relative hover:border-purple-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-[44px] font-extrabold text-slate-200 leading-none select-none tracking-tight">
                {step.num}
              </span>
              <div className={`w-10 h-10 rounded-full ${step.bgIcon} flex items-center justify-center ${step.textIcon}`}>
                <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
              </div>
            </div>
            <h4 className="text-[18px] font-bold text-slate-900">
              {step.title}
            </h4>
            <p className="text-[13px] text-slate-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
