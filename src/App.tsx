import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { SubNav } from './components/SubNav';
import { HeroSection } from './components/HeroSection';
import { StatStrip } from './components/StatStrip';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { CapabilitiesGrid } from './components/CapabilitiesGrid';
import { HowItWorksWorkflow } from './components/HowItWorksWorkflow';
import { NigerianDataSection } from './components/NigerianDataSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';

import { AuthPage } from './components/AuthPage';
import { DashboardView } from './components/DashboardView';
import { SearchModal } from './components/SearchModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [activeSubSection, setActiveSubSection] = useState<string>('overview');
  const [focusedState, setFocusedState] = useState<string>('Lagos');
  const [currentAnalyst, setCurrentAnalyst] = useState<string | null>(null);

  // Search Modal State (⌘K / Ctrl+K)
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Keyboard shortcut for Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubNavNavigate = (sectionId: string) => {
    if (sectionId === 'dashboard' || sectionId === 'hotspots' || sectionId === 'prediction' || sectionId === 'crime-data') {
      setActiveTab(sectionId as ActiveTab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveSubSection(sectionId);
    if (activeTab !== 'overview') {
      setActiveTab('overview');
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleSelectSearchResult = (type: 'state' | 'zone' | 'tab' | 'section', value: string) => {
    if (type === 'state') {
      setFocusedState(value);
      setActiveTab('hotspots');
    } else if (type === 'tab') {
      setActiveTab(value as ActiveTab);
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleSelectStateFromMap = (stateName: string) => {
    setFocusedState(stateName);
    setActiveTab('hotspots');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenPredictionForState = (stateName: string) => {
    setFocusedState(stateName);
    setActiveTab('prediction');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is inside any operational dashboard tab
  if (
    activeTab === 'dashboard' ||
    activeTab === 'crime-data' ||
    activeTab === 'analytics' ||
    activeTab === 'hotspots' ||
    activeTab === 'prediction' ||
    activeTab === 'models'
  ) {
    return (
      <div className="min-h-screen bg-white text-[#1e1926] font-sans antialiased">
        <DashboardView
          initialSubView={activeTab}
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectState={(stateName) => {
            setFocusedState(stateName);
          }}
          onOpenSearch={() => setIsSearchOpen(true)}
          currentAnalyst={currentAnalyst || 'Authorized Analyst'}
          onSignOut={() => {
            setCurrentAnalyst(null);
            setActiveTab('overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToOverview={() => {
            setActiveTab('overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectResult={handleSelectSearchResult}
        />
      </div>
    );
  }

  // If user is on the Login page
  if (activeTab === 'auth') {
    return (
      <div className="min-h-screen bg-white text-[#17121F] font-sans antialiased">
        <AuthPage
          onBackToOverview={() => {
            setActiveTab('overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSignedIn={(analystName) => {
            setCurrentAnalyst(analystName);
            setActiveTab('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenDocs={() => {
            setActiveTab('overview');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectResult={handleSelectSearchResult}
        />
      </div>
    );
  }

  // Public Landing Page (Clear, Streamlined, High-Impact)
  return (
    <div className="min-h-screen bg-white text-[#1e1926] font-sans antialiased selection:bg-[#6200a9] selection:text-white">
      {/* Navigation Bar */}
      <SubNav
        activeTab={activeTab}
        activeSection={activeSubSection}
        onNavigateSection={handleSubNavNavigate}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLaunchDashboard={() => {
          setActiveTab('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSignIn={() => {
          setActiveTab('auth');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentAnalyst={currentAnalyst}
        onSignOut={() => setCurrentAnalyst(null)}
      />

      {/* Main Landing Sections */}
      <main>
        {/* 1. Hero Section: Direct value proposition and interactive Nigeria map */}
        <HeroSection
          onExploreAnalytics={() => {
            setActiveTab('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSeeHowItWorks={() => {
            const el = document.getElementById('how-it-works');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onSelectState={handleSelectStateFromMap}
        />

        {/* 2. Key National Statistics */}
        <StatStrip />

        {/* 3. Executive Dashboard Preview */}
        <ExecutiveDashboard
          onExploreDeep={() => {
            setActiveTab('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* 4. Core Features (Hotspots, Prediction, Crime Records, Analytics) */}
        <CapabilitiesGrid
          onSelectCapability={(id) => {
            if (id === 'hotspots') {
              setActiveTab('hotspots');
            } else if (id === 'prediction') {
              setActiveTab('prediction');
            } else if (id === 'trends' || id === 'intelligence') {
              setActiveTab('dashboard');
            } else {
              setActiveTab('crime-data');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* 5. 3-Step Simple How It Works */}
        <div id="how-it-works">
          <HowItWorksWorkflow />
        </div>

        {/* 6. State-by-State Nigerian Crime Explorer */}
        <NigerianDataSection
          onSelectState={handleOpenPredictionForState}
        />

        {/* 7. Call To Action to Launch Dashboard */}
        <CTASection
          onLaunch={() => {
            setActiveTab('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onReadDocs={() => {
            setActiveTab('crime-data');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(target) => {
          if (target === 'auth') {
            setActiveTab('auth');
          } else if (target === 'dashboard' || target === 'hotspots' || target === 'prediction' || target === 'crime-data') {
            setActiveTab(target as ActiveTab);
          } else {
            handleSubNavNavigate(target);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Quick Search Shortcut Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />
    </div>
  );
}
