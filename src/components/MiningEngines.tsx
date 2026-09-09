import React, { useState } from 'react';

interface MiningEnginesProps {
  onOpenModelSimulator?: (model: string) => void;
}

export const MiningEngines: React.FC<MiningEnginesProps> = ({ onOpenModelSimulator }) => {
  const [activeTab, setActiveTab] = useState<'kmeans' | 'tree' | 'rf'>('kmeans');

  return (
    <section className="w-full px-4 sm:px-8 lg:px-10 py-16 flex flex-col items-center gap-10" id="engines">
      <div className="text-center max-w-2xl flex flex-col items-center gap-2">
        <span className="px-3.5 py-1 rounded-full bg-[#f0dbff] text-[#6200a9] text-[11px] font-bold uppercase tracking-wider">
          Methodology
        </span>
        <h2 className="text-[28px] sm:text-[34px] font-bold text-[#1e1926] tracking-tight">
          Powered by Transparent Data Mining
        </h2>
        <p className="text-[14px] text-[#4c4354] leading-relaxed">
          Three proven computational paradigms selected for mathematical stability, explainability, and resistance to overfitting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* Engine 1: K-Means */}
        <div 
          onClick={() => {
            setActiveTab('kmeans');
            if (onOpenModelSimulator) onOpenModelSimulator('kmeans');
          }}
          className="p-6 md:p-8 rounded-3xl bg-[#ffffff] border border-[#e9dff2] hover:border-[#6200a9]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#f0dbff] flex items-center justify-center text-[#6200a9] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">scatter_plot</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#efe4f8] text-[#6200a9] text-[11px] font-bold">
                Silhouette: 0.84
              </span>
            </div>

            <h3 className="text-[18px] font-bold text-[#1e1926]">
              K-Means Spatial Clustering
            </h3>

            <p className="text-[13px] text-[#4c4354] leading-relaxed">
              Unsupervised spatial segmentation algorithm partitioning continuous Nigerian geographical data into optimal incident clusters based on Euclidean distance to centroids.
            </p>

            {/* Mini Cluster Diagram */}
            <div className="p-4 rounded-xl bg-[#faf0ff] border border-[#e9dff2]/60 flex items-center justify-center h-28 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#6200a9]/40 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-[#6200a9] animate-ping"></div>
              </div>
              <div className="absolute top-4 left-8 w-2.5 h-2.5 rounded-full bg-[#6e3aca]"></div>
              <div className="absolute bottom-5 right-10 w-2.5 h-2.5 rounded-full bg-[#6e3aca]"></div>
              <div className="absolute top-8 right-14 w-2 h-2 rounded-full bg-[#7e22ce]"></div>
              <div className="absolute bottom-6 left-12 w-2 h-2 rounded-full bg-[#7e22ce]"></div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#faf0ff] flex items-center justify-between">
            <span className="text-[11px] text-[#4c4354] font-semibold">
              Applied to: Geographic Hotspot Discovery
            </span>
            <span className="text-[12px] font-bold text-[#6200a9] group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* Engine 2: Decision Tree */}
        <div 
          onClick={() => {
            setActiveTab('tree');
            if (onOpenModelSimulator) onOpenModelSimulator('tree');
          }}
          className="p-6 md:p-8 rounded-3xl bg-[#ffffff] border border-[#e9dff2] hover:border-[#6e3aca]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#ebddff] flex items-center justify-center text-[#6e3aca] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">schema</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#efe4f8] text-[#6e3aca] text-[11px] font-bold">
                Gini Impurity ≤ 0.04
              </span>
            </div>

            <h3 className="text-[18px] font-bold text-[#1e1926]">
              Decision Tree Heuristics
            </h3>

            <p className="text-[13px] text-[#4c4354] leading-relaxed">
              Hierarchical rule-based classifier providing full structural interpretability. Each prediction can be explicitly traced from branch condition to probability leaf.
            </p>

            {/* Mini Tree Diagram */}
            <div className="p-4 rounded-xl bg-[#faf0ff] border border-[#e9dff2]/60 flex flex-col items-center justify-center h-28 gap-1.5">
              <div className="px-3 py-1 rounded-lg bg-[#ffffff] border border-[#e9dff2] text-[#1e1926] text-[11px] font-bold">
                State ∈ High Volume?
              </div>
              <div className="w-0.5 h-3 bg-[#cfc2d6]"></div>
              <div className="flex gap-3">
                <div className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                  Class A (50.9%)
                </div>
                <div className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                  Class B (39.8%)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#faf0ff] flex items-center justify-between">
            <span className="text-[11px] text-[#4c4354] font-semibold">
              Applied to: Explainable Rule Verification
            </span>
            <span className="text-[12px] font-bold text-[#6e3aca] group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>

        {/* Engine 3: Random Forest */}
        <div 
          onClick={() => {
            setActiveTab('rf');
            if (onOpenModelSimulator) onOpenModelSimulator('rf');
          }}
          className="p-6 md:p-8 rounded-3xl bg-[#ffffff] border border-[#e9dff2] hover:border-[#7e22ce]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#ddb8ff] flex items-center justify-center text-[#7e22ce] group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[26px]">forest</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                91.8% Accuracy
              </span>
            </div>

            <h3 className="text-[18px] font-bold text-[#1e1926]">
              Random Forest Ensemble
            </h3>

            <p className="text-[13px] text-[#4c4354] leading-relaxed">
              Bagged aggregation of 120 decorrelated decision trees minimizing variance and preventing overfitting across regional sample anomalies.
            </p>

            {/* Mini Forest Metric Indicator */}
            <div className="p-4 rounded-xl bg-[#faf0ff] border border-[#e9dff2]/60 flex items-center justify-around h-28">
              <div className="flex flex-col items-center">
                <span className="text-[26px] text-[#6200a9] font-extrabold tabular-nums">
                  0.94
                </span>
                <span className="text-[11px] text-[#4c4354] font-semibold">
                  F1-Score
                </span>
              </div>
              <div className="w-px h-10 bg-[#cfc2d6]/60"></div>
              <div className="flex flex-col items-center">
                <span className="text-[26px] text-[#6e3aca] font-extrabold tabular-nums">
                  120
                </span>
                <span className="text-[11px] text-[#4c4354] font-semibold">
                  Estimators
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#faf0ff] flex items-center justify-between">
            <span className="text-[11px] text-[#4c4354] font-semibold">
              Applied to: General Risk Probability Modeling
            </span>
            <span className="text-[12px] font-bold text-[#7e22ce] group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </section>
  );
};
