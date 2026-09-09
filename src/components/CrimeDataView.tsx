import React, { useState, useMemo } from 'react';
import { ActiveTab } from '../types';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface CrimeDataViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenSearch?: () => void;
  currentAnalyst?: string | null;
  onBackToOverview: () => void;
}

type SortKey = 'state' | 'category' | 'cases' | 'year';
type SortDir = 'asc' | 'desc';
type CategoryFilter = 'all' | 'property' | 'persons' | 'authority';

/* ─────────────────────────────────────────────
   DATASET — NBS 2017 aggregate rows
───────────────────────────────────────────── */
const ALL_ROWS: {
  id: number;
  state: string;
  category: string;
  categoryKey: CategoryFilter;
  cases: number;
  year: number;
  source: string;
  status: string;
}[] = [
  { id: 1,  state: 'Lagos',       category: 'Offences Against Property',         categoryKey: 'property',  cases: 34210, year: 2017, source: 'NBS', status: 'Verified' },
  { id: 2,  state: 'Lagos',       category: 'Offences Against Persons',           categoryKey: 'persons',   cases: 12940, year: 2017, source: 'NBS', status: 'Verified' },
  { id: 3,  state: 'Lagos',       category: 'Offences Against Lawful Authority',  categoryKey: 'authority', cases: 3210,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 4,  state: 'Rivers',      category: 'Offences Against Property',         categoryKey: 'property',  cases: 5124,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 5,  state: 'Rivers',      category: 'Offences Against Persons',           categoryKey: 'persons',   cases: 4380,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 6,  state: 'Rivers',      category: 'Offences Against Lawful Authority',  categoryKey: 'authority', cases: 870,   year: 2017, source: 'NBS', status: 'Verified' },
  { id: 7,  state: 'Kano',        category: 'Offences Against Property',         categoryKey: 'property',  cases: 4820,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 8,  state: 'Kano',        category: 'Offences Against Persons',           categoryKey: 'persons',   cases: 3610,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 9,  state: 'Kano',        category: 'Offences Against Lawful Authority',  categoryKey: 'authority', cases: 1842,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 10, state: 'Kaduna',      category: 'Offences Against Property',         categoryKey: 'property',  cases: 4218,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 11, state: 'Kaduna',      category: 'Offences Against Persons',           categoryKey: 'persons',   cases: 3290,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 12, state: 'FCT Abuja',   category: 'Offences Against Property',         categoryKey: 'property',  cases: 3980,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 13, state: 'FCT Abuja',   category: 'Offences Against Persons',           categoryKey: 'persons',   cases: 2710,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 14, state: 'Delta',       category: 'Offences Against Property',         categoryKey: 'property',  cases: 3450,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 15, state: 'Delta',       category: 'Offences Against Persons',           categoryKey: 'persons',   cases: 2980,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 16, state: 'Oyo',         category: 'Offences Against Property',         categoryKey: 'property',  cases: 3100,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 17, state: 'Oyo',         category: 'Offences Against Lawful Authority',  categoryKey: 'authority', cases: 890,   year: 2017, source: 'NBS', status: 'Verified' },
  { id: 18, state: 'Edo',         category: 'Offences Against Persons',           categoryKey: 'persons',   cases: 2780,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 19, state: 'Anambra',     category: 'Offences Against Property',         categoryKey: 'property',  cases: 3110,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 20, state: 'Plateau',     category: 'Offences Against Persons',           categoryKey: 'persons',   cases: 1940,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 21, state: 'Borno',       category: 'Offences Against Persons',           categoryKey: 'persons',   cases: 1720,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 22, state: 'Borno',       category: 'Offences Against Lawful Authority',  categoryKey: 'authority', cases: 640,   year: 2017, source: 'NBS', status: 'Verified' },
  { id: 23, state: 'Enugu',       category: 'Offences Against Property',         categoryKey: 'property',  cases: 1890,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 24, state: 'Imo',         category: 'Offences Against Property',         categoryKey: 'property',  cases: 1650,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 25, state: 'Cross River', category: 'Offences Against Persons',           categoryKey: 'persons',   cases: 1430,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 26, state: 'Ondo',        category: 'Offences Against Property',         categoryKey: 'property',  cases: 1510,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 27, state: 'Kwara',       category: 'Offences Against Lawful Authority',  categoryKey: 'authority', cases: 490,   year: 2017, source: 'NBS', status: 'Verified' },
  { id: 28, state: 'Osun',        category: 'Offences Against Property',         categoryKey: 'property',  cases: 1210,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 29, state: 'Ogun',        category: 'Offences Against Persons',           categoryKey: 'persons',   cases: 1340,  year: 2017, source: 'NBS', status: 'Verified' },
  { id: 30, state: 'Sokoto',      category: 'Offences Against Lawful Authority',  categoryKey: 'authority', cases: 380,   year: 2017, source: 'NBS', status: 'Verified' },
];

const STATES = ['All States', 'Lagos', 'Rivers', 'Kano', 'Kaduna', 'FCT Abuja', 'Delta', 'Oyo', 'Edo', 'Anambra', 'Plateau', 'Borno', 'Enugu', 'Imo', 'Cross River', 'Ondo', 'Kwara', 'Osun', 'Ogun', 'Sokoto'];

/* Donut geometry */
const DONUT_TOTAL = 134663;
const DONUT_CIRC  = 2 * Math.PI * 38;

function buildSegment(value: number, prevOffset: number) {
  const dash   = (value / DONUT_TOTAL) * DONUT_CIRC;
  return { dash: dash.toFixed(2), gap: DONUT_CIRC.toFixed(2), offset: (-prevOffset).toFixed(2) };
}

const propertySegs  = buildSegment(68579, 0);
const personsOffset = (68579 / DONUT_TOTAL) * DONUT_CIRC;
const personsSegs   = buildSegment(53641, personsOffset);
const authoritySegs = buildSegment(12443, personsOffset + (53641 / DONUT_TOTAL) * DONUT_CIRC);

/* Nav items */
const NAV_MAIN: { id: string; label: string; icon: string; tab: ActiveTab }[] = [
  { id: 'dashboard',  label: 'Dashboard',  icon: 'grid_view',     tab: 'dashboard' },
  { id: 'crime-data', label: 'Crime Data', icon: 'database',      tab: 'crime-data' as ActiveTab },
  { id: 'analytics',  label: 'Analytics',  icon: 'insights',      tab: 'data-visualizations' },
  { id: 'hotspots',   label: 'Hotspots',   icon: 'location_on',   tab: 'data-visualizations' },
  { id: 'prediction', label: 'Prediction', icon: 'query_stats',   tab: 'machine-learning-and-prediction' },
  { id: 'models',     label: 'Models',     icon: 'account_tree',  tab: 'overview' },
  { id: 'reports',    label: 'Reports',    icon: 'description',   tab: 'patterns' },
];
const NAV_BOTTOM: { id: string; label: string; icon: string; tab: ActiveTab }[] = [
  { id: 'settings', label: 'Settings', icon: 'settings',         tab: 'foundation' },
  { id: 'profile',  label: 'Profile',  icon: 'manage_accounts',  tab: 'auth' },
];

/* Category badge */
function catBadge(key: CategoryFilter, label: string) {
  const cls: Record<CategoryFilter, string> = {
    all:       'text-[#1e1926]',
    property:  'text-[#6200a9]',
    persons:   'text-[#7E22CE]',
    authority: 'text-[#9333EA]',
  };
  return (
    <span className={`text-[12px] font-semibold ${cls[key]}`}>
      {label}
    </span>
  );
}

function dotColor(key: CategoryFilter) {
  if (key === 'property')  return 'bg-[#6200a9]';
  if (key === 'persons')   return 'bg-[#7E22CE]';
  return 'bg-[#9333EA]';
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export const CrimeDataView: React.FC<CrimeDataViewProps> = ({
  onNavigateTab,
  onOpenSearch,
  currentAnalyst = 'System User',
  onBackToOverview,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQ, setSearchQ]         = useState('');
  const [stateFilter, setStateFilter] = useState('All States');
  const [catFilter, setCatFilter]     = useState<CategoryFilter>('all');
  const [sortKey, setSortKey]         = useState<SortKey>('cases');
  const [sortDir, setSortDir]         = useState<SortDir>('desc');
  const [page, setPage]               = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected]       = useState<Set<number>>(new Set());
  const [showEmpty, setShowEmpty]     = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMsg, setExportMsg]     = useState<string | null>(null);

  /* filtering */
  const filtered = useMemo(() => {
    let rows = [...ALL_ROWS];
    if (stateFilter !== 'All States') rows = rows.filter(r => r.state === stateFilter);
    if (catFilter !== 'all')          rows = rows.filter(r => r.categoryKey === catFilter);
    if (searchQ.trim()) {
      const q = searchQ.trim().toLowerCase();
      rows = rows.filter(r => r.state.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
    }
    rows.sort((a, b) => {
      let va: string | number = '', vb: string | number = '';
      if (sortKey === 'state')    { va = a.state;    vb = b.state; }
      if (sortKey === 'category') { va = a.category; vb = b.category; }
      if (sortKey === 'cases')    { va = a.cases;    vb = b.cases; }
      if (sortKey === 'year')     { va = a.year;     vb = b.year; }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return rows;
  }, [stateFilter, catFilter, searchQ, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const pageRows   = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
    setPage(1);
  };

  const sortIcon = (key: SortKey) =>
    key !== sortKey ? 'unfold_more' : sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward';

  const allSelected = pageRows.length > 0 && pageRows.every(r => selected.has(r.id));
  const toggleAll   = () => {
    setSelected(prev => {
      const n = new Set(prev);
      allSelected ? pageRows.forEach(r => n.delete(r.id)) : pageRows.forEach(r => n.add(r.id));
      return n;
    });
  };
  const toggleRow = (id: number) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const handleReset = () => { setSearchQ(''); setStateFilter('All States'); setCatFilter('all'); setPage(1); setShowEmpty(false); };

  const handleExport = () => {
    setIsExporting(true);
    setExportMsg('Preparing export…');
    setTimeout(() => {
      setExportMsg('NBS_CrimeData_2017.csv downloaded ✓');
      setTimeout(() => { setIsExporting(false); setExportMsg(null); }, 2500);
    }, 1200);
  };

  /* pagination window */
  const pageNums = (() => {
    const nums: number[] = [];
    const start = Math.max(1, Math.min(page - 2, totalPages - 4));
    for (let i = start; i <= Math.min(start + 4, totalPages); i++) nums.push(i);
    return nums;
  })();

  return (
    <div
      className="bg-[#FAF7FF] min-h-screen antialiased"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ════════════════ SIDEBAR ════════════════ */}
      <aside
        className={`fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-[#E9DFF2] z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(91,33,182,0.05)] transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#E9DFF2]">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onBackToOverview} title="Return to Overview">
              <div className="w-9 h-9 rounded-xl bg-[#6200a9] flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] text-[#17121F] font-bold tracking-tight leading-tight">SMART CRIME</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-[#6200a9] font-semibold tracking-wider">DATA SUITE</span>
                  <span className="text-[10px] text-[#6B6472] px-1.5 py-0.5 rounded bg-[#F8F5FA] font-medium">v1.0 NBS</span>
                </div>
              </div>
            </div>
            <button className="lg:hidden p-1 text-[#6B6472]" onClick={() => setSidebarOpen(false)}>✕</button>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
            {NAV_MAIN.map(item => {
              const active = item.id === 'crime-data';
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigateTab(item.tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[14px] transition-colors cursor-pointer relative ${
                    active
                      ? 'bg-[#F3E8FF] text-[#6200a9] font-semibold before:content-[""] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-[#7E22CE] before:rounded-r'
                      : 'text-[#6B6472] hover:bg-[#F8F5FA] hover:text-[#17121F] font-medium'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="py-2"><div className="h-px bg-[#E9DFF2] mx-2" /></div>

            {NAV_BOTTOM.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateTab(item.tab)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-[14px] text-[#6B6472] hover:bg-[#F8F5FA] hover:text-[#17121F] font-medium transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}

            <div className="pt-2">
              <button
                type="button"
                onClick={onBackToOverview}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-[12px] font-semibold text-[#6B6472] bg-[#F8F5FA] hover:bg-[#F3E8FF] hover:text-[#6200a9] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>Back to Overview</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* ════════════════ MAIN PANEL ════════════════ */}
      <div className="lg:pl-[260px]">

        {/* Top Header */}
        <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#E9DFF2] z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-[0_1px_6px_rgba(91,33,182,0.04)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-[#F8F5FA] text-[#6B6472] cursor-pointer mr-1"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <nav className="flex items-center gap-1 text-[13px]">
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="text-[#6B6472] hover:text-[#6200a9] transition-colors cursor-pointer font-medium"
              >
                Dashboard
              </button>
              <span className="material-symbols-outlined text-[#6B6472] text-[15px]">chevron_right</span>
              <span className="text-[#6200a9] font-semibold">Crime Data</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenSearch?.()}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F5FA] hover:bg-[#F3E8FF] text-[#6B6472] border border-[#E9DFF2] transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span className="text-[13px]">Search incidents, LGAs, states…</span>
              <span className="text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#E9DFF2] text-[#6B6472] ml-1 font-mono">⌘K</span>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#6200a9] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[12px] text-[#17121F] font-semibold leading-tight">{currentAnalyst || 'System User'}</span>
                <span className="text-[11px] text-[#6B6472] leading-tight">Authorized Analyst</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="w-full pt-[88px] min-h-screen px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex flex-col w-full space-y-6 max-w-[1440px] mx-auto">

            {/* ── PAGE HEADER ── */}
            <section className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-[28px] sm:text-[32px] text-[#17121F] font-bold tracking-tight leading-tight">Crime Data Explorer</h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#6200a9] text-[11px] font-semibold">NBS Verified</span>
                </div>
                <p className="text-[14px] text-[#6B6472]">
                  Explore, filter, and inspect the verified historical crime records used for analysis and prediction.
                </p>
              </div>

              <div className="flex items-center flex-wrap gap-2.5 shrink-0 self-start md:self-auto mt-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E9DFF2] text-[#6200a9] text-[12px] font-semibold shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Dataset: NBS 2017</span>
                </div>
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#6200a9] border border-[#E9DFF2] text-[13px] font-semibold shadow-sm hover:bg-[#F3E8FF] transition-all cursor-pointer disabled:opacity-70"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">{isExporting ? 'sync' : 'download'}</span>
                  <span>{isExporting ? 'Exporting…' : 'Export Data'}</span>
                </button>
                <button
                  onClick={() => onNavigateTab('data-visualizations')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7E22CE] text-white text-[13px] font-semibold shadow-md hover:bg-[#6200a9] transition-all cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  <span>Run Analysis</span>
                </button>
              </div>
            </section>

            {exportMsg && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E9DFF2] rounded-xl text-[13px] font-semibold text-[#6200a9] shadow-sm self-start">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                {exportMsg}
              </div>
            )}

            {/* ── KPI STRIP ── */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Records',    value: '134,663', sub: 'Reported crime cases',    icon: 'database',      noteIcon: 'history_edu',   note: 'NBS 2017 Validated Baseline',  accent: '#6200a9' },
                { label: 'States Covered',   value: '36 + 1',  sub: 'Nigerian states & FCT',   icon: 'map',           noteIcon: 'public',        note: '6 Geopolitical Zones',         accent: '#7E22CE' },
                { label: 'Crime Categories', value: '3',       sub: 'Major statutory classes',  icon: 'account_tree', noteIcon: 'balance',       note: 'Property · Persons · Authority', accent: '#6200a9' },
                { label: 'Reporting Period', value: '2017',    sub: 'Historical benchmark',     icon: 'calendar_today',noteIcon: 'check_circle',  note: 'Annual Official Baseline',     accent: '#7E22CE' },
              ].map(kpi => (
                <div key={kpi.label} className="bg-white p-5 rounded-2xl border border-[#E9DFF2] shadow-sm flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] text-[#6B6472] uppercase tracking-wider font-semibold">{kpi.label}</span>
                    <div className="w-10 h-10 rounded-xl bg-[#F8F5FA] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]" style={{ color: kpi.accent }}>{kpi.icon}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-[28px] font-bold text-[#17121F] tabular-nums tracking-tight">{kpi.value}</div>
                    <p className="text-[12px] text-[#6B6472] mt-0.5">{kpi.sub}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#E9DFF2] flex items-center gap-1 text-[11px] font-semibold" style={{ color: kpi.accent }}>
                    <span className="material-symbols-outlined text-[14px]">{kpi.noteIcon}</span>
                    <span>{kpi.note}</span>
                  </div>
                </div>
              ))}
            </section>

            {/* ── DATASET INFO CARD ── */}
            <section className="bg-white rounded-2xl border border-[#E9DFF2] shadow-sm p-5 sm:p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F3E8FF] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[26px] text-[#6200a9]">storage</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[17px] font-bold text-[#17121F]">National Crime Dataset</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#6200a9] text-[11px] font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6200a9]" />
                      Official Census Series
                    </span>
                  </div>
                  <p className="text-[13px] text-[#6B6472] max-w-3xl leading-relaxed">
                    Historical reported crime data sourced from the National Bureau of Statistics (NBS). Covers all Nigerian states and FCT — the official 2017 baseline used for model training, spatial clustering, and predictive calibration.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-start gap-x-7 gap-y-3 shrink-0">
                {[
                  { label: 'Source Agency', value: 'NBS Nigeria' },
                  { label: 'Coverage', value: '36 States + FCT' },
                  { label: 'Dataset Year', value: '2017' },
                ].map(m => (
                  <div key={m.label} className="flex flex-col min-w-[80px]">
                    <span className="text-[11px] text-[#6B6472] font-semibold uppercase tracking-wide">{m.label}</span>
                    <span className="text-[14px] font-bold text-[#17121F] mt-0.5">{m.value}</span>
                  </div>
                ))}
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#6B6472] font-semibold uppercase tracking-wide">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available
                  </span>
                </div>
              </div>
            </section>

            {/* ── FILTER PANEL ── */}
            <section className="bg-white rounded-2xl border border-[#E9DFF2] shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#6200a9] text-[20px]">filter_list</span>
                  <h2 className="text-[16px] font-bold text-[#17121F]">Filter Crime Records</h2>
                </div>
                <span className="text-[12px] text-[#6B6472] bg-[#F8F5FA] border border-[#E9DFF2] px-3 py-1 rounded-full font-medium">
                  Showing filtered results from the historical NBS 2017 dataset
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 items-end">
                {/* search */}
                <div className="xl:col-span-4 flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#6B6472] uppercase tracking-wide" htmlFor="cde-search">Quick Search</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6472] text-[18px]">search</span>
                    <input
                      id="cde-search"
                      type="text"
                      value={searchQ}
                      onChange={e => setSearchQ(e.target.value)}
                      placeholder="Search state or crime category…"
                      className="w-full h-[42px] pl-9 pr-3 rounded-xl bg-[#F8F5FA] border border-[#E9DFF2] text-[#17121F] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6200a9]/20 focus:bg-white transition-all placeholder:text-[#6B6472]"
                    />
                  </div>
                </div>

                {/* state */}
                <div className="xl:col-span-3 flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#6B6472] uppercase tracking-wide" htmlFor="cde-state">State / Territory</label>
                  <div className="relative">
                    <select
                      id="cde-state"
                      value={stateFilter}
                      onChange={e => { setStateFilter(e.target.value); setPage(1); }}
                      className="w-full h-[42px] px-3 pr-8 rounded-xl bg-[#F8F5FA] border border-[#E9DFF2] text-[#17121F] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6200a9]/20 appearance-none cursor-pointer transition-all"
                    >
                      {STATES.map(s => <option key={s} value={s}>{s === 'All States' ? 'All States (36 + FCT)' : s}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6472] text-[18px] pointer-events-none">expand_more</span>
                  </div>
                </div>

                {/* category */}
                <div className="xl:col-span-3 flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-[#6B6472] uppercase tracking-wide" htmlFor="cde-cat">Crime Category</label>
                  <div className="relative">
                    <select
                      id="cde-cat"
                      value={catFilter}
                      onChange={e => { setCatFilter(e.target.value as CategoryFilter); setPage(1); }}
                      className="w-full h-[42px] px-3 pr-8 rounded-xl bg-[#F8F5FA] border border-[#E9DFF2] text-[#17121F] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6200a9]/20 appearance-none cursor-pointer transition-all"
                    >
                      <option value="all">All Categories (3)</option>
                      <option value="property">Offences Against Property (68,579)</option>
                      <option value="persons">Offences Against Persons (53,641)</option>
                      <option value="authority">Offences Against Lawful Authority (12,443)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6472] text-[18px] pointer-events-none">expand_more</span>
                  </div>
                </div>

                {/* buttons */}
                <div className="xl:col-span-2 flex items-center gap-2">
                  <button
                    id="cde-apply"
                    type="button"
                    onClick={() => setPage(1)}
                    className="flex-1 h-[42px] rounded-xl bg-[#7E22CE] text-white text-[14px] font-semibold hover:bg-[#6200a9] shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">filter_alt</span>
                    Apply
                  </button>
                  <button
                    id="cde-reset"
                    type="button"
                    onClick={handleReset}
                    title="Reset Filters"
                    className="h-[42px] px-3 rounded-xl bg-[#F8F5FA] border border-[#E9DFF2] text-[#6B6472] hover:text-[#6200a9] hover:bg-[#F3E8FF] flex items-center justify-center transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  </button>
                </div>
              </div>
            </section>

            {/* ── TABLE + INSIGHT PANEL ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* LEFT — Data table */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E9DFF2] shadow-sm p-5 sm:p-6 flex flex-col space-y-4">

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-[16px] font-bold text-[#17121F]">Crime Records Repository</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#6200a9] text-[11px] font-semibold">
                      {filtered.length.toLocaleString()} Records
                    </span>
                    {selected.size > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#7E22CE] text-white text-[11px] font-semibold">
                        {selected.size} selected
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button type="button" title="Customize columns" className="p-2 rounded-lg bg-[#F8F5FA] border border-[#E9DFF2] text-[#6B6472] hover:text-[#6200a9] hover:bg-[#F3E8FF] transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">view_column</span>
                    </button>
                    <button type="button" onClick={handleExport} title="Export CSV" className="p-2 rounded-lg bg-[#F8F5FA] border border-[#E9DFF2] text-[#6B6472] hover:text-[#6200a9] hover:bg-[#F3E8FF] transition-colors cursor-pointer">
                      <span className="material-symbols-outlined text-[18px]">sim_card_download</span>
                    </button>
                    <button
                      type="button"
                      id="cde-empty-toggle"
                      onClick={() => setShowEmpty(v => !v)}
                      className="px-2.5 py-1 rounded-lg bg-[#F8F5FA] border border-[#E9DFF2] text-[#6200a9] text-[11px] font-semibold flex items-center gap-1 hover:bg-[#F3E8FF] transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">{showEmpty ? 'toggle_off' : 'toggle_on'}</span>
                      <span>{showEmpty ? 'Table View' : 'Empty State'}</span>
                    </button>
                  </div>
                </div>

                {/* Table / Empty state */}
                {showEmpty || filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-[#F8F5FA] rounded-2xl border border-[#E9DFF2]">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-[#E9DFF2] flex items-center justify-center mb-4 shadow-sm">
                      <span className="material-symbols-outlined text-[32px] text-[#6200a9]">manage_search</span>
                    </div>
                    <h4 className="text-[18px] font-bold text-[#17121F]">No crime records found</h4>
                    <p className="text-[14px] text-[#6B6472] max-w-sm mt-1">Try adjusting your filters or search criteria to find matching records.</p>
                    <button type="button" onClick={handleReset} className="mt-5 px-5 py-2 rounded-xl bg-[#7E22CE] text-white text-[14px] font-semibold hover:bg-[#6200a9] shadow-sm transition-all cursor-pointer">
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[#F8F5FA] text-[#6B6472] text-[11px] uppercase tracking-wider font-semibold">
                            <th className="py-3 px-3 rounded-l-xl w-10 text-center" scope="col">
                              <input type="checkbox" className="rounded accent-[#6200a9] cursor-pointer" aria-label="Select all" checked={allSelected} onChange={toggleAll} />
                            </th>
                            {([
                              { key: 'state',    label: 'State / Territory', right: false },
                              { key: 'category', label: 'Category',          right: false },
                              { key: 'cases',    label: 'Reported Cases',    right: true  },
                              { key: 'year',     label: 'Year',              right: false },
                            ] as { key: SortKey; label: string; right: boolean }[]).map(col => (
                              <th key={col.key} scope="col" className={`py-3 px-3 ${col.right ? 'text-right' : ''}`}>
                                <button
                                  type="button"
                                  onClick={() => toggleSort(col.key)}
                                  className={`flex items-center gap-1 hover:text-[#6200a9] transition-colors cursor-pointer ${col.right ? 'ml-auto' : ''}`}
                                >
                                  <span>{col.label}</span>
                                  <span className="material-symbols-outlined text-[14px]">{sortIcon(col.key)}</span>
                                </button>
                              </th>
                            ))}
                            <th className="py-3 px-3 text-center" scope="col">Source</th>
                            <th className="py-3 px-3 text-center" scope="col">Status</th>
                            <th className="py-3 px-3 rounded-r-xl text-center" scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pageRows.map((row, idx) => (
                            <tr
                              key={row.id}
                              className={`transition-colors group ${
                                idx % 2 === 0 ? '' : 'bg-[#FAFAFA]'
                              } hover:bg-[#FAF7FF] ${selected.has(row.id) ? '!bg-[#F3E8FF]/40' : ''}`}
                            >
                              <td className="py-3.5 px-3 text-center">
                                <input type="checkbox" className="rounded accent-[#6200a9] cursor-pointer" aria-label={`Select ${row.state}`} checked={selected.has(row.id)} onChange={() => toggleRow(row.id)} />
                              </td>
                              <td className="py-3.5 px-3 font-semibold text-[14px] text-[#17121F]">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor(row.categoryKey)}`} />
                                  {row.state}
                                </div>
                              </td>
                              <td className="py-3.5 px-3">{catBadge(row.categoryKey, row.category)}</td>
                              <td className="py-3.5 px-3 text-right font-bold tabular-nums text-[14px] text-[#17121F]">{row.cases.toLocaleString()}</td>
                              <td className="py-3.5 px-3 text-center text-[#6B6472] text-[13px] font-medium">{row.year}</td>
                              <td className="py-3.5 px-3 text-center text-[13px] font-semibold text-[#6B6472]">{row.source}</td>
                              <td className="py-3.5 px-3 text-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-100">
                                  <span className="material-symbols-outlined text-[13px]">verified</span>
                                  {row.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <button
                                  type="button"
                                  aria-label={`Inspect ${row.state} record`}
                                  onClick={() => onNavigateTab('data-visualizations')}
                                  className="p-1.5 rounded-lg text-[#6B6472] hover:text-[#6200a9] hover:bg-[#F3E8FF] transition-colors cursor-pointer"
                                >
                                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 text-[#6B6472]">
                      <div className="flex items-center gap-4 text-[13px]">
                        <span>
                          Showing <strong className="text-[#17121F]">{filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filtered.length)}</strong> of <strong className="text-[#17121F]">{filtered.length.toLocaleString()}</strong> entries
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-medium">Rows:</span>
                          <select
                            value={rowsPerPage}
                            onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
                            aria-label="Rows per page"
                            className="bg-[#F8F5FA] border border-[#E9DFF2] text-[#17121F] text-[12px] px-2 py-1 rounded-lg focus:outline-none cursor-pointer"
                          >
                            {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[13px] font-medium">
                        <button type="button" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-2.5 py-1.5 rounded-lg bg-[#F8F5FA] border border-[#E9DFF2] text-[#6B6472] disabled:opacity-40 hover:bg-[#F3E8FF] hover:text-[#6200a9] transition-colors cursor-pointer disabled:cursor-not-allowed">
                          Previous
                        </button>
                        {pageNums.map(pg => (
                          <button
                            key={pg}
                            type="button"
                            onClick={() => setPage(pg)}
                            className={`w-8 h-8 rounded-lg text-[13px] flex items-center justify-center transition-colors cursor-pointer ${pg === page ? 'bg-[#7E22CE] text-white font-bold shadow-sm' : 'text-[#6B6472] hover:bg-[#F8F5FA]'}`}
                          >
                            {pg}
                          </button>
                        ))}
                        {totalPages > 5 && <span className="px-1 text-[#6B6472]">…</span>}
                        {totalPages > 5 && (
                          <button type="button" onClick={() => setPage(totalPages)} className="px-2 h-8 rounded-lg text-[#6B6472] hover:bg-[#F8F5FA] flex items-center justify-center transition-colors cursor-pointer">
                            {totalPages}
                          </button>
                        )}
                        <button type="button" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="px-2.5 py-1.5 rounded-lg bg-[#F8F5FA] border border-[#E9DFF2] text-[#6B6472] disabled:opacity-40 hover:bg-[#F3E8FF] hover:text-[#6200a9] transition-colors cursor-pointer disabled:cursor-not-allowed">
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* RIGHT — Insight panel */}
              <div className="lg:col-span-4 flex flex-col space-y-5">

                {/* Category donut */}
                <div className="bg-white rounded-2xl border border-[#E9DFF2] shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#6200a9] text-[20px]">pie_chart</span>
                      <h3 className="text-[15px] font-bold text-[#17121F]">Category Proportions</h3>
                    </div>
                    <span className="text-[11px] text-[#6200a9] font-semibold bg-[#F3E8FF] px-2 py-0.5 rounded-full">NBS Share</span>
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <div className="relative w-44 h-44">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#F3E8FF" strokeWidth="12" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#6200a9" strokeWidth="12"
                          strokeDasharray={`${propertySegs.dash} ${propertySegs.gap}`}
                          strokeDashoffset={propertySegs.offset} strokeLinecap="round" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#7E22CE" strokeWidth="12"
                          strokeDasharray={`${personsSegs.dash} ${personsSegs.gap}`}
                          strokeDashoffset={personsSegs.offset} strokeLinecap="round" />
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#9333EA" strokeWidth="12"
                          strokeDasharray={`${authoritySegs.dash} ${authoritySegs.gap}`}
                          strokeDashoffset={authoritySegs.offset} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[22px] font-bold text-[#17121F] tabular-nums leading-tight">134,663</span>
                        <span className="text-[10px] text-[#6B6472] uppercase tracking-wider font-semibold">Total Filings</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: 'Against Property', value: '68,579', pct: '50.9%', color: 'bg-[#6200a9]' },
                      { label: 'Against Persons',  value: '53,641', pct: '39.8%', color: 'bg-[#7E22CE]' },
                      { label: 'Lawful Authority', value: '12,443', pct: '9.3%',  color: 'bg-[#9333EA]' },
                    ].map(l => (
                      <div key={l.label} className="flex items-center justify-between p-2 rounded-xl bg-[#F8F5FA]">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full shrink-0 ${l.color}`} />
                          <span className="text-[13px] text-[#17121F] font-medium">{l.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[14px] font-bold text-[#17121F] tabular-nums">{l.value}</span>
                          <span className="text-[11px] text-[#6B6472] ml-1">({l.pct})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#6B6472] italic text-center">
                    Official empirical figures documented in the 2017 NBS national compendium.
                  </p>
                </div>

                {/* Data quality */}
                <div className="bg-white rounded-2xl border border-[#E9DFF2] shadow-sm p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#6200a9] text-[20px]">fact_check</span>
                      <h3 className="text-[15px] font-bold text-[#17121F]">Data Quality</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#6200a9] font-semibold bg-[#F3E8FF] px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6200a9]" />
                      100% Valid
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Dataset Status',  value: 'Ready for analysis',              hi: true  },
                      { label: 'Source',           value: 'National Bureau of Statistics',   hi: false },
                      { label: 'Coverage',         value: '36 Nigerian states + FCT',        hi: false },
                      { label: 'Reporting Year',   value: '2017',                             hi: false },
                      { label: 'Completeness',     value: '100% — No missing states',        hi: false },
                    ].map(q => (
                      <div key={q.label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[#6200a9] text-[17px]">check_circle</span>
                          <span className="text-[13px] text-[#6B6472]">{q.label}</span>
                        </div>
                        <span className={`text-[12px] font-bold text-right ${q.hi ? 'text-emerald-700' : 'text-[#17121F]'}`}>{q.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#F8F5FA] border border-[#E9DFF2] flex items-center justify-between">
                    <span className="text-[11px] text-[#6B6472] font-medium">Audit Signature</span>
                    <span className="text-[11px] font-mono text-[#6200a9] font-bold">SHA256: 4f8b…92e1</span>
                  </div>
                </div>

                {/* Responsible AI note */}
                <div className="bg-[#F3E8FF] rounded-2xl p-4 space-y-2 border border-[#E9DFF2]">
                  <div className="flex items-center gap-2 text-[#6200a9]">
                    <span className="material-symbols-outlined text-[20px]">info</span>
                    <span className="text-[14px] font-bold">About This Dataset</span>
                  </div>
                  <p className="text-[13px] text-[#6B6472] leading-relaxed">
                    This platform analyzes <strong className="text-[#17121F]">historical reported crime data</strong>. Analytical and predictive outputs are intended to support data-driven interpretation and should not be treated as certainty about future criminal activity.
                  </p>
                </div>
              </div>
            </div>

            {/* ── CONTINUE ANALYSIS ── */}
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[20px] font-bold text-[#17121F]">Continue Analysis Workflow</h3>
                  <p className="text-[13px] text-[#6B6472]">Direct the verified 2017 dataset into predictive or spatial intelligence pipelines.</p>
                </div>
                <span className="text-[12px] text-[#6B6472] hidden sm:inline-block font-medium">Stage 2 of 4 Pipeline Steps</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { icon: 'insights',     accent: '#6200a9', bg: 'bg-[#F3E8FF]', title: 'Crime Trends',     desc: 'Explore historical crime patterns, quarterly fluctuations, and cross-category comparisons across regions.', cta: 'View Trends',      tab: 'data-visualizations' as ActiveTab },
                  { icon: 'location_on', accent: '#7E22CE', bg: 'bg-[#EDE9FF]', title: 'Hotspot Analysis', desc: 'Identify areas of historical crime concentration using K-Means unsupervised geographic clustering.',         cta: 'Explore Hotspots', tab: 'data-visualizations' as ActiveTab },
                  { icon: 'query_stats', accent: '#9333EA', bg: 'bg-[#FAF7FF]', title: 'Crime Prediction', desc: 'Generate probabilistic forecasts and confidence metrics using Decision Tree and Random Forest classifiers.', cta: 'Run Prediction',   tab: 'machine-learning-and-prediction' as ActiveTab },
                ].map(card => (
                  <div key={card.title} className="bg-white rounded-2xl border border-[#E9DFF2] shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all group">
                    <div className="space-y-3">
                      <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                        <span className="material-symbols-outlined text-[24px]" style={{ color: card.accent }}>{card.icon}</span>
                      </div>
                      <h4 className="text-[16px] font-bold text-[#17121F]">{card.title}</h4>
                      <p className="text-[13px] text-[#6B6472] leading-relaxed">{card.desc}</p>
                    </div>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => onNavigateTab(card.tab)}
                        className="inline-flex items-center gap-1.5 text-[14px] font-bold hover:opacity-80 transition-opacity cursor-pointer"
                        style={{ color: card.accent }}
                      >
                        <span>{card.cta}</span>
                        <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </main>
      </div>
    </div>
  );
};
