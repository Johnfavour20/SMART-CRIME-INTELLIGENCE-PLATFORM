import React, { useState } from 'react';

interface MiningEnginesProps {
  onOpenModelSimulator?: (model: string) => void;
}

export const MiningEngines: React.FC<MiningEnginesProps> = ({ onOpenModelSimulator }) => {
  const [activeTab, setActiveTab] = useState<'kmeans' | 'tree' | 'rf'>('kmeans');

  return (
    <section className="w-full px-4 sm:px-8 lg:px-10 py-16 flex flex-col items-center gap-10 bg-white" id="engines">
      <div className="text-center max-w-2xl flex flex-col items-center gap-2">
        <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
          Methodology
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Powered by Transparent Data Mining
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Three computational paradigms selected for mathematical stability, explainability, and resistance to overfitting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
        {/* Engine 1: K-Means */}
        <div 
          onClick={() => {
            setActiveTab('kmeans');
            if (onOpenModelSimulator) onOpenModelSimulator('kmeans');
          }}
          className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-150 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                <span className="material-symbols-outlined text-[20px]">scatter_plot</span>
              </div>
              <span className="text-xs font-semibold text-purple-700">
                Silhouette: 0.84
              </span>
            </div>

            <h3 className="text-base font-semibold text-slate-900">
              K-Means Spatial Clustering
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Unsupervised spatial segmentation algorithm partitioning continuous Nigerian geographical data into optimal incident clusters based on Euclidean distance to centroids.
            </p>

            {/* Mini Cluster Diagram */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center h-28 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full border border-dashed border-slate-400 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-purple-700"></div>
              </div>
              <div className="absolute top-4 left-8 w-2 h-2 rounded-full bg-slate-400"></div>
              <div className="absolute bottom-5 right-10 w-2 h-2 rounded-full bg-slate-400"></div>
              <div className="absolute top-8 right-14 w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              <div className="absolute bottom-6 left-12 w-1.5 h-1.5 rounded-full bg-slate-400"></div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Applied to: Hotspot Discovery
            </span>
            <span className="font-semibold text-purple-700 group-hover:translate-x-0.5 transition-transform duration-150">→</span>
          </div>
        </div>

        {/* Engine 2: Decision Tree */}
        <div 
          onClick={() => {
            setActiveTab('tree');
            if (onOpenModelSimulator) onOpenModelSimulator('tree');
          }}
          className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-150 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                <span className="material-symbols-outlined text-[20px]">schema</span>
              </div>
              <span className="text-xs font-semibold text-purple-700">
                Gini Impurity ≤ 0.04
              </span>
            </div>

            <h3 className="text-base font-semibold text-slate-900">
              Decision Tree Heuristics
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Hierarchical rule-based classifier providing full structural interpretability. Each prediction can be explicitly traced from branch condition to probability leaf.
            </p>

            {/* Mini Tree Diagram */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center justify-center h-28 gap-1.5">
              <div className="px-3 py-1 rounded bg-white border border-slate-200 text-slate-900 text-[11px] font-semibold">
                State ∈ High Volume?
              </div>
              <div className="w-0.5 h-3 bg-slate-300"></div>
              <div className="flex gap-2">
                <div className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium">
                  Class A (50.9%)
                </div>
                <div className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-medium">
                  Class B (39.8%)
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Applied to: Rule Verification
            </span>
            <span className="font-semibold text-purple-700 group-hover:translate-x-0.5 transition-transform duration-150">→</span>
          </div>
        </div>

        {/* Engine 3: Random Forest */}
        <div 
          onClick={() => {
            setActiveTab('rf');
            if (onOpenModelSimulator) onOpenModelSimulator('rf');
          }}
          className="p-6 md:p-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all duration-150 flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
                <span className="material-symbols-outlined text-[20px]">forest</span>
              </div>
              <span className="text-xs font-semibold text-emerald-800">
                91.8% Accuracy
              </span>
            </div>

            <h3 className="text-base font-semibold text-slate-900">
              Random Forest Ensemble
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Bagged aggregation of 120 decorrelated decision trees minimizing variance and preventing overfitting across regional sample anomalies.
            </p>

            {/* Mini Forest Metric Indicator */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-around h-28">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-slate-900 tabular-nums">120</span>
                <span className="text-[11px] text-slate-500">Estimators</span>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-purple-700 tabular-nums">0.93</span>
                <span className="text-[11px] text-slate-500">ROC-AUC</span>
              </div>
              <div className="w-px h-10 bg-slate-200"></div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-slate-900 tabular-nums">0.91</span>
                <span className="text-[11px] text-slate-500">F1 Score</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">
              Applied to: Ensemble Projection
            </span>
            <span className="font-semibold text-purple-700 group-hover:translate-x-0.5 transition-transform duration-150">→</span>
          </div>
        </div>
      </div>
    </section>
  );
};
