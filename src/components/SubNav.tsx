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
    { id: 'dashboard', label: 'Analytics', isTab: activeTab === 'overview' && activeSection === 'dashboard' },
    { id: 'data-workbench', label: 'Workbench', isTab: activeTab === 'data-visualizations' },
    { id: 'how-it-works', label: 'How It Works', isTab: activeTab === 'overview' && activeSection === 'how-it-works' },
    { id: 'nigerian-data', label: 'Nigerian Data', isTab: activeTab === 'overview' && activeSection === 'nigerian-data' },
    { id: 'engines', label: 'Methodology', isTab: activeTab === 'overview' && activeSection === 'engines' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#ffffff]/95 backdrop-blur-md border-b border-[#e9dff2] transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-10 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => {
            onNavigateTab('overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6200a9] to-[#7e22ce] flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-white text-[19px]">security</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[17px] text-[#1e1926] font-bold tracking-tight">
                SMART CRIME
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#efe4f8] text-[#6200a9] text-[10px] font-bold">
                NBS 2017
              </span>
            </div>
            <span className="text-[11px] text-[#4c4354] font-medium hidden md:inline">
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
                    ? 'text-[#6200a9] font-bold after:content-[""] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-[#6200a9]'
                    : 'text-[#4c4354] font-medium hover:text-[#1e1926]'
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
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF7FF] border border-[#E9DFF2] text-xs font-semibold text-[#7E22CE]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="truncate max-w-[140px]">{currentAnalyst}</span>
              </div>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-[#6B6472] hover:text-[#7E22CE] hover:bg-[#FAF7FF] transition-colors cursor-pointer text-xs font-medium"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="px-3 py-1.5 text-[13.5px] font-semibold text-[#1e1926] hover:text-[#6200a9] transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}
          <button
            onClick={onLaunchDashboard}
            className="px-4 py-2 rounded-xl bg-[#7e22ce] hover:bg-[#6200a9] text-white text-[13.5px] font-semibold transition-all active:scale-98 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Launch Dashboard</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>

          {/* Mobile menu hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#4c4354] hover:text-[#1e1926] hover:bg-[#faf0ff] transition-colors"
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
        <div className="lg:hidden border-t border-[#e9dff2] bg-white px-4 py-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`text-left px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
                link.isTab
                  ? 'bg-[#efe4f8] text-[#6200a9] font-bold'
                  : 'text-[#4c4354] hover:bg-[#faf0ff]'
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
