import React from 'react';
import { ActiveTab } from '../types';

interface SubNavProps {
  activeTab?: ActiveTab;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onLaunchDashboard: () => void;
  onSignIn: () => void;
  currentAnalyst?: string | null;
  onSignOut?: () => void;
}

export const SubNav: React.FC<SubNavProps> = ({
  onNavigateTab,
  onLaunchDashboard,
  onSignIn,
  currentAnalyst,
  onSignOut,
}) => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-10 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <button
          onClick={() => {
            onNavigateTab('overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-700 flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[18px]">security</span>
          </div>
          <span className="text-base text-slate-900 font-bold tracking-tight">
            SMART CRIME
          </span>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentAnalyst ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-semibold text-purple-700">
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
          <button
            onClick={onLaunchDashboard}
            className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-[13.5px] font-semibold transition-all active:scale-98 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Launch Dashboard</span>
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
