import React from 'react';

export const StatStrip: React.FC = () => {
  return (
    <section className="w-full bg-gradient-to-r from-[#6200a9] via-[#6e3aca] to-[#7e22ce] text-white py-8 px-4 sm:px-8 lg:px-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 relative z-10">
        <div className="flex flex-col items-start">
          <span className="text-[28px] sm:text-[32px] font-bold tracking-tight text-white tabular-nums">
            134,663
          </span>
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#e4c5ff] mt-1">
            Reported Offences
          </span>
          <span className="text-[13px] text-white/80 font-normal mt-0.5">
            NBS 2017 Baseline Verified
          </span>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-[28px] sm:text-[32px] font-bold tracking-tight text-white">
            36 + FCT
          </span>
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#e4c5ff] mt-1">
            Sovereign Jurisdictions
          </span>
          <span className="text-[13px] text-white/80 font-normal mt-0.5">
            6 Geopolitical Zones Covered
          </span>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-[28px] sm:text-[32px] font-bold tracking-tight text-white">
            3 Classes
          </span>
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#e4c5ff] mt-1">
            Primary Crime Categories
          </span>
          <span className="text-[13px] text-white/80 font-normal mt-0.5">
            Property, Persons, Authority
          </span>
        </div>

        <div className="flex flex-col items-start">
          <span className="text-[28px] sm:text-[32px] font-bold tracking-tight text-white">
            3 Engines
          </span>
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#e4c5ff] mt-1">
            Mining Architectures
          </span>
          <span className="text-[13px] text-white/80 font-normal mt-0.5">
            K-Means, Decision Tree, RF
          </span>
        </div>
      </div>
    </section>
  );
};
