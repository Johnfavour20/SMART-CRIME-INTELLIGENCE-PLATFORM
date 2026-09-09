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
  onNavigateTab,
  onSignIn,
  currentAnalyst,
  onSignOut,
}) => {
  const handleLinkClick = (tab: ActiveTab) => {
    onNavigateTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-10 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => handleLinkClick('overview')}
          className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
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
              Crime Intelligence & Risk Forecasting
            </span>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {currentAnalyst ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="truncate max-w-[140px]">{currentAnalyst}</span>
              </div>
              <button
                onClick={() => handleLinkClick('dashboard')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Dashboard</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[17px]">logout</span>
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <button
                onClick={onSignIn}
                className="px-5 py-2 text-[13.5px] font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[17px]">login</span>
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
