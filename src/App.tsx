import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { SubNav } from './components/SubNav';
import { HeroSection } from './components/HeroSection';
import { StatStrip } from './components/StatStrip';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { CapabilitiesGrid } from './components/CapabilitiesGrid';
import { HowItWorksWorkflow } from './components/HowItWorksWorkflow';
import { MiningEngines } from './components/MiningEngines';
import { NigerianDataSection } from './components/NigerianDataSection';
import { CTASection } from './components/CTASection';
import { Footer } from './components/Footer';

import { InteractiveWorkbench } from './components/InteractiveWorkbench';
import { PredictionSimulator } from './components/PredictionSimulator';
import { FoundationView } from './components/FoundationView';
import { ComponentsView } from './components/ComponentsView';
import { PatternsView } from './components/PatternsView';
import { AuthPage } from './components/AuthPage';
import { DashboardView } from './components/DashboardView';
import { CrimeDataView } from './components/CrimeDataView';

import { ExportTokensModal } from './components/ExportTokensModal';
import { SearchModal } from './components/SearchModal';
import { SignInModal } from './components/SignInModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [activeSubSection, setActiveSubSection] = useState<string>('overview');
  const [focusedState, setFocusedState] = useState<string>('Lagos');
  const [currentAnalyst, setCurrentAnalyst] = useState<string | null>(null);

  // Modal States
  const [isExportTokensOpen, setIsExportTokensOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isSignInOpen, setIsSignInOpen] = useState<boolean>(false);

  // Keyboard shortcut for Search (⌘K / Ctrl+K)
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
    if (sectionId === 'dashboard') {
      setActiveTab('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveSubSection(sectionId);
    if (activeTab !== 'overview') {
      setActiveTab('overview');
    }
    // Smooth scroll to section after short delay
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
      setActiveTab('data-visualizations');
    } else if (type === 'tab') {
      setActiveTab(value as ActiveTab);
    } else if (type === 'section') {
      handleSubNavNavigate(value);
    } else {
      setActiveTab('data-visualizations');
    }
  };

  const handleSelectStateFromMap = (stateName: string) => {
    setFocusedState(stateName);
  };

  const handleOpenPredictionForState = (stateName: string) => {
    setFocusedState(stateName);
    setActiveTab('prediction');
  };

  if (
    activeTab === 'dashboard' ||
    activeTab === 'crime-data' ||
    activeTab === 'datasets' ||
    activeTab === 'analytics' ||
    activeTab === 'hotspots' ||
    activeTab === 'prediction' ||
    activeTab === 'models'
  ) {
    return (
      <div className="min-h-screen bg-white text-[#1e1926] font-sans antialiased">
        <DashboardView
          initialSubView={
            activeTab === 'datasets'
              ? 'datasets'
              : activeTab === 'models'
              ? 'models'
              : activeTab === 'prediction'
              ? 'prediction'
              : activeTab === 'hotspots'
              ? 'hotspots'
              : activeTab === 'analytics'
              ? 'analytics'
              : activeTab === 'crime-data'
              ? 'crime-data'
              : 'dashboard'
          }
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSelectState={(stateName) => {
            setFocusedState(stateName);
            setActiveTab('data-visualizations');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSearch={() => setIsSearchOpen(true)}
          currentAnalyst={currentAnalyst}
          onSignOut={() => setCurrentAnalyst(null)}
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

  if (activeTab === 'crime-data') {
    return (
      <div className="min-h-screen bg-white text-[#1e1926] font-sans antialiased">
        <CrimeDataView
          onNavigateTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenSearch={() => setIsSearchOpen(true)}
          currentAnalyst={currentAnalyst}
          onBackToOverview={() => {
            setActiveTab('dashboard');
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
            setActiveTab('patterns');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Search Modal can still be triggered via hotkey */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectResult={handleSelectSearchResult}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1e1926] font-sans antialiased selection:bg-[#6200a9] selection:text-white">
      {/* Primary Navigation Bar */}
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

      {/* Main View Container */}
      <main>
        {/* Conditional View Rendering Based on Active Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Hero Section with interactive Nigeria map and hotspot envelopes */}
            <HeroSection
              onExploreAnalytics={() => {
                setActiveTab('data-visualizations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSeeHowItWorks={() => handleSubNavNavigate('how-it-works')}
              onSelectState={handleSelectStateFromMap}
            />

            {/* Stat Strip: 134,663 offences, 36+FCT, 3 classes, 3 engines */}
            <StatStrip />

            {/* Executive Dashboard Preview with Area Chart, KPI Cards & Category Bars */}
            <ExecutiveDashboard
              onExploreDeep={() => {
                setActiveTab('data-visualizations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Core Capabilities 4-Card Grid */}
            <CapabilitiesGrid
              onSelectCapability={(id) => {
                if (id === 'trends' || id === 'intelligence') {
                  setActiveTab('data-visualizations');
                } else if (id === 'prediction') {
                  setActiveTab('prediction');
                } else if (id === 'hotspots') {
                  handleSubNavNavigate('engines');
                }
              }}
            />

            {/* Algorithmic Workflow: 01 Collect, 02 Prepare, 03 Analyze, 04 Understand */}
            <HowItWorksWorkflow />

            {/* Mining Engines: K-Means, Decision Tree, Random Forest */}
            <MiningEngines
              onOpenModelSimulator={(model) => {
                setActiveTab('machine-learning-and-prediction');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Built Around Nigerian Crime Data: Geopolitical Regional Matrix + NBS Spec */}
            <NigerianDataSection
              onSelectState={handleOpenPredictionForState}
            />

            {/* Call To Action Banner */}
            <CTASection
              onLaunch={() => {
                setActiveTab('data-visualizations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onReadDocs={() => {
                setActiveTab('patterns');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}

        {/* Foundation: Light Mode Constitution & Design Tokens */}
        {activeTab === 'foundation' && (
          <FoundationView
            onBackToOverview={() => setActiveTab('overview')}
            onOpenExportTokens={() => setIsExportTokensOpen(true)}
          />
        )}

        {/* Components: Design System Component Primitives */}
        {activeTab === 'components' && (
          <ComponentsView
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}

        {/* Data Visualizations: Granular State Analytics & Workbench */}
        {activeTab === 'data-visualizations' && (
          <InteractiveWorkbench
            initialState={focusedState}
            onClose={() => setActiveTab('overview')}
            onOpenPrediction={handleOpenPredictionForState}
          />
        )}

        {/* Machine Learning & Prediction: Risk Classifier Simulator */}
        {activeTab === 'machine-learning-and-prediction' && (
          <PredictionSimulator
            initialState={focusedState}
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}

        {/* Patterns: Methodological & Governance Architecture */}
        {activeTab === 'patterns' && (
          <PatternsView
            onBackToOverview={() => setActiveTab('overview')}
          />
        )}
      </main>

      {/* Global SaaS Footer */}
      <Footer
        onNavigate={(target) => {
          if (target === 'auth') {
            setActiveTab('auth');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (target === 'dashboard') {
            setActiveTab('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (target === 'nigerian-data') {
            setActiveTab('data-visualizations');
          } else {
            handleSubNavNavigate(target);
          }
        }}
        onOpenDoc={(doc) => {
          setActiveTab('patterns');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      <ExportTokensModal
        isOpen={isExportTokensOpen}
        onClose={() => setIsExportTokensOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={handleSelectSearchResult}
      />

      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSignedIn={(analystName) => {
          setCurrentAnalyst(analystName);
          setActiveTab('data-visualizations');
        }}
      />
    </div>
  );
}
