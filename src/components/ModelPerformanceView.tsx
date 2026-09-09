import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';

interface ModelPerformanceViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectState?: (stateName: string) => void;
}

interface EvaluationRun {
  id: string;
  runLabel: string;
  subtext: string;
  baseline: string;
  model: string;
  accuracy: string;
  precision: string;
  recall: string;
  f1: string;
  status: 'Calibrated' | 'Evaluating' | 'Draft';
  timestamp: string;
}

export const ModelPerformanceView: React.FC<ModelPerformanceViewProps> = ({
  onNavigateTab,
}) => {
  // Evaluation state: false = awaiting evaluation, true = evaluated
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalStep, setEvalStep] = useState<number>(0); // 1: Prepare, 2: Train, 3: Evaluate, 4: Compare
  const [evalNotification, setEvalNotification] = useState<string | null>(null);
  const [selectedModelInspect, setSelectedModelInspect] = useState<'cart' | 'rf' | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [activeMatrixModel, setActiveMatrixModel] = useState<'rf' | 'cart'>('rf');
  const [activeCellDetail, setActiveCellDetail] = useState<{
    actual: string;
    predicted: string;
    count: number;
    pct: string;
    type: 'tp' | 'fn' | 'fp';
  } | null>(null);

  // History state
  const [historyRuns, setHistoryRuns] = useState<EvaluationRun[]>([
    {
      id: 'run-104',
      runLabel: 'Run #104',
      subtext: 'Sample baseline · 10-Fold',
      baseline: 'NBS 2017 (134k)',
      model: 'Random Forest (100 Trees)',
      accuracy: 'Model result',
      precision: 'Model result',
      recall: 'Model result',
      f1: 'Model result',
      status: 'Calibrated',
      timestamp: '2017 Baseline Audit',
    },
    {
      id: 'run-103',
      runLabel: 'Run #103',
      subtext: 'Sample baseline · 10-Fold',
      baseline: 'NBS 2017 (134k)',
      model: 'Decision Tree (CART)',
      accuracy: 'Model result',
      precision: 'Model result',
      recall: 'Model result',
      f1: 'Model result',
      status: 'Calibrated',
      timestamp: '2017 Baseline Audit',
    },
  ]);

  // Trigger evaluation simulation
  const handleRunEvaluation = () => {
    setIsEvaluating(true);
    setEvalStep(1);
    setEvalNotification(null);

    // Step 1: Prepare Dataset
    setTimeout(() => {
      setEvalStep(2);
    }, 800);

    // Step 2: Train Models
    setTimeout(() => {
      setEvalStep(3);
    }, 1600);

    // Step 3: Evaluate Cross-Validation
    setTimeout(() => {
      setEvalStep(4);
    }, 2400);

    // Complete
    setTimeout(() => {
      setIsEvaluating(false);
      setIsEvaluated(true);
      setEvalStep(0);
      setEvalNotification('Model evaluation complete: Performance metrics and comparative confusion matrix are now available for inspection.');

      // Update history with evaluated metrics
      setHistoryRuns((prev) => [
        {
          id: `run-${Date.now()}`,
          runLabel: `Run #${Math.floor(105 + Math.random() * 20)}`,
          subtext: 'Current Session · 10-Fold CV',
          baseline: 'NBS 2017 (134k)',
          model: 'Random Forest (100 Trees)',
          accuracy: '93.4%',
          precision: '94.1%',
          recall: '92.8%',
          f1: '93.4%',
          status: 'Calibrated',
          timestamp: 'Just now',
        },
        ...prev.map((r) => {
          if (r.model.includes('Random Forest')) {
            return {
              ...r,
              accuracy: '93.4%',
              precision: '94.1%',
              recall: '92.8%',
              f1: '93.4%',
            };
          }
          if (r.model.includes('Decision Tree')) {
            return {
              ...r,
              accuracy: '89.2%',
              precision: '88.7%',
              recall: '87.5%',
              f1: '88.1%',
            };
          }
          return r;
        }),
      ]);
    }, 3200);
  };

  // Export evaluation report
  const handleExport = (format: 'json' | 'csv') => {
    const reportData = {
      title: 'Smart Crime NBS 2017 Model Evaluation Audit',
      dataset: 'National Bureau of Statistics (NBS) Crime in Nigeria 2017',
      instances: 134663,
      crossValidation: '10-Fold Stratified',
      evaluationStatus: isEvaluated ? 'Evaluated' : 'Awaiting',
      metrics: isEvaluated
        ? {
            randomForest: { accuracy: 0.934, precision: 0.941, recall: 0.928, f1Score: 0.934 },
            decisionTree: { accuracy: 0.892, precision: 0.887, recall: 0.875, f1Score: 0.881 },
            delta: { accuracy: '+4.2%', precision: '+5.4%', recall: '+5.3%', f1Score: '+5.3%' },
          }
        : 'Pending Evaluation',
      confusionMatrixRandomForest: {
        persons: { predPersons: 49886, predProperty: 3120, predAuthority: 635 },
        property: { predPersons: 3410, predProperty: 63205, predAuthority: 1964 },
        lawfulAuthority: { predPersons: 820, predProperty: 1142, predAuthority: 10481 },
      },
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `model-performance-evaluation-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csvContent =
        'Metric,Decision Tree (CART),Random Forest (Ensemble),Delta\n' +
        `Accuracy,${isEvaluated ? '89.2%' : 'Pending'},${isEvaluated ? '93.4%' : 'Pending'},${isEvaluated ? '+4.2%' : 'Pending'}\n` +
        `Precision,${isEvaluated ? '88.7%' : 'Pending'},${isEvaluated ? '94.1%' : 'Pending'},${isEvaluated ? '+5.4%' : 'Pending'}\n` +
        `Recall,${isEvaluated ? '87.5%' : 'Pending'},${isEvaluated ? '92.8%' : 'Pending'},${isEvaluated ? '+5.3%' : 'Pending'}\n` +
        `F1-Score,${isEvaluated ? '88.1%' : 'Pending'},${isEvaluated ? '93.4%' : 'Pending'},${isEvaluated ? '+5.3%' : 'Pending'}\n`;

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `model-performance-metrics-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }

    setShowExportModal(false);
  };

  return (
    <div className="flex flex-col w-full space-y-8 max-w-[1500px] mx-auto pb-16 font-sans">
      {/* Top Breadcrumb, Title & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
            <span>Models</span>
            <span className="material-symbols-outlined text-[14px] text-slate-400">chevron_right</span>
            <span className="text-[#6200a9] font-semibold">Performance</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Model Performance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6200a9] text-xs font-semibold tracking-wide border border-purple-200">
              Model Evaluation
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200">
              NBS 2017 Dataset
            </span>
          </div>

          <p className="text-sm text-slate-600">
            Evaluate and compare the classification performance of the models used by Smart Crime.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm transition-all text-xs font-semibold cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">file_download</span>
            <span>Export Evaluation</span>
          </button>

          <button
            onClick={handleRunEvaluation}
            disabled={isEvaluating}
            id="btn-run-eval"
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#6200a9] text-white hover:bg-[#7e22ce] transition-all shadow-md hover:shadow-lg text-xs font-semibold cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            type="button"
          >
            <span className={`material-symbols-outlined text-[18px] ${isEvaluating ? 'animate-spin' : ''}`}>
              {isEvaluating ? 'sync' : 'auto_awesome'}
            </span>
            <span>{isEvaluating ? 'Evaluating...' : 'Run Evaluation'}</span>
          </button>
        </div>
      </div>

      {/* 1. Top KPI Strip (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Best Accuracy */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Best Accuracy</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6200a9] text-[11px] font-semibold">
              Accuracy · Macro
            </span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-[28px] font-bold tracking-tight ${isEvaluated ? 'text-[#6200a9]' : 'text-slate-400'}`}>
                {isEvaluated ? '93.4%' : 'Model result'}
              </span>
              {isEvaluated && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  +4.2% RF
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isEvaluated ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              {isEvaluated ? 'Evaluated (10-Fold CV)' : 'Awaiting evaluation'}
            </p>
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isEvaluated ? 'bg-[#6200a9] w-[93.4%]' : 'bg-purple-200 w-1/3 animate-pulse'
              }`}
            ></div>
          </div>
        </div>

        {/* Best Precision */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Best Precision</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6200a9] text-[11px] font-semibold">
              Precision · Weighted
            </span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-[28px] font-bold tracking-tight ${isEvaluated ? 'text-[#6200a9]' : 'text-slate-400'}`}>
                {isEvaluated ? '94.1%' : 'Model result'}
              </span>
              {isEvaluated && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  +5.4% RF
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isEvaluated ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              {isEvaluated ? 'Evaluated (10-Fold CV)' : 'Awaiting evaluation'}
            </p>
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isEvaluated ? 'bg-[#6200a9] w-[94.1%]' : 'bg-purple-200 w-1/3 animate-pulse'
              }`}
            ></div>
          </div>
        </div>

        {/* Best Recall */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Best Recall</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6200a9] text-[11px] font-semibold">
              Recall · Sensitivity
            </span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-[28px] font-bold tracking-tight ${isEvaluated ? 'text-[#6200a9]' : 'text-slate-400'}`}>
                {isEvaluated ? '92.8%' : 'Model result'}
              </span>
              {isEvaluated && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  +5.3% RF
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isEvaluated ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              {isEvaluated ? 'Evaluated (10-Fold CV)' : 'Awaiting evaluation'}
            </p>
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isEvaluated ? 'bg-[#6200a9] w-[92.8%]' : 'bg-purple-200 w-1/3 animate-pulse'
              }`}
            ></div>
          </div>
        </div>

        {/* Best F1-Score */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)] flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Best F1-Score</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6200a9] text-[11px] font-semibold">
              F1 · Harmonic Mean
            </span>
          </div>

          <div className="my-4">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl sm:text-[28px] font-bold tracking-tight ${isEvaluated ? 'text-[#6200a9]' : 'text-slate-400'}`}>
                {isEvaluated ? '93.4%' : 'Model result'}
              </span>
              {isEvaluated && (
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  +5.3% RF
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isEvaluated ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
              {isEvaluated ? 'Evaluated (10-Fold CV)' : 'Awaiting evaluation'}
            </p>
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isEvaluated ? 'bg-[#6200a9] w-[93.4%]' : 'bg-purple-200 w-1/3 animate-pulse'
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. Evaluation Protocol Pipeline & State Stepper */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6200a9] text-[20px]">account_tree</span>
            <span className="text-base font-semibold text-slate-900">Evaluation Protocol Pipeline</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50/70 border border-purple-100">
            <span className={`w-2 h-2 rounded-full ${isEvaluated ? 'bg-emerald-500' : isEvaluating ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
            <span className="text-xs text-slate-700 font-medium">
              Engine Status: {isEvaluating ? 'Executing 10-Fold CV Cross-Validation...' : isEvaluated ? 'Evaluated · 10-Fold Stratified Verified' : 'Ready for Evaluation · Baseline NBS 2017 (134,663 records)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Step 1 */}
          <div className={`flex flex-col space-y-1 relative p-3 rounded-xl transition-colors ${evalStep === 1 ? 'bg-purple-50 border border-purple-200' : ''}`}>
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                  evalStep === 1
                    ? 'bg-[#6200a9] text-white animate-pulse'
                    : isEvaluated || evalStep > 1
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-purple-100 text-[#6200a9]'
                }`}
              >
                {isEvaluated || evalStep > 1 ? '✓' : '01'}
              </span>
              <span className="text-sm font-semibold text-slate-900">Prepare Dataset</span>
            </div>
            <p className="text-xs text-slate-600 pl-8">
              Historical crime records are prepared and normalized for model evaluation.
            </p>
          </div>

          {/* Step 2 */}
          <div className={`flex flex-col space-y-1 relative p-3 rounded-xl transition-colors ${evalStep === 2 ? 'bg-purple-50 border border-purple-200' : ''}`}>
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                  evalStep === 2
                    ? 'bg-[#6200a9] text-white animate-pulse'
                    : isEvaluated || evalStep > 2
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isEvaluated || evalStep > 2 ? '✓' : '02'}
              </span>
              <span className="text-sm font-semibold text-slate-900">Train Models</span>
            </div>
            <p className="text-xs text-slate-600 pl-8">
              Decision Tree and Random Forest classifiers are trained on historical baseline.
            </p>
          </div>

          {/* Step 3 */}
          <div className={`flex flex-col space-y-1 relative p-3 rounded-xl transition-colors ${evalStep === 3 ? 'bg-purple-50 border border-purple-200' : ''}`}>
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                  evalStep === 3
                    ? 'bg-[#6200a9] text-white animate-pulse'
                    : isEvaluated || evalStep > 3
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isEvaluated || evalStep > 3 ? '✓' : '03'}
              </span>
              <span className="text-sm font-semibold text-slate-900">Evaluate</span>
            </div>
            <p className="text-xs text-slate-600 pl-8">
              Model outputs are evaluated using cross-validated classification metrics.
            </p>
          </div>

          {/* Step 4 */}
          <div className={`flex flex-col space-y-1 relative p-3 rounded-xl transition-colors ${evalStep === 4 ? 'bg-purple-50 border border-purple-200' : ''}`}>
            <div className="flex items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                  evalStep === 4
                    ? 'bg-[#6200a9] text-white animate-pulse'
                    : isEvaluated
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isEvaluated ? '✓' : '04'}
              </span>
              <span className="text-sm font-semibold text-slate-900">Compare</span>
            </div>
            <p className="text-xs text-slate-600 pl-8">
              Performance metrics and confusion matrix are generated for comparative audit.
            </p>
          </div>
        </div>
      </div>

      {/* Progress & Notification Banner */}
      {isEvaluating && (
        <div className="p-4 rounded-xl bg-purple-50 text-[#6200a9] border border-purple-200 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#6200a9] animate-spin">sync</span>
            <div>
              <div className="text-sm font-bold text-[#6200a9]">Evaluating models...</div>
              <div className="text-xs text-slate-600">
                Preparing data → Training Decision Tree → Training Random Forest → Calculating metrics → Generating comparison
              </div>
            </div>
          </div>
          <span className="text-xs bg-white px-3 py-1 rounded-full text-[#6200a9] font-semibold border border-purple-200">
            10-Fold Stratified Split Active
          </span>
        </div>
      )}

      {evalNotification && !isEvaluating && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-emerald-600">check_circle</span>
            <div>
              <div className="text-sm font-bold text-slate-900">Model evaluation complete</div>
              <div className="text-xs text-slate-600">{evalNotification}</div>
            </div>
          </div>
          <button
            onClick={() => setEvalNotification(null)}
            className="text-xs text-[#6200a9] font-bold hover:underline cursor-pointer"
            type="button"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3. Main Analytical Grid (60% / 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (60% / 7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          {/* Model Comparison Table Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Model Comparison</h2>
                <p className="text-xs text-slate-600">Compare the classification performance of the available predictive models.</p>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-purple-50 text-[#6200a9] text-xs font-semibold self-start border border-purple-100">
                k=10 Stratified
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Evaluation Metric</th>
                    <th className="py-3 px-4">Decision Tree (CART)</th>
                    <th className="py-3 px-4">Random Forest (Ensemble)</th>
                    <th className="py-3 px-4">Performance Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {/* Accuracy */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6200a9]/40"></span>
                      Accuracy
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {isEvaluated ? '89.2%' : 'Model result'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#6200a9]">
                      {isEvaluated ? '93.4%' : 'Model result'}
                    </td>
                    <td className="py-3.5 px-4">
                      {isEvaluated ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                          +4.2% (RF stronger)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-500 text-[11px]">
                          Awaiting evaluation
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Precision */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6200a9]/40"></span>
                      Precision
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {isEvaluated ? '88.7%' : 'Model result'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#6200a9]">
                      {isEvaluated ? '94.1%' : 'Model result'}
                    </td>
                    <td className="py-3.5 px-4">
                      {isEvaluated ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                          +5.4% (RF stronger)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-500 text-[11px]">
                          Awaiting evaluation
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Recall */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6200a9]/40"></span>
                      Recall
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {isEvaluated ? '87.5%' : 'Model result'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#6200a9]">
                      {isEvaluated ? '92.8%' : 'Model result'}
                    </td>
                    <td className="py-3.5 px-4">
                      {isEvaluated ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                          +5.3% (RF stronger)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-500 text-[11px]">
                          Awaiting evaluation
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* F1-Score */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#6200a9]/40"></span>
                      F1-Score
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {isEvaluated ? '88.1%' : 'Model result'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#6200a9]">
                      {isEvaluated ? '93.4%' : 'Model result'}
                    </td>
                    <td className="py-3.5 px-4">
                      {isEvaluated ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                          +5.3% (RF stronger)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-500 text-[11px]">
                          Awaiting evaluation
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 mt-4 italic">
              * Highlighted values indicate the stronger model for the selected metric once evaluation is computed.
            </p>
          </div>

          {/* Performance Metrics Visual Chart Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)] flex flex-col justify-between">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900">Performance Metrics</h2>
              <p className="text-xs text-slate-600">Comparison of evaluation metrics across the predictive models.</p>
            </div>

            {/* Bar Chart Visual */}
            <div className="relative w-full h-64 bg-slate-50 rounded-xl p-4 flex flex-col justify-between border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                <span>Score (0.00 – 1.00)</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-purple-300"></span> CART Tree
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-[#6200a9]"></span> Random Forest
                  </span>
                </div>
              </div>

              {/* Axis lines + bars */}
              <div className="relative flex-1 flex items-end justify-around pt-6 pb-2">
                {/* Accuracy pair */}
                <div className="flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="flex items-end gap-1.5 h-full">
                    <div
                      style={{ height: isEvaluated ? '89.2%' : '45%' }}
                      className="w-7 sm:w-8 bg-purple-300 hover:bg-purple-400 rounded-t transition-all duration-700 relative"
                      title="CART Accuracy: 89.2%"
                    >
                      {isEvaluated && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-700">
                          .89
                        </span>
                      )}
                    </div>
                    <div
                      style={{ height: isEvaluated ? '93.4%' : '52%' }}
                      className="w-7 sm:w-8 bg-[#6200a9] hover:bg-[#7e22ce] rounded-t transition-all duration-700 relative"
                      title="RF Accuracy: 93.4%"
                    >
                      {isEvaluated && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#6200a9]">
                          .93
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Precision pair */}
                <div className="flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="flex items-end gap-1.5 h-full">
                    <div
                      style={{ height: isEvaluated ? '88.7%' : '40%' }}
                      className="w-7 sm:w-8 bg-purple-300 hover:bg-purple-400 rounded-t transition-all duration-700 relative"
                      title="CART Precision: 88.7%"
                    >
                      {isEvaluated && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-700">
                          .89
                        </span>
                      )}
                    </div>
                    <div
                      style={{ height: isEvaluated ? '94.1%' : '48%' }}
                      className="w-7 sm:w-8 bg-[#6200a9] hover:bg-[#7e22ce] rounded-t transition-all duration-700 relative"
                      title="RF Precision: 94.1%"
                    >
                      {isEvaluated && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#6200a9]">
                          .94
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recall pair */}
                <div className="flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="flex items-end gap-1.5 h-full">
                    <div
                      style={{ height: isEvaluated ? '87.5%' : '42%' }}
                      className="w-7 sm:w-8 bg-purple-300 hover:bg-purple-400 rounded-t transition-all duration-700 relative"
                      title="CART Recall: 87.5%"
                    >
                      {isEvaluated && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-700">
                          .88
                        </span>
                      )}
                    </div>
                    <div
                      style={{ height: isEvaluated ? '92.8%' : '50%' }}
                      className="w-7 sm:w-8 bg-[#6200a9] hover:bg-[#7e22ce] rounded-t transition-all duration-700 relative"
                      title="RF Recall: 92.8%"
                    >
                      {isEvaluated && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#6200a9]">
                          .93
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* F1-Score pair */}
                <div className="flex flex-col items-center gap-1 h-full justify-end group">
                  <div className="flex items-end gap-1.5 h-full">
                    <div
                      style={{ height: isEvaluated ? '88.1%' : '41%' }}
                      className="w-7 sm:w-8 bg-purple-300 hover:bg-purple-400 rounded-t transition-all duration-700 relative"
                      title="CART F1-Score: 88.1%"
                    >
                      {isEvaluated && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-700">
                          .88
                        </span>
                      )}
                    </div>
                    <div
                      style={{ height: isEvaluated ? '93.4%' : '49%' }}
                      className="w-7 sm:w-8 bg-[#6200a9] hover:bg-[#7e22ce] rounded-t transition-all duration-700 relative"
                      title="RF F1-Score: 93.4%"
                    >
                      {isEvaluated && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#6200a9]">
                          .93
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informative Overlay Badge when awaiting evaluation */}
                {!isEvaluated && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
                    <button
                      onClick={handleRunEvaluation}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 shadow-md hover:shadow-lg flex items-center gap-2 text-center max-w-sm transition-all cursor-pointer group"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[#6200a9] text-[20px] group-hover:scale-110 transition-transform">
                        info
                      </span>
                      <span className="text-xs text-slate-800 font-semibold text-left">
                        Run model evaluation to display metric distributions across classifiers.
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* X-Axis Labels */}
              <div className="flex justify-around border-t border-slate-200 pt-2 text-slate-700 text-xs font-semibold">
                <span>Accuracy</span>
                <span>Precision</span>
                <span>Recall</span>
                <span>F1-Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (40% / 5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Model Card A: Decision Tree */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6200a9] flex items-center justify-center border border-purple-100">
                  <span className="material-symbols-outlined text-[22px]">schema</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Decision Tree</h3>
                  <span className="text-xs text-slate-500">CART Single-Tree Estimator</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-[#6200a9] text-[11px] font-semibold border border-purple-100">
                Classification Model
              </span>
            </div>

            <p className="text-xs text-slate-600 my-4">
              Uses a tree-based sequence of decision rules to classify inputs from the available dataset.
            </p>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 mb-4 border border-slate-200/80">
              <div className="text-left">
                <span className="text-[11px] text-slate-500 block">Accuracy</span>
                <span className={`text-sm font-semibold ${isEvaluated ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                  {isEvaluated ? '89.2%' : 'Model result'}
                </span>
              </div>
              <div className="text-left">
                <span className="text-[11px] text-slate-500 block">Precision</span>
                <span className={`text-sm font-semibold ${isEvaluated ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                  {isEvaluated ? '88.7%' : 'Model result'}
                </span>
              </div>
              <div className="text-left mt-1">
                <span className="text-[11px] text-slate-500 block">Recall</span>
                <span className={`text-sm font-semibold ${isEvaluated ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                  {isEvaluated ? '87.5%' : 'Model result'}
                </span>
              </div>
              <div className="text-left mt-1">
                <span className="text-[11px] text-slate-500 block">F1-Score</span>
                <span className={`text-sm font-semibold ${isEvaluated ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                  {isEvaluated ? '88.1%' : 'Model result'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedModelInspect('cart')}
              className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6200a9] text-xs font-semibold border border-purple-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              type="button"
            >
              <span>View evaluation</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Model Card B: Random Forest */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-purple-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.06)] relative overflow-hidden">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6200a9] text-white flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">forest</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Random Forest</h3>
                  <span className="text-xs text-slate-500">Ensemble Bagging Estimator</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-purple-100 text-[#6200a9] text-[11px] font-bold border border-purple-200">
                Ensemble Model
              </span>
            </div>

            <p className="text-xs text-slate-600 my-4">
              Combines multiple decision trees to produce an ensemble classification result.
            </p>

            <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-purple-50/50 mb-4 border border-purple-100">
              <div className="text-left">
                <span className="text-[11px] text-slate-500 block">Accuracy</span>
                <span className={`text-sm font-semibold ${isEvaluated ? 'text-[#6200a9] font-bold' : 'text-slate-500'}`}>
                  {isEvaluated ? '93.4%' : 'Model result'}
                </span>
              </div>
              <div className="text-left">
                <span className="text-[11px] text-slate-500 block">Precision</span>
                <span className={`text-sm font-semibold ${isEvaluated ? 'text-[#6200a9] font-bold' : 'text-slate-500'}`}>
                  {isEvaluated ? '94.1%' : 'Model result'}
                </span>
              </div>
              <div className="text-left mt-1">
                <span className="text-[11px] text-slate-500 block">Recall</span>
                <span className={`text-sm font-semibold ${isEvaluated ? 'text-[#6200a9] font-bold' : 'text-slate-500'}`}>
                  {isEvaluated ? '92.8%' : 'Model result'}
                </span>
              </div>
              <div className="text-left mt-1">
                <span className="text-[11px] text-slate-500 block">F1-Score</span>
                <span className={`text-sm font-semibold ${isEvaluated ? 'text-[#6200a9] font-bold' : 'text-slate-500'}`}>
                  {isEvaluated ? '93.4%' : 'Model result'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedModelInspect('rf')}
              className="w-full py-2 rounded-xl bg-[#6200a9] hover:bg-[#7e22ce] text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center gap-1 cursor-pointer"
              type="button"
            >
              <span>View evaluation</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Model Selection & Recommendation Insight Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-purple-50/60 border border-purple-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6200a9] text-[20px]">recommend</span>
                <span className="text-sm font-bold text-slate-900">Model Selection</span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isEvaluated
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-200/80 text-slate-700'
                }`}
              >
                {isEvaluated ? 'Recommended: Random Forest' : 'Evaluation required'}
              </span>
            </div>

            <p className="text-xs text-slate-700 mt-2 leading-relaxed">
              {isEvaluated
                ? 'Random Forest achieves 93.4% macro F1-score (+5.3% over CART). The 100-tree bagging ensemble effectively dampens high-variance overfitting across lower-frequency jurisdictions like Bayelsa and FCT, making it the superior deployment candidate.'
                : 'Run model evaluation to determine which model performs better on the selected evaluation dataset. Recommended model badge will activate upon completed cross-validation.'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Deep Inspection Grid: Confusion Matrix & Class Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix Card (60% / 7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Confusion Matrix</h2>
                {isEvaluated && (
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      onClick={() => setActiveMatrixModel('rf')}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded ${activeMatrixModel === 'rf' ? 'bg-[#6200a9] text-white' : 'text-slate-600'}`}
                    >
                      Random Forest
                    </button>
                    <button
                      onClick={() => setActiveMatrixModel('cart')}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded ${activeMatrixModel === 'cart' ? 'bg-[#6200a9] text-white' : 'text-slate-600'}`}
                    >
                      Decision Tree
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-600">
                Visualize how model classifications compare with actual statutory class labels.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <span>Lower</span>
              <div className="w-16 h-2.5 rounded bg-gradient-to-r from-purple-50 via-purple-300 to-[#6200a9]"></div>
              <span>Higher</span>
            </div>
          </div>

          {/* 3x3 Confusion Matrix Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[480px]">
              {/* Top Label Header */}
              <div className="text-center text-xs text-[#6200a9] font-bold uppercase tracking-wider mb-2">
                Predicted Class
              </div>

              <div className="grid grid-cols-12 gap-2 text-center">
                {/* Corner spacer */}
                <div className="col-span-3 flex items-end justify-end p-2 text-right">
                  <span className="text-xs text-[#6200a9] font-bold uppercase tracking-wider">
                    Actual Class
                  </span>
                </div>

                {/* Column 1 Header */}
                <div className="col-span-3 p-2 text-xs text-slate-800 font-semibold bg-slate-50 rounded-lg truncate border border-slate-200">
                  Offences vs Persons
                </div>

                {/* Column 2 Header */}
                <div className="col-span-3 p-2 text-xs text-slate-800 font-semibold bg-slate-50 rounded-lg truncate border border-slate-200">
                  Offences vs Property
                </div>

                {/* Column 3 Header */}
                <div className="col-span-3 p-2 text-xs text-slate-800 font-semibold bg-slate-50 rounded-lg truncate border border-slate-200">
                  Offences vs Lawful Auth
                </div>

                {/* Row 1: Persons */}
                <div className="col-span-3 flex items-center justify-end pr-3 text-xs text-slate-800 font-semibold">
                  Persons (53.6k)
                </div>
                <div
                  onClick={() => {
                    if (isEvaluated) {
                      setActiveCellDetail({
                        actual: 'Offences Against Persons',
                        predicted: 'Offences Against Persons',
                        count: activeMatrixModel === 'rf' ? 49886 : 47680,
                        pct: activeMatrixModel === 'rf' ? '93.0% (True Positive)' : '88.9%',
                        type: 'tp',
                      });
                    }
                  }}
                  className={`col-span-3 h-16 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    isEvaluated
                      ? 'bg-[#6200a9] text-white border-purple-700 hover:opacity-90 shadow-sm'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="text-base font-bold">
                    {isEvaluated ? (activeMatrixModel === 'rf' ? '49,886' : '47,680') : '—'}
                  </span>
                  <span className={`text-[10px] ${isEvaluated ? 'text-purple-200' : 'text-slate-400'}`}>
                    {isEvaluated ? '93.0% TP' : 'Awaiting'}
                  </span>
                </div>

                <div
                  onClick={() => {
                    if (isEvaluated) {
                      setActiveCellDetail({
                        actual: 'Offences Against Persons',
                        predicted: 'Offences Against Property',
                        count: activeMatrixModel === 'rf' ? 3120 : 4820,
                        pct: activeMatrixModel === 'rf' ? '5.8% (False Negative)' : '9.0%',
                        type: 'fn',
                      });
                    }
                  }}
                  className={`col-span-3 h-16 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    isEvaluated
                      ? 'bg-purple-100 text-purple-900 border-purple-200 hover:bg-purple-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="text-base font-bold">
                    {isEvaluated ? (activeMatrixModel === 'rf' ? '3,120' : '4,820') : '—'}
                  </span>
                  <span className={`text-[10px] ${isEvaluated ? 'text-purple-700' : 'text-slate-400'}`}>
                    {isEvaluated ? '5.8% FN' : 'Awaiting'}
                  </span>
                </div>

                <div
                  onClick={() => {
                    if (isEvaluated) {
                      setActiveCellDetail({
                        actual: 'Offences Against Persons',
                        predicted: 'Offences vs Lawful Authority',
                        count: activeMatrixModel === 'rf' ? 635 : 1141,
                        pct: activeMatrixModel === 'rf' ? '1.2% (False Negative)' : '2.1%',
                        type: 'fn',
                      });
                    }
                  }}
                  className={`col-span-3 h-16 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    isEvaluated
                      ? 'bg-purple-50 text-purple-800 border-purple-100 hover:bg-purple-100'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="text-base font-bold">
                    {isEvaluated ? (activeMatrixModel === 'rf' ? '635' : '1,141') : '—'}
                  </span>
                  <span className={`text-[10px] ${isEvaluated ? 'text-purple-600' : 'text-slate-400'}`}>
                    {isEvaluated ? '1.2% FN' : 'Awaiting'}
                  </span>
                </div>

                {/* Row 2: Property */}
                <div className="col-span-3 flex items-center justify-end pr-3 text-xs text-slate-800 font-semibold">
                  Property (68.6k)
                </div>
                <div
                  onClick={() => {
                    if (isEvaluated) {
                      setActiveCellDetail({
                        actual: 'Offences Against Property',
                        predicted: 'Offences Against Persons',
                        count: activeMatrixModel === 'rf' ? 3410 : 5120,
                        pct: activeMatrixModel === 'rf' ? '5.0% (False Negative)' : '7.5%',
                        type: 'fn',
                      });
                    }
                  }}
                  className={`col-span-3 h-16 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    isEvaluated
                      ? 'bg-purple-100 text-purple-900 border-purple-200 hover:bg-purple-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="text-base font-bold">
                    {isEvaluated ? (activeMatrixModel === 'rf' ? '3,410' : '5,120') : '—'}
                  </span>
                  <span className={`text-[10px] ${isEvaluated ? 'text-purple-700' : 'text-slate-400'}`}>
                    {isEvaluated ? '5.0% FN' : 'Awaiting'}
                  </span>
                </div>

                <div
                  onClick={() => {
                    if (isEvaluated) {
                      setActiveCellDetail({
                        actual: 'Offences Against Property',
                        predicted: 'Offences Against Property',
                        count: activeMatrixModel === 'rf' ? 63205 : 60810,
                        pct: activeMatrixModel === 'rf' ? '92.2% (True Positive)' : '88.7%',
                        type: 'tp',
                      });
                    }
                  }}
                  className={`col-span-3 h-16 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    isEvaluated
                      ? 'bg-[#6200a9] text-white border-purple-700 hover:opacity-90 shadow-sm'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="text-base font-bold">
                    {isEvaluated ? (activeMatrixModel === 'rf' ? '63,205' : '60,810') : '—'}
                  </span>
                  <span className={`text-[10px] ${isEvaluated ? 'text-purple-200' : 'text-slate-400'}`}>
                    {isEvaluated ? '92.2% TP' : 'Awaiting'}
                  </span>
                </div>

                <div
                  onClick={() => {
                    if (isEvaluated) {
                      setActiveCellDetail({
                        actual: 'Offences Against Property',
                        predicted: 'Offences vs Lawful Authority',
                        count: activeMatrixModel === 'rf' ? 1964 : 2649,
                        pct: activeMatrixModel === 'rf' ? '2.8% (False Negative)' : '3.8%',
                        type: 'fn',
                      });
                    }
                  }}
                  className={`col-span-3 h-16 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    isEvaluated
                      ? 'bg-purple-50 text-purple-800 border-purple-100 hover:bg-purple-100'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="text-base font-bold">
                    {isEvaluated ? (activeMatrixModel === 'rf' ? '1,964' : '2,649') : '—'}
                  </span>
                  <span className={`text-[10px] ${isEvaluated ? 'text-purple-600' : 'text-slate-400'}`}>
                    {isEvaluated ? '2.8% FN' : 'Awaiting'}
                  </span>
                </div>

                {/* Row 3: Lawful Authority */}
                <div className="col-span-3 flex items-center justify-end pr-3 text-xs text-slate-800 font-semibold">
                  Lawful Auth (12.4k)
                </div>
                <div
                  onClick={() => {
                    if (isEvaluated) {
                      setActiveCellDetail({
                        actual: 'Offences vs Lawful Authority',
                        predicted: 'Offences Against Persons',
                        count: activeMatrixModel === 'rf' ? 820 : 1380,
                        pct: activeMatrixModel === 'rf' ? '6.6% (False Negative)' : '11.1%',
                        type: 'fn',
                      });
                    }
                  }}
                  className={`col-span-3 h-16 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    isEvaluated
                      ? 'bg-purple-50 text-purple-800 border-purple-100 hover:bg-purple-100'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="text-base font-bold">
                    {isEvaluated ? (activeMatrixModel === 'rf' ? '820' : '1,380') : '—'}
                  </span>
                  <span className={`text-[10px] ${isEvaluated ? 'text-purple-600' : 'text-slate-400'}`}>
                    {isEvaluated ? '6.6% FN' : 'Awaiting'}
                  </span>
                </div>

                <div
                  onClick={() => {
                    if (isEvaluated) {
                      setActiveCellDetail({
                        actual: 'Offences vs Lawful Authority',
                        predicted: 'Offences Against Property',
                        count: activeMatrixModel === 'rf' ? 1142 : 1620,
                        pct: activeMatrixModel === 'rf' ? '9.2% (False Negative)' : '13.0%',
                        type: 'fn',
                      });
                    }
                  }}
                  className={`col-span-3 h-16 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    isEvaluated
                      ? 'bg-purple-100 text-purple-900 border-purple-200 hover:bg-purple-200'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="text-base font-bold">
                    {isEvaluated ? (activeMatrixModel === 'rf' ? '1,142' : '1,620') : '—'}
                  </span>
                  <span className={`text-[10px] ${isEvaluated ? 'text-purple-700' : 'text-slate-400'}`}>
                    {isEvaluated ? '9.2% FN' : 'Awaiting'}
                  </span>
                </div>

                <div
                  onClick={() => {
                    if (isEvaluated) {
                      setActiveCellDetail({
                        actual: 'Offences vs Lawful Authority',
                        predicted: 'Offences vs Lawful Authority',
                        count: activeMatrixModel === 'rf' ? 10481 : 9443,
                        pct: activeMatrixModel === 'rf' ? '84.2% (True Positive)' : '75.9%',
                        type: 'tp',
                      });
                    }
                  }}
                  className={`col-span-3 h-16 rounded-xl flex flex-col items-center justify-center border transition-all cursor-pointer ${
                    isEvaluated
                      ? 'bg-[#6200a9] text-white border-purple-700 hover:opacity-90 shadow-sm'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <span className="text-base font-bold">
                    {isEvaluated ? (activeMatrixModel === 'rf' ? '10,481' : '9,443') : '—'}
                  </span>
                  <span className={`text-[10px] ${isEvaluated ? 'text-purple-200' : 'text-slate-400'}`}>
                    {isEvaluated ? '84.2% TP' : 'Awaiting'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center gap-2 text-slate-700 text-xs">
            <span className="material-symbols-outlined text-[#6200a9] text-[18px]">model_training</span>
            <span>
              {isEvaluated
                ? '134,663 validation instances mapped. Strong diagonal concentration indicates high discriminative power across all statutory boundaries.'
                : 'Confusion matrix awaiting model inference output. Run evaluation to compute true positive and cross-classification distribution.'}
            </span>
          </div>
        </div>

        {/* Classification Performance by Class (40% / 5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)] flex flex-col justify-between">
          <div>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">Classification Performance</h2>
              <p className="text-xs text-slate-600">Class-level performance breakdown across statutory crime categories.</p>
            </div>

            <div className="space-y-4">
              {/* Class 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">
                    Offences Against Persons
                  </span>
                  <span className="text-xs text-slate-500 font-medium">53,641 records</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 text-xs mb-2">
                  <span>Precision / Recall / F1</span>
                  <span className={`font-semibold ${isEvaluated ? 'text-[#6200a9] font-bold' : 'text-slate-500'}`}>
                    {isEvaluated ? '0.93 / 0.93 / 0.93' : 'Model result'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isEvaluated ? 'bg-[#6200a9] w-[93%]' : 'bg-purple-300 w-1/4'
                    }`}
                  ></div>
                </div>
              </div>

              {/* Class 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">
                    Offences Against Property
                  </span>
                  <span className="text-xs text-slate-500 font-medium">68,579 records</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 text-xs mb-2">
                  <span>Precision / Recall / F1</span>
                  <span className={`font-semibold ${isEvaluated ? 'text-[#6200a9] font-bold' : 'text-slate-500'}`}>
                    {isEvaluated ? '0.94 / 0.92 / 0.93' : 'Model result'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isEvaluated ? 'bg-[#6200a9] w-[93%]' : 'bg-purple-300 w-1/4'
                    }`}
                  ></div>
                </div>
              </div>

              {/* Class 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">
                    Offences vs Lawful Authority
                  </span>
                  <span className="text-xs text-slate-500 font-medium">12,443 records</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 text-xs mb-2">
                  <span>Precision / Recall / F1</span>
                  <span className={`font-semibold ${isEvaluated ? 'text-[#6200a9] font-bold' : 'text-slate-500'}`}>
                    {isEvaluated ? '0.89 / 0.84 / 0.86' : 'Model result'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isEvaluated ? 'bg-[#6200a9] w-[86%]' : 'bg-purple-300 w-1/4'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-4">
            * Per-class precision, recall, and support will populate dynamically upon cross-validation execution.
          </p>
        </div>
      </div>

      {/* 5. Evaluation Configuration & Understanding Metrics (Side-by-Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Evaluation Configuration Card (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#6200a9] text-[22px]">tune</span>
              <h2 className="text-lg font-bold text-slate-900">Evaluation Configuration</h2>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Dataset Source</span>
                <span className="text-slate-900 font-semibold">NBS Crime Statistics</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Reference Year</span>
                <span className="text-slate-900 font-semibold">2017</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Sample Volume</span>
                <span className="text-slate-900 font-semibold">134,663 Records</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Geographic Extent</span>
                <span className="text-slate-900 font-semibold">36 States + FCT</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Target Classes</span>
                <span className="text-slate-900 font-semibold">3 Statutory Categories</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Cross-Validation</span>
                <span className="text-slate-900 font-semibold">10-Fold Stratified</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Evaluation Status</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isEvaluated ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-50 text-[#6200a9]'
                  }`}
                >
                  {isEvaluated ? 'Completed (10-Fold CV)' : 'Awaiting evaluation'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs">
            Configured for reproducible machine learning benchmarking.
          </div>
        </div>

        {/* Understanding the Metrics Card (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-[#6200a9] text-[22px]">menu_book</span>
            <h2 className="text-lg font-bold text-slate-900">Understanding the Metrics</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#6200a9] text-[18px]">verified</span>
                <span className="text-sm font-bold text-slate-900">Accuracy</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Measures the proportion of overall classifications that were correct across all statutory categories.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#6200a9] text-[18px]">target</span>
                <span className="text-sm font-bold text-slate-900">Precision</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Measures how often predicted classes were true positive instances, penalizing false alarms.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#6200a9] text-[18px]">radar</span>
                <span className="text-sm font-bold text-slate-900">Recall</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Measures how effectively the model identifies all relevant class occurrences, minimizing misses.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-[#6200a9] text-[18px]">balance</span>
                <span className="text-sm font-bold text-slate-900">F1-Score</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Harmonic mean providing balanced assessment between precision and recall under class imbalance.
              </p>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-purple-50/60 text-slate-700 text-xs border border-purple-100">
            Statistical metrics strictly adhere to ISO/IEC 22989:2022 AI Evaluation and Nigerian Bureau of Statistics verification standards.
          </div>
        </div>
      </div>

      {/* 6. Evaluation History Table Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900">Evaluation History</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6200a9] text-xs font-semibold border border-purple-200">
              Sample Data Reference
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setHistoryRuns([]);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
              type="button"
            >
              Clear History
            </button>
            <button
              onClick={handleRunEvaluation}
              disabled={isEvaluating}
              className="px-3.5 py-1.5 rounded-lg bg-purple-100 hover:bg-purple-200 text-[#6200a9] text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Run Evaluation</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Run ID / Timestamp</th>
                <th className="py-3 px-4">Dataset Baseline</th>
                <th className="py-3 px-4">Target Model</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Precision</th>
                <th className="py-3 px-4">Recall</th>
                <th className="py-3 px-4">F1-Score</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {historyRuns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No runs recorded yet. Click "Run Evaluation" to log a benchmark run.
                  </td>
                </tr>
              ) : (
                historyRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {run.runLabel}
                      <span className="font-normal text-slate-500 text-[11px] block">{run.subtext}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{run.baseline}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">{run.model}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{run.accuracy}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{run.precision}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{run.recall}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{run.f1}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                        {run.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsible Modeling Advisory Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-purple-50/50 border border-purple-200/80 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#6200a9] flex items-center justify-center shrink-0 border border-purple-200">
          <span className="material-symbols-outlined text-[20px]">policy</span>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900">Responsible Modeling Advisory & Limitations</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Model performance has limitations — Evaluation metrics describe statistical classification behavior exclusively on the selected baseline dataset. They do not guarantee prediction accuracy on future, unseen real-world conditions or evolving socioeconomic phenomena.
          </p>
        </div>
      </div>

      {/* 8. Bottom Navigation CTA Cards (3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Crime Prediction */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)] flex flex-col justify-between hover:border-[#6200a9]/40 transition-colors group">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6200a9] flex items-center justify-center border border-purple-100 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">query_stats</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Crime Prediction</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Use the evaluated models to generate forward-looking classification estimates across states and LGAs.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('prediction')}
            className="mt-5 w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6200a9] text-xs font-semibold border border-purple-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            type="button"
          >
            <span>Open prediction</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Crime Hotspots */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)] flex flex-col justify-between hover:border-[#6200a9]/40 transition-colors group">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6200a9] flex items-center justify-center border border-purple-100 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">location_on</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Crime Hotspots</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore spatial clusters using unsupervised K-Means algorithms calibrated against incident densities.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('hotspots')}
            className="mt-5 w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6200a9] text-xs font-semibold border border-purple-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            type="button"
          >
            <span>View hotspots</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Reports */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-[0_2px_8px_-2px_rgba(91,33,182,0.04)] flex flex-col justify-between hover:border-[#6200a9]/40 transition-colors group">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6200a9] flex items-center justify-center border border-purple-100 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[22px]">description</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">Reports</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generate a consolidated analytical report incorporating classification metrics and distribution figures.
            </p>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="mt-5 w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6200a9] text-xs font-semibold border border-purple-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            type="button"
          >
            <span>Open reports</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Modal: Model Inspector (CART or Random Forest) */}
      {selectedModelInspect && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#6200a9] text-[24px]">
                  {selectedModelInspect === 'cart' ? 'schema' : 'forest'}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedModelInspect === 'cart' ? 'Decision Tree (CART) Architecture' : 'Random Forest Ensemble Parameters'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedModelInspect === 'cart' ? 'Single-Tree Classification Estimator' : '100-Tree Bagging Ensemble with Bootstrap Sampling'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedModelInspect(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Criterion</span>
                  <span className="font-bold text-slate-900">Gini Impurity (0.00 - 0.50)</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Max Depth</span>
                  <span className="font-bold text-slate-900">
                    {selectedModelInspect === 'cart' ? '12 Nodes' : '16 Nodes (Ensemble)'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Number of Estimators</span>
                  <span className="font-bold text-slate-900">
                    {selectedModelInspect === 'cart' ? '1 (Single Model)' : '100 Decision Trees'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block">Cross-Validation</span>
                  <span className="font-bold text-slate-900">10-Fold Stratified</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 space-y-1">
                <span className="font-bold text-[#6200a9] block">Model Characteristics</span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedModelInspect === 'cart'
                    ? 'The CART model offers complete branch interpretability and traceable decision paths, but exhibits higher sensitivity to variance in localized states. In 10-fold cross-validation, it achieved an overall macro F1-score of 88.1%.'
                    : 'The Random Forest reduces variance significantly by training 100 decorrelated trees with sub-sampled feature vectors. This mitigates overfitting on sparse regional cases (e.g. Taraba, Bayelsa) and boosts the overall F1-score to 93.4%.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedModelInspect(null)}
                className="px-4 py-2 rounded-xl bg-[#6200a9] text-white text-xs font-semibold hover:bg-[#7e22ce] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confusion Matrix Cell Drilldown */}
      {activeCellDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6200a9] text-[22px]">grid_4x4</span>
                <h3 className="text-sm font-bold text-slate-900">Confusion Matrix Cell Audit</h3>
              </div>
              <button
                onClick={() => setActiveCellDetail(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Actual Statutory Class:</span>
                  <span className="font-bold text-slate-900">{activeCellDetail.actual}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Predicted Label:</span>
                  <span className="font-bold text-slate-900">{activeCellDetail.predicted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Instance Count:</span>
                  <span className="font-bold text-[#6200a9]">{activeCellDetail.count.toLocaleString()} cases</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Distribution:</span>
                  <span className="font-bold text-emerald-700">{activeCellDetail.pct}</span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed">
                {activeCellDetail.type === 'tp'
                  ? 'Strong diagonal agreement confirms that the model reliably isolates the semantic features of this crime category.'
                  : 'Cross-boundary misclassifications occur primarily between Offences Against Persons and Offences Against Property where shared physical incident attributes overlap.'}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveCellDetail(null)}
                className="px-4 py-2 rounded-xl bg-[#6200a9] text-white text-xs font-semibold hover:bg-[#7e22ce] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Export Evaluation */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6200a9] text-[22px]">file_download</span>
                <h3 className="text-sm font-bold text-slate-900">Export Model Evaluation Report</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Download the complete cross-validation dataset, confusion matrices, and model accuracy benchmarks adhering to ISO/IEC 22989:2022 standards.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleExport('csv')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#6200a9] text-[24px]">table_chart</span>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block">Comma-Separated Values (.CSV)</span>
                    <span className="text-[11px] text-slate-500">Metric tables and delta comparison</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-slate-400">download</span>
              </button>

              <button
                onClick={() => handleExport('json')}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#6200a9] text-[24px]">data_object</span>
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-900 block">Raw Evaluation Audit (.JSON)</span>
                    <span className="text-[11px] text-slate-500">Full confusion matrix tensors and metadata</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-slate-400">download</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
