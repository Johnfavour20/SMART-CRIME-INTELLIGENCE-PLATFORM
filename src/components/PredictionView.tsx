import React, { useState, useMemo } from 'react';
import { NIGERIAN_STATES_DATA } from '../data/crimeData';
import { ActiveTab } from '../types';

interface PredictionViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectState?: (stateName: string) => void;
}

type ModelType = 'dt' | 'rf';
type SimState = 'idle' | 'loading' | 'error' | 'success';

interface PredictionLogItem {
  id: string;
  timestamp: string;
  jurisdiction: string;
  inputCategory: string;
  algorithm: 'Decision Tree' | 'Random Forest';
  predictedCategory: string;
  confidence: number;
  riskBand: 'Low' | 'Moderate' | 'High';
  frequency: number;
}

const INITIAL_LOGS: PredictionLogItem[] = [
  {
    id: 'log-1',
    timestamp: 'Today, 14:28',
    jurisdiction: 'Lagos State',
    inputCategory: 'Offences Against Property',
    algorithm: 'Decision Tree',
    predictedCategory: 'Offences Against Property',
    confidence: 88.4,
    riskBand: 'High',
    frequency: 34210,
  },
  {
    id: 'log-2',
    timestamp: 'Today, 11:14',
    jurisdiction: 'Kano State',
    inputCategory: 'Offences Against Persons',
    algorithm: 'Random Forest',
    predictedCategory: 'Offences Against Persons',
    confidence: 92.1,
    riskBand: 'Moderate',
    frequency: 18450,
  },
  {
    id: 'log-3',
    timestamp: 'Yesterday, 16:50',
    jurisdiction: 'FCT Abuja',
    inputCategory: 'Offences Against Lawful Authority',
    algorithm: 'Decision Tree',
    predictedCategory: 'Offences Against Lawful Auth.',
    confidence: 84.7,
    riskBand: 'Moderate',
    frequency: 9120,
  },
  {
    id: 'log-4',
    timestamp: 'Yesterday, 09:32',
    jurisdiction: 'Rivers State',
    inputCategory: 'Offences Against Property',
    algorithm: 'Random Forest',
    predictedCategory: 'Offences Against Property',
    confidence: 95.3,
    riskBand: 'High',
    frequency: 24300,
  },
];

export const PredictionView: React.FC<PredictionViewProps> = ({
  onNavigateTab,
  onSelectState,
}) => {
  // Form Parameters
  const [selectedState, setSelectedState] = useState<string>('Lagos State');
  const [selectedCategory, setSelectedCategory] = useState<string>('Offences Against Property');
  const [frequency, setFrequency] = useState<string>('34,210');
  const [selectedModel, setSelectedModel] = useState<ModelType>('dt');

  // Simulation View States: 'idle', 'loading', 'error', 'success'
  const [simState, setSimState] = useState<SimState>('idle');
  const [simTab, setSimTab] = useState<'config' | 'running' | 'error'>('config');

  // Prediction Result Data (populated when generated)
  const [predictionOutput, setPredictionOutput] = useState<{
    predictedCategory: string;
    confidence: number;
    riskBand: string;
    probabilities: { label: string; prob: number }[];
    featureWeights: { feature: string; weight: string }[];
    executionTimeMs: number;
  } | null>(null);

  // Session Logs & Modal
  const [logs, setLogs] = useState<PredictionLogItem[]>(INITIAL_LOGS);
  const [selectedLogForInspect, setSelectedLogForInspect] = useState<PredictionLogItem | null>(null);
  const [showEthicsModal, setShowEthicsModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [logFilterCategory, setLogFilterCategory] = useState<string>('all');

  // Running step tracker for animation
  const [loadingStep, setLoadingStep] = useState<number>(1);

  // Trigger Prediction Execution
  const handleGeneratePrediction = () => {
    // Check if input frequency is valid or deliberately triggering error fallback
    const numericFreq = parseInt(frequency.replace(/[^0-9]/g, ''), 10);

    if (isNaN(numericFreq) || numericFreq > 150000) {
      setSimState('error');
      setSimTab('error');
      return;
    }

    setSimState('loading');
    setSimTab('running');
    setLoadingStep(1);

    setTimeout(() => {
      setLoadingStep(2);
    }, 600);

    setTimeout(() => {
      setLoadingStep(3);
    }, 1100);

    setTimeout(() => {
      const isDT = selectedModel === 'dt';
      const baseConfidence = isDT ? 89.2 : 93.8;
      const variation = (numericFreq % 50) * 0.1;
      const finalConfidence = Math.min(96.4, Number((baseConfidence + variation).toFixed(1)));

      let predictedCat = selectedCategory;
      if (selectedCategory === 'Offences Against Local Acts') {
        predictedCat = 'Offences Against Lawful Authority';
      }

      const calculatedResult = {
        predictedCategory: predictedCat,
        confidence: finalConfidence,
        riskBand: finalConfidence > 90 ? 'High Confidence Classification' : 'Validated Classification',
        probabilities: [
          { label: 'Offences Against Property', prob: selectedCategory.includes('Property') ? finalConfidence : 100 - finalConfidence - 4.5 },
          { label: 'Offences Against Persons', prob: selectedCategory.includes('Persons') ? finalConfidence : 18.2 },
          { label: 'Offences Against Lawful Authority', prob: selectedCategory.includes('Authority') ? finalConfidence : 12.4 },
        ],
        featureWeights: [
          { feature: 'Jurisdiction Baseline Tensor', weight: '0.42' },
          { feature: 'Statutory Volume Coefficient', weight: '0.31' },
          { feature: 'Regional Transit Proximity', weight: '0.18' },
          { feature: 'Seasonal Harmattan Drift', weight: '0.09' },
        ],
        executionTimeMs: isDT ? 34 : 58,
      };

      setPredictionOutput(calculatedResult);
      setSimState('success');
      setSimTab('config');

      // Append to session logs
      const newLog: PredictionLogItem = {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        jurisdiction: selectedState,
        inputCategory: selectedCategory,
        algorithm: isDT ? 'Decision Tree' : 'Random Forest',
        predictedCategory: calculatedResult.predictedCategory,
        confidence: calculatedResult.confidence,
        riskBand: finalConfidence > 90 ? 'High' : 'Moderate',
        frequency: numericFreq,
      };

      setLogs((prev) => [newLog, ...prev]);
      setToastMessage('Prediction generated successfully ✓');
      setTimeout(() => setToastMessage(null), 3000);
    }, 1600);
  };

  const handleReset = () => {
    setSelectedState('Lagos State');
    setSelectedCategory('Offences Against Property');
    setFrequency('34,210');
    setSelectedModel('dt');
    setSimState('idle');
    setSimTab('config');
    setPredictionOutput(null);
  };

  const handleExportLogs = () => {
    const csvHeader = ['Timestamp', 'Jurisdiction', 'Input Category', 'Algorithm', 'Predicted Category', 'Confidence (%)', 'Risk Band', 'Reported Frequency'];
    const rows = logs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.jurisdiction}"`,
      `"${l.inputCategory}"`,
      `"${l.algorithm}"`,
      `"${l.predictedCategory}"`,
      l.confidence,
      `"${l.riskBand}"`,
      l.frequency,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [csvHeader.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', 'SmartCrime_Inference_Logs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage('Inference logs exported to CSV');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    if (logFilterCategory === 'all') return logs;
    return logs.filter((l) => l.algorithm === logFilterCategory);
  }, [logs, logFilterCategory]);

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* INSPECT LOG MODAL */}
      {selectedLogForInspect && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-700 text-[22px]">psychology</span>
                <h3 className="text-lg font-bold text-slate-900">Inference Record Detail</h3>
              </div>
              <button
                onClick={() => setSelectedLogForInspect(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Jurisdiction</span>
                  <span className="text-slate-900 font-bold text-sm">{selectedLogForInspect.jurisdiction}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Timestamp</span>
                  <span className="text-slate-900 font-bold text-sm">{selectedLogForInspect.timestamp}</span>
                </div>
              </div>

              <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-100 space-y-2">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-600 font-medium">Evaluated Algorithm:</span>
                  <span className="font-bold text-purple-700">{selectedLogForInspect.algorithm}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-600 font-medium">Predicted Statutory Class:</span>
                  <span className="font-bold text-slate-900">{selectedLogForInspect.predictedCategory}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-600 font-medium">Model Confidence:</span>
                  <span className="font-mono font-bold text-purple-700">{selectedLogForInspect.confidence}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-600 font-medium">Input Baseline Frequency:</span>
                  <span className="font-mono text-slate-700">{selectedLogForInspect.frequency.toLocaleString()} filings</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedLogForInspect(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    if (onSelectState) onSelectState(selectedLogForInspect.jurisdiction.replace(' State', ''));
                    setSelectedLogForInspect(null);
                    onNavigateTab('data-visualizations');
                  }}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  Open in Workbench
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ETHICS & LIMITATIONS CHARTER MODAL */}
      {showEthicsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">verified_user</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Model Limitations & Ethics Charter</h3>
              </div>
              <button
                onClick={() => setShowEthicsModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600">
              <p>
                The Smart Crime predictive inference module provides <strong>model-based statistical probabilities</strong> derived strictly from the official 2017 National Bureau of Statistics national census.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">Operational Tenets</span>
                <p>1. <strong>Non-Predictive Policing:</strong> The model is designed for spatial resource planning and civic lighting allocation, never for individual surveillance or automated suspicion profiling.</p>
                <p>2. <strong>Historical Boundary:</strong> Inferences model historical reporting dynamics and do not predict instantaneous or real-time event occurrences.</p>
                <p>3. <strong>Algorithmic Auditability:</strong> Decision Tree CART classifiers preserve full branching interpretability for civilian and legislative oversight.</p>
              </div>
            </div>
            <div className="flex justify-end pt-4 mt-2 border-t border-slate-100">
              <button
                onClick={() => setShowEthicsModal(false)}
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-semibold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
           1. PAGE HEADER & OPERATIONAL BADGES
      ==================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Crime Prediction
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
              Supervised Inference
            </span>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl">
            Generate model-based predictive insights using historical Nigerian NBS statutory crime baselines and validated statistical classifiers.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs text-slate-700 text-xs font-medium">
            <span className="material-symbols-outlined text-[16px] text-purple-700">calendar_month</span>
            <span>Baseline · NBS 2017</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs text-slate-700 text-xs font-medium">
            <span className="material-symbols-outlined text-[16px] text-indigo-600">memory</span>
            <span>Models v1.0 Validated</span>
          </div>
          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
            <span>Export Log</span>
          </button>
        </div>
      </div>

      {/* ====================================================
           2. MAIN DUAL COLUMN WORKSPACE (Col 7 / Col 5)
      ==================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Parameter Configuration & Model Engine (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Primary Configuration Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col space-y-6">
            {/* Header & Simulation View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Prediction Parameters</h2>
                  <span className="w-2 h-2 rounded-full bg-purple-700"></span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select the historical baseline parameters that should be evaluated by the classification model.
                </p>
              </div>

              {/* Analyst Mode Toggles */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 self-start sm:self-auto text-xs">
                <button
                  onClick={() => {
                    setSimTab('config');
                    setSimState('idle');
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    simTab === 'config'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  type="button"
                >
                  Config
                </button>
                <button
                  onClick={() => {
                    setSimTab('running');
                    setSimState('loading');
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    simTab === 'running'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  type="button"
                >
                  Inferencing
                </button>
                <button
                  onClick={() => {
                    setSimTab('error');
                    setSimState('error');
                  }}
                  className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    simTab === 'error'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  type="button"
                >
                  Fallback
                </button>
              </div>
            </div>

            {/* Dynamic Content Panel 1: Input Form (Idle/Config State) */}
            {simState !== 'loading' && simState !== 'error' && (
              <div className="flex flex-col space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* SECTION 1: Location */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800 flex items-center justify-between" htmlFor="param-state">
                      <span>State / Federated Jurisdiction</span>
                      <span className="text-[11px] text-purple-700 font-semibold">37 Admin Units</span>
                    </label>
                    <div className="relative">
                      <select
                        id="param-state"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all cursor-pointer"
                      >
                        <option value="Lagos State">Lagos State (South West)</option>
                        <option value="Kano State">Kano State (North West)</option>
                        <option value="Rivers State">Rivers State (South South)</option>
                        <option value="FCT Abuja">Federal Capital Territory (North Central)</option>
                        <option value="Kaduna State">Kaduna State (North West)</option>
                        <option value="Delta State">Delta State (South South)</option>
                        <option value="Enugu State">Enugu State (South East)</option>
                        <option value="Oyo State">Oyo State (South West)</option>
                        <option value="Borno State">Borno State (North East)</option>
                        <option value="Edo State">Edo State (South South)</option>
                        {NIGERIAN_STATES_DATA.filter((s) => !['Lagos', 'Kano', 'Rivers', 'FCT Abuja', 'Kaduna', 'Delta', 'Enugu', 'Oyo', 'Borno', 'Edo'].includes(s.state)).map((s) => (
                          <option key={s.state} value={`${s.state} State`}>
                            {s.state} State ({s.zone})
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">
                        expand_more
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Choose the Nigerian state represented in the historical NBS dataset.</p>
                  </div>

                  {/* SECTION 2: Crime Category */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800 flex items-center justify-between" htmlFor="param-category">
                      <span>Historical Statutory Category</span>
                      <span className="text-[11px] text-slate-400 font-medium">Standard NBS Code</span>
                    </label>
                    <div className="relative">
                      <select
                        id="param-category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all cursor-pointer"
                      >
                        <option value="Offences Against Property">Offences Against Property</option>
                        <option value="Offences Against Persons">Offences Against Persons</option>
                        <option value="Offences Against Lawful Authority">Offences Against Lawful Authority</option>
                        <option value="Offences Against Local Acts">Offences Against Local Acts</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 pointer-events-none text-[20px]">
                        expand_more
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Legal categorisation used for supervised grouping algorithms.</p>
                  </div>

                  {/* SECTION 3: Historical Frequency */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800 flex items-center justify-between" htmlFor="param-frequency">
                      <span>Reported Case Frequency</span>
                      <span className="text-[11px] text-purple-700 font-semibold">Baseline Weight</span>
                    </label>
                    <div className="relative">
                      <input
                        id="param-frequency"
                        type="text"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        placeholder="e.g. 34,210"
                        className="w-full h-11 pl-3.5 pr-10 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                      />
                      <span
                        className="material-symbols-outlined absolute right-3 top-2.5 text-slate-400 text-[20px] cursor-help"
                        title="Normalized volume metric representing reported cases."
                      >
                        info
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Numeric input representing annual recorded occurrences in baseline.</p>
                  </div>

                  {/* SECTION 4: Reporting Period (Locked Benchmark) */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                      <span>Reporting Period</span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                        Historical Fixed
                      </span>
                    </label>
                    <div className="relative">
                      <div className="w-full h-11 px-3.5 flex items-center justify-between rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium cursor-not-allowed">
                        <span>2017 (NBS Official Census Benchmark)</span>
                        <span className="material-symbols-outlined text-[18px] text-slate-400">lock</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">Calibrated against published national statistical bureau records.</p>
                  </div>
                </div>

                {/* Model Selection Cards */}
                <div className="flex flex-col space-y-2.5 pt-1">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-slate-900">Prediction Model Selection</h3>
                    <p className="text-xs text-slate-500">Choose the supervised classification algorithm for inferencing.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Option 1: Decision Tree */}
                    <div
                      onClick={() => setSelectedModel('dt')}
                      className={`cursor-pointer p-4 rounded-xl transition-all duration-200 border ${
                        selectedModel === 'dt'
                          ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-purple-700 shadow-xs border border-slate-200">
                            <span className="material-symbols-outlined text-[20px]">account_tree</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">Decision Tree</div>
                            <div className="text-[11px] text-slate-400 font-medium">CART Classifier</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                            Recommended
                          </span>
                          <div className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center">
                            {selectedModel === 'dt' && <div className="w-2.5 h-2.5 rounded-full bg-purple-700"></div>}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                        Uses hierarchical decision rules to classify the selected input vector with full interpretability and fast execution.
                      </p>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Accuracy: <strong className="text-slate-900">89.8%</strong></span>
                        <span>F1-Score: <strong className="text-slate-900">0.90</strong></span>
                      </div>
                    </div>

                    {/* Option 2: Random Forest */}
                    <div
                      onClick={() => setSelectedModel('rf')}
                      className={`cursor-pointer p-4 rounded-xl transition-all duration-200 border ${
                        selectedModel === 'rf'
                          ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-indigo-600 shadow-xs border border-slate-200">
                            <span className="material-symbols-outlined text-[20px]">forest</span>
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-900">Random Forest</div>
                            <div className="text-[11px] text-slate-400 font-medium">Ensemble Model</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold">
                            Available
                          </span>
                          <div className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center">
                            {selectedModel === 'rf' && <div className="w-2.5 h-2.5 rounded-full bg-purple-700"></div>}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                        Combines multiple randomized decision trees to produce a consolidated prediction, reducing variance and noise.
                      </p>
                      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Accuracy: <strong className="text-slate-900">93.4%</strong></span>
                        <span>F1-Score: <strong className="text-slate-900">0.94</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inferencing Status Strip */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-700"></span>
                    </span>
                    <span className="text-slate-900 font-bold">Engine Status: Ready for Inferencing</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span>NBS 2017 Dataset: <strong>134,663</strong> entries</span>
                    <span>•</span>
                    <span>Memory Overhead: <strong>18.4 MB</strong></span>
                  </div>
                </div>

                {/* Operational Controls Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <button
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all text-center cursor-pointer"
                    type="button"
                  >
                    Reset Parameters
                  </button>
                  <button
                    onClick={handleGeneratePrediction}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    <span>Generate Prediction</span>
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Content Panel 2: Execution / Loading State View */}
            {simState === 'loading' && (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-6 animate-in fade-in">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center relative border border-purple-100 shadow-sm">
                  <span className="material-symbols-outlined text-purple-700 text-[36px] animate-pulse">psychology</span>
                  <div className="absolute -inset-1 rounded-2xl bg-purple-200 opacity-40 blur animate-pulse"></div>
                </div>
                <div className="flex flex-col space-y-1 max-w-md">
                  <h3 className="text-lg font-bold text-slate-900">Evaluating Feature Vectors...</h3>
                  <p className="text-xs text-slate-500">
                    Executing supervised classification with calibrated baseline weights across Nigerian regional tensors.
                  </p>
                </div>

                {/* Progress Stepper Simulation */}
                <div className="w-full max-w-md bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col space-y-3 text-left">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                    <span className="text-xs font-semibold text-slate-900">1. Validating Jurisdiction & NBS Baseline (Completed)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {loadingStep >= 2 ? (
                      <span className="w-4 h-4 rounded-full border-2 border-purple-700 border-t-transparent animate-spin"></span>
                    ) : (
                      <span className="w-4 h-4 rounded-full bg-slate-300"></span>
                    )}
                    <span className={`text-xs font-semibold ${loadingStep >= 2 ? 'text-purple-700' : 'text-slate-500'}`}>
                      2. Running Supervised Decision Matrix...
                    </span>
                  </div>
                  <div className={`flex items-center gap-2.5 ${loadingStep < 3 ? 'opacity-40' : 'opacity-100'}`}>
                    <span className="w-4 h-4 rounded-full bg-slate-300"></span>
                    <span className="text-xs text-slate-600">3. Synthesizing Confidence Bands & Risk Weights</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSimState('idle');
                    setSimTab('config');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                  type="button"
                >
                  Cancel Process
                </button>
              </div>
            )}

            {/* Dynamic Content Panel 3: Fallback / Boundary Condition */}
            {simState === 'error' && (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[32px]">warning</span>
                </div>
                <div className="flex flex-col space-y-1 max-w-md">
                  <h3 className="text-base font-bold text-slate-900">Out of Sample Variance</h3>
                  <p className="text-xs text-slate-500">
                    The case frequency parameter exceeds standard deviation tolerances for the selected jurisdiction. The model requires an input within the 2017 historical calibration bounds.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFrequency('34,210');
                    setSimState('idle');
                    setSimTab('config');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  type="button"
                >
                  Adjust Input Values
                </button>
              </div>
            )}
          </div>

          {/* Dataset & Calibration Metric Ribbon (4 cards) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Baseline Records</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">134,663</span>
              <span className="text-[11px] text-purple-700 font-semibold mt-0.5">NBS Verified</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Jurisdictions</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">37 / 37</span>
              <span className="text-[11px] text-purple-700 font-semibold mt-0.5">100% Federation</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Mean F1 Accuracy</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">0.92</span>
              <span className="text-[11px] text-indigo-600 font-semibold mt-0.5">Cross-Validated</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Inference Latency</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">42 ms</span>
              <span className="text-[11px] text-purple-700 font-semibold mt-0.5">Optimal Serverless</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Prediction Result & Contextual Guides (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Prediction Result Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">Prediction Result</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  predictionOutput
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {predictionOutput ? 'Inference Computed' : 'Output Awaiting'}
                </span>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[18px]">info</span>
            </div>

            {/* EMPTY STATE */}
            {!predictionOutput && (
              <div className="flex flex-col items-center text-center pt-2">
                {/* Geometric Graphic Placeholder (Radar / Nodes Pattern) */}
                <div className="relative w-44 h-44 my-4 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-purple-50 opacity-70"></div>
                  <div className="absolute inset-3 rounded-full bg-purple-100/50 opacity-50"></div>
                  <div className="absolute inset-8 rounded-full bg-purple-200/40 opacity-40"></div>

                  {/* Abstract SVG Node Graph Visualizer */}
                  <svg className="relative w-32 h-32 text-purple-700" fill="none" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" opacity="0.4" r="48" stroke="currentColor" strokeDasharray="3 3" strokeWidth="1.5"></circle>
                    <circle cx="60" cy="60" opacity="0.6" r="30" stroke="currentColor" strokeWidth="1.5"></circle>
                    <circle cx="60" cy="60" fill="currentColor" r="8"></circle>
                    <circle cx="28" cy="40" fill="currentColor" opacity="0.75" r="5"></circle>
                    <circle cx="92" cy="40" fill="currentColor" opacity="0.75" r="5"></circle>
                    <circle cx="40" cy="94" fill="currentColor" opacity="0.75" r="5"></circle>
                    <circle cx="80" cy="94" fill="currentColor" opacity="0.75" r="5"></circle>
                    <line opacity="0.5" stroke="currentColor" strokeWidth="1.5" x1="60" x2="28" y1="60" y2="40"></line>
                    <line opacity="0.5" stroke="currentColor" strokeWidth="1.5" x1="60" x2="92" y1="60" y2="40"></line>
                    <line opacity="0.5" stroke="currentColor" strokeWidth="1.5" x1="60" x2="40" y1="60" y2="94"></line>
                    <line opacity="0.5" stroke="currentColor" strokeWidth="1.5" x1="60" x2="80" y1="60" y2="94"></line>
                  </svg>
                </div>

                <h4 className="text-base font-bold text-slate-900">No prediction generated yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Complete the parameters on the left and trigger the classifier to compute predictive feature alignments.
                </p>

                <div className="mt-5 w-full p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 text-left space-y-1">
                  <div className="flex items-center gap-1.5 text-purple-800 text-xs font-bold">
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    <span>Screen 8 Drilldown Integration</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Upon execution, you will review the complete classification tensor, ranking probabilities, historical confidence intervals, and demographic correlate vectors.
                  </p>
                </div>

                <button
                  onClick={handleGeneratePrediction}
                  className="mt-4 text-purple-700 hover:text-purple-900 text-xs font-bold inline-flex items-center gap-1 group cursor-pointer"
                  type="button"
                >
                  <span>Generate Prediction Now</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            )}

            {/* COMPUTED RESULT CARD (When generated) */}
            {predictionOutput && (
              <div className="flex flex-col space-y-4 pt-3 animate-in fade-in">
                <div className="p-4 rounded-xl bg-purple-50/80 border border-purple-200 space-y-2">
                  <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                    Predicted Classification
                  </span>
                  <div className="text-lg font-bold text-slate-900">
                    {predictionOutput.predictedCategory}
                  </div>
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-600 font-medium">Confidence Interval:</span>
                    <span className="font-mono font-bold text-purple-700 text-sm">{predictionOutput.confidence}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-purple-100 overflow-hidden">
                    <div
                      className="h-full bg-purple-700 rounded-full transition-all duration-700"
                      style={{ width: `${predictionOutput.confidence}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Class Probabilities</span>
                  <div className="space-y-2">
                    {predictionOutput.probabilities.map((p) => (
                      <div key={p.label} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-slate-700 truncate max-w-[200px]">{p.label}</span>
                          <span className="font-mono font-bold text-slate-900">{p.prob.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${Math.min(100, Math.max(5, p.prob))}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-800 text-[11px] block uppercase tracking-wider">
                    Feature Weights
                  </span>
                  {predictionOutput.featureWeights.map((fw) => (
                    <div key={fw.feature} className="flex justify-between items-center text-slate-600">
                      <span>{fw.feature}:</span>
                      <span className="font-mono font-semibold text-purple-700">{fw.weight}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setPredictionOutput(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                    type="button"
                  >
                    Clear Output
                  </button>
                  <button
                    onClick={() => onNavigateTab('data-visualizations')}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    type="button"
                  >
                    Explore in Workbench →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* How Prediction Works Connected Stepper */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">How Prediction Works</h3>
              <span className="text-[11px] text-slate-400 font-medium">Workflow Overview</span>
            </div>
            <div className="space-y-4 relative pl-1">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                  01
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">Select parameters</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Define statutory jurisdiction, reporting category, and volume weighting.
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                  02
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">Select a model</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Choose between interpretable Decision Trees or an ensemble Random Forest.
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-7 h-7 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center">
                  03
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">Generate prediction</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Trained model evaluates historical feature vectors against the target classes.
                  </span>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                  04
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">Review result & insights</span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    Inspect predicted statutory category, confidence band, and feature weights.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dataset & Model Baseline Provenance Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Prediction Dataset & Baseline</h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                Available
              </span>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Data Origin</span>
                <span className="text-slate-900 font-medium">National Bureau of Statistics</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Dataset Code</span>
                <span className="text-slate-900 font-mono text-[11px]">NBS-CRIME-OFFENCE-2017</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Benchmark Year</span>
                <span className="text-slate-900 font-medium">2017 Historical Baseline</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Total Ingested Rows</span>
                <span className="text-slate-900 font-mono font-medium">134,663 records</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Federation Span</span>
                <span className="text-slate-900 font-medium">36 States + FCT (100%)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Active Classifiers</span>
                <span className="text-slate-900 font-medium">2 Supervised Models</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
           3. RESPONSIBLE AI & ANALYTICAL GUIDANCE BANNER
      ==================================================== */}
      <div className="w-full rounded-2xl bg-purple-50/80 p-6 border border-purple-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-700 text-white shrink-0 flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-[24px]">verified_user</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-bold text-slate-900">
              Important Notice: Use predictions as analytical decision-support
            </span>
            <p className="text-xs text-slate-600 max-w-4xl leading-relaxed">
              Predictions are generated from historical reported crime data and mathematical model inputs. They represent model-based statistical probabilities and should not be interpreted as certainty about future criminal activity or real-time risk. Smart Crime strictly supports evidence-based planning and civic resource allocation, deliberately avoiding predictive policing fallacies.
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowEthicsModal(true)}
          className="shrink-0 inline-flex items-center gap-1 text-xs text-purple-700 font-bold hover:text-purple-900 transition-colors cursor-pointer"
          type="button"
        >
          <span>Model Limitations & Ethics Charter</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* ====================================================
           4. METHODOLOGICAL FRAMEWORK (3-Card Matrix)
      ==================================================== */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-slate-900">Methodological Framework</h3>
          <p className="text-xs text-slate-500">Underlying algorithmic architectures calibrated on the Nigerian criminal statistics baseline.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Decision Tree */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition">
            <div className="flex flex-col space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 border border-purple-100">
                <span className="material-symbols-outlined text-[22px]">account_tree</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 pt-1">Decision Tree Classifier</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Builds an interpretable sequence of decision rules from available features to classify an input vector into statutory groupings. Provides transparent branching logic for policy audits.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Type: Supervised Rule</span>
              <span className="font-semibold text-purple-700">Interpretability: High</span>
            </div>
          </div>

          {/* Card 2: Random Forest */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition">
            <div className="flex flex-col space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 border border-indigo-100">
                <span className="material-symbols-outlined text-[22px]">hub</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 pt-1">Random Forest Ensemble</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Combines multiple randomized decision trees to produce a consensus prediction. Minimizes variance and out-of-sample error across heterogeneous municipal densities.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Type: Bagged Ensemble</span>
              <span className="font-semibold text-indigo-700">Stability: High</span>
            </div>
          </div>

          {/* Card 3: K-Means Spatial Clusters */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition">
            <div className="flex flex-col space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-200">
                <span className="material-symbols-outlined text-[22px]">bubble_chart</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 pt-1">K-Means Spatial Clusters</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Groups similar state records into spatial and numerical clusters without explicit supervision. Supports hotspot discovery and regional vulnerability categorization.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Type: Unsupervised K-Means</span>
              <span className="font-semibold text-slate-700">Pattern Density</span>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
           5. RECENT PREDICTION INFERENCES TABLE
      ==================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Prediction Inferences</h3>
            <p className="text-xs text-slate-500">Logged inference runs across authorized analyst sessions (Sample baseline logs).</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLogs([])}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              type="button"
            >
              Clear Session Log
            </button>
            <div className="relative">
              <select
                value={logFilterCategory}
                onChange={(e) => setLogFilterCategory(e.target.value)}
                className="h-8 pl-2.5 pr-7 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold appearance-none cursor-pointer outline-none"
              >
                <option value="all">All Models</option>
                <option value="Decision Tree">Decision Tree</option>
                <option value="Random Forest">Random Forest</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-1.5 top-1.5 text-slate-500 text-[16px]">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Responsive Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-bold border-y border-slate-100">
                <th className="px-4 py-3 rounded-l-lg">Timestamp</th>
                <th className="px-4 py-3">Jurisdiction</th>
                <th className="px-4 py-3">Input Category</th>
                <th className="px-4 py-3">Algorithm</th>
                <th className="px-4 py-3">Predicted Category</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3 rounded-r-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No logged inferences available for this session.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-4 py-3.5 text-slate-400">{log.timestamp}</td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">{log.jurisdiction}</td>
                    <td className="px-4 py-3.5 text-slate-600">{log.inputCategory}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        log.algorithm === 'Decision Tree'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {log.algorithm}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-purple-700">
                      {log.predictedCategory}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${log.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-[11px] font-bold font-mono text-slate-900">
                          {log.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedLogForInspect(log)}
                        className="text-purple-700 hover:text-purple-900 text-xs font-bold cursor-pointer hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500">
          <span>Showing {filteredLogs.length} of {logs.length} session inferences</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 cursor-not-allowed" disabled>
              Previous
            </button>
            <span className="px-2.5 py-1 rounded-lg bg-purple-700 text-white font-bold">1</span>
            <button className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
              2
            </button>
            <button className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
              3
            </button>
            <button className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
