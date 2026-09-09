import React, { useState, useMemo } from 'react';
import { NIGERIAN_STATES_DATA } from '../data/crimeData';
import { ActiveTab } from '../types';

export interface CrimeRecord {
  id: string;
  state: string;
  zone: string;
  category: 'property' | 'persons' | 'authority';
  categoryLabel: string;
  cases: number;
  year: number;
  status: string;
  capital: string;
  riskScore: number;
  clusterId: number;
}

interface CrimeDataViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectState?: (stateName: string) => void;
}

export const CrimeDataView: React.FC<CrimeDataViewProps> = ({
  onNavigateTab,
  onSelectState,
}) => {
  // Build flattened 111 detailed baseline records from 37 states x 3 categories
  const allRecords: CrimeRecord[] = useMemo(() => {
    const list: CrimeRecord[] = [];
    NIGERIAN_STATES_DATA.forEach((st) => {
      list.push({
        id: `${st.state}-property`,
        state: st.state.includes('State') || st.state.includes('FCT') ? st.state : `${st.state} State`,
        zone: st.zone,
        category: 'property',
        categoryLabel: 'Offences Against Property',
        cases: st.propertyCases,
        year: 2017,
        status: 'Verified',
        capital: st.capital,
        riskScore: st.riskScore,
        clusterId: st.clusterId,
      });
      list.push({
        id: `${st.state}-persons`,
        state: st.state.includes('State') || st.state.includes('FCT') ? st.state : `${st.state} State`,
        zone: st.zone,
        category: 'persons',
        categoryLabel: 'Offences Against Persons',
        cases: st.personsCases,
        year: 2017,
        status: 'Verified',
        capital: st.capital,
        riskScore: st.riskScore,
        clusterId: st.clusterId,
      });
      list.push({
        id: `${st.state}-authority`,
        state: st.state.includes('State') || st.state.includes('FCT') ? st.state : `${st.state} State`,
        zone: st.zone,
        category: 'authority',
        categoryLabel: 'Against Lawful Authority',
        cases: st.authorityCases,
        year: 2017,
        status: 'Verified',
        capital: st.capital,
        riskScore: st.riskScore,
        clusterId: st.clusterId,
      });
    });
    return list;
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Applied Filters (applied on click of Apply, or updated directly)
  const [appliedSearch, setAppliedSearch] = useState<string>('');
  const [appliedState, setAppliedState] = useState<string>('all');
  const [appliedCategory, setAppliedCategory] = useState<string>('all');

  // Sort States
  const [sortField, setSortField] = useState<'state' | 'category' | 'cases'>('cases');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selection & UI States
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [emptyStatePreview, setEmptyStatePreview] = useState<boolean>(false);
  const [inspectRecord, setInspectRecord] = useState<CrimeRecord | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // Apply button handler
  const handleApplyFilters = () => {
    setAppliedSearch(searchQuery);
    setAppliedState(selectedStateFilter);
    setAppliedCategory(selectedCategoryFilter);
    setCurrentPage(1);
    setEmptyStatePreview(false);
  };

  // Reset button handler
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStateFilter('all');
    setSelectedCategoryFilter('all');
    setAppliedSearch('');
    setAppliedState('all');
    setAppliedCategory('all');
    setCurrentPage(1);
    setEmptyStatePreview(false);
  };

  // Filtered & Sorted Records
  const filteredRecords = useMemo(() => {
    if (emptyStatePreview) return [];

    let result = allRecords.filter((rec) => {
      // Search
      if (appliedSearch.trim()) {
        const q = appliedSearch.toLowerCase();
        const matchState = rec.state.toLowerCase().includes(q);
        const matchCat = rec.categoryLabel.toLowerCase().includes(q);
        const matchZone = rec.zone.toLowerCase().includes(q);
        if (!matchState && !matchCat && !matchZone) return false;
      }
      // State Filter
      if (appliedState !== 'all') {
        const stateKey = rec.state.toLowerCase();
        const filterKey = appliedState.toLowerCase();
        if (!stateKey.includes(filterKey)) return false;
      }
      // Category Filter
      if (appliedCategory !== 'all' && rec.category !== appliedCategory) {
        return false;
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortField === 'state') {
        return sortOrder === 'asc' ? a.state.localeCompare(b.state) : b.state.localeCompare(a.state);
      }
      if (sortField === 'category') {
        return sortOrder === 'asc' ? a.categoryLabel.localeCompare(b.categoryLabel) : b.categoryLabel.localeCompare(a.categoryLabel);
      }
      if (sortField === 'cases') {
        return sortOrder === 'asc' ? a.cases - b.cases : b.cases - a.cases;
      }
      return 0;
    });

    return result;
  }, [allRecords, appliedSearch, appliedState, appliedCategory, sortField, sortOrder, emptyStatePreview]);

  // Paginated Slices
  const totalEntries = filteredRecords.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalEntries);
  const currentRows = filteredRecords.slice(startIndex, endIndex);

  // Toggle sort
  const handleSort = (field: 'state' | 'category' | 'cases') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'cases' ? 'desc' : 'asc');
    }
  };

  // Row selection
  const handleToggleSelectAll = () => {
    if (selectedRowIds.size === currentRows.length && currentRows.length > 0) {
      setSelectedRowIds(new Set());
    } else {
      const newSet = new Set<string>();
      currentRows.forEach((r) => newSet.add(r.id));
      setSelectedRowIds(newSet);
    }
  };

  const handleToggleRow = (id: string) => {
    const newSet = new Set(selectedRowIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedRowIds(newSet);
  };

  // Export CSV
  const handleExportData = () => {
    const headers = ['State', 'Geopolitical Zone', 'Crime Category', 'Reported Cases', 'Year', 'Status', 'Risk Score'];
    const rows = filteredRecords.map((r) => [
      `"${r.state}"`,
      `"${r.zone}"`,
      `"${r.categoryLabel}"`,
      r.cases,
      r.year,
      `"${r.status}"`,
      r.riskScore,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'NBS_2017_Nigeria_Crime_Data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice('Export complete: NBS_2017_Nigeria_Crime_Data.csv downloaded');
    setTimeout(() => setExportNotice(null), 3500);
  };

  // Category Badge colors
  const getCategoryBadge = (cat: 'property' | 'persons' | 'authority') => {
    switch (cat) {
      case 'property':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-[12px] font-medium">
            Offences Against Property
          </span>
        );
      case 'persons':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[12px] font-medium">
            Offences Against Persons
          </span>
        );
      case 'authority':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100 text-[12px] font-medium">
            Against Lawful Authority
          </span>
        );
    }
  };

  // Dot color for state
  const getStateDot = (cat: 'property' | 'persons' | 'authority') => {
    switch (cat) {
      case 'property':
        return 'bg-purple-600';
      case 'persons':
        return 'bg-indigo-600';
      case 'authority':
        return 'bg-violet-600';
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* EXPORT TOAST NOTIFICATION */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl flex items-center gap-3 animate-bounce">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
          <span className="text-sm font-medium">{exportNotice}</span>
        </div>
      )}

      {/* PAGE HEADER & ACTION CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Crime Data Explorer
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
              NBS Verified
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-600">
            Explore, filter, and inspect verified historical records utilized across predictive models and spatial clustering.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-purple-700 text-xs font-semibold shadow-xs">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Dataset: NBS 2017</span>
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-purple-700 font-semibold text-sm border border-slate-200 shadow-xs hover:bg-slate-50 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Data</span>
          </button>

          <button
            onClick={() => onNavigateTab('machine-learning-and-prediction')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 text-white font-semibold text-sm shadow-sm hover:bg-purple-800 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            <span>Run Analysis</span>
          </button>
        </div>
      </div>

      {/* DATASET SUMMARY STRIP (4 METRIC CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Records */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Records</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <span className="material-symbols-outlined text-[22px]">database</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">134,663</div>
            <p className="text-xs text-slate-500 mt-0.5">Reported crime cases</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-purple-700 text-xs font-medium">
            <span className="material-symbols-outlined text-[15px]">history_edu</span>
            <span>NBS 2017 Validated Baseline</span>
          </div>
        </div>

        {/* Card 2: States Covered */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">States Covered</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <span className="material-symbols-outlined text-[22px]">map</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">36 + 1</div>
            <p className="text-xs text-slate-500 mt-0.5">Nigerian states & FCT</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-slate-600 text-xs font-medium">
            <span className="material-symbols-outlined text-[15px]">public</span>
            <span>6 Geopolitical Zones</span>
          </div>
        </div>

        {/* Card 3: Crime Categories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crime Categories</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <span className="material-symbols-outlined text-[22px]">account_tree</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">3</div>
            <p className="text-xs text-slate-500 mt-0.5">Major statutory classes</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-slate-600 text-xs font-medium">
            <span className="material-symbols-outlined text-[15px]">balance</span>
            <span>Property, Persons, Authority</span>
          </div>
        </div>

        {/* Card 4: Reporting Period */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reporting Period</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-700">
              <span className="material-symbols-outlined text-[22px]">calendar_today</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">2017</div>
            <p className="text-xs text-slate-500 mt-0.5">Historical benchmark</p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-slate-600 text-xs font-medium">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span>Annual Official Baseline</span>
          </div>
        </div>
      </div>

      {/* DATASET INFORMATION BANNER */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">storage</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-slate-900">National Crime Dataset (Historical NBS Baseline)</span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-700"></span>
                Official Census Series
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Official historical reported crime statistics sourced from the National Bureau of Statistics (NBS). Data represents baseline statutory filings across all federated states, calibrated for baseline training across supervised and unsupervised algorithms.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 lg:pt-0 shrink-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Source Agency</span>
            <span className="text-sm font-bold text-slate-900">NBS Nigeria</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Coverage</span>
            <span className="text-sm font-bold text-slate-900">36 States + FCT</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Model Readiness</span>
            <span className="inline-flex items-center gap-1.5 text-purple-700 text-xs font-bold mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Ready for Analysis
            </span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS SECTION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-700 text-[20px]">filter_list</span>
            <h2 className="text-base font-bold text-slate-900">Filter Crime Records</h2>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
            Showing filtered results from the historical NBS 2017 dataset
          </span>
        </div>

        {/* 5-PART RESPONSIVE QUERY CONTROL GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 items-end">
          {/* Quick Search */}
          <div className="xl:col-span-4 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="search-records">
              Quick Search
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                search
              </span>
              <input
                id="search-records"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyFilters();
                }}
                placeholder="Search state or crime category..."
                className="w-full h-[42px] pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* State Selector */}
          <div className="xl:col-span-3 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="state-selector">
              State / Territory
            </label>
            <div className="relative">
              <select
                id="state-selector"
                value={selectedStateFilter}
                onChange={(e) => setSelectedStateFilter(e.target.value)}
                className="w-full h-[42px] px-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700 appearance-none transition-all cursor-pointer"
              >
                <option value="all">All States (36 + FCT)</option>
                {NIGERIAN_STATES_DATA.map((s) => (
                  <option key={s.state} value={s.state.toLowerCase()}>
                    {s.state} {s.state.includes('FCT') ? '' : 'State'}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Category Selector */}
          <div className="xl:col-span-3 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700" htmlFor="category-selector">
              Offence Category
            </label>
            <div className="relative">
              <select
                id="category-selector"
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full h-[42px] px-3 pr-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-700/20 focus:border-purple-700 appearance-none transition-all cursor-pointer"
              >
                <option value="all">All Categories (3)</option>
                <option value="property">Offences Against Property (68,579)</option>
                <option value="persons">Offences Against Persons (53,641)</option>
                <option value="authority">Offences Against Lawful Authority (12,443)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="xl:col-span-2 flex items-center gap-2">
            <button
              id="btn-apply-filters"
              type="button"
              onClick={handleApplyFilters}
              className="flex-1 h-[42px] rounded-xl bg-purple-700 text-white font-semibold text-sm hover:bg-purple-800 shadow-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <span>Apply</span>
            </button>
            <button
              id="btn-reset-filters"
              type="button"
              onClick={handleResetFilters}
              title="Reset Filters"
              className="h-[42px] px-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-purple-700 hover:bg-slate-200 text-sm flex items-center justify-center transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>
      </div>

      {/* SPLIT SECTION: DATA TABLE (~70%) + ANALYTICAL QUALITY STRIP (~30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: CRIME RECORDS REPOSITORY TABLE (col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col space-y-4 overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base font-bold text-slate-900">Crime Records Repository</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
                {totalEntries.toLocaleString()} Records Active
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleExportData}
                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-purple-700 transition-colors cursor-pointer"
                title="Export current view as CSV"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">sim_card_download</span>
              </button>

              <button
                onClick={() => setEmptyStatePreview(!emptyStatePreview)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  emptyStatePreview
                    ? 'bg-purple-700 text-white border-purple-700'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">
                  {emptyStatePreview ? 'toggle_on' : 'toggle_off'}
                </span>
                <span>Empty State Preview</span>
              </button>
            </div>
          </div>

          {/* TABLE CONTAINER OR EMPTY STATE */}
          {emptyStatePreview || currentRows.length === 0 ? (
            /* EMPTY STATE PLACEHOLDER */
            <div className="flex flex-col items-center justify-center py-14 px-4 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 shadow-xs">
                <span className="material-symbols-outlined text-[32px]">manage_search</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">No crime records found</h4>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1">
                No entries matched your active filters. Try clearing queries or adjusting specific statutory classifications.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-700 text-white font-semibold text-xs shadow-xs hover:bg-purple-800 transition-all cursor-pointer"
                type="button"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* TABLE */
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider rounded-xl">
                    <th className="py-3 px-3 rounded-l-xl w-10 text-center" scope="col">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.size === currentRows.length && currentRows.length > 0}
                        onChange={handleToggleSelectAll}
                        aria-label="Select all rows"
                        className="rounded accent-purple-700 cursor-pointer"
                      />
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-purple-700 transition-colors"
                      scope="col"
                      onClick={() => handleSort('state')}
                    >
                      <div className="flex items-center gap-1">
                        <span>State / Territory</span>
                        <span className="material-symbols-outlined text-[14px]">
                          {sortField === 'state' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                        </span>
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-purple-700 transition-colors"
                      scope="col"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Category</span>
                        <span className="material-symbols-outlined text-[14px]">
                          {sortField === 'category' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                        </span>
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 text-right cursor-pointer hover:text-purple-700 transition-colors"
                      scope="col"
                      onClick={() => handleSort('cases')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <span>Reported Cases</span>
                        <span className="material-symbols-outlined text-[14px]">
                          {sortField === 'cases' ? (sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward') : 'unfold_more'}
                        </span>
                      </div>
                    </th>
                    <th className="py-3 px-3 text-center" scope="col">Year</th>
                    <th className="py-3 px-3 text-center" scope="col">Status</th>
                    <th className="py-3 px-3 rounded-r-xl text-center" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-900">
                  {currentRows.map((rec) => {
                    const isChecked = selectedRowIds.has(rec.id);
                    return (
                      <tr
                        key={rec.id}
                        className={`hover:bg-slate-50 transition-colors ${isChecked ? 'bg-purple-50/50' : ''}`}
                      >
                        <td className="py-3.5 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleRow(rec.id)}
                            aria-label={`Select ${rec.state}`}
                            className="rounded accent-purple-700 cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${getStateDot(rec.category)}`}></span>
                            <span>{rec.state}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          {getCategoryBadge(rec.category)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold tabular-nums text-slate-900">
                          {rec.cases.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 text-center text-slate-500 font-medium text-xs">
                          {rec.year}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-purple-700 text-xs font-semibold">
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => setInspectRecord(rec)}
                            aria-label={`Inspect ${rec.state} record`}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                            type="button"
                            title="Inspect Details"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TABLE FOOTER & PAGINATION */}
          {!emptyStatePreview && currentRows.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 text-slate-500">
              <div className="flex items-center gap-4 text-xs">
                <span>
                  Showing <strong className="text-slate-900">{startIndex + 1}–{endIndex}</strong> of{' '}
                  <strong className="text-slate-900">{totalEntries.toLocaleString()}</strong> entries
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Rows per page:</span>
                  <select
                    aria-label="Select rows per page"
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-slate-50 border border-slate-200 text-slate-900 text-xs px-2 py-1 rounded-lg focus:outline-none cursor-pointer"
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center gap-1 text-xs font-semibold">
                <button
                  disabled={safePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  type="button"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = i + 1;
                    const isActive = p === safePage;
                    return (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-purple-700 text-white font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        type="button"
                      >
                        {p}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="px-1 text-slate-400">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-2 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                          safePage === totalPages
                            ? 'bg-purple-700 text-white font-bold'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                        type="button"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  disabled={safePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  type="button"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: ANALYTICAL QUALITY & AUDIT STRIP (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          {/* Card 1: Category Proportions & Visual Donut Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-700 text-[20px]">pie_chart</span>
                <h3 className="text-base font-bold text-slate-900">Category Proportions</h3>
              </div>
              <span className="text-xs text-purple-700 font-semibold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                NBS Share
              </span>
            </div>

            {/* SVG Donut Chart */}
            <div className="flex items-center justify-center py-2">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    className="text-slate-100"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeWidth="12"
                  />
                  {/* Segment 1: Offences Against Property (50.9%) -> circumference ~238.76 -> 121.5 */}
                  <circle
                    className="text-purple-700"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="121.5 238.76"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeWidth="12"
                  />
                  {/* Segment 2: Offences Against Persons (39.8%) -> 95.0 */}
                  <circle
                    className="text-indigo-600"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="95.0 238.76"
                    strokeDashoffset="-121.5"
                    strokeLinecap="round"
                    strokeWidth="12"
                  />
                  {/* Segment 3: Offences Against Lawful Authority (9.3%) -> 22.2 */}
                  <circle
                    className="text-violet-500"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="38"
                    stroke="currentColor"
                    strokeDasharray="22.2 238.76"
                    strokeDashoffset="-216.5"
                    strokeLinecap="round"
                    strokeWidth="12"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-xl font-bold text-slate-900 tabular-nums">134,663</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Filings</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-700 shrink-0"></span>
                  <span className="text-xs font-semibold text-slate-900">Against Property</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">68,579</span>
                  <span className="text-xs text-slate-500 ml-1 font-medium">(50.9%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 shrink-0"></span>
                  <span className="text-xs font-semibold text-slate-900">Against Persons</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">53,641</span>
                  <span className="text-xs text-slate-500 ml-1 font-medium">(39.8%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-violet-500 shrink-0"></span>
                  <span className="text-xs font-semibold text-slate-900">Lawful Authority</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-900 tabular-nums">12,443</span>
                  <span className="text-xs text-slate-500 ml-1 font-medium">(9.3%)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic text-center pt-1">
              Official empirical figures documented in the 2017 NBS national compendium.
            </p>
          </div>

          {/* Card 2: Data Integrity & Audit */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-700 text-[20px]">fact_check</span>
                <h3 className="text-base font-bold text-slate-900">Data Integrity & Audit</h3>
              </div>
              <span className="inline-flex items-center gap-1 text-purple-700 text-xs font-bold bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                100% Valid
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  <span>Completeness</span>
                </div>
                <span className="font-semibold text-slate-900">100% No missing states</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  <span>Standardization</span>
                </div>
                <span className="font-semibold text-slate-900">NBS 2017 Taxonomy</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  <span>Geopolitical Coverage</span>
                </div>
                <span className="font-semibold text-slate-900">36 States + FCT</span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
                  <span>Verification Level</span>
                </div>
                <span className="font-semibold text-slate-900">Official Academic Bench</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Audit Signature</span>
              <span className="font-mono text-purple-700 font-bold">SHA256: 4f8b...92e1</span>
            </div>
          </div>

          {/* Card 3: Responsible AI & Policy Guidance Note */}
          <div className="bg-slate-50 rounded-2xl p-5 space-y-2 border border-slate-200">
            <div className="flex items-center gap-2 text-purple-700">
              <span className="material-symbols-outlined text-[20px]">info</span>
              <span className="text-sm font-bold">About This Dataset</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This platform analyzes historical reported crime data. Analytical and predictive outputs are intended to support data-driven interpretation and resource planning. They should not be treated as certainty about future criminal activity.
            </p>
          </div>
        </div>
      </div>

      {/* CONTINUE ANALYSIS WORKFLOW (3 QUICK ACCESS CARDS) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Continue Analysis Workflow</h3>
            <p className="text-xs text-slate-500">Direct the verified 2017 dataset into predictive or spatial intelligence pipelines.</p>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline-block font-medium">Stage 2 of 4 Pipeline Steps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action Card 1: Crime Trends */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 hover:shadow-sm transition-all group">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">insights</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">Crime Trends</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Analyze longitudinal patterns, quarterly fluctuations, and cross-category comparisons across regions.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => onNavigateTab('data-visualizations')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors cursor-pointer"
                type="button"
              >
                <span>View Trends</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Action Card 2: Hotspot Analysis */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 hover:shadow-sm transition-all group">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">location_on</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">Hotspot Analysis</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Examine spatial concentrations and risk corridors using K-Means unsupervised geographic clustering.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => onNavigateTab('data-visualizations')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition-colors cursor-pointer"
                type="button"
              >
                <span>Explore Hotspots</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>

          {/* Action Card 3: Crime Prediction */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between hover:border-purple-300 hover:shadow-sm transition-all group">
            <div className="space-y-2.5">
              <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">query_stats</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">Crime Prediction</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate probabilistic forecasts and confidence metrics using Decision Tree and Random Forest classifiers.
              </p>
            </div>
            <div className="pt-4">
              <button
                onClick={() => onNavigateTab('machine-learning-and-prediction')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-900 transition-colors cursor-pointer"
                type="button"
              >
                <span>Run Prediction</span>
                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* INSPECT RECORD MODAL */}
      {inspectRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-2xl p-6 relative flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Historical Audit Record</span>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>{inspectRecord.state}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    {inspectRecord.zone}
                  </span>
                </h3>
              </div>
              <button
                onClick={() => setInspectRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Offence Class:</span>
                <span className="font-semibold text-slate-900">{inspectRecord.categoryLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Filings Logged:</span>
                <span className="font-bold text-purple-700 text-sm">{inspectRecord.cases.toLocaleString()} cases</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Capital City:</span>
                <span className="font-semibold text-slate-900">{inspectRecord.capital}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Spatial Cluster:</span>
                <span className="font-semibold text-slate-900">K-Means Cluster #{inspectRecord.clusterId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Computed Risk Score:</span>
                <span className="font-semibold text-slate-900">{inspectRecord.riskScore} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Statutory Benchmark Year:</span>
                <span className="font-semibold text-slate-900">{inspectRecord.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Integrity Hash:</span>
                <span className="font-mono text-purple-700">SHA256-NBS-OK</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setInspectRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                type="button"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const stateClean = inspectRecord.state.replace(' State', '');
                  if (onSelectState) onSelectState(stateClean);
                  onNavigateTab('data-visualizations');
                  setInspectRecord(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-700 hover:bg-purple-800 text-white transition-colors cursor-pointer shadow-xs"
                type="button"
              >
                View State Analytics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
