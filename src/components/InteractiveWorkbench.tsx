import React, { useState, useMemo } from 'react';
import { NIGERIAN_STATES_DATA, GEOPOLITICAL_ZONES } from '../data/crimeData';
import { StateCrimeData } from '../types';

interface InteractiveWorkbenchProps {
  initialState?: string;
  onClose?: () => void;
  onOpenPrediction?: (state: string) => void;
}

export const InteractiveWorkbench: React.FC<InteractiveWorkbenchProps> = ({
  initialState,
  onClose,
  onOpenPrediction,
}) => {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStateName, setSelectedStateName] = useState<string>(initialState || 'Lagos');
  const [sortField, setSortField] = useState<keyof StateCrimeData>('totalCases');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredStates = useMemo(() => {
    return NIGERIAN_STATES_DATA.filter((s) => {
      const matchZone = selectedZone === 'all' || s.zone === selectedZone;
      const matchSearch = s.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.capital.toLowerCase().includes(searchTerm.toLowerCase());
      return matchZone && matchSearch;
    }).sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      }
      return 0;
    });
  }, [selectedZone, searchTerm, sortField, sortOrder]);

  const currentState = NIGERIAN_STATES_DATA.find((s) => s.state === selectedStateName) || filteredStates[0] || NIGERIAN_STATES_DATA[0];

  const handleSort = (field: keyof StateCrimeData) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleZoneSelect = (zone: string) => {
    setIsFiltering(true);
    setSelectedZone(zone);
    setTimeout(() => {
      setIsFiltering(false);
    }, 200);
  };

  const exportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const headers = ['State', 'Zone', 'Capital', 'Total Cases', 'Property Cases', 'Persons Cases', 'Authority Cases', 'Risk Score', 'Trend'];
      const rows = filteredStates.map(s => [
        s.state,
        s.zone,
        s.capital,
        s.totalCases,
        s.propertyCases,
        s.personsCases,
        s.authorityCases,
        s.riskScore,
        s.trend
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `nigerian_crime_data_${selectedZone}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
      setToastMessage(`Export completed: ${filteredStates.length} jurisdiction records compiled.`);
      setTimeout(() => setToastMessage(null), 3000);
    }, 450);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg border border-slate-700 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            Smart Crime Workbench · Interactive Command Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            Nigerian Crime Analytics Workbench
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Granular state-by-state incident exploration, multi-class ratio breakdown, and risk index evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            disabled={isExporting}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold transition-colors disabled:opacity-60 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[16px] text-purple-700 ${isExporting ? 'animate-spin' : ''}`}>
              {isExporting ? 'progress_activity' : 'download'}
            </span>
            <span>{isExporting ? 'Compiling CSV...' : 'Export CSV'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Overview</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Zone:</span>
          <button
            onClick={() => handleZoneSelect('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              selectedZone === 'all'
                ? 'bg-purple-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Zones (37)
          </button>
          {GEOPOLITICAL_ZONES.map((z) => (
            <button
              key={z.name}
              onClick={() => handleZoneSelect(z.name)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                selectedZone === z.name
                  ? 'bg-purple-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {z.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 min-w-[220px]">
          <span className="material-symbols-outlined text-slate-400 text-[16px]">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter state or capital..."
            className="bg-transparent border-none outline-none text-xs text-slate-900 placeholder:text-slate-400 w-full"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-xs text-slate-400 hover:text-slate-800">×</button>
          )}
        </div>
      </div>

      {/* Main Focus Panel: Selected State Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Selected State Dossier */}
        <div className="lg:col-span-5 rounded-xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col gap-6">
          {isFiltering ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-8 bg-slate-200 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="h-20 bg-slate-100 rounded-lg"></div>
                <div className="h-20 bg-slate-100 rounded-lg"></div>
              </div>
              <div className="h-32 bg-slate-100 rounded-lg"></div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-purple-700">
                    {currentState.zone} Jurisdiction
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
                    {currentState.state} State
                  </h2>
                  <span className="text-xs text-slate-600 block mt-0.5">
                    Administrative Capital: <strong>{currentState.capital}</strong> · Lat {currentState.lat}°N, Lon {currentState.lng}°E
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk Index</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-bold text-purple-700 tabular-nums">
                      {currentState.riskScore}
                    </span>
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                  <span className={`text-xs font-semibold ${
                    currentState.riskScore > 35 ? 'text-amber-800' : 'text-emerald-800'
                  }`}>
                    {currentState.riskScore > 35 ? 'Moderate Watch' : 'Baseline Stable'}
                  </span>
                </div>
              </div>

              {/* KPI Mini-Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Total Reported</span>
                  <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
                    {currentState.totalCases.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-purple-700 font-medium">
                    {((currentState.totalCases / 134663) * 100).toFixed(1)}% of National Total
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 uppercase font-semibold">Spatial Cluster</span>
                  <div className="text-xl font-bold text-purple-700 mt-0.5">
                    Cluster #{currentState.clusterId}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {currentState.trend}
                  </span>
                </div>
              </div>

              {/* Category Proportions for this State */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Categorical Breakdown
                </span>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-800">Property Offences</span>
                    <span className="font-semibold text-purple-700 tabular-nums">
                      {currentState.propertyCases.toLocaleString()} ({Math.round((currentState.propertyCases / currentState.totalCases) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-purple-700 rounded" 
                      style={{ width: `${(currentState.propertyCases / currentState.totalCases) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-800">Against Persons</span>
                    <span className="font-semibold text-indigo-600 tabular-nums">
                      {currentState.personsCases.toLocaleString()} ({Math.round((currentState.personsCases / currentState.totalCases) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 rounded" 
                      style={{ width: `${(currentState.personsCases / currentState.totalCases) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-800">Against Lawful Authority</span>
                    <span className="font-semibold text-slate-600 tabular-nums">
                      {currentState.authorityCases.toLocaleString()} ({Math.round((currentState.authorityCases / currentState.totalCases) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-slate-600 rounded" 
                      style={{ width: `${(currentState.authorityCases / currentState.totalCases) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="pt-2 border-t border-slate-200">
                <button
                  onClick={() => onOpenPrediction && onOpenPrediction(currentState.state)}
                  className="w-full py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  <span>Simulate Predictions for {currentState.state}</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Right Side: Tabular State Comparison Grid */}
        <div className="lg:col-span-7 rounded-xl bg-white border border-slate-200 p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Jurisdiction Registry ({filteredStates.length} Commands)
              </h3>
              <p className="text-xs text-slate-500">
                Click any column header to sort. Select a row to inspect state profile.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto max-h-[460px] overflow-y-auto rounded-lg border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th onClick={() => handleSort('state')} className="p-3 cursor-pointer hover:text-purple-700">
                    State {sortField === 'state' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('zone')} className="p-3 cursor-pointer hover:text-purple-700">
                    Zone {sortField === 'zone' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('totalCases')} className="p-3 text-right cursor-pointer hover:text-purple-700">
                    Total Cases {sortField === 'totalCases' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('propertyCases')} className="p-3 text-right cursor-pointer hover:text-purple-700">
                    Property {sortField === 'propertyCases' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('personsCases')} className="p-3 text-right cursor-pointer hover:text-purple-700">
                    Persons {sortField === 'personsCases' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort('riskScore')} className="p-3 text-right cursor-pointer hover:text-purple-700">
                    Risk Score {sortField === 'riskScore' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isFiltering ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
                      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div></td>
                      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-14 ml-auto"></div></td>
                      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-14 ml-auto"></div></td>
                      <td className="p-3"><div className="h-4 bg-slate-200 rounded w-10 ml-auto"></div></td>
                    </tr>
                  ))
                ) : (
                  filteredStates.map((s) => {
                    const isSelected = s.state === currentState.state;
                    return (
                      <tr
                        key={s.state}
                        onClick={() => setSelectedStateName(s.state)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-purple-50 font-semibold text-purple-900'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <td className="p-3 font-semibold text-slate-900 flex items-center gap-1.5">
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-purple-700"></span>}
                          <span>{s.state}</span>
                        </td>
                        <td className="p-3">{s.zone}</td>
                        <td className="p-3 text-right font-semibold text-slate-900 tabular-nums">
                          {s.totalCases.toLocaleString()}
                        </td>
                        <td className="p-3 text-right tabular-nums">{s.propertyCases.toLocaleString()}</td>
                        <td className="p-3 text-right tabular-nums">{s.personsCases.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tabular-nums ${
                            s.riskScore > 35
                              ? 'text-amber-800 bg-amber-50'
                              : 'text-emerald-800 bg-emerald-50'
                          }`}>
                            {s.riskScore}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
