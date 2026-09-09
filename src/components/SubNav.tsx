import React, { useState } from 'react';
import { ActiveTab } from '../types';

interface SubNavProps {
  activeTab: ActiveTab;
  activeSection: string;
  onNavigateSection: (sectionId: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onLaunchDashboard: () => void;
  onSignIn: () => void;
  currentAnalyst?: string | null;
  onSignOut?: () => void;
}

export const SubNav: React.FC<SubNavProps> = ({
  activeTab,
  activeSection,
  onNavigateSection,
  onNavigateTab,
  onLaunchDashboard,
  onSignIn,
  currentAnalyst,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'overview') {
      onNavigateTab('overview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'dashboard') {
      if (activeTab === 'overview') {
        onNavigateSection('dashboard');
      } else {
        onNavigateTab('overview');
        setTimeout(() => onNavigateSection('dashboard'), 50);
      }
    } else if (id === 'crime-data') {
      onNavigateTab('crime-data');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'datasets') {
      onNavigateTab('datasets');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'analytics') {
      onNavigateTab('analytics');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'hotspots') {
      onNavigateTab('hotspots');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'prediction') {
      onNavigateTab('prediction');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'models') {
      onNavigateTab('models');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'ml-prediction') {
      onNavigateTab('machine-learning-and-prediction');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'data-workbench') {
      onNavigateTab('data-visualizations');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigateSection(id);
    }
  };

  const navLinks = [
    { id: 'overview', label: 'Home', isTab: activeTab === 'overview' && activeSection === 'overview' },
    { id: 'crime-data', label: 'Crime Data', isTab: activeTab === 'crime-data' || activeTab === 'datasets' },
    { id: 'analytics', label: 'Analytics', isTab: activeTab === 'analytics' },
    { id: 'hotspots', label: 'Hotspots', isTab: activeTab === 'hotspots' },
    { id: 'prediction', label: 'Prediction', isTab: activeTab === 'prediction' },
    { id: 'models', label: 'Models', isTab: activeTab === 'models' },
    { id: 'data-workbench', label: 'Workbench', isTab: activeTab === 'data-visualizations' },
    { id: 'how-it-works', label: 'How It Works', isTab: activeTab === 'overview' && activeSection === 'how-it-works' },
    { id: 'nigerian-data', label: 'Nigerian Data', isTab: activeTab === 'overview' && activeSection === 'nigerian-data' },
    { id: 'engines', label: 'Methodology', isTab: activeTab === 'overview' && activeSection === 'engines' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-10 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => {
            onNavigateTab('overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-[19px]">security</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[17px] text-slate-900 font-bold tracking-tight">
                SMART CRIME
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                NBS 2017
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden md:inline">
              Geospatial Intelligence Platform
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-7">
          {navLinks.map((link) => {
            const isActive = link.isTab;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-[13.5px] transition-colors relative py-1 cursor-pointer ${
                  isActive
                    ? 'text-purple-700 font-bold after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-purple-700'
                    : 'text-slate-600 font-medium hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        {/* Action Controls & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentAnalyst ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-purple-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="truncate max-w-[140px]">{currentAnalyst}</span>
              </div>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="px-3 py-1.5 text-[13.5px] font-semibold text-slate-800 hover:text-purple-700 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
          {/* Mobile menu hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`text-left px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                link.isTab
                  ? 'bg-purple-50 text-purple-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};
