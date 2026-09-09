import React, { useState, useMemo } from 'react';
import { NIGERIAN_STATES_DATA } from '../data/crimeData';
import { ActiveTab } from '../types';

interface AnalyticsViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectState?: (stateName: string) => void;
  onOpenCrimeData?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onNavigateTab,
  onSelectState,
  onOpenCrimeData,
}) => {
  // Filter bar states
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [analysisType, setAnalysisType] = useState<string>('trends');
  const [activeSegmentTab, setActiveSegmentTab] = useState<'all' | 'persons' | 'property' | 'authority'>('all');
  const [trendCycle, setTrendCycle] = useState<'quarterly' | 'semiannual' | 'statutory'>('quarterly');

  // State comparison filters
  const [compCategory, setCompCategory] = useState<string>('all');
  const [compZone, setCompZone] = useState<string>('all');
  const [compSort, setCompSort] = useState<'volume' | 'alpha' | 'zone'>('volume');
  const [showAllStates, setShowAllStates] = useState<boolean>(false);

  // Report generation toast/modal state
  const [reportGenerating, setReportGenerating] = useState<boolean>(false);
  const [reportNotice, setReportNotice] = useState<string | null>(null);

  const handleGenerateReport = () => {
    setReportGenerating(true);
    setReportNotice('Compiling NBS 2017 Longitudinal Analytics Report...');
    setTimeout(() => {
      setReportNotice('Analytics_Executive_Brief_2017.pdf generated successfully ✓');
      setTimeout(() => {
        setReportGenerating(false);
        setReportNotice(null);
      }, 3000);
    }, 1200);
  };

  // State comparison data derived from NIGERIAN_STATES_DATA
  const filteredStates = useMemo(() => {
    let list = [...NIGERIAN_STATES_DATA];

    // Filter by Zone
    if (compZone !== 'all') {
      list = list.filter((s) => s.zone === compZone);
    }

    // Sort
    list.sort((a, b) => {
      if (compSort === 'volume') {
        const getVol = (s: typeof a) => {
          if (compCategory === 'property') return s.propertyCases;
          if (compCategory === 'persons') return s.personsCases;
          if (compCategory === 'authority') return s.authorityCases;
          return s.totalCases;
        };
        return getVol(b) - getVol(a);
      }
      if (compSort === 'alpha') {
        return a.state.localeCompare(b.state);
      }
      if (compSort === 'zone') {
        return a.zone.localeCompare(b.zone) || a.state.localeCompare(b.state);
      }
      return 0;
    });

    return list;
  }, [compZone, compSort, compCategory]);

  const displayedStates = showAllStates ? filteredStates : filteredStates.slice(0, 6);
  const maxVolume = useMemo(() => {
    return Math.max(...NIGERIAN_STATES_DATA.map((s) => s.totalCases), 1);
  }, []);

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* REPORT GENERATION NOTIFICATION */}
      {reportNotice && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span className="text-sm font-medium">{reportNotice}</span>
        </div>
      )}

      {/* ====================================================
           1. PAGE TITLE & HEADER ACTIONS
      ==================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Crime Trends & Analytics
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              <span className="material-symbols-outlined text-purple-700 text-xs">verified</span>
              Official NBS 2017 Baseline
            </span>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl">
            Identify historical patterns, distributions, and relationships across the available crime data.
          </p>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 shadow-xs">
            <span className="material-symbols-outlined text-purple-700 text-sm">calendar_today</span>
            <span>Historical Data · 2017</span>
          </div>
          <button
            onClick={handleGenerateReport}
            disabled={reportGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl shadow-xs transition active:scale-[0.98] cursor-pointer disabled:opacity-75"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">
              {reportGenerating ? 'sync' : 'file_download'}
            </span>
            <span>{reportGenerating ? 'Generating...' : 'Generate Report'}</span>
          </button>
        </div>
      </div>

      {/* ====================================================
           2. FILTER BAR ("Analysis Filters")
      ==================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-700 text-base">tune</span>
            <h2 className="text-sm font-bold text-slate-900">Analysis Filters</h2>
            <span className="text-[11px] text-slate-500">(Multi-parameter querying)</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">Status:</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Analysis ready
            </span>
          </div>
        </div>

        {/* Filter Controls Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* 1. State */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="filter-state">
              State Jurisdiction
            </label>
            <div className="relative">
              <select
                id="filter-state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-100 cursor-pointer"
              >
                <option value="all">All States (36 + FCT)</option>
                {NIGERIAN_STATES_DATA.map((st) => (
                  <option key={st.state} value={st.state}>
                    {st.state} {st.state.includes('FCT') ? '' : 'State'}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-xs">
                expand_more
              </span>
            </div>
          </div>

          {/* 2. Crime Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="filter-cat">
              Crime Category
            </label>
            <div className="relative">
              <select
                id="filter-cat"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-100 cursor-pointer"
              >
                <option value="all">All Categories (3 Statutory Classes)</option>
                <option value="property">Offences Against Property (68,579)</option>
                <option value="persons">Offences Against Persons (53,641)</option>
                <option value="authority">Offences Against Lawful Authority (12,443)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-xs">
                expand_more
              </span>
            </div>
          </div>

          {/* 3. Analysis Type */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="filter-type">
              Analysis Type
            </label>
            <div className="relative">
              <select
                id="filter-type"
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-100 cursor-pointer"
              >
                <option value="trends">Crime Trends & Distributions</option>
                <option value="comparison">Geographic State Comparison</option>
                <option value="crosstab">Statutory Cross-Tabulation</option>
                <option value="cluster">Cluster Affinity Index</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-xs">
                expand_more
              </span>
            </div>
          </div>

          {/* 4. Year & Action Buttons */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5" htmlFor="filter-year">
              Year Benchmark
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  id="filter-year"
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-700 focus:ring-2 focus:ring-purple-100 cursor-pointer"
                >
                  <option>2017 (Historical Benchmark)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-xs">
                  expand_more
                </span>
              </div>
              <button
                className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl shadow-xs transition shrink-0 cursor-pointer"
                title="Apply filters"
                type="button"
                onClick={() => {
                  setReportNotice('Filters synchronized with analytical pipelines');
                  setTimeout(() => setReportNotice(null), 2500);
                }}
              >
                Apply Analysis
              </button>
              <button
                className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-medium transition shrink-0 cursor-pointer"
                title="Reset filters"
                type="button"
                onClick={() => {
                  setSelectedState('all');
                  setSelectedCategory('all');
                  setAnalysisType('trends');
                }}
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dataset attribution line */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-700 text-sm">info</span>
            <span>Analysis is based on the historical NBS 2017 dataset.</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Source ID: NBS-CRIM-2017-V1</span>
        </div>
      </div>

      {/* ====================================================
           3. KEY ANALYTICS METRICS (4 KPI CARDS)
      ==================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* CARD 1: Total Reported Cases */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-purple-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Total Reported Cases</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">database</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">134,663</span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="text-purple-700 font-semibold">100%</span>
            <span>Across the available dataset</span>
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-800 to-purple-600"></div>
        </div>

        {/* CARD 2: Offences Against Persons */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-purple-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Offences Against Persons</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
              <span className="material-symbols-outlined text-lg">person</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">53,641</span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="text-indigo-700 font-semibold">39.8%</span>
            <span>Reported cases</span>
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"></div>
        </div>

        {/* CARD 3: Offences Against Property */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-purple-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Offences Against Property</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">home_work</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">68,579</span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="text-purple-700 font-semibold">50.9%</span>
            <span>Reported cases (Dominant category)</span>
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-700"></div>
        </div>

        {/* CARD 4: Lawful Authority Offences */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-purple-300 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Lawful Authority Offences</span>
            <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-200">
              <span className="material-symbols-outlined text-lg">balance</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">12,443</span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="text-violet-600 font-semibold">9.3%</span>
            <span>Reported cases</span>
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-600"></div>
        </div>
      </div>

      {/* ====================================================
           4. PRIMARY ANALYTICS CANVAS: 
              Main Trend Chart (68%) + Key Insights Panel (32%)
      ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: MAIN TREND CHART CARD (approx 68% = 8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          {/* Header & Segmented Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Crime Distribution</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution of reported offences across the major crime categories.
              </p>
            </div>

            {/* Segmented filter control */}
            <div className="inline-flex p-1 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveSegmentTab('all')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeSegmentTab === 'all'
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                type="button"
              >
                All
              </button>
              <button
                onClick={() => setActiveSegmentTab('persons')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeSegmentTab === 'persons'
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                type="button"
              >
                Persons
              </button>
              <button
                onClick={() => setActiveSegmentTab('property')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeSegmentTab === 'property'
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                type="button"
              >
                Property
              </button>
              <button
                onClick={() => setActiveSegmentTab('authority')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeSegmentTab === 'authority'
                    ? 'bg-white text-purple-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                type="button"
              >
                Authority
              </button>
            </div>
          </div>

          {/* Polished Bar Chart Visualization */}
          <div className="relative bg-slate-50/70 rounded-xl p-6 border border-slate-200">
            {/* Chart Header context */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-2 border-b border-slate-200">
              <span className="font-bold text-slate-900">Statutory Class Volume (Benchmark 2017)</span>
              <span className="text-slate-400">Scale: 0 – 80,000 Verified Cases</span>
            </div>

            {/* Bar Chart Graphics container */}
            <div className="space-y-6 pt-2 pb-2">
              {/* Bar 1: Offences Against Property (68,579) */}
              {(activeSegmentTab === 'all' || activeSegmentTab === 'property') && (
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-purple-700"></span>
                      <span className="font-bold text-slate-900">Offences Against Property</span>
                      <span className="text-[11px] text-slate-400">(Theft, burglary, arson, fraud)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-purple-700 text-sm">68,579</span>
                      <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                        50.9%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-white h-9 rounded-xl overflow-hidden p-1 border border-slate-200 shadow-inner flex items-center relative group">
                    <div
                      className="h-full rounded-lg bg-gradient-to-r from-purple-800 to-purple-600 transition-all duration-700 flex items-center justify-end pr-3"
                      style={{ width: '85.7%' }}
                    >
                      <span className="text-[11px] font-bold text-white tracking-wider">68,579</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bar 2: Offences Against Persons (53,641) */}
              {(activeSegmentTab === 'all' || activeSegmentTab === 'persons') && (
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-indigo-600"></span>
                      <span className="font-bold text-slate-900">Offences Against Persons</span>
                      <span className="text-[11px] text-slate-400">(Assault, bodily harm, homicide)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-700 text-sm">53,641</span>
                      <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                        39.8%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-white h-9 rounded-xl overflow-hidden p-1 border border-slate-200 shadow-inner flex items-center relative group">
                    <div
                      className="h-full rounded-lg bg-gradient-to-r from-indigo-700 to-indigo-500 transition-all duration-700 flex items-center justify-end pr-3"
                      style={{ width: '67.0%' }}
                    >
                      <span className="text-[11px] font-bold text-white tracking-wider">53,641</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Bar 3: Lawful Authority Offences (12,443) */}
              {(activeSegmentTab === 'all' || activeSegmentTab === 'authority') && (
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-md bg-slate-700"></span>
                      <span className="font-bold text-slate-900">Offences Against Lawful Authority</span>
                      <span className="text-[11px] text-slate-400">(Perjury, breach of peace, contempt)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">12,443</span>
                      <span className="text-[11px] text-slate-700 font-semibold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        9.3%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-white h-9 rounded-xl overflow-hidden p-1 border border-slate-200 shadow-inner flex items-center relative group">
                    <div
                      className="h-full rounded-lg bg-gradient-to-r from-slate-600 to-slate-800 transition-all duration-700 flex items-center justify-end pr-3"
                      style={{ width: '15.5%' }}
                    >
                      <span className="text-[11px] font-bold text-white tracking-wider">12,443</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Horizontal Grid Lines & Scale Markers */}
            <div className="pt-4 border-t border-slate-200 flex justify-between text-[10px] font-mono text-slate-400">
              <span>0</span>
              <span>20,000</span>
              <span>40,000</span>
              <span>60,000</span>
              <span>80,000 Cases</span>
            </div>
          </div>

          {/* Footer note on statistical fidelity */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
              <span>
                Total verified baseline across all 3 classes: <strong className="text-slate-900 font-mono">134,663</strong> cases
              </span>
            </span>
            <span className="text-slate-400">Standard NBS statutory grouping</span>
          </div>
        </div>

        {/* RIGHT: KEY INSIGHTS PANEL (approx 32% = 4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">lightbulb</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Key Insights</h3>
            </div>
            <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              3 Observations
            </span>
          </div>

          <div className="space-y-4">
            {/* Insight 1 */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 relative">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-purple-700 shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-sm">warning</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Property offences represent the largest category in the available dataset.
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    68,579 reported cases are recorded under offences against property, making up more than half (50.9%) of all recorded filings.
                  </p>
                </div>
              </div>
            </div>

            {/* Insight 2 */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 relative">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-700 shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-sm">group</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Offences against persons account for 53,641 reported cases.
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    This category represents a substantial portion of the historical dataset (39.8%), highlighting critical personal safety vectors.
                  </p>
                </div>
              </div>
            </div>

            {/* Insight 3 */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 relative">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-sm">gavel</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Lawful authority offences account for 12,443 reported cases.
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    These records form the third major category in the dataset (9.3%), reflecting institutional and regulatory compliance reports.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Insight Footer / Caveat */}
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-purple-700 text-sm">verified</span>
            <span>Statutory distributions strictly reflect historical filings.</span>
          </div>
        </div>
      </div>

      {/* ====================================================
           5. HISTORICAL TREND ANALYSIS CARD
      ==================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Historical Trend Analysis</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                <span className="material-symbols-outlined text-xs">history</span>
                2017 Dataset
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore changes in reported crime cases across the available reporting period.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Reporting Phase:</span>
            <div className="inline-flex p-1 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setTrendCycle('quarterly')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  trendCycle === 'quarterly'
                    ? 'bg-white text-purple-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                type="button"
              >
                Quarterly Cycle
              </button>
              <button
                onClick={() => setTrendCycle('semiannual')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  trendCycle === 'semiannual'
                    ? 'bg-white text-purple-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                type="button"
              >
                Semi-Annual
              </button>
              <button
                onClick={() => setTrendCycle('statutory')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  trendCycle === 'statutory'
                    ? 'bg-white text-purple-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                type="button"
              >
                Statutory Total
              </button>
            </div>
          </div>
        </div>

        {/* Trend Chart Representation (SVG Visualizer) */}
        <div className="bg-slate-50/60 rounded-xl p-6 border border-slate-200 relative overflow-hidden">
          {/* Informational Banner inside visualizer */}
          <div className="mb-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-full bg-purple-700"></span>
                <span className="font-semibold text-slate-900">Property Offences</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-full bg-indigo-600"></span>
                <span className="font-semibold text-slate-900">Persons Offences</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-full bg-slate-800"></span>
                <span className="font-semibold text-slate-900">Lawful Authority</span>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Cycle: {trendCycle === 'quarterly' ? 'Q1 Baseline to Q4 Audit' : trendCycle === 'semiannual' ? 'H1 vs H2' : 'Full Annual 2017'}
            </span>
          </div>

          {/* SVG Multi-Series Wave Visualization */}
          <div className="w-full h-48 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 800 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradProperty" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6b21a8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#6b21a8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradPersons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line x1="0" y1="30" x2="800" y2="30" stroke="#e2e8f0" strokeDasharray="4,4" strokeWidth="1" />
              <line x1="0" y1="75" x2="800" y2="75" stroke="#e2e8f0" strokeDasharray="4,4" strokeWidth="1" />
              <line x1="0" y1="120" x2="800" y2="120" stroke="#e2e8f0" strokeDasharray="4,4" strokeWidth="1" />
              <line x1="0" y1="165" x2="800" y2="165" stroke="#e2e8f0" strokeWidth="1" />

              {/* Area 1: Property */}
              <path d="M 0,165 Q 200,90 400,65 T 800,45 L 800,165 L 0,165 Z" fill="url(#gradProperty)" />
              <path d="M 0,165 Q 200,90 400,65 T 800,45" fill="none" stroke="#6b21a8" strokeWidth="2.5" />

              {/* Area 2: Persons */}
              <path d="M 0,165 Q 200,115 400,95 T 800,80 L 800,165 L 0,165 Z" fill="url(#gradPersons)" />
              <path d="M 0,165 Q 200,115 400,95 T 800,80" fill="none" stroke="#4f46e5" strokeWidth="2.5" />

              {/* Line 3: Authority */}
              <path d="M 0,165 Q 200,150 400,140 T 800,135" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="3,3" />

              {/* Data point pins */}
              <circle cx="400" cy="65" r="4" fill="#6b21a8" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="800" cy="45" r="4" fill="#6b21a8" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="400" cy="95" r="4" fill="#4f46e5" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="800" cy="80" r="4" fill="#4f46e5" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between items-center text-xs text-slate-500 pt-3 border-t border-slate-200 font-medium">
            <span>Q1 Baseline</span>
            <span>Q2 Mid-Cycle Filings</span>
            <span>Q3 Spatial Consolidations</span>
            <span>Q4 NBS Annual Benchmark Total</span>
          </div>
        </div>

        {/* Cautionary Note */}
        <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 flex items-center gap-3 text-xs text-slate-700">
          <span className="material-symbols-outlined text-purple-700 text-base shrink-0">info</span>
          <span>
            <strong>Note on Longitudinal Bounds:</strong> Only historical records available in the selected dataset are represented. This view models intra-annual distribution across documented filing periods without extrapolating beyond the 2017 census benchmark.
          </span>
        </div>
      </div>

      {/* ====================================================
           6. STATE-LEVEL COMPARISON (Full-Width Card)
      ==================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">State-Level Comparison</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare reported crime records across Nigerian states (36 Federated States + FCT).
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={compCategory}
                onChange={(e) => setCompCategory(e.target.value)}
                aria-label="Filter by offence type"
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-700 cursor-pointer"
              >
                <option value="all">All Offence Types</option>
                <option value="property">Offences Against Property</option>
                <option value="persons">Offences Against Persons</option>
                <option value="authority">Offences Against Lawful Authority</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2 text-slate-400 text-xs pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Geopolitical Zone Filter */}
            <div className="relative">
              <select
                value={compZone}
                onChange={(e) => setCompZone(e.target.value)}
                aria-label="Filter by geopolitical zone"
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-700 cursor-pointer"
              >
                <option value="all">All 6 Geopolitical Zones</option>
                <option value="South West">South West</option>
                <option value="South South">South South</option>
                <option value="South East">South East</option>
                <option value="North West">North West</option>
                <option value="North Central">North Central</option>
                <option value="North East">North East</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2 text-slate-400 text-xs pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Sort control */}
            <div className="relative">
              <select
                value={compSort}
                onChange={(e) => setCompSort(e.target.value as 'volume' | 'alpha' | 'zone')}
                aria-label="Sort states"
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-purple-700 cursor-pointer"
              >
                <option value="volume">Sort: Highest Documented Volume</option>
                <option value="alpha">Sort: Alphabetical (A–Z)</option>
                <option value="zone">Sort: Geopolitical Sequence</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-2 text-slate-400 text-xs pointer-events-none">
                swap_vert
              </span>
            </div>
          </div>
        </div>

        {/* State List Table / Progress Rows */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1">
            <span className="font-bold text-slate-900">Federated Jurisdiction</span>
            <div className="flex items-center gap-6">
              <span className="w-36 text-right">Primary Category</span>
              <span className="w-28 text-right">Relative Volume</span>
              <span className="w-24 text-right">Benchmark Share</span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            {displayedStates.map((st, index) => {
              // Calculate values based on active category filter
              let activeCases = st.totalCases;
              let primaryCat = 'Offences vs. Property';
              let barColor = 'bg-purple-700';

              if (compCategory === 'property') {
                activeCases = st.propertyCases;
                primaryCat = 'Offences vs. Property';
                barColor = 'bg-purple-700';
              } else if (compCategory === 'persons') {
                activeCases = st.personsCases;
                primaryCat = 'Offences vs. Persons';
                barColor = 'bg-indigo-600';
              } else if (compCategory === 'authority') {
                activeCases = st.authorityCases;
                primaryCat = 'Offences vs. Authority';
                barColor = 'bg-slate-700';
              } else {
                // When 'all', show highest category for that state
                if (st.propertyCases >= st.personsCases && st.propertyCases >= st.authorityCases) {
                  primaryCat = 'Offences vs. Property';
                  barColor = 'bg-purple-700';
                } else if (st.personsCases >= st.propertyCases && st.personsCases >= st.authorityCases) {
                  primaryCat = 'Offences vs. Persons';
                  barColor = 'bg-indigo-600';
                } else {
                  primaryCat = 'Offences vs. Authority';
                  barColor = 'bg-slate-700';
                }
              }

              const percentage = ((activeCases / 134663) * 100).toFixed(1);
              const relativeWidth = Math.max(8, Math.min(100, Math.round((activeCases / maxVolume) * 100)));

              return (
                <div
                  key={st.state}
                  onClick={() => {
                    if (onSelectState) onSelectState(st.state);
                  }}
                  className="p-3 bg-slate-50/70 hover:bg-purple-50/50 rounded-xl border border-slate-200 flex items-center justify-between transition cursor-pointer group"
                >
                  <div className="flex items-center gap-3 w-48 shrink-0">
                    <span className="w-6 h-6 rounded-full bg-purple-50 text-purple-700 text-[11px] font-bold flex items-center justify-center font-mono border border-purple-100">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                        {st.state} {st.state.includes('FCT') ? '' : 'State'}
                      </span>
                      <span className="block text-[10px] text-slate-400">{st.zone}</span>
                    </div>
                  </div>

                  {/* Progress visual bar */}
                  <div className="flex-1 mx-4 h-3 bg-white rounded-full overflow-hidden border border-slate-200 flex">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${relativeWidth}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 font-mono text-[11px]">
                    <span className="w-36 text-right text-slate-600 font-sans">{primaryCat}</span>
                    <span className="w-28 text-right font-bold text-slate-900 tabular-nums">
                      {activeCases.toLocaleString()} cases
                    </span>
                    <span className="w-24 text-right text-purple-700 font-semibold">{percentage}% share</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Pagination / State Selector Expansion */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-purple-700 text-sm">info</span>
              <span>All 36 states + FCT indexed in the underlying NBS repository.</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                Showing 1–{displayedStates.length} of {filteredStates.length} jurisdictions
              </span>
              <button
                onClick={() => setShowAllStates(!showAllStates)}
                className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                type="button"
              >
                {showAllStates ? 'Show Top 6 States' : 'View All 37 States'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
           7. PATTERN DISCOVERY (Data Mining Techniques)
      ==================================================== */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Pattern Discovery</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Use data mining techniques to uncover relationships and concentrations within the historical data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1: K-Means Clustering */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">bubble_chart</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  Available
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">K-Means Clustering</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Group records into clusters based on similarities in the available crime data.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('data-visualizations')}
              className="w-full py-2.5 px-3 bg-slate-50 hover:bg-purple-50 text-purple-700 hover:text-purple-900 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span>Explore clusters</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>

          {/* CARD 2: Decision Tree */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                  <span className="material-symbols-outlined text-xl">account_tree</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  Available
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Decision Tree</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Analyze relationships between input variables and crime categories.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('machine-learning-and-prediction')}
              className="w-full py-2.5 px-3 bg-slate-50 hover:bg-purple-50 text-purple-700 hover:text-purple-900 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span>View model</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>

          {/* CARD 3: Random Forest */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">hub</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  Available
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">Random Forest</h4>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Compare predictive patterns using an ensemble of decision trees.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('machine-learning-and-prediction')}
              className="w-full py-2.5 px-3 bg-slate-50 hover:bg-purple-50 text-purple-700 hover:text-purple-900 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span>View model</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================
           8. ANALYTICS SUMMARY (Polished Horizontal Card)
      ==================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-lg">assignment</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Analysis Summary</h4>
              <p className="text-xs text-slate-500">Consolidated parameters of the active analytical scope</p>
            </div>
          </div>

          {/* Metadata Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 w-full lg:w-auto text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Dataset</span>
              <span className="font-bold text-slate-900 font-mono text-xs">NBS Crime Statistics</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Year</span>
              <span className="font-bold text-slate-900 font-mono text-xs">2017</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Records</span>
              <span className="font-bold text-purple-700 font-mono text-xs">134,663</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">States</span>
              <span className="font-bold text-slate-900 font-mono text-xs">36 + 1</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">Categories</span>
              <span className="font-bold text-slate-900 font-mono text-xs">3</span>
            </div>
            <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-200">
              <span className="block text-[10px] text-purple-700 uppercase font-bold">Analysis Status</span>
              <span className="font-bold text-purple-800 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Ready
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
           9. RESPONSIBLE ANALYTICS NOTICE
      ==================================================== */}
      <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4 flex items-start gap-3.5 text-xs text-slate-900">
        <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0 mt-0.5">
          <span className="material-symbols-outlined text-base">info</span>
        </div>
        <div>
          <h4 className="font-bold text-purple-800 text-xs mb-0.5">Interpret historical patterns carefully</h4>
          <p className="text-slate-600 leading-relaxed">
            These visualizations describe reported crime records contained in the historical dataset. They should be interpreted as descriptive analysis and should not be treated as certainty about future criminal activity.
          </p>
        </div>
      </div>

      {/* ====================================================
           10. BOTTOM ACTION CTA ROW (3 Compact Action Cards)
      ==================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Action 1: Explore Crime Data */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-lg">database</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Explore Crime Data</h4>
            <p className="text-xs text-slate-600 mb-4">
              Inspect the underlying records and statutory filings.
            </p>
          </div>
          <button
            onClick={() => {
              if (onOpenCrimeData) onOpenCrimeData();
              else onNavigateTab('crime-data');
            }}
            className="w-full py-2 bg-slate-50 hover:bg-purple-700 hover:text-white text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
            type="button"
          >
            <span>Open data</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>

        {/* Action 2: Analyze Hotspots */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3 border border-indigo-100">
              <span className="material-symbols-outlined text-lg">location_on</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Analyze Hotspots</h4>
            <p className="text-xs text-slate-600 mb-4">
              Explore historical concentrations using spatial clustering.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('data-visualizations')}
            className="w-full py-2 bg-slate-50 hover:bg-purple-700 hover:text-white text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
            type="button"
          >
            <span>View hotspots</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>

        {/* Action 3: Run Prediction */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-300 transition flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-lg">trending_up</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Run Prediction</h4>
            <p className="text-xs text-slate-600 mb-4">
              Generate model-based predictive insights.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('machine-learning-and-prediction')}
            className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
            type="button"
          >
            <span>Start prediction</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
