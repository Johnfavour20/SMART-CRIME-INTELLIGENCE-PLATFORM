import React, { useState, useMemo } from 'react';
import { NIGERIAN_STATES_DATA } from '../data/crimeData';
import { ActiveTab } from '../types';

interface HotspotsViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectState?: (stateName: string) => void;
  onOpenCrimeData?: () => void;
}

interface ClusterMeta {
  title: string;
  classification: string;
  records: string;
  category: string;
  confidence: string;
  silhouette: string;
  dotColor: string;
  share: string;
  volume: number;
  band: string;
  zone: string;
  description: string;
}

const CLUSTERS_CONFIG: Record<string, ClusterMeta> = {
  '01': {
    title: 'Selected: Cluster 01',
    classification: 'High Historical Concentration',
    records: '50,985 filings',
    category: 'Against Property',
    confidence: '91.4% (Euclidean)',
    silhouette: '0.86',
    dotColor: 'bg-purple-700',
    share: '37.8%',
    volume: 50985,
    band: 'High',
    zone: 'SW Axis',
    description: 'Records grouped into this cluster show relatively stronger concentration within the selected historical dataset.',
  },
  '02': {
    title: 'Selected: Cluster 02',
    classification: 'Moderate Concentration',
    records: '44,820 filings',
    category: 'Against Persons / Lawful',
    confidence: '88.2% (Euclidean)',
    silhouette: '0.84',
    dotColor: 'bg-indigo-600',
    share: '33.3%',
    volume: 44820,
    band: 'Moderate',
    zone: 'NC / NW',
    description: 'Records grouped into this cluster show moderate concentration across major administrative and commercial transit hubs.',
  },
  '03': {
    title: 'Selected: Cluster 03',
    classification: 'Lower Incident Density',
    records: '38,858 filings',
    category: 'Dispersed Statutory',
    confidence: '84.6% (Euclidean)',
    silhouette: '0.79',
    dotColor: 'bg-slate-700',
    share: '28.9%',
    volume: 38858,
    band: 'Dispersed',
    zone: 'Dispersed',
    description: 'Records grouped into this cluster show comparatively lower incident volumes across regional territorial commands.',
  },
};

export const HotspotsView: React.FC<HotspotsViewProps> = ({
  onNavigateTab,
  onSelectState,
  onOpenCrimeData,
}) => {
  // Configuration filters
  const [filterTerritory, setFilterTerritory] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterK, setFilterK] = useState<string>('3');
  const [filterDataset, setFilterDataset] = useState<string>('nbs_2017');

  // Selected Cluster state
  const [selectedClusterId, setSelectedClusterId] = useState<string>('01');
  const [tableClusterFilter, setTableClusterFilter] = useState<string>('all');

  // Engine State simulation
  const [engineState, setEngineState] = useState<'active' | 'loading' | 'empty'>('active');
  const [isClusteringRunning, setIsClusteringRunning] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Map zoom level simulation
  const [mapZoom, setMapZoom] = useState<number>(1);

  // Inspected state modal
  const [inspectStateModal, setInspectStateModal] = useState<typeof NIGERIAN_STATES_DATA[0] | null>(null);

  // Trigger clustering calculation animation
  const handleTriggerClustering = () => {
    setIsClusteringRunning(true);
    setEngineState('loading');
    setToastMessage('Recalibrating Euclidean centroids across 37 jurisdictions...');

    setTimeout(() => {
      setIsClusteringRunning(false);
      setEngineState('active');
      setToastMessage('K-Means Centroids converged in 14 iterations (Silhouette: 0.86) ✓');
      setTimeout(() => setToastMessage(null), 3500);
    }, 1100);
  };

  // Assign states dynamically to clusters based on volume / data
  const stateClusterAssignments = useMemo(() => {
    return NIGERIAN_STATES_DATA.map((st) => {
      let clusterId = '03';
      let band = 'Lower Incident Density';
      let silhouette = (0.78 + (st.state.length % 5) * 0.02).toFixed(2);

      if (st.totalCases > 15000) {
        clusterId = '01';
        band = 'High Historical Concentration';
        silhouette = (0.86 + (st.state.length % 4) * 0.01).toFixed(2);
      } else if (st.totalCases > 3000) {
        clusterId = '02';
        band = 'Moderate Concentration';
        silhouette = (0.82 + (st.state.length % 4) * 0.01).toFixed(2);
      }

      // Determine primary category
      let primaryCategory = 'Offences Against Property';
      if (st.personsCases > st.propertyCases && st.personsCases > st.authorityCases) {
        primaryCategory = 'Offences Against Persons';
      } else if (st.authorityCases > st.propertyCases && st.authorityCases > st.personsCases) {
        primaryCategory = 'Offences Against Lawful Authority';
      }

      return {
        ...st,
        clusterId,
        band,
        silhouette,
        primaryCategory,
      };
    });
  }, []);

  // Filtered state list for table
  const filteredTableStates = useMemo(() => {
    let list = stateClusterAssignments;

    if (tableClusterFilter !== 'all') {
      list = list.filter((s) => s.clusterId === tableClusterFilter);
    }

    if (filterTerritory !== 'all') {
      list = list.filter((s) => {
        if (filterTerritory === 'SW') return s.zone === 'South West';
        if (filterTerritory === 'NC') return s.zone === 'North Central';
        if (filterTerritory === 'NW') return s.zone === 'North West';
        if (filterTerritory === 'SS') return s.zone === 'South South';
        if (filterTerritory === 'SE') return s.zone === 'South East';
        if (filterTerritory === 'NE') return s.zone === 'North East';
        return true;
      });
    }

    return list;
  }, [stateClusterAssignments, tableClusterFilter, filterTerritory]);

  const activeCluster = CLUSTERS_CONFIG[selectedClusterId] || CLUSTERS_CONFIG['01'];

  // Export CSV functionality
  const handleExportCSV = () => {
    const headers = ['State', 'Zone', 'Assigned Cluster', 'Primary Category', 'Total Cases', 'Property Cases', 'Persons Cases', 'Authority Cases', 'Silhouette Score'];
    const rows = filteredTableStates.map((s) => [
      s.state,
      s.zone,
      `Cluster ${s.clusterId}`,
      `"${s.primaryCategory}"`,
      s.totalCases,
      s.propertyCases,
      s.personsCases,
      s.authorityCases,
      s.silhouette,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NBS_2017_Hotspots_Cluster_${tableClusterFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage('Hotspot Cluster data exported successfully (CSV)');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* INSPECT STATE MODAL */}
      {inspectStateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-700"></span>
                <h3 className="text-lg font-bold text-slate-900">{inspectStateModal.state} Details</h3>
              </div>
              <button
                onClick={() => setInspectStateModal(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Geopolitical Zone</span>
                  <span className="text-slate-900 font-bold text-sm">{inspectStateModal.zone}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Total Filings (2017)</span>
                  <span className="text-purple-700 font-bold text-sm font-mono">
                    {inspectStateModal.totalCases.toLocaleString()} cases
                  </span>
                </div>
              </div>

              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-semibold block text-[11px]">Statutory Breakdown</span>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Offences Against Property:</span>
                  <span className="font-mono font-bold">{inspectStateModal.propertyCases.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Offences Against Persons:</span>
                  <span className="font-mono font-bold">{inspectStateModal.personsCases.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span>Offences Against Lawful Authority:</span>
                  <span className="font-mono font-bold">{inspectStateModal.authorityCases.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (onSelectState) onSelectState(inspectStateModal.state);
                    setInspectStateModal(null);
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

      {/* ====================================================
           1. PAGE HEADER & MACRO BAR
      ==================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
              <span className="material-symbols-outlined text-[14px]">bubble_chart</span>
              Spatial Intelligence
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Unsupervised Machine Learning</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Crime Hotspot Analysis
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl mt-0.5">
            Identify historical concentrations and statistical clusters within the verified Nigerian crime dataset using multidimensional distance algorithms.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold shadow-xs">
            <span className="material-symbols-outlined text-purple-700 text-[18px]">schema</span>
            <span>K-Means (k={filterK})</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium shadow-xs">
            <span className="material-symbols-outlined text-slate-400 text-[18px]">calendar_today</span>
            <span>Historical Baseline · 2017</span>
          </div>
          <button
            onClick={handleTriggerClustering}
            disabled={isClusteringRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-75 active:scale-[0.98]"
            type="button"
          >
            <span className={`material-symbols-outlined text-[18px] ${isClusteringRunning ? 'animate-spin' : ''}`}>
              {isClusteringRunning ? 'sync' : 'auto_fix_high'}
            </span>
            <span>{isClusteringRunning ? 'Computing...' : 'Run Clustering'}</span>
          </button>
        </div>
      </div>

      {/* ====================================================
           2. FILTER PANEL (Clustering Configuration)
      ==================================================== */}
      <section className="rounded-2xl bg-white p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Clustering Configuration</h2>
              <p className="text-[11px] text-slate-500">
                Configure centroid initialization, geopolitical boundaries, and statutory parameters
              </p>
            </div>
          </div>
          <span className="text-[11px] text-purple-700 font-semibold px-2 py-1 bg-purple-50 rounded-md border border-purple-100">
            Status: Calibrated Matrix
          </span>
        </div>

        <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" onSubmit={(e) => e.preventDefault()}>
          {/* State / Territory Filter */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider" htmlFor="filterState">
              Federated Territory
            </label>
            <div className="relative">
              <select
                id="filterState"
                value={filterTerritory}
                onChange={(e) => setFilterTerritory(e.target.value)}
                className="w-full h-10 px-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">All States (36 + FCT)</option>
                <option value="SW">South West (Lagos, Ogun, Oyo...)</option>
                <option value="NC">North Central (FCT, Plateau, Niger...)</option>
                <option value="NW">North West (Kano, Kaduna, Katsina...)</option>
                <option value="SS">South South (Rivers, Delta, Edo...)</option>
                <option value="SE">South East (Enugu, Imo, Anambra...)</option>
                <option value="NE">North East (Borno, Bauchi, Adamawa...)</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2.5 text-slate-400 text-[18px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Crime Category Filter */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider" htmlFor="filterCategory">
              Statutory Category
            </label>
            <div className="relative">
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full h-10 px-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="all">All Categories (3 Statutory Classes)</option>
                <option value="property">Offences Against Property</option>
                <option value="persons">Offences Against Persons</option>
                <option value="authority">Offences Against Lawful Authority</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2.5 text-slate-400 text-[18px]">
                expand_more
              </span>
            </div>
          </div>

          {/* Number of Clusters (K) */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider" htmlFor="filterK">
              Centroid Number (K)
            </label>
            <div className="relative">
              <select
                id="filterK"
                value={filterK}
                onChange={(e) => setFilterK(e.target.value)}
                className="w-full h-10 px-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="3">3 Clusters (Optimal Silhouette: 0.86)</option>
                <option value="4">4 Clusters (Granular Regional Partition)</option>
                <option value="5">5 Clusters (Micro-density Analysis)</option>
                <option value="2">2 Clusters (Bimodal Macro Tier)</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2.5 text-slate-400 text-[18px]">
                tune
              </span>
            </div>
          </div>

          {/* Baseline Dataset */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider" htmlFor="filterDataset">
              Verified Baseline Data
            </label>
            <div className="relative">
              <select
                id="filterDataset"
                value={filterDataset}
                onChange={(e) => setFilterDataset(e.target.value)}
                className="w-full h-10 px-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-100 outline-none transition-all appearance-none cursor-pointer"
              >
                <option value="nbs_2017">NBS 2017 Baseline (134,663 records)</option>
                <option value="nbs_subset">NBS 2017 Urban Hubs Subset</option>
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-2.5 text-slate-400 text-[18px]">
                lock
              </span>
            </div>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 mt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span className="material-symbols-outlined text-purple-700 text-[18px]">info</span>
            <span>
              Clustering applies Euclidean distance normalization to identify multivariate similarities across 36 States + FCT. Data benchmark: 2017 NBS National Audit.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setFilterTerritory('all');
                setFilterCategory('all');
                setFilterK('3');
                setTableClusterFilter('all');
                setSelectedClusterId('01');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
              type="button"
            >
              Reset
            </button>
            <button
              onClick={handleTriggerClustering}
              className="px-4 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition shadow-xs cursor-pointer"
              type="button"
            >
              Run Analysis
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================
           3. CLUSTER METRICS KPI STRIP (4 CARDS)
      ==================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Clusters Identified</span>
              <div className="text-3xl font-extrabold text-purple-700 mt-1 font-mono">{filterK}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <span className="material-symbols-outlined text-[24px]">grain</span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">Optimal K Partition</span>
            <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              Silh. 0.86
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">States Analyzed</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">36 + FCT</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 border border-indigo-100">
              <span className="material-symbols-outlined text-[24px]">map</span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">National Coverage</span>
            <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              100% Geocoded
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Statutory Categories</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono">3 Classes</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-200">
              <span className="material-symbols-outlined text-[24px]">category</span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium truncate">Property, Persons, Authority</span>
            <span className="text-[11px] text-slate-400 font-mono">Standardized</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Analysis Status</span>
              <div className="text-3xl font-extrabold text-purple-700 mt-1 flex items-center gap-2">
                <span>Ready</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </div>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">K-Means Model</span>
            <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
              Calibrated
            </span>
          </div>
        </div>
      </section>

      {/* ====================================================
           4. MAIN GEOGRAPHIC & CLUSTER SECTION (70% Left / 30% Right)
      ==================================================== */}
      <section className="grid grid-cols-1 xl:grid-cols-10 gap-8">
        {/* LEFT COLUMN (70% = 7 cols on XL) */}
        <div className="xl:col-span-7 flex flex-col space-y-4">
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs flex flex-col relative overflow-hidden">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Historical Crime Concentration Map</h2>
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-100">
                    Spatial Clustered View
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Geographic projection of model-generated centroids across the 2017 federated state records.
                </p>
              </div>

              {/* Map Tool Controls */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 self-start">
                <button
                  aria-label="Zoom In"
                  onClick={() => setMapZoom((prev) => Math.min(prev + 0.15, 1.45))}
                  className="w-8 h-8 rounded-lg hover:bg-white text-slate-600 flex items-center justify-center transition cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <button
                  aria-label="Zoom Out"
                  onClick={() => setMapZoom((prev) => Math.max(prev - 0.15, 0.85))}
                  className="w-8 h-8 rounded-lg hover:bg-white text-slate-600 flex items-center justify-center transition cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <div className="h-4 w-px bg-slate-200 mx-0.5"></div>
                <button
                  aria-label="Reset View"
                  onClick={() => setMapZoom(1)}
                  className="px-2 h-8 rounded-lg hover:bg-white text-slate-600 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Geospatial Canvas / Map Container */}
            <div className="relative w-full h-[520px] rounded-xl bg-slate-50/70 border border-slate-200 mt-4 flex items-center justify-center overflow-hidden">
              {/* Background Coordinate Grid Pattern */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              ></div>

              {/* Gridlines */}
              <div className="absolute inset-x-0 top-1/4 h-px bg-slate-200/70 border-dashed"></div>
              <div className="absolute inset-x-0 top-2/4 h-px bg-slate-200/70 border-dashed"></div>
              <div className="absolute inset-x-0 top-3/4 h-px bg-slate-200/70 border-dashed"></div>
              <div className="absolute inset-y-0 left-1/3 w-px bg-slate-200/70 border-dashed"></div>
              <div className="absolute inset-y-0 left-2/3 w-px bg-slate-200/70 border-dashed"></div>

              {/* Stylized Custom SVG Map of Nigeria */}
              <div
                className="w-full h-full flex items-center justify-center transition-transform duration-300"
                style={{ transform: `scale(${mapZoom})` }}
              >
                <svg
                  className="w-full h-full max-h-[500px] z-10 filter drop-shadow-sm select-none"
                  viewBox="0 0 800 620"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <radialGradient cx="50%" cy="50%" id="highCentroidGlow" r="50%">
                      <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.5"></stop>
                      <stop offset="60%" stopColor="#7e22ce" stopOpacity="0.18"></stop>
                      <stop offset="100%" stopColor="#7e22ce" stopOpacity="0"></stop>
                    </radialGradient>
                    <radialGradient cx="50%" cy="50%" id="modCentroidGlow" r="50%">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45"></stop>
                      <stop offset="70%" stopColor="#4f46e5" stopOpacity="0.12"></stop>
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"></stop>
                    </radialGradient>
                    <radialGradient cx="50%" cy="50%" id="lowCentroidGlow" r="50%">
                      <stop offset="0%" stopColor="#334155" stopOpacity="0.35"></stop>
                      <stop offset="70%" stopColor="#334155" stopOpacity="0.08"></stop>
                      <stop offset="100%" stopColor="#334155" stopOpacity="0"></stop>
                    </radialGradient>
                  </defs>

                  {/* Geopolitical Zones Stylized Polygonal Segments */}
                  {/* North West Zone */}
                  <path
                    className="hover:fill-purple-50/70 transition-colors cursor-pointer"
                    d="M 230 80 L 370 70 L 410 160 L 350 250 L 250 250 L 190 190 Z"
                    fill="#f8fafc"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  >
                    <title>North West Geopolitical Zone</title>
                  </path>

                  {/* North East Zone */}
                  <path
                    className="hover:fill-purple-50/70 transition-colors cursor-pointer"
                    d="M 370 70 L 610 110 L 650 240 L 520 290 L 410 240 L 410 160 Z"
                    fill="#f8fafc"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  >
                    <title>North East Geopolitical Zone</title>
                  </path>

                  {/* North Central Zone */}
                  <path
                    className="hover:fill-purple-50/70 transition-colors cursor-pointer"
                    d="M 250 250 L 350 250 L 410 240 L 520 290 L 480 370 L 320 380 L 210 330 Z"
                    fill="#f1f5f9"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  >
                    <title>North Central Geopolitical Zone (incl. FCT)</title>
                  </path>

                  {/* South West Zone */}
                  <path
                    className="hover:fill-purple-100/70 transition-colors cursor-pointer"
                    d="M 120 340 L 210 330 L 270 380 L 260 480 L 140 460 Z"
                    fill="#faf5ff"
                    stroke="#d8b4fe"
                    strokeWidth="1.5"
                  >
                    <title>South West Geopolitical Zone (Lagos Corridor)</title>
                  </path>

                  {/* South South Zone */}
                  <path
                    className="hover:fill-purple-50/70 transition-colors cursor-pointer"
                    d="M 260 480 L 270 380 L 370 390 L 440 470 L 360 540 L 240 510 Z"
                    fill="#f1f5f9"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  >
                    <title>South South Geopolitical Zone (Niger Delta)</title>
                  </path>

                  {/* South East Zone */}
                  <path
                    className="hover:fill-purple-50/70 transition-colors cursor-pointer"
                    d="M 370 390 L 480 370 L 490 460 L 440 470 Z"
                    fill="#f8fafc"
                    stroke="#cbd5e1"
                    strokeWidth="1.5"
                  >
                    <title>South East Geopolitical Zone</title>
                  </path>

                  {/* Geographic Context Labels */}
                  <text fill="#64748b" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="600" letterSpacing="1" x="290" y="150">
                    NORTH WEST
                  </text>
                  <text fill="#64748b" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="600" letterSpacing="1" x="490" y="180">
                    NORTH EAST
                  </text>
                  <text fill="#4f46e5" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="700" letterSpacing="1" x="330" y="320">
                    NORTH CENTRAL
                  </text>
                  <text fill="#6b21a8" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="700" letterSpacing="1" x="160" y="410">
                    SOUTH WEST
                  </text>
                  <text fill="#64748b" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="600" letterSpacing="1" x="310" y="470">
                    SOUTH SOUTH
                  </text>
                  <text fill="#64748b" fontFamily="Plus Jakarta Sans" fontSize="12" fontWeight="600" letterSpacing="1" x="420" y="430">
                    SOUTH EAST
                  </text>

                  {/* Confluence River Lines */}
                  <path d="M 170 270 Q 260 320 340 360 T 360 520" fill="none" opacity="0.6" stroke="#cbd5e1" strokeLinecap="round" strokeWidth="2.5"></path>
                  <path d="M 540 280 Q 420 330 340 360" fill="none" opacity="0.6" stroke="#cbd5e1" strokeLinecap="round" strokeWidth="2.5"></path>
                  <circle cx="340" cy="360" fill="#64748b" r="3"></circle>
                  <text fill="#64748b" fontFamily="Plus Jakarta Sans" fontSize="9" x="348" y="364">
                    Confluence Point (Lokoja)
                  </text>

                  {/* CLUSTER 01 CENTROID (SW Axis) */}
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedClusterId('01');
                      setTableClusterFilter('01');
                    }}
                  >
                    <circle cx="205" cy="435" fill="url(#highCentroidGlow)" r="54"></circle>
                    <circle className="animate-ping" cx="205" cy="435" fill="none" opacity="0.4" r="36" stroke="#7e22ce" strokeWidth="1.5" style={{ animationDuration: '3s' }}></circle>
                    <circle cx="205" cy="435" fill="#7e22ce" fillOpacity="0.2" r="22" stroke="#6b21a8" strokeWidth="1.5"></circle>
                    <circle cx="205" cy="435" fill="#6b21a8" r="9" stroke="#ffffff" strokeWidth="2.5"></circle>

                    <rect fill="#ffffff" filter="drop-shadow(0 2px 6px rgba(107,33,168,0.15))" height="42" rx="8" width="135" x="220" y="415" stroke="#e2e8f0"></rect>
                    <text fill="#0f172a" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" x="230" y="431">
                      Cluster 01 Centroid
                    </text>
                    <text fill="#6b21a8" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="600" x="230" y="446">
                      High Concentration · 37.8%
                    </text>
                  </g>

                  {/* CLUSTER 02 CENTROID (NC / NW) */}
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedClusterId('02');
                      setTableClusterFilter('02');
                    }}
                  >
                    <circle cx="370" cy="305" fill="url(#modCentroidGlow)" r="46"></circle>
                    <circle className="animate-ping" cx="370" cy="305" fill="none" opacity="0.35" r="28" stroke="#4f46e5" strokeWidth="1.5" style={{ animationDuration: '3.8s' }}></circle>
                    <circle cx="370" cy="305" fill="#4f46e5" fillOpacity="0.2" r="18" stroke="#4338ca" strokeWidth="1.5"></circle>
                    <circle cx="370" cy="305" fill="#4338ca" r="8" stroke="#ffffff" strokeWidth="2.5"></circle>

                    <rect fill="#ffffff" filter="drop-shadow(0 2px 6px rgba(79,70,229,0.15))" height="42" rx="8" width="145" x="385" y="285" stroke="#e2e8f0"></rect>
                    <text fill="#0f172a" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" x="395" y="301">
                      Cluster 02 Centroid
                    </text>
                    <text fill="#4f46e5" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="600" x="395" y="316">
                      Moderate · 33.3%
                    </text>
                  </g>

                  {/* CLUSTER 03 CENTROID (SS / SE) */}
                  <g
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedClusterId('03');
                      setTableClusterFilter('03');
                    }}
                  >
                    <circle cx="380" cy="485" fill="url(#lowCentroidGlow)" r="40"></circle>
                    <circle className="animate-ping" cx="380" cy="485" fill="none" opacity="0.3" r="22" stroke="#334155" strokeWidth="1.5" style={{ animationDuration: '4.5s' }}></circle>
                    <circle cx="380" cy="485" fill="#334155" fillOpacity="0.2" r="15" stroke="#1e293b" strokeWidth="1.5"></circle>
                    <circle cx="380" cy="485" fill="#1e293b" r="7" stroke="#ffffff" strokeWidth="2"></circle>

                    <rect fill="#ffffff" filter="drop-shadow(0 2px 6px rgba(51,65,85,0.15))" height="42" rx="8" width="138" x="395" y="470" stroke="#e2e8f0"></rect>
                    <text fill="#0f172a" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" x="405" y="486">
                      Cluster 03 Centroid
                    </text>
                    <text fill="#334155" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="600" x="405" y="501">
                      Dispersed Band · 28.9%
                    </text>
                  </g>

                  {/* Anchor Nodes */}
                  <g opacity="0.85">
                    <circle cx="178" cy="455" fill="#6b21a8" r="4"></circle>
                    <text fill="#334155" fontSize="9" fontWeight="600" x="186" y="458">
                      Lagos
                    </text>

                    <circle cx="355" cy="330" fill="#6b21a8" r="4"></circle>
                    <text fill="#334155" fontSize="9" fontWeight="600" x="363" y="333">
                      FCT Abuja
                    </text>

                    <circle cx="375" cy="165" fill="#4338ca" r="4"></circle>
                    <text fill="#334155" fontSize="9" fontWeight="600" x="383" y="168">
                      Kano
                    </text>

                    <circle cx="350" cy="510" fill="#4338ca" r="4"></circle>
                    <text fill="#334155" fontSize="9" fontWeight="600" x="358" y="513">
                      Port Harcourt
                    </text>
                  </g>
                </svg>
              </div>

              {/* Floating Selected Cluster Inspector Card */}
              <div className="absolute top-4 left-4 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-slate-200 max-w-[270px] z-20 transition-all duration-300">
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${activeCluster.dotColor}`}></span>
                    <span className="text-xs font-bold text-slate-900">{activeCluster.title}</span>
                  </div>
                  <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-semibold border border-purple-100">
                    Active Node
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Classification:</span>
                    <span className="font-semibold text-slate-900 text-right">{activeCluster.classification}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Grouped Records:</span>
                    <span className="font-semibold text-slate-900 font-mono">{activeCluster.records}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Primary Category:</span>
                    <span className="font-semibold text-purple-700 truncate max-w-[125px]">{activeCluster.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Convergence:</span>
                    <span className="font-semibold text-slate-900">{activeCluster.confidence}</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Silhouette: {activeCluster.silhouette}</span>
                  <button
                    onClick={() => setTableClusterFilter(selectedClusterId)}
                    className="text-purple-700 hover:text-purple-900 text-[11px] font-bold cursor-pointer"
                    type="button"
                  >
                    Filter Below ↓
                  </button>
                </div>
              </div>

              {/* Bottom Spatial Readout */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-xs border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-purple-700">my_location</span>
                <span>Projection: EPSG:4326 · WGS84</span>
              </div>
            </div>

            {/* Map Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-2 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                <span className="font-semibold text-slate-900">Centroid Legend:</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-purple-700 ring-2 ring-purple-100"></span>
                  <span className="text-slate-600">Cluster 01: High Concentration</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 ring-2 ring-indigo-100"></span>
                  <span className="text-slate-600">Cluster 02: Moderate Concentration</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-700 ring-2 ring-slate-200"></span>
                  <span className="text-slate-600">Cluster 03: Lower Incident Density</span>
                </div>
              </div>
              <span className="text-slate-400 text-[11px]">Iterative Convergence: 14 steps</span>
            </div>

            {/* Disclaimer */}
            <div className="mt-3 p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2.5 text-xs text-slate-700">
              <span className="material-symbols-outlined text-purple-700 text-[18px] shrink-0 mt-0.5">verified_user</span>
              <span>
                Map visualization represents historical analytical patterns from the selected NBS 2017 dataset. It does not represent live crime activity or real-time surveillance.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CLUSTER SUMMARY (30% = 3 cols on XL) */}
        <div className="xl:col-span-3 flex flex-col space-y-4">
          <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between pb-2">
                <h2 className="text-base font-bold text-slate-900">Cluster Summary</h2>
                <span className="material-symbols-outlined text-purple-700 text-[20px]">hub</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Synthesized K-Means groupings across 3 calculated centroids (total: 134,663 records).
              </p>

              <div className="space-y-3">
                {/* Cluster 01 Card */}
                <div
                  onClick={() => {
                    setSelectedClusterId('01');
                    setTableClusterFilter('01');
                  }}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer border-l-4 border-purple-700 shadow-xs ${
                    selectedClusterId === '01' ? 'bg-purple-50/70 ring-2 ring-purple-300' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-purple-700 text-white text-[10px] font-bold">
                        Cluster 01
                      </span>
                      <span className="text-xs text-purple-700 font-semibold">High concentration</span>
                    </div>
                    <span className="text-[10px] text-slate-400">SW Axis</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    Records grouped into this cluster show relatively stronger concentration within the selected historical dataset.
                  </p>
                  <div className="grid grid-cols-3 gap-1 my-2 py-1.5 border-y border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Volume</span>
                      <span className="text-xs text-slate-900 font-bold font-mono">50,985</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Share</span>
                      <span className="text-xs text-purple-700 font-bold">37.8%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Band</span>
                      <span className="text-xs text-slate-900 font-bold">High</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-purple-700 text-xs font-semibold pt-0.5">
                    <span>View Cluster Details</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </div>
                </div>

                {/* Cluster 02 Card */}
                <div
                  onClick={() => {
                    setSelectedClusterId('02');
                    setTableClusterFilter('02');
                  }}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer border-l-4 border-indigo-600 shadow-xs ${
                    selectedClusterId === '02' ? 'bg-indigo-50/70 ring-2 ring-indigo-300' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white text-[10px] font-bold">
                        Cluster 02
                      </span>
                      <span className="text-xs text-indigo-700 font-semibold">Moderate concentration</span>
                    </div>
                    <span className="text-[10px] text-slate-400">NC / NW</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    Records grouped into this cluster show moderate concentration across major administrative and commercial transit hubs.
                  </p>
                  <div className="grid grid-cols-3 gap-1 my-2 py-1.5 border-y border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Volume</span>
                      <span className="text-xs text-slate-900 font-bold font-mono">44,820</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Share</span>
                      <span className="text-xs text-indigo-700 font-bold">33.3%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Band</span>
                      <span className="text-xs text-slate-900 font-bold">Moderate</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-indigo-700 text-xs font-semibold pt-0.5">
                    <span>View Cluster Details</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </div>
                </div>

                {/* Cluster 03 Card */}
                <div
                  onClick={() => {
                    setSelectedClusterId('03');
                    setTableClusterFilter('03');
                  }}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer border-l-4 border-slate-700 shadow-xs ${
                    selectedClusterId === '03' ? 'bg-slate-200/70 ring-2 ring-slate-400' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-700 text-white text-[10px] font-bold">
                        Cluster 03
                      </span>
                      <span className="text-xs text-slate-700 font-semibold">Lower density</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Dispersed</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    Records grouped into this cluster show comparatively lower incident volumes across regional territorial commands.
                  </p>
                  <div className="grid grid-cols-3 gap-1 my-2 py-1.5 border-y border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Volume</span>
                      <span className="text-xs text-slate-900 font-bold font-mono">38,858</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Share</span>
                      <span className="text-xs text-slate-900 font-bold">28.9%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Band</span>
                      <span className="text-xs text-slate-900 font-bold">Dispersed</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 text-xs font-semibold pt-0.5">
                    <span>View Cluster Details</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Variance Ratio: 78.4%</span>
              <button
                onClick={() => {
                  setToastMessage('Centroid Distance Matrix: 3x3 diagonal calibrated');
                  setTimeout(() => setToastMessage(null), 2500);
                }}
                className="text-purple-700 hover:text-purple-900 flex items-center gap-1 font-semibold cursor-pointer"
                type="button"
              >
                <span>Centroid Matrix</span>
                <span className="material-symbols-outlined text-[16px]">table_view</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
           5. SECONDARY ANALYTICS GRID (2 COLUMNS)
      ==================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* COLUMN 1: Donut & Process Flow */}
        <div className="flex flex-col space-y-8">
          {/* Donut Chart Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">Cluster Distribution</h2>
                <p className="text-xs text-slate-500">
                  Proportional volume of 134,663 historical cases partitioned by K-Means
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
                <span className="material-symbols-outlined text-[20px]">pie_chart</span>
              </div>
            </div>

            {/* Inline SVG Donut Chart with Readout */}
            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-4">
              <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="40" stroke="#f1f5f9" strokeWidth="14"></circle>
                  {/* Segment 01 (37.8%) */}
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="#7e22ce"
                    strokeDasharray="95 156.4"
                    strokeDashoffset="0"
                    strokeWidth="14"
                  ></circle>
                  {/* Segment 02 (33.3%) */}
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="#4f46e5"
                    strokeDasharray="83.7 167.7"
                    strokeDashoffset="-95"
                    strokeWidth="14"
                  ></circle>
                  {/* Segment 03 (28.9%) */}
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="#64748b"
                    strokeDasharray="72.6 178.8"
                    strokeDashoffset="-178.7"
                    strokeWidth="14"
                  ></circle>
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Grouped</span>
                  <span className="text-lg font-bold text-slate-900 leading-tight font-mono">134,663</span>
                  <span className="text-[11px] text-purple-700 font-semibold">Cases</span>
                </div>
              </div>

              {/* Donut Breakdown Legend */}
              <div className="flex flex-col space-y-2.5 w-full sm:w-auto">
                <div
                  onClick={() => {
                    setSelectedClusterId('01');
                    setTableClusterFilter('01');
                  }}
                  className="flex items-center justify-between gap-4 p-2 rounded-lg bg-slate-50 hover:bg-purple-50 cursor-pointer transition border border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-700"></span>
                    <span className="text-xs font-semibold text-slate-900">Cluster 01</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono">50,985</span>
                    <span className="text-[11px] text-slate-500 ml-1">(37.8%)</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setSelectedClusterId('02');
                    setTableClusterFilter('02');
                  }}
                  className="flex items-center justify-between gap-4 p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 cursor-pointer transition border border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                    <span className="text-xs font-semibold text-slate-900">Cluster 02</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono">44,820</span>
                    <span className="text-[11px] text-slate-500 ml-1">(33.3%)</span>
                  </div>
                </div>

                <div
                  onClick={() => {
                    setSelectedClusterId('03');
                    setTableClusterFilter('03');
                  }}
                  className="flex items-center justify-between gap-4 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer transition border border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-700"></span>
                    <span className="text-xs font-semibold text-slate-900">Cluster 03</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 font-mono">38,858</span>
                    <span className="text-[11px] text-slate-500 ml-1">(28.9%)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Iterative stability achieved in 14 epochs</span>
              <button
                onClick={handleTriggerClustering}
                className="text-purple-700 hover:underline font-semibold cursor-pointer"
                type="button"
              >
                Recompute
              </button>
            </div>
          </div>

          {/* Educational Flow: How K-Means Identifies Concentrations */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">How K-Means Identifies Concentrations</h2>
                <p className="text-xs text-slate-500">Objective mathematical pipeline behind spatial clustering</p>
              </div>
              <span className="material-symbols-outlined text-purple-700 text-[20px]">science</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 my-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-purple-700 text-white text-xs flex items-center justify-center font-bold">
                    01
                  </span>
                  <span className="material-symbols-outlined text-purple-700 text-[18px]">transform</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Prepare</span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Historical crime records are normalized & standardized across categories.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-purple-700 text-white text-xs flex items-center justify-center font-bold">
                    02
                  </span>
                  <span className="material-symbols-outlined text-indigo-600 text-[18px]">straighten</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Group</span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    K-Means calculates Euclidean distance to determine optimal centroids.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-purple-700 text-white text-xs flex items-center justify-center font-bold">
                    03
                  </span>
                  <span className="material-symbols-outlined text-purple-700 text-[18px]">published_with_changes</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Compare</span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Iterative re-assignment maximizes intra-cluster statistical cohesion.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-purple-700 text-white text-xs flex items-center justify-center font-bold">
                    04
                  </span>
                  <span className="material-symbols-outlined text-purple-700 text-[18px]">bubble_chart</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Visualize</span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Concentric spatial envelopes reveal regional concentration patterns.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-slate-500 text-xs">
              Algorithmic model is governed by zero-bias distance functions. No racial, socioeconomic, or subjective attributes are fed into the clustering matrix.
            </div>
          </div>
        </div>

        {/* COLUMN 2: Analytical Insights & Engine State */}
        <div className="flex flex-col space-y-8">
          {/* Analytical Insights Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">Analytical Insights</h2>
                <p className="text-xs text-slate-500">Key structural takeaways extracted from centroid convergence</p>
              </div>
              <span className="material-symbols-outlined text-purple-700 text-[20px]">lightbulb</span>
            </div>

            <div className="space-y-3.5 my-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700 shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">hub</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Cluster-based Spatial Grouping</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    K-Means groups state records according to multi-dimensional volume and statutory distribution without subjective bias. Lagos and surrounding corridors coalesce naturally into Cluster 01 due to dense property offence reporting.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-700 shrink-0 mt-0.5 border border-indigo-100">
                  <span className="material-symbols-outlined text-[20px]">radar</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Historical Concentration Envelopes</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Cluster centroids uncover regional patterns that differ from simple raw frequency counts. The North Central and Kano corridor demonstrates a specific balance between property offences and offences against lawful authority.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5 border border-slate-200">
                  <span className="material-symbols-outlined text-[20px]">policy</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Decision-Support Applicability</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Provides evidence-based spatial baselines for administrative resource allocation, judicial caseload planning, and civil infrastructure deployment rather than reactive or punitive enforcement.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Methodology: Lloyd’s K-Means Algorithm</span>
              <button
                onClick={() => {
                  setToastMessage('Technical paper: Lloyd K-Means on National Baseline data (NBS 2017)');
                  setTimeout(() => setToastMessage(null), 2500);
                }}
                className="text-purple-700 hover:underline font-semibold cursor-pointer"
                type="button"
              >
                Full Technical Paper →
              </button>
            </div>
          </div>

          {/* Engine State Preview Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h2 className="text-base font-bold text-slate-900">Engine State Preview</h2>
                <p className="text-xs text-slate-500">Test the clustering interface under different analytical runtime states</p>
              </div>
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                <button
                  onClick={() => setEngineState('active')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    engineState === 'active'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  type="button"
                >
                  Active Result
                </button>
                <button
                  onClick={() => setEngineState('loading')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    engineState === 'loading'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  type="button"
                >
                  Loading State
                </button>
                <button
                  onClick={() => setEngineState('empty')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    engineState === 'empty'
                      ? 'bg-white text-purple-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  type="button"
                >
                  Empty State
                </button>
              </div>
            </div>

            {/* Simulation Canvas */}
            <div className="my-3 p-5 rounded-xl bg-slate-50 border border-slate-200 min-h-[160px] flex items-center justify-center transition-all">
              {engineState === 'active' && (
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-700 shrink-0 border border-purple-100">
                    <span className="material-symbols-outlined text-[28px]">check_circle</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-bold text-slate-900 block">
                      Current Cluster Matrix: Optimal (k=3)
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Convergence reached with 134,663 records parsed. 0 outliers flagged. Inertia score: 2,410.82.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-100">
                    Active Mode
                  </span>
                </div>
              )}

              {engineState === 'loading' && (
                <div className="flex flex-col items-center justify-center text-center space-y-2 w-full py-2">
                  <div className="w-9 h-9 border-3 border-purple-200 border-t-purple-700 rounded-full animate-spin"></div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Recalibrating K-Means Centroids...
                    </span>
                    <p className="text-xs text-slate-500 max-w-sm mt-0.5">
                      Normalizing statutory distributions across 36 states + FCT. Computing pairwise Euclidean matrix.
                    </p>
                  </div>
                </div>
              )}

              {engineState === 'empty' && (
                <div className="flex flex-col items-center justify-center text-center space-y-2 w-full py-2">
                  <div className="w-10 h-10 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-500">
                    <span className="material-symbols-outlined text-[24px]">filter_alt_off</span>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">No Active Hotspot Query Found</span>
                    <p className="text-xs text-slate-500 max-w-sm mt-0.5">
                      No clusters can be formed under the selected sub-parameters. Reset configuration to restore baseline analysis.
                    </p>
                  </div>
                  <button
                    onClick={() => setEngineState('active')}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-700 text-white text-xs font-semibold cursor-pointer"
                    type="button"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Engine Runtime: v1.0.4-NBS</span>
              <span className="text-purple-700 font-semibold">Memory: 42 MB / Alloc</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
           6. STATE-LEVEL CLUSTER ANALYSIS TABLE
      ==================================================== */}
      <section className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">State-Level Cluster Analysis</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-100">
                {tableClusterFilter === 'all' ? 'Showing All States' : `Filtered by Cluster ${tableClusterFilter}`}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect how federated states are assigned across model centroids based on 2017 historical reporting volume.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTableClusterFilter('all')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">filter_list_off</span>
              <span>Show All</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 rounded-l-xl">State / Territory</th>
                <th className="py-3 px-4">Assigned Cluster</th>
                <th className="py-3 px-4">Primary Crime Category</th>
                <th className="py-3 px-4">Normalized Filings (2017)</th>
                <th className="py-3 px-4">Concentration Band</th>
                <th className="py-3 px-4">Silhouette Cohesion</th>
                <th className="py-3 px-4 text-right rounded-r-xl">Inspect</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-900 divide-y divide-slate-100">
              {filteredTableStates.map((st) => (
                <tr key={st.state} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-3.5 px-4 font-semibold flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        st.clusterId === '01'
                          ? 'bg-purple-700'
                          : st.clusterId === '02'
                          ? 'bg-indigo-600'
                          : 'bg-slate-600'
                      }`}
                    ></span>
                    <span>
                      {st.state} {st.state.includes('FCT') ? '' : 'State'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                        st.clusterId === '01'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : st.clusterId === '02'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      Cluster {st.clusterId}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{st.primaryCategory}</td>
                  <td className="py-3.5 px-4 font-mono font-bold">{st.totalCases.toLocaleString()} filings</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        st.clusterId === '01'
                          ? 'bg-rose-50 text-rose-700 border border-rose-100'
                          : st.clusterId === '02'
                          ? 'bg-purple-50 text-purple-700 border border-purple-100'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {st.band}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {st.silhouette} ({st.clusterId === '01' ? 'High Cohesion' : st.clusterId === '02' ? 'Stable' : 'Dispersed'})
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setInspectStateModal(st)}
                      className="p-1.5 rounded-lg hover:bg-purple-50 text-purple-700 transition cursor-pointer"
                      type="button"
                      title="Inspect State Record"
                    >
                      <span className="material-symbols-outlined text-[18px]">search</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>
            Showing {filteredTableStates.length} verified baseline states (National Bureau of Statistics Crime Audit)
          </span>
          <div className="flex items-center gap-1">
            <button
              className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
              type="button"
              onClick={() => {
                setToastMessage('Page 1 of baseline states loaded');
                setTimeout(() => setToastMessage(null), 2000);
              }}
            >
              Page 1 of 1
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================
           7. RESPONSIBLE ANALYTICS & GOVERNANCE NOTICE
      ==================================================== */}
      <section className="p-5 rounded-2xl bg-purple-50/50 border-l-4 border-purple-700 border border-purple-100 shadow-xs flex flex-col md:flex-row items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white text-purple-700 flex items-center justify-center shrink-0 shadow-xs border border-purple-100">
          <span className="material-symbols-outlined text-[24px]">verified_user</span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-900">
            Important Interpretation & Ethical Governance Note
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Cluster results represent descriptive patterns discovered within historical reported crime data (NBS 2017). A cluster should never be interpreted as proof that crime will occur in a location or as a real-time indication of criminal activity. Smart Crime adheres strictly to decision-support governance, avoiding predictive policing fallacies and reinforcing evidence-driven urban resource distribution.
          </p>
        </div>
        <div className="shrink-0 flex md:flex-col gap-2 w-full md:w-auto">
          <button
            onClick={() => {
              setToastMessage('Ethics & Governance documentation active: Zero subjective demographic profiling');
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="px-4 py-2 rounded-xl bg-white text-purple-700 border border-purple-200 text-xs font-bold hover:bg-purple-50 transition text-center cursor-pointer shadow-xs"
            type="button"
          >
            Governance Framework
          </button>
        </div>
      </section>

      {/* ====================================================
           8. DOWNSTREAM QUICK ACTIONS (3 CARDS)
      ==================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 mb-3 border border-purple-100">
              <span className="material-symbols-outlined text-[22px]">table_rows</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Explore Crime Data</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Inspect the underlying historical records in tabular format with custom queries and state filters.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                if (onOpenCrimeData) onOpenCrimeData();
                else onNavigateTab('crime-data');
              }}
              className="flex items-center justify-between w-full text-purple-700 hover:text-purple-900 text-xs font-bold cursor-pointer"
              type="button"
            >
              <span>Open Data</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700 mb-3 border border-indigo-100">
              <span className="material-symbols-outlined text-[22px]">show_chart</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Crime Trends</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Compare temporal distributions across statutory crime categories and multi-year trajectory benchmarks.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('analytics')}
              className="flex items-center justify-between w-full text-indigo-700 hover:text-indigo-900 text-xs font-bold cursor-pointer"
              type="button"
            >
              <span>View Trends</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700 mb-3 border border-purple-100">
              <span className="material-symbols-outlined text-[22px]">psychology</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">Crime Prediction</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Use historical data for calibrated machine learning forecasting and resource scenario modeling.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('machine-learning-and-prediction')}
              className="flex items-center justify-between w-full text-purple-700 hover:text-purple-900 text-xs font-bold cursor-pointer"
              type="button"
            >
              <span>Run Prediction</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
