import React from 'react';
import { LiveDashboardData } from '../mockRealtimeData';

interface StatStripProps {
  liveData: LiveDashboardData;
}

export const StatStrip: React.FC<StatStripProps> = ({ liveData }) => {
  return (
    <section className="w-full bg-slate-900 border-y border-slate-800 text-white py-8 px-4 sm:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
        <div className="flex flex-col items-start">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
            {liveData.totalCases.toLocaleString()}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 mt-1">
            Reported Offences
          </span>
          <span className="text-xs text-slate-400 font-normal mt-0.5">
            Live feed · {liveData.lastUpdated}
          </span>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            36 + FCT
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 mt-1">
            Jurisdictions
          </span>
          <span className="text-xs text-slate-400 font-normal mt-0.5">
            6 Geopolitical Zones Covered
          </span>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            3 Classes
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 mt-1">
            Statutory Classes
          </span>
          <span className="text-xs text-slate-400 font-normal mt-0.5">
            Property, Persons, Authority
          </span>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            3 Engines
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 mt-1">
            Mining Models
          </span>
          <span className="text-xs text-slate-400 font-normal mt-0.5">
            K-Means, Decision Tree, RF
          </span>
        </div>
      </div>
    </section>
  );
};
