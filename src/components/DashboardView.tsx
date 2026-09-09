import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { CrimeDataView } from './CrimeDataView';
import { AnalyticsView } from './AnalyticsView';
import { HotspotsView } from './HotspotsView';
import { PredictionView } from './PredictionView';
import { ModelPerformanceView } from './ModelPerformanceView';
import { DatasetManagementView } from './DatasetManagementView';

interface DashboardViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onSelectState?: (stateName: string) => void;
  onOpenSearch?: () => void;
  currentAnalyst?: string | null;
  onSignOut?: () => void;
  onBackToOverview: () => void;
  initialSubView?: 'dashboard' | 'crime-data' | 'datasets' | 'analytics' | 'hotspots' | 'prediction' | 'models';
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onSelectState,
  onOpenSearch,
  currentAnalyst = 'System User',
  onBackToOverview,
  initialSubView = 'dashboard',
}) => {
  const [activeSubView, setActiveSubView] = useState<'dashboard' | 'crime-data' | 'datasets' | 'analytics' | 'hotspots' | 'prediction' | 'models'>(initialSubView);
  const [trendCategory, setTrendCategory] = useState<'all' | 'property' | 'persons' | 'authority'>('all');
  const [selectedState, setSelectedState] = useState<string>('Lagos');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportNotification, setExportNotification] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('smart_crime_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('smart_crime_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Keyboard shortcut: '[' or 'Ctrl+B' / 'Cmd+B' to toggle sidebar collapse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.tagName === 'INPUT' ||
        (e.target as HTMLElement)?.tagName === 'TEXTAREA' ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if (e.key === '[' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b')) {
        e.preventDefault();
        toggleSidebarCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (initialSubView) {
      setActiveSubView(initialSubView);
    }
  }, [initialSubView]);

  const handleExportBrief = () => {
    setIsExporting(true);
    setExportNotification('Generating Executive Intelligence Brief...');
    setTimeout(() => {
      setExportNotification('NBS_Crime_Brief_2017_Generated.pdf downloaded ✓');
      setTimeout(() => {
        setIsExporting(false);
        setExportNotification(null);
      }, 2500);
    }, 1200);
  };

  const handleStateClick = (stateName: string) => {
    setSelectedState(stateName);
    if (onSelectState) {
      onSelectState(stateName);
    }
  };

  // Primary navigation entries
  const primaryNavItems = [
    {
      id: 'dashboard',
      label: 'Executive Overview',
      icon: 'dashboard',
      onClick: () => setActiveSubView('dashboard'),
      isActive: activeSubView === 'dashboard',
    },
    {
      id: 'hotspots',
      label: 'Hotspots Map',
      icon: 'location_on',
      onClick: () => setActiveSubView('hotspots'),
      isActive: activeSubView === 'hotspots',
    },
    {
      id: 'prediction',
      label: 'Risk Predictor',
      icon: 'query_stats',
      onClick: () => setActiveSubView('prediction'),
      isActive: activeSubView === 'prediction',
    },
    {
      id: 'crime-data',
      label: 'NBS Crime Records',
      icon: 'table_chart',
      onClick: () => setActiveSubView('crime-data'),
      isActive: activeSubView === 'crime-data' || activeSubView === 'datasets',
    },
    {
      id: 'analytics',
      label: 'Crime Statistics',
      icon: 'insights',
      onClick: () => setActiveSubView('analytics'),
      isActive: activeSubView === 'analytics',
    },
    {
      id: 'models',
      label: 'Model Accuracy',
      icon: 'verified',
      onClick: () => setActiveSubView('models'),
      isActive: activeSubView === 'models',
    },
  ];

  const secondaryNavItems = [
    {
      id: 'home',
      label: 'Public Home Page',
      icon: 'home',
      onClick: onBackToOverview,
      isActive: false,
    },
  ];

  return (
    <div className="bg-white font-sans text-slate-900 antialiased min-h-screen">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Aside Navigation Bar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-all duration-300 ${
          isSidebarCollapsed ? 'w-[260px] lg:w-[76px]' : 'w-[260px]'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200">
            {/* When collapsed on desktop: show icon button that expands */}
            {isSidebarCollapsed ? (
              <div className="hidden lg:flex items-center justify-center w-full">
                <button
                  type="button"
                  onClick={toggleSidebarCollapse}
                  className="w-10 h-10 rounded-xl bg-purple-50 hover:bg-purple-100 flex items-center justify-center text-[#6200a9] transition-colors cursor-pointer"
                  title="Expand sidebar ( [ )"
                  aria-label="Expand sidebar"
                >
                  <span className="material-symbols-outlined text-[22px]">menu_open</span>
                </button>
              </div>
            ) : null}

            {/* Expanded view or mobile view */}
            <div
              className={`items-center gap-3 cursor-pointer ${
                isSidebarCollapsed ? 'flex lg:hidden' : 'flex'
              }`}
              onClick={onBackToOverview}
              title="Return to Public Overview"
            >
              <div className="w-9 h-9 rounded-xl bg-[#6200a9] flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[15px] text-[#1e1926] font-bold tracking-tight leading-tight truncate">
                  SMART CRIME
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] text-[#6200a9] font-semibold tracking-wider truncate">
                    DATA SUITE
                  </span>
                  <span className="text-[10px] text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 font-medium shrink-0">
                    v1.0 NBS
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop collapse button in header when expanded */}
            {!isSidebarCollapsed && (
              <button
                type="button"
                onClick={toggleSidebarCollapse}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-purple-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Collapse sidebar ( [ )"
                aria-label="Collapse sidebar"
              >
                <span className="material-symbols-outlined text-[20px]">first_page</span>
              </button>
            )}

            {/* Mobile close button */}
            <button
              className="lg:hidden p-1 text-slate-500 hover:text-[#1e1926] cursor-pointer"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-1">
            {primaryNavItems.map((item) => {
              const isActive = item.isActive;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.onClick();
                    setSidebarOpen(false);
                  }}
                  title={item.label}
                  className={`group relative w-full flex items-center transition-all cursor-pointer rounded-xl ${
                    isSidebarCollapsed
                      ? 'lg:justify-center lg:px-0 lg:h-11 px-3 py-2.5 gap-3'
                      : 'px-3 py-2.5 gap-3'
                  } ${
                    isActive
                      ? 'bg-purple-50 text-[#6200a9] font-semibold shadow-xs'
                      : 'text-[14px] text-slate-700 hover:bg-slate-100 hover:text-[#1e1926]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[20px] shrink-0 ${
                      isActive ? 'text-[#7e22ce]' : 'text-slate-500 group-hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span
                    className={`text-[14px] truncate ${
                      isSidebarCollapsed ? 'lg:hidden' : 'inline'
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active bar indicator when expanded */}
                  {isActive && !isSidebarCollapsed && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 bg-[#7e22ce] rounded-r"></span>
                  )}

                  {/* Tooltip on hover when collapsed on desktop */}
                  {isSidebarCollapsed && (
                    <span className="pointer-events-none hidden lg:block absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="py-2">
              <div className="h-px bg-slate-200 mx-2"></div>
            </div>

            {secondaryNavItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  item.onClick();
                  setSidebarOpen(false);
                }}
                title={item.label}
                className={`group relative w-full flex items-center transition-all cursor-pointer rounded-xl ${
                  isSidebarCollapsed
                    ? 'lg:justify-center lg:px-0 lg:h-11 px-3 py-2.5 gap-3'
                    : 'px-3 py-2.5 gap-3'
                } text-[14px] text-slate-700 hover:bg-slate-100 hover:text-[#1e1926]`}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0 text-slate-500 group-hover:text-slate-900">
                  {item.icon}
                </span>

                <span
                  className={`text-[14px] truncate ${
                    isSidebarCollapsed ? 'lg:hidden' : 'inline'
                  }`}
                >
                  {item.label}
                </span>

                {/* Tooltip on hover when collapsed on desktop */}
                {isSidebarCollapsed && (
                  <span className="pointer-events-none hidden lg:block absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    {item.label}
                  </span>
                )}
              </button>
            ))}

            {/* Back to Overview */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onBackToOverview}
                title="Back to Overview"
                className={`group relative w-full flex items-center transition-all cursor-pointer rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 ${
                  isSidebarCollapsed
                    ? 'lg:justify-center lg:px-0 lg:h-11 px-3 py-2 gap-2 text-xs font-semibold'
                    : 'px-3 py-2 gap-2 text-xs font-semibold'
                }`}
              >
                <span className="material-symbols-outlined text-[16px] shrink-0">arrow_back</span>
                <span className={`truncate ${isSidebarCollapsed ? 'lg:hidden' : 'inline'}`}>
                  Back to Overview
                </span>

                {isSidebarCollapsed && (
                  <span className="pointer-events-none hidden lg:block absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Back to Overview
                  </span>
                )}
              </button>
            </div>

            {/* Bottom Collapse / Expand Toggle Button for Desktop */}
            <div className="hidden lg:block pt-3 mt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={toggleSidebarCollapse}
                title={isSidebarCollapsed ? 'Expand sidebar ( [ )' : 'Collapse sidebar ( [ )'}
                className={`group relative w-full flex items-center transition-all cursor-pointer rounded-xl text-slate-500 hover:text-purple-700 hover:bg-slate-100 ${
                  isSidebarCollapsed ? 'justify-center h-11' : 'justify-between px-3 py-2'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    {isSidebarCollapsed ? 'last_page' : 'first_page'}
                  </span>
                  {!isSidebarCollapsed && (
                    <span className="text-xs font-semibold">Collapse sidebar</span>
                  )}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                    [
                  </span>
                )}

                {isSidebarCollapsed && (
                  <span className="pointer-events-none hidden lg:block absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Expand sidebar
                  </span>
                )}
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Panel Wrapper */}
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[260px]'
        }`}
      >
        {/* Fixed Top Header */}
        <header
          className={`fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
            isSidebarCollapsed ? 'lg:left-[76px]' : 'lg:left-[260px]'
          }`}
        >
          <div className="flex items-center gap-2">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer mr-1"
              aria-label="Open sidebar"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            {/* Desktop Collapse / Expand Toggle Button in Header */}
            <button
              type="button"
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:text-purple-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer mr-2 shadow-xs"
              title={isSidebarCollapsed ? 'Expand sidebar ( [ )' : 'Collapse sidebar ( [ )'}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isSidebarCollapsed ? 'menu_open' : 'menu'}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Hotkey Button */}
            <button
              onClick={() => {
                if (onOpenSearch) onOpenSearch();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span className="hidden sm:inline text-[13px]">Search incidents, LGAs, states...</span>
              <span className="hidden sm:inline text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-600 ml-2 font-mono">
                ⌘K
              </span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* User Profile */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#6200a9] flex items-center justify-center text-white font-bold text-xs">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[12px] text-slate-900 font-semibold leading-tight">
                  {currentAnalyst || 'System User'}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">Authorized Analyst</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="w-full pt-20 bg-white min-h-screen px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col w-full space-y-8 max-w-[1500px] mx-auto">
            {activeSubView === 'datasets' ? (
              <DatasetManagementView
                onNavigateTab={onNavigateTab}
                onOpenDataExplorer={() => setActiveSubView('crime-data')}
              />
            ) : activeSubView === 'models' ? (
              <ModelPerformanceView
                onNavigateTab={onNavigateTab}
                onSelectState={(st) => {
                  handleStateClick(st);
                  onNavigateTab('data-visualizations');
                }}
              />
            ) : activeSubView === 'prediction' ? (
              <PredictionView
                onNavigateTab={onNavigateTab}
                onSelectState={(st) => {
                  handleStateClick(st);
                  onNavigateTab('data-visualizations');
                }}
              />
            ) : activeSubView === 'hotspots' ? (
              <HotspotsView
                onNavigateTab={onNavigateTab}
                onSelectState={(st) => {
                  handleStateClick(st);
                  onNavigateTab('data-visualizations');
                }}
                onOpenCrimeData={() => setActiveSubView('crime-data')}
              />
            ) : activeSubView === 'analytics' ? (
              <AnalyticsView
                onNavigateTab={onNavigateTab}
                onSelectState={(st) => {
                  handleStateClick(st);
                  onNavigateTab('data-visualizations');
                }}
                onOpenCrimeData={() => setActiveSubView('crime-data')}
              />
            ) : activeSubView === 'crime-data' ? (
              <CrimeDataView
                onNavigateTab={onNavigateTab}
                onSelectState={(st) => {
                  handleStateClick(st);
                  onNavigateTab('data-visualizations');
                }}
                onOpenDatasetManagement={() => setActiveSubView('datasets')}
              />
            ) : (
              <>
                {/* Top Context Header & Welcome Banner */}
                <section className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-1.5 text-slate-600 text-[13px]">
                  <span
                    onClick={onBackToOverview}
                    className="hover:text-[#6200a9] transition-colors cursor-pointer"
                  >
                    Smart Crime
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-[#7e7385]">chevron_right</span>
                  <span className="text-[#6200a9] font-semibold">Dashboard</span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                  <div>
                    <h1 className="text-[28px] sm:text-[32px] text-[#1e1926] font-bold tracking-tight">
                      Crime Intelligence Overview
                    </h1>
                    <p className="text-[14px] text-[#4c4354]">
                      Monitor historical crime patterns, analytical insights, and predictive results from one unified vantage.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
                    <button
                      onClick={() => setActiveSubView('crime-data')}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-medium transition-all cursor-pointer"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                      <span>NBS 2017 Dataset</span>
                    </button>

                    <button
                      onClick={handleExportBrief}
                      disabled={isExporting}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7e22ce] text-white text-[13px] font-semibold hover:bg-[#6200a9] transition-all cursor-pointer disabled:opacity-80"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isExporting ? 'sync' : 'download'}
                      </span>
                      <span>{isExporting ? 'Exporting...' : 'Export Brief'}</span>
                    </button>
                  </div>
                </div>

                {exportNotification && (
                  <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#7E22CE] flex items-center gap-2 shadow-xs">
                    <span className="material-symbols-outlined text-[18px] text-[#7E22CE]">check_circle</span>
                    <span>{exportNotification}</span>
                  </div>
                )}
              </div>

              {/* Welcome Card / Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-xs p-6 lg:p-8">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-[#6200a9] text-[11px] font-bold tracking-wide uppercase">
                      <span className="material-symbols-outlined text-[14px]">insights</span>
                      Geospatial Policy Suite
                    </div>
                    <h2 className="text-[22px] sm:text-[24px] text-[#1e1926] font-bold">
                      Good morning, welcome to Smart Crime.
                    </h2>
                    <p className="text-[14px] text-slate-600 leading-relaxed">
                      Here is an overview of the crime intelligence available in your workspace. Explore verified statistical distribution matrices across 36 states and the Federal Capital Territory.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <div className="flex flex-col text-left">
                        <span className="text-[11px] font-bold tracking-wider text-slate-900 uppercase">
                          System Status
                        </span>
                        <span className="text-[13px] text-slate-600">Operational (Historical Baseline)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* KPI Metric Cards (4-column grid) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* KPI 1 */}
              <div className="group relative rounded-2xl bg-white p-6 border border-slate-200 shadow-xs transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex flex-col">
                    <span className="text-[12px] text-slate-500 font-semibold uppercase tracking-wider">
                      Reported Cases
                    </span>
                    <span className="text-[32px] font-bold text-slate-900 tracking-tight mt-0.5">
                      134,663
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6200a9] flex items-center justify-center shrink-0 group-hover:bg-[#6200a9] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[24px]">database</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[#6200a9] text-[11px] font-semibold">
                    Total Baseline
                  </span>
                  <span className="text-[13px] truncate">NBS 2017 Validated Benchmark</span>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="group relative rounded-2xl bg-white p-6 border border-slate-200 shadow-xs transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex flex-col">
                    <span className="text-[12px] text-slate-500 font-semibold uppercase tracking-wider">
                      Geographic Scope
                    </span>
                    <span className="text-[32px] font-bold text-slate-900 tracking-tight mt-0.5">
                      36 + 1
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6e3aca] flex items-center justify-center shrink-0 group-hover:bg-[#6e3aca] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[24px]">location_city</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[#6e3aca] text-[11px] font-semibold">
                    National
                  </span>
                  <span className="text-[13px] truncate">Nigerian States & FCT (6 Zones)</span>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="group relative rounded-2xl bg-white p-6 border border-slate-200 shadow-xs transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex flex-col">
                    <span className="text-[12px] text-slate-500 font-semibold uppercase tracking-wider">
                      Primary Classification
                    </span>
                    <span className="text-[32px] font-bold text-slate-900 tracking-tight mt-0.5">
                      3 Types
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#7e22ce] flex items-center justify-center shrink-0 group-hover:bg-[#7e22ce] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[24px]">category</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-semibold">
                    Hierarchy
                  </span>
                  <span className="text-[13px] truncate">Property, Persons, Lawful Authority</span>
                </div>
              </div>

              {/* KPI 4 */}
              <div className="group relative rounded-2xl bg-white p-6 border border-slate-200 shadow-xs transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex flex-col">
                    <span className="text-[12px] text-slate-500 font-semibold uppercase tracking-wider">
                      Analytical Models
                    </span>
                    <span className="text-[32px] font-bold text-[#7e22ce] tracking-tight mt-0.5">
                      Ready
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6200a9] flex items-center justify-center shrink-0 group-hover:bg-[#6200a9] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[24px]">verified</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                    F1: 0.94
                  </span>
                  <span className="text-[13px] truncate">Trained Decision Tree & Forest</span>
                </div>
              </div>
            </section>

            {/* Primary Analytics Area (Two-column layout, 60/40 ratio) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Crime Trends Area Chart (60%) */}
              <div className="lg:col-span-7 flex flex-col rounded-2xl bg-white p-6 border border-slate-200 shadow-xs justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h3 className="text-[18px] font-bold text-slate-900">Crime Trends Analysis</h3>
                    <p className="text-[13px] text-slate-600">
                      Reported crime distribution across the longitudinal dataset phases
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setTrendCategory(trendCategory === 'all' ? 'property' : 'all')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">tune</span>
                      <span>{trendCategory === 'all' ? 'All Categories' : 'Property Focus'}</span>
                    </button>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-[#6200a9] text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6200a9]"></span>
                      <span>2017 NBS Baseline</span>
                    </div>
                  </div>
                </div>

                {/* Inline SVG Chart Canvas */}
                <div className="relative w-full h-[260px] flex items-center justify-center">
                  {/* Peak Tooltip Pill */}
                  <div className="absolute top-8 left-[64%] -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
                    <div className="bg-[#342e3c] text-[#f7edff] px-3 py-1.5 rounded-lg text-center flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-300"></span>
                      <span className="text-[11px] font-semibold whitespace-nowrap">
                        Property Offences: 18,420 cases
                      </span>
                    </div>
                    <div className="w-2 h-2 bg-[#342e3c] rotate-45 -mt-1"></div>
                  </div>

                  <svg
                    className="w-full h-full overflow-visible"
                    fill="none"
                    viewBox="0 0 540 230"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="dashboardPurpleGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#7E22CE" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.01" />
                      </linearGradient>
                      <linearGradient id="dashboardVioletGrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#9333EA" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#9333EA" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Reference Gridlines */}
                    <line stroke="#E9DFF2" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="520" y1="30" y2="30" />
                    <line stroke="#E9DFF2" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="520" y1="80" y2="80" />
                    <line stroke="#E9DFF2" strokeDasharray="4 4" strokeWidth="1" x1="40" x2="520" y1="130" y2="130" />
                    <line stroke="#E9DFF2" strokeWidth="1.2" x1="40" x2="520" y1="180" y2="180" />

                    {/* Axis Y Labels */}
                    <text fill="#7E7385" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="end" x="32" y="34">
                      20k
                    </text>
                    <text fill="#7E7385" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="end" x="32" y="84">
                      14k
                    </text>
                    <text fill="#7E7385" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="end" x="32" y="134">
                      7k
                    </text>
                    <text fill="#7E7385" fontFamily="Plus Jakarta Sans" fontSize="10" textAnchor="end" x="32" y="184">
                      0
                    </text>

                    {/* Series 1: Property Offences (Filled Area + Stroke) */}
                    <path
                      d="M 60 115 C 140 100, 190 75, 250 82 C 310 88, 350 42, 400 40 C 450 38, 480 65, 510 58 L 510 180 L 60 180 Z"
                      fill="url(#dashboardPurpleGrad)"
                    />
                    <path
                      d="M 60 115 C 140 100, 190 75, 250 82 C 310 88, 350 42, 400 40 C 450 38, 480 65, 510 58"
                      stroke="#7E22CE"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />

                    {/* Series 2: Offences Against Persons */}
                    <path
                      d="M 60 135 C 140 130, 190 105, 250 112 C 310 118, 350 88, 400 85 C 450 82, 480 100, 510 95 L 510 180 L 60 180 Z"
                      fill="url(#dashboardVioletGrad)"
                    />
                    <path
                      d="M 60 135 C 140 130, 190 105, 250 112 C 310 118, 350 88, 400 85 C 450 82, 480 100, 510 95"
                      stroke="#9333EA"
                      strokeLinecap="round"
                      strokeWidth="2.2"
                    />

                    {/* Series 3: Lawful Authority */}
                    <path
                      d="M 60 165 C 140 162, 190 156, 250 158 C 310 160, 350 148, 400 150 C 450 152, 480 158, 510 155"
                      stroke="#C084FC"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />

                    {/* Indicator Dot on Peak Point (400, 40) */}
                    <circle cx="400" cy="40" fill="#7E22CE" r="5" stroke="#ffffff" strokeWidth="2.5" />

                    {/* Axis X Labels */}
                    <text
                      fill="#4C4354"
                      fontFamily="Plus Jakarta Sans"
                      fontSize="11"
                      fontWeight="500"
                      textAnchor="middle"
                      x="60"
                      y="202"
                    >
                      Q1 Baseline
                    </text>
                    <text
                      fill="#4C4354"
                      fontFamily="Plus Jakarta Sans"
                      fontSize="11"
                      fontWeight="500"
                      textAnchor="middle"
                      x="210"
                      y="202"
                    >
                      Q2 Mid-Cycle
                    </text>
                    <text
                      fill="#4C4354"
                      fontFamily="Plus Jakarta Sans"
                      fontSize="11"
                      fontWeight="500"
                      textAnchor="middle"
                      x="360"
                      y="202"
                    >
                      Q3 Seasonal Surge
                    </text>
                    <text
                      fill="#4C4354"
                      fontFamily="Plus Jakarta Sans"
                      fontSize="11"
                      fontWeight="500"
                      textAnchor="middle"
                      x="495"
                      y="202"
                    >
                      Q4 Reconciliation
                    </text>
                  </svg>
                </div>

                {/* Trend Series Legend */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#7E22CE]"></span>
                    <span className="text-[11px] text-[#1e1926] font-medium">Offences Against Property</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#6e3aca]"></span>
                    <span className="text-[11px] text-[#1e1926] font-medium">Offences Against Persons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ddb8ff]"></span>
                    <span className="text-[11px] text-[#1e1926] font-medium">Lawful Authority</span>
                  </div>
                </div>
              </div>

              {/* Crime Distribution Donut Card (40%) */}
              <div className="lg:col-span-5 flex flex-col rounded-2xl bg-white p-6 border border-slate-200 justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-[18px] font-bold text-[#1e1926]">Crime Distribution</h3>
                    <span className="material-symbols-outlined text-[#7e7385] text-[20px]">pie_chart</span>
                  </div>
                  <p className="text-[13px] text-[#4c4354] mb-4">
                    Reported offences aggregated by statutory category
                  </p>
                </div>

                {/* SVG Donut Chart with Centered Total */}
                <div className="relative flex items-center justify-center my-2">
                  <svg className="w-48 h-48 -rotate-90" viewBox="0 0 160 160">
                    {/* Background track */}
                    <circle cx="80" cy="80" fill="transparent" r="62" stroke="#F5EAFD" strokeWidth="18" />
                    {/* Circumference = 389.55 */}
                    {/* Segment 1: Property (50.9%) */}
                    <circle
                      cx="80"
                      cy="80"
                      fill="transparent"
                      r="62"
                      stroke="#7E22CE"
                      strokeDasharray="198.28 191.27"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      strokeWidth="18"
                    />
                    {/* Segment 2: Persons (39.8%) */}
                    <circle
                      cx="80"
                      cy="80"
                      fill="transparent"
                      r="62"
                      stroke="#5B21B6"
                      strokeDasharray="155.04 234.51"
                      strokeDashoffset="-198.28"
                      strokeLinecap="round"
                      strokeWidth="18"
                    />
                    {/* Segment 3: Lawful Authority (9.3%) */}
                    <circle
                      cx="80"
                      cy="80"
                      fill="transparent"
                      r="62"
                      stroke="#C084FC"
                      strokeDasharray="36.22 353.33"
                      strokeDashoffset="-353.32"
                      strokeLinecap="round"
                      strokeWidth="18"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-[26px] font-bold text-[#1e1926] leading-none tracking-tight">
                      134,663
                    </span>
                    <span className="text-[11px] text-[#7e7385] font-semibold tracking-wider uppercase mt-1">
                      Total Offences
                    </span>
                  </div>
                </div>

                {/* Exact Breakdown Legend List */}
                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#7E22CE] shrink-0"></span>
                      <span className="text-[13px] font-medium text-slate-900">Against Property</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-slate-900">68,579</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-purple-50 font-semibold text-[#6200a9]">
                        50.9%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#5B21B6] shrink-0"></span>
                      <span className="text-[13px] font-medium text-slate-900">Against Persons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-slate-900">53,641</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-purple-50 font-semibold text-[#6e3aca]">
                        39.8%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#C084FC] shrink-0"></span>
                      <span className="text-[13px] font-medium text-slate-900">Lawful Authority</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-slate-900">12,443</span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-200 font-semibold text-slate-600">
                        9.3%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Geographic Intelligence & Cluster Hotspots Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Map & Benchmark Spatial Distribution (70% -> col-span-8) */}
              <div className="lg:col-span-8 flex flex-col rounded-2xl bg-white p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[18px] font-bold text-slate-900">Crime Distribution Across Nigeria</h3>
                    <p className="text-[13px] text-slate-600">
                      Explore reported crime concentration by state (Sample historical spatial distribution)
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold self-start sm:self-auto">
                    37 Regional Divisions
                  </span>
                </div>

                {/* Map & List Subgrid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Choropleth Map Graphic (md:col-span-7) */}
                  <div className="md:col-span-7 relative flex items-center justify-center p-4 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden min-h-[320px]">
                    <svg
                      className="w-full max-w-[380px] h-auto"
                      fill="none"
                      viewBox="0 0 380 290"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Region Shading Grids & Boundaries */}
                      <path
                        d="M 28 85 L 90 40 L 170 30 L 250 48 L 330 35 L 360 90 L 340 160 L 305 210 L 260 255 L 210 240 L 155 270 L 80 240 L 40 180 Z"
                        fill="#F8FAFC"
                        stroke="#CBD5E1"
                        strokeWidth="1.5"
                      />
                      {/* North-West & North-East Regions */}
                      <path d="M 90 40 L 170 30 L 195 80 L 135 110 L 70 85 Z" fill="#E2E8F0" />
                      <path d="M 170 30 L 250 48 L 330 35 L 345 80 L 280 100 L 205 75 Z" fill="#F1F5F9" />
                      <path d="M 195 80 L 280 100 L 270 145 L 180 135 Z" fill="#DDD6FE" />
                      {/* Middle Belt & Central */}
                      <path d="M 70 85 L 135 110 L 180 135 L 155 185 L 85 160 Z" fill="#DDD6FE" />
                      <path d="M 180 135 L 270 145 L 290 190 L 195 195 Z" fill="#A855F7" fillOpacity="0.35" />
                      {/* South-West & Lagos High-Density */}
                      <path d="M 40 180 L 85 160 L 110 220 L 50 225 Z" fill="#A855F7" fillOpacity="0.6" />
                      <path d="M 50 225 L 85 220 L 95 245 L 58 245 Z" fill="#6B21A8" />

                      {/* South-South & South-East Zones */}
                      <path d="M 110 220 L 155 185 L 210 200 L 185 260 L 120 250 Z" fill="#A855F7" fillOpacity="0.4" />
                      <path d="M 210 200 L 290 190 L 260 255 L 200 250 Z" fill="#DDD6FE" />

                      {/* Geographic Nodes */}
                      <g className="cursor-pointer group" onClick={() => handleStateClick('Lagos')}>
                        <circle className="animate-pulse" cx="72" cy="235" fill="#7E22CE" fillOpacity="0.2" r="14" />
                        <circle cx="72" cy="235" fill="#7E22CE" r="5" stroke="#ffffff" strokeWidth="1.5" />
                        <text fill="#1E1926" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700" x="75" y="222">
                          Lagos Hub
                        </text>
                      </g>

                      <g className="cursor-pointer" onClick={() => handleStateClick('FCT Abuja')}>
                        <circle cx="178" cy="142" fill="#7E22CE" fillOpacity="0.2" r="10" />
                        <circle cx="178" cy="142" fill="#5B21B6" r="4.5" stroke="#ffffff" strokeWidth="1.5" />
                        <text fill="#1E1926" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700" x="188" y="145">
                          FCT Abuja
                        </text>
                      </g>

                      <g className="cursor-pointer" onClick={() => handleStateClick('Kano')}>
                        <circle cx="180" cy="65" fill="#7E22CE" fillOpacity="0.2" r="12" />
                        <circle cx="180" cy="65" fill="#7E22CE" r="4.5" stroke="#ffffff" strokeWidth="1.5" />
                        <text fill="#1E1926" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700" x="190" y="68">
                          Kano Node
                        </text>
                      </g>

                      <g className="cursor-pointer" onClick={() => handleStateClick('Rivers')}>
                        <circle cx="170" cy="245" fill="#7E22CE" fillOpacity="0.2" r="11" />
                        <circle cx="170" cy="245" fill="#9333EA" r="4.5" stroke="#ffffff" strokeWidth="1.5" />
                        <text fill="#1E1926" fontFamily="Plus Jakarta Sans" fontSize="10" fontWeight="700" x="180" y="248">
                          Rivers Command
                        </text>
                      </g>
                    </svg>

                    {/* Interactive Map Legend */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-2 rounded-lg border border-slate-200 text-[11px] space-y-1 shadow-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-[#EDE9FE]"></span>
                        <span className="text-slate-600">Lower density</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-[#A855F7]"></span>
                        <span className="text-slate-600">Moderate density</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded bg-[#6B21A8]"></span>
                        <span className="text-slate-800 font-semibold">Higher concentration</span>
                      </div>
                    </div>
                  </div>

                  {/* Sample Historical Benchmark Ranking (md:col-span-5) */}
                  <div className="md:col-span-5 flex flex-col space-y-2">
                    <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                      Top Incident Density (Illustrative sample)
                    </span>
                    <div className="space-y-1.5">
                      {[
                        { rank: 1, state: 'Lagos State', cases: '50,985 cases', isTop: true, name: 'Lagos' },
                        { rank: 2, state: 'Kano State', cases: '10,519 cases', isTop: false, name: 'Kano' },
                        { rank: 3, state: 'Rivers State', cases: '8,790 cases', isTop: false, name: 'Rivers' },
                        { rank: 4, state: 'FCT Abuja', cases: '6,842 cases', isTop: false, name: 'FCT Abuja' },
                        { rank: 5, state: 'Kaduna State', cases: '5,148 cases', isTop: false, name: 'Kaduna' },
                      ].map((item) => (
                        <div
                          key={item.rank}
                          onClick={() => handleStateClick(item.name)}
                          className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer ${
                            selectedState === item.name
                              ? 'bg-purple-100 border border-purple-300'
                              : 'bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                                item.isTop
                                  ? 'bg-[#6200a9] text-white'
                                  : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              {item.rank}
                            </span>
                            <span className="text-[13px] font-semibold text-slate-900">{item.state}</span>
                          </div>
                          <span
                            className={`text-[11px] ${
                              item.isTop ? 'text-[#6200a9] font-bold' : 'text-slate-600 font-medium'
                            }`}
                          >
                            {item.cases}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2 mt-2">
                      <span className="material-symbols-outlined text-slate-500 text-[16px] shrink-0 mt-0.5">
                        info
                      </span>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        Historical benchmark data for spatial density visualization based on 2017 national reporting protocols.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Stacked Cards (30% -> col-span-4) */}
              <div className="lg:col-span-4 flex flex-col space-y-6">
                {/* Card A: Hotspot Analysis (K-Means Clustering) */}
                <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6200a9]">
                        Spatial Clustering
                      </span>
                      <span className="material-symbols-outlined text-[#6200a9] text-[18px]">scatter_plot</span>
                    </div>
                    <h4 className="text-[18px] font-bold text-slate-900">Hotspot Analysis (K-Means)</h4>
                    <p className="text-[13px] text-slate-600">
                      K-Means clustering identifies groups and concentrations within historical crime data.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-orange-50/80">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                        <span className="text-[13px] font-semibold text-orange-950">Cluster 01</span>
                      </div>
                      <span className="text-[11px] font-bold text-orange-700">High Concentration</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/80">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="text-[13px] font-semibold text-amber-950">Cluster 02</span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-700">Moderate Density</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/80">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="text-[13px] font-semibold text-emerald-950">Cluster 03</span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700">Lower Incident Volume</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="text-[11px] text-slate-500 mb-3">
                      Unsupervised segmentation into 3 centroid envelopes.
                    </p>
                    <button
                      onClick={() => onNavigateTab('data-visualizations')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#6200a9] text-[13px] font-semibold transition-all cursor-pointer"
                      type="button"
                    >
                      <span>View Hotspots</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>

                {/* Card B: Prediction Intelligence */}
                <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#6e3aca]">
                        Inference Engines
                      </span>
                      <span className="material-symbols-outlined text-[#6e3aca] text-[18px]">auto_awesome</span>
                    </div>
                    <h4 className="text-[18px] font-bold text-slate-900">Prediction Intelligence</h4>
                    <p className="text-[13px] text-slate-600">
                      Generate predictive insights using calibrated historical classification models.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Decision Tree</span>
                      <span className="text-[15px] font-bold text-slate-900">Ready</span>
                      <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">F1: 0.90</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Random Forest</span>
                      <span className="text-[15px] font-bold text-slate-900">Ready</span>
                      <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">F1: 0.94</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => onNavigateTab('machine-learning-and-prediction')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#6200a9] hover:bg-[#581db3] text-white text-[13px] font-bold transition-all cursor-pointer shadow-sm"
                      type="button"
                    >
                      <span>Run Prediction</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                    <p className="text-[11px] text-slate-500 text-center mt-2 leading-tight">
                      Predictions are based on patterns contained in the historical dataset.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Insights (3-card grid) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-5 rounded-full bg-[#6200a9]"></span>
                  <h3 className="text-[18px] font-bold text-slate-900">Synthesized Intelligence Findings</h3>
                </div>
                <span className="text-[13px] text-slate-600">Key empirical takeaways from NBS 2017 baseline</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Insight 01 */}
                <div className="flex flex-col justify-between rounded-2xl bg-white p-6 border border-slate-200 shadow-xs transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#6200a9] tracking-wider uppercase">
                        Insight 01
                      </span>
                      <span className="material-symbols-outlined text-[#6200a9] text-[18px]">inventory_2</span>
                    </div>
                    <h4 className="text-[15px] font-bold text-slate-900">Crime Distribution</h4>
                    <p className="text-[13.5px] text-slate-600 leading-relaxed">
                      Offences against property represent the single largest category in the current dataset, accounting for{' '}
                      <strong className="text-slate-900 font-semibold">50.9%</strong> of all reported cases nationally.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('data-visualizations')}
                    className="inline-flex items-center gap-1.5 text-[#6200a9] text-[13px] font-bold hover:text-[#2c0051] transition-colors mt-4 pt-3 border-t border-slate-200 text-left cursor-pointer"
                  >
                    <span>View Category Details</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                {/* Insight 02 */}
                <div className="flex flex-col justify-between rounded-2xl bg-white p-6 border border-slate-200 shadow-xs transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#6e3aca] tracking-wider uppercase">
                        Insight 02
                      </span>
                      <span className="material-symbols-outlined text-[#6e3aca] text-[18px]">hub</span>
                    </div>
                    <h4 className="text-[15px] font-bold text-slate-900">Geographic Pattern</h4>
                    <p className="text-[13.5px] text-slate-600 leading-relaxed">
                      Reported crime varies substantially across Nigerian states, with urban economic hubs and coastal administrative zones recording significantly higher incident density.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('data-visualizations')}
                    className="inline-flex items-center gap-1.5 text-[#6e3aca] text-[13px] font-bold hover:text-[#6200a9] transition-colors mt-4 pt-3 border-t border-slate-200 text-left cursor-pointer"
                  >
                    <span>Inspect Regional Matrix</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>

                {/* Insight 03 */}
                <div className="flex flex-col justify-between rounded-2xl bg-white p-6 border border-slate-200 shadow-xs transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#6100a8] tracking-wider uppercase">
                        Insight 03
                      </span>
                      <span className="material-symbols-outlined text-[#6100a8] text-[18px]">model_training</span>
                    </div>
                    <h4 className="text-[15px] font-bold text-slate-900">Data Intelligence</h4>
                    <p className="text-[13.5px] text-slate-600 leading-relaxed">
                      Clustering and supervised classification provide complementary approaches to understanding historical crime structures and jurisdictional predictability.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigateTab('patterns')}
                    className="inline-flex items-center gap-1.5 text-[#6100a8] text-[13px] font-bold hover:text-[#2c0051] transition-colors mt-4 pt-3 border-t border-slate-200 text-left cursor-pointer"
                  >
                    <span>Read Model Methodology</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Quick Actions Row */}
            <section className="space-y-2.5">
              <span className="text-[12px] text-slate-500 font-semibold uppercase tracking-wider">
                Quick System Actions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  type="button"
                  onClick={() => onNavigateTab('data-visualizations')}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all group text-left cursor-pointer shadow-xs"
                >
                  <div className="w-11 h-11 rounded-lg bg-purple-50 text-[#6200a9] flex items-center justify-center shrink-0 group-hover:bg-[#6200a9] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[22px]">database</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-bold text-slate-900 truncate group-hover:text-[#6200a9] transition-colors">
                      Explore Crime Data
                    </span>
                    <span className="text-[12px] text-slate-600 truncate">Raw tables & filtering</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('data-visualizations')}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all group text-left cursor-pointer shadow-xs"
                >
                  <div className="w-11 h-11 rounded-lg bg-purple-50 text-[#6200a9] flex items-center justify-center shrink-0 group-hover:bg-[#6200a9] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[22px]">insights</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-bold text-slate-900 truncate group-hover:text-[#6200a9] transition-colors">
                      Analyze Trends
                    </span>
                    <span className="text-[12px] text-slate-600 truncate">Time-series comparisons</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('data-visualizations')}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all group text-left cursor-pointer shadow-xs"
                >
                  <div className="w-11 h-11 rounded-lg bg-purple-50 text-[#6200a9] flex items-center justify-center shrink-0 group-hover:bg-[#6200a9] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[22px]">radar</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-bold text-slate-900 truncate group-hover:text-[#6200a9] transition-colors">
                      View Hotspots
                    </span>
                    <span className="text-[12px] text-slate-600 truncate">Interactive GIS viewports</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('machine-learning-and-prediction')}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all group text-left cursor-pointer shadow-xs"
                >
                  <div className="w-11 h-11 rounded-lg bg-purple-50 text-[#6200a9] flex items-center justify-center shrink-0 group-hover:bg-[#6200a9] group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[22px]">psychology</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[15px] font-bold text-slate-900 truncate group-hover:text-[#6200a9] transition-colors">
                      Run Prediction
                    </span>
                    <span className="text-[12px] text-slate-600 truncate">Apply trained classifiers</span>
                  </div>
                </button>
              </div>
            </section>

            {/* Dataset Information Footer Card */}
            <section className="rounded-2xl bg-white p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6200a9] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">verified_user</span>
                  </div>
                  <div>
                    <h4 className="text-[18px] font-bold text-slate-900">Dataset Information</h4>
                    <p className="text-[13px] text-slate-600">
                      Validated governmental baseline reference standard
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigateTab('patterns')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#6200a9] text-[13px] font-semibold transition-colors shrink-0 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  <span>View Dataset Documentation</span>
                </button>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Source</span>
                  <span className="text-[14px] font-bold text-slate-900">National Bureau of Statistics (NBS)</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Dataset</span>
                  <span className="text-[14px] font-bold text-slate-900">Crime Statistics: Offences by State</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Period</span>
                  <span className="text-[14px] font-bold text-slate-900">2017 Historical Baseline</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Total Reported</span>
                  <span className="text-[14px] font-bold text-slate-900">134,663 Cases</span>
                </div>
              </div>
            </section>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

