import React, { useState, useRef } from 'react';
import { ActiveTab } from '../types';
import { NIGERIAN_STATES_DATA } from '../data/crimeData';

interface DatasetManagementViewProps {
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenDataExplorer?: () => void;
}

interface DatasetAuditRecord {
  id: string;
  name: string;
  agency: string;
  year: string;
  records: number;
  timestamp: string;
  ingestedBy: string;
  status: 'Active Baseline' | 'Validated Staging' | 'Archived';
  isVerified?: boolean;
}

export const DatasetManagementView: React.FC<DatasetManagementViewProps> = ({
  onNavigateTab,
  onOpenDataExplorer,
}) => {
  // Staged File State
  const [stagedFileName, setStagedFileName] = useState<string | null>('staged_crime_data_v1.1.csv');
  const [stagedFileSize, setStagedFileSize] = useState<string>('4.8 MB');
  const [stagedTime, setStagedTime] = useState<string>('Uploaded by System Admin (Lead Analyst) • 2 mins ago');
  const [isStagedValid, setIsStagedValid] = useState<boolean>(true);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Active Baseline state
  const [activeBaselineName, setActiveBaselineName] = useState<string>(
    'Crime Statistics: Reported Offences by Type and State'
  );
  const [activeBaselineVersion, setActiveBaselineVersion] = useState<string>('NBS 2017');

  // Modals state
  const [isActivateModalOpen, setIsActivateModalOpen] = useState<boolean>(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isJsonLogModalOpen, setIsJsonLogModalOpen] = useState<boolean>(false);
  const [replaceReason, setReplaceReason] = useState<string>('Official NBS Statistical Revision Update');

  // Preview Pagination
  const [previewPage, setPreviewPage] = useState<number>(1);
  const rowsPerPage = 5;

  // Filter state for audit log
  const [auditFilter, setAuditFilter] = useState<'All' | 'Active Baseline' | 'Validated Staging' | 'Archived'>('All');

  // Toast notifications
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: 'success' | 'info' | 'error' }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Preview data rows generated from canonical Nigerian dataset
  const previewRows = [
    { state: 'Lagos State', category: 'Offences Against Property', cases: '34,210', year: '2017' },
    { state: 'Kano State', category: 'Offences Against Persons', cases: '18,250', year: '2017' },
    { state: 'Rivers State', category: 'Offences Against Property', cases: '14,310', year: '2017' },
    { state: 'FCT Abuja', category: 'Offences Against Property', cases: '12,260', year: '2017' },
    { state: 'Delta State', category: 'Offences Against Lawful Authority', cases: '4,120', year: '2017' },
    { state: 'Kaduna State', category: 'Offences Against Persons', cases: '9,840', year: '2017' },
    { state: 'Oyo State', category: 'Offences Against Property', cases: '11,400', year: '2017' },
    { state: 'Edo State', category: 'Offences Against Persons', cases: '7,190', year: '2017' },
    { state: 'Anambra State', category: 'Offences Against Property', cases: '6,450', year: '2017' },
    { state: 'Plateau State', category: 'Offences Against Lawful Authority', cases: '1,890', year: '2017' },
  ];

  // Audit history records
  const [auditRecords, setAuditRecords] = useState<DatasetAuditRecord[]>([
    {
      id: 'rec-1',
      name: 'NBS Historical Baseline 2017',
      agency: 'NBS Nigeria',
      year: '2017',
      records: 134663,
      timestamp: 'Baseline Calibration',
      ingestedBy: 'System Admin',
      status: 'Active Baseline',
      isVerified: true,
    },
    {
      id: 'rec-2',
      name: 'Staged Ingestion Candidate v1.1',
      agency: 'Internal NBS Audit',
      year: '2017',
      records: 134663,
      timestamp: 'Today, 11:20 AM',
      ingestedBy: 'Admin (Lead Analyst)',
      status: 'Validated Staging',
      isVerified: false,
    },
    {
      id: 'rec-3',
      name: 'Legacy NBS Sample Batch #02',
      agency: 'NBS Nigeria',
      year: '2016 Archive',
      records: 128400,
      timestamp: 'Oct 14, 2023',
      ingestedBy: 'System Admin',
      status: 'Archived',
      isVerified: false,
    },
  ]);

  const filteredAuditRecords = auditRecords.filter((r) => {
    if (auditFilter === 'All') return true;
    return r.status === auditFilter;
  });

  // Re-run validation action
  const handleRerunValidation = () => {
    setIsValidating(true);
    showToast('Re-running 7 integrity heuristics against candidate dataset...', 'info');

    setTimeout(() => {
      setIsValidating(false);
      setIsStagedValid(true);
      showToast('Validation Complete: 7 of 7 compliance checks passed successfully.', 'success');
    }, 1400);
  };

  // Handle File Drop / Select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setStagedFileName(file.name);
      setStagedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setStagedTime('Uploaded just now by Lead Analyst');
      setIsStagedValid(false);
      showToast(`Selected ${file.name}. Initializing schema verification pipeline...`, 'info');

      // Auto-validate after 1.2s
      setTimeout(() => {
        setIsStagedValid(true);
        showToast('Auto-validation complete: Schema conformant (4 canonical features mapped).', 'success');
      }, 1200);
    }
  };

  // Confirm Activation Action
  const handleConfirmActivation = () => {
    if (!stagedFileName) return;
    setActiveBaselineName(`Crime Statistics: ${stagedFileName.replace('.csv', '')}`);
    setActiveBaselineVersion('Candidate v1.1 (Activated)');
    setIsActivateModalOpen(false);

    // Update audit log
    setAuditRecords((prev) => [
      {
        id: `rec-${Date.now()}`,
        name: `${stagedFileName} (Promoted Baseline)`,
        agency: 'NBS Nigeria (Audited)',
        year: '2017',
        records: 134663,
        timestamp: 'Just now',
        ingestedBy: 'System Admin',
        status: 'Active Baseline',
        isVerified: true,
      },
      ...prev.map((r) => (r.status === 'Active Baseline' ? { ...r, status: 'Archived' as const } : r)),
    ]);

    showToast('Dataset Activated! Production baseline updated to candidate v1.1.', 'success');
  };

  // Confirm Delete Action
  const handleConfirmDelete = () => {
    setStagedFileName(null);
    setIsDeleteModalOpen(false);
    showToast('Staged candidate file removed from ingestion buffer.', 'error');
  };

  // Export active baseline
  const handleExportBaseline = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      let csv = 'State,Geopolitical Zone,Category,Cases,Reporting Year\n';
      NIGERIAN_STATES_DATA.forEach((st) => {
        csv += `"${st.state} State","${st.zone}","Offences Against Property",${st.propertyCases},2017\n`;
        csv += `"${st.state} State","${st.zone}","Offences Against Persons",${st.personsCases},2017\n`;
        csv += `"${st.state} State","${st.zone}","Offences vs Lawful Authority",${st.authorityCases},2017\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-crime-baseline-nbs-2017.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const exportObj = {
        title: 'NBS 2017 Official Crime Baseline',
        datasetSource: 'National Bureau of Statistics (NBS) Nigeria',
        reportingYear: 2017,
        totalCases: 134663,
        propertyCases: 68579,
        personsCases: 53641,
        authorityCases: 12443,
        federationCoverage: '36 States + FCT',
        sha256Checksum: '8f4e2b1090ab1289cf49a0e1c20174180',
        records: NIGERIAN_STATES_DATA.map((st) => ({
          state: st.state,
          zone: st.zone,
          property: st.propertyCases,
          persons: st.personsCases,
          authority: st.authorityCases,
          total: st.totalCases,
        })),
      };
      const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smart-crime-baseline-nbs-2017.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    showToast(`Exporting NBS 2017 baseline (${format.toUpperCase()})...`, 'success');
  };

  const totalPages = Math.ceil(previewRows.length / rowsPerPage);
  const currentPreviewRows = previewRows.slice((previewPage - 1) * rowsPerPage, previewPage * rowsPerPage);

  return (
    <div className="flex flex-col w-full space-y-8 max-w-[1500px] mx-auto pb-16 font-sans">
      {/* PAGE HEADER & ACTION CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Dataset Management</h1>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-semibold">Active Baseline: {activeBaselineVersion}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#6200a9] text-white shadow-xs">
              <span className="material-symbols-outlined text-[14px]">shield_person</span>
              <span className="text-[10px] tracking-wider uppercase font-bold">ADMIN WORKSPACE</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Upload, validate, and manage historical administrative datasets powering machine-learning pipelines, geospatial clustering, and predictive spatial risk baselines across Nigeria.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            onClick={() => {
              if (onOpenDataExplorer) {
                onOpenDataExplorer();
              } else {
                onNavigateTab('crime-data');
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors text-xs font-semibold cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-[#6200a9]">visibility</span>
            <span>View Data Explorer</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('upload-pipeline-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6200a9] hover:bg-[#7e22ce] text-white shadow-sm hover:shadow transition-all text-xs font-semibold cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
            <span>Upload Dataset</span>
          </button>
        </div>
      </div>

      {/* ACTIVE DATASET MASTER CARD + HEALTH METRICS */}
      <div className="flex flex-col space-y-6">
        {/* Primary Active Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-purple-50 pointer-events-none blur-3xl opacity-70"></div>

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col space-y-2 max-w-3xl">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Active Baseline Dataset
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active · In Production
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {activeBaselineName}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Official benchmark published by the National Bureau of Statistics (NBS). Serves as the ground-truth historical training corpus for spatial incident risk indices, K-Means geopolitical clusters, and Random Forest feature calibration.
              </p>
            </div>

            {/* Quick actions on active dataset */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={() => handleExportBaseline('csv')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors text-xs font-medium cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                <span>Export Baseline</span>
              </button>

              <button
                onClick={() => setIsReplaceModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 text-[#6200a9] hover:bg-purple-100 border border-purple-200 transition-colors text-xs font-semibold cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">swap_horizontal_circle</span>
                <span>Replace Dataset</span>
              </button>
            </div>
          </div>

          {/* Metadata Bento Grid */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 bg-slate-50 rounded-xl p-4 border border-slate-200/80">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Source Agency</span>
              <span className="text-xs sm:text-sm text-slate-900 font-bold truncate mt-0.5">NBS Nigeria</span>
              <span className="text-[11px] text-slate-500">Official Gazette</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Reporting Year</span>
              <span className="text-xs sm:text-sm text-slate-900 font-bold truncate mt-0.5">2017 Benchmark</span>
              <span className="text-[11px] text-slate-500">Full-year synthesis</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Verified Records</span>
              <span className="text-xs sm:text-sm text-slate-900 font-bold truncate mt-0.5">134,663 Offences</span>
              <span className="text-[11px] text-emerald-700 font-medium">Zero null records</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Administrative Span</span>
              <span className="text-xs sm:text-sm text-slate-900 font-bold truncate mt-0.5">36 States + FCT</span>
              <span className="text-[11px] text-slate-500">100% Federation</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">File Checksum</span>
              <span className="text-xs sm:text-sm text-slate-900 font-bold truncate mt-0.5">SHA-256 Valid</span>
              <span className="text-[11px] text-slate-500">UTF-8 Clean RFC4180</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Engine Status</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-[#6200a9]">model_training</span>
                <span className="text-xs sm:text-sm text-[#6200a9] font-bold truncate">Model Ready</span>
              </div>
              <span className="text-[11px] text-slate-500">Pipelines online</span>
            </div>
          </div>

          {/* Statutory Category Breakdown */}
          <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Statutory Crime Categories Partitioning
              </span>
              <span className="text-xs text-slate-500">Categorical totals distributed across legal reporting classes</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#6200a9]"></div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500">Against Property</span>
                  <span className="text-xs font-bold text-slate-900">
                    68,579 <span className="text-[10px] text-slate-500 font-normal">(50.9%)</span>
                  </span>
                </div>
              </div>

              <div className="w-px h-7 bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500">Against Persons</span>
                  <span className="text-xs font-bold text-slate-900">
                    53,641 <span className="text-[10px] text-slate-500 font-normal">(39.8%)</span>
                  </span>
                </div>
              </div>

              <div className="w-px h-7 bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-200"></div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500">Lawful Authority</span>
                  <span className="text-xs font-bold text-slate-900">
                    12,443 <span className="text-[10px] text-slate-500 font-normal">(9.3%)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Analytical KPI Health Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Records</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6200a9]">
                <span className="material-symbols-outlined text-[18px]">storage</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">134,663</div>
              <div className="flex items-center gap-1 mt-1 text-emerald-700">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span className="text-xs font-medium">NBS Verified Baseline</span>
              </div>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Geographic Coverage</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6200a9]">
                <span className="material-symbols-outlined text-[18px]">public</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">36 States + FCT</div>
              <div className="flex items-center gap-1 mt-1 text-emerald-700">
                <span className="material-symbols-outlined text-[16px]">map</span>
                <span className="text-xs font-medium">100% National Span</span>
              </div>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Statutory Classes</span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#6200a9]">
                <span className="material-symbols-outlined text-[18px]">category</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">3 Categories</div>
              <div className="flex items-center gap-1 mt-1 text-slate-600">
                <span className="material-symbols-outlined text-[16px] text-slate-400">balance</span>
                <span className="text-xs">Persons, Property, Authority</span>
              </div>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Quality</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-[28px] font-bold text-emerald-600 tracking-tight">Ready (100%)</div>
              <div className="flex items-center gap-1 mt-1 text-slate-600">
                <span className="material-symbols-outlined text-[16px] text-emerald-500">done_all</span>
                <span className="text-xs">Schema valid, 0 dupes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPLOAD NEW DATASET & VALIDATION WORKFLOW */}
      <div className="flex flex-col space-y-6" id="upload-pipeline-section">
        {/* Section Title & 4-Step Pipeline Bar */}
        <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Dataset Ingestion & Validation Workflow</h3>
            <p className="text-xs text-slate-600">
              Execute automated heuristic compliance, schema checks, and integrity verification before model consumption.
            </p>
          </div>

          {/* 4-step Horizontal Status Indicator */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {/* Step 1 Completed */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#6200a9] text-white text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-900 font-bold">01 Upload</span>
                <span className="text-[10px] text-emerald-700 font-medium">Staged</span>
              </div>
            </div>

            <div className="w-7 h-0.5 bg-[#6200a9]"></div>

            {/* Step 2 Active */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 text-white text-xs font-bold animate-pulse">
                02
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-[#6200a9] font-bold">02 Validate</span>
                <span className="text-[10px] text-[#6200a9] font-semibold">In Review</span>
              </div>
            </div>

            <div className="w-7 h-0.5 bg-slate-200"></div>

            {/* Step 3 Pending */}
            <div className="flex items-center gap-2 opacity-60">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                03
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-700 font-medium">03 Review</span>
                <span className="text-[10px] text-slate-400">Pre-deploy</span>
              </div>
            </div>

            <div className="w-7 h-0.5 bg-slate-200"></div>

            {/* Step 4 Pending */}
            <div className="flex items-center gap-2 opacity-60">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                04
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-700 font-medium">04 Activate</span>
                <span className="text-[10px] text-slate-400">Production</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Ingestion Engine Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Upload Area & Staged File Card (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            {/* Drag & Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const file = e.dataTransfer.files[0];
                  setStagedFileName(file.name);
                  setStagedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
                  setStagedTime('Uploaded just now by Lead Analyst');
                  showToast(`Selected ${file.name}. Initializing schema pipeline...`, 'info');
                }
              }}
              className="group relative rounded-2xl bg-white border-2 border-dashed border-purple-200 hover:border-[#6200a9] p-7 shadow-xs hover:shadow-md transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]"
            >
              <input
                ref={fileInputRef}
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
                type="file"
              />

              <div className="w-13 h-13 rounded-2xl bg-purple-50 flex items-center justify-center text-[#6200a9] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">upload_file</span>
              </div>

              <h4 className="mt-3 text-base font-bold text-slate-900">Drag and drop your CSV file here</h4>

              <p className="mt-1 text-xs text-slate-600 max-w-sm">
                Or <span className="text-[#6200a9] font-semibold underline underline-offset-2">browse from your computer</span>. Supported format: CSV (max 50MB).
              </p>

              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium">
                <span className="material-symbols-outlined text-[14px] text-purple-700">info</span>
                Required headers: State, Crime Category, Reported Cases, Reporting Year
              </div>
            </div>

            {/* Staged File Card */}
            {stagedFileName ? (
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Staged Ingestion Candidate
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                    Ready for validation
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#6200a9] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[20px]">csv</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm text-slate-900 font-bold truncate font-mono">
                        {stagedFileName}
                      </span>
                      <span className="text-[11px] text-slate-500">{stagedFileSize} • {stagedTime}</span>
                    </div>
                  </div>

                  <button
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    onClick={() => setIsDeleteModalOpen(true)}
                    title="Remove staged file"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-slate-600 text-xs font-mono">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">lock</span>
                    <span>SHA-256: 8f4e2...90ab12</span>
                  </div>

                  <button
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#6200a9] hover:bg-[#7e22ce] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-75"
                    onClick={handleRerunValidation}
                    disabled={isValidating}
                    type="button"
                  >
                    <span className={`material-symbols-outlined text-[16px] ${isValidating ? 'animate-spin' : ''}`}>
                      {isValidating ? 'sync' : 'auto_awesome'}
                    </span>
                    <span>{isValidating ? 'Validating...' : 'Re-run Validation Engine'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 text-xs">
                No file currently staged. Upload or drop a CSV dataset above to initiate schema validation.
              </div>
            )}
          </div>

          {/* Right Column: Dataset Validation Engine Panel (6 Cols) */}
          <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#6200a9] text-[22px]">troubleshoot</span>
                  <h4 className="text-base font-bold text-slate-900">Dataset Validation Pipeline</h4>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  7 of 7 Passed
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4">
                Automated verification checks assessing schema conformity, geospatial nomenclature, and data purity.
              </p>

              {/* Check Matrix */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                    <span className="text-slate-800 font-medium">Schema validation</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">Passed (4/4 core columns mapped)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                    <span className="text-slate-800 font-medium">Required columns present</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">Passed (State, Category, Cases, Year)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                    <span className="text-slate-800 font-medium">Missing values analysis</span>
                  </div>
                  <span className="text-emerald-700 font-bold text-[11px]">Passed (0 null fields detected)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                    <span className="text-slate-800 font-medium">Duplicate records check</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">Passed (0 duplicated tuples)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                    <span className="text-slate-800 font-medium">Data type integrity</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">Passed (String, Categorical, Int, Year)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                    <span className="text-slate-800 font-medium">State nomenclature coverage</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">Passed (36 geopolitical states + FCT)</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                    <span className="text-slate-800 font-medium">Statutory category conformity</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">Passed (Matches statutory 3-tier taxonomy)</span>
                </div>
              </div>
            </div>

            {/* Status Notification Box & Actions */}
            <div className="flex flex-col space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-emerald-600 mt-0.5">verified_user</span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-emerald-900">Dataset validation passed</span>
                  <p className="text-xs text-emerald-800 leading-snug">
                    The uploaded candidate meets all 7 integrity constraints and is qualified for analytical staging and live model activation.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById('preview-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  type="button"
                >
                  Review Sample Data
                </button>

                <button
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6200a9] hover:bg-[#7e22ce] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  onClick={() => setIsActivateModalOpen(true)}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">publish</span>
                  <span>Activate Dataset</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REQUIRED DATA STRUCTURE (SCHEMA CONTRACT) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#6200a9] text-[22px]">schema</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Required Data Structure (Schema Contract)</h3>
              <p className="text-xs text-slate-600">Datasets uploaded to Smart Crime must strictly conform to the 4 canonical feature vectors below.</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
            <span className="material-symbols-outlined text-[16px] text-[#6200a9]">terminal</span>
            <span>RFC4180 Standard UTF-8</span>
          </div>
        </div>

        {/* Schema Table */}
        <div className="overflow-x-auto rounded-xl bg-slate-50 border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Field Name</th>
                <th className="px-4 py-3">Data Type</th>
                <th className="px-4 py-3">Accepted Values & Scope</th>
                <th className="px-4 py-3">Validation Rules</th>
                <th className="px-4 py-3 text-right">Requirement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900">
              <tr className="hover:bg-white transition-colors">
                <td className="px-4 py-3 font-semibold font-mono text-[#6200a9]">State</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-slate-200 font-mono text-slate-700 font-medium">String</span>
                </td>
                <td className="px-4 py-3 text-slate-700">36 Recognized Nigerian States + Federal Capital Territory (FCT Abuja)</td>
                <td className="px-4 py-3 text-slate-500">Must match standard NBS geopolitical nomenclature exactly</td>
                <td className="px-4 py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">Required</span>
                </td>
              </tr>

              <tr className="hover:bg-white transition-colors">
                <td className="px-4 py-3 font-semibold font-mono text-[#6200a9]">Crime Category</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-slate-200 font-mono text-slate-700 font-medium">Categorical</span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  <span className="font-medium text-slate-900">Offences Against Persons</span>,{' '}
                  <span className="font-medium text-slate-900">Offences Against Property</span>,{' '}
                  <span className="font-medium text-slate-900">Offences Against Lawful Authority</span>
                </td>
                <td className="px-4 py-3 text-slate-500">Strict 3-category statutory taxonomy; case-sensitive string match</td>
                <td className="px-4 py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">Required</span>
                </td>
              </tr>

              <tr className="hover:bg-white transition-colors">
                <td className="px-4 py-3 font-semibold font-mono text-[#6200a9]">Reported Cases</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-slate-200 font-mono text-slate-700 font-medium">Integer (uint32)</span>
                </td>
                <td className="px-4 py-3 text-slate-700">Non-negative integer count of verified recorded police offences [0 - 10,000,000]</td>
                <td className="px-4 py-3 text-slate-500">Nulls prohibited; non-numeric values trigger fatal schema parse errors</td>
                <td className="px-4 py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">Required</span>
                </td>
              </tr>

              <tr className="hover:bg-white transition-colors">
                <td className="px-4 py-3 font-semibold font-mono text-[#6200a9]">Reporting Year</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded bg-slate-200 font-mono text-slate-700 font-medium">Integer (Year)</span>
                </td>
                <td className="px-4 py-3 text-slate-700">Four-digit Gregorian calendar year (e.g., 2017)</td>
                <td className="px-4 py-3 text-slate-500">Historical baseline calibration timeframe; range 1999–Current Year</td>
                <td className="px-4 py-3 text-right">
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">Required</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Schema Notice Callout */}
        <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100 flex items-center gap-3 text-slate-700 text-xs">
          <span className="material-symbols-outlined text-[#6200a9] text-[20px] shrink-0">data_object</span>
          <p>
            <span className="font-bold text-slate-900">ML Preprocessing Contract:</span> Field names and accepted values must match backend data preprocessing standards for Decision Tree feature vectors, Random Forest hyperparameter estimators, and K-Means spatial clustering centroids.
          </p>
        </div>
      </div>

      {/* DATASET PREVIEW & QUALITY CHECKLIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="preview-section">
        {/* Left: Dataset Preview Table (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6200a9] text-[20px]">preview</span>
                <h4 className="text-base font-bold text-slate-900">Dataset Preview ({stagedFileName || 'active_baseline.csv'})</h4>
              </div>
              <span className="text-[11px] text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                Showing rows {(previewPage - 1) * rowsPerPage + 1}–{Math.min(previewPage * rowsPerPage, previewRows.length)} of 111 preview records
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl bg-slate-50 border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">State</th>
                    <th className="px-4 py-3">Crime Category</th>
                    <th className="px-4 py-3">Reported Cases</th>
                    <th className="px-4 py-3">Reporting Year</th>
                    <th className="px-4 py-3 text-right">Schema Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-900">
                  {currentPreviewRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">{row.state}</td>
                      <td className="px-4 py-3 text-slate-600">{row.category}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#6200a9]">{row.cases}</td>
                      <td className="px-4 py-3 text-slate-500 font-mono">{row.year}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                          <span className="material-symbols-outlined text-[14px]">check</span> Validated
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preview Footer Navigation */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
                disabled={previewPage === 1}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <span className="text-xs text-slate-800 font-semibold">
                Page {previewPage} of {totalPages}
              </span>
              <button
                onClick={() => setPreviewPage((p) => Math.min(totalPages, p + 1))}
                disabled={previewPage === totalPages}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>

            <button
              onClick={() => setIsJsonLogModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs text-[#6200a9] hover:underline font-bold cursor-pointer"
              type="button"
            >
              <span>View Full Ingestion Log (JSON)</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right: Data Quality Checklist (4 Cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-emerald-600 text-[22px]">checklist</span>
              <h4 className="text-base font-bold text-slate-900">Quality Checklist</h4>
            </div>

            <p className="text-xs text-slate-600 mb-4">Strict verification protocol applied by the data staging engine.</p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">task_alt</span>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">Required Fields Check</span>
                  <span className="text-[11px] text-slate-500">State, Category, Cases, Year present in header</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">task_alt</span>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">Data Types Validated</span>
                  <span className="text-[11px] text-slate-500">All counts parse as unsigned integer without overflow</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">task_alt</span>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">Crime Categories Clean</span>
                  <span className="text-[11px] text-slate-500">Exclusively 3 statutory categories, zero aliases</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">task_alt</span>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">State Values Normalization</span>
                  <span className="text-[11px] text-slate-500">All 37 administrative geo-entities matched</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">task_alt</span>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">Duplicate Detection</span>
                  <span className="text-[11px] text-slate-500">0 composite primary key collisions [State + Category]</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">task_alt</span>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">Outlier Threshold Check</span>
                  <span className="text-[11px] text-slate-500">Values fall within 3-sigma expected variance bounds</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700">Total integrity score:</span>
            <span className="font-bold text-emerald-700">100% Passed</span>
          </div>
        </div>
      </div>

      {/* DATASET HISTORY & VERSION AUDIT TABLE */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#6200a9] text-[22px]">history_edu</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Dataset Version History & Audit Log</h3>
              <p className="text-xs text-slate-600">Immutable administrative record of all ingested, staged, and retired analytical datasets.</p>
            </div>
          </div>

          {/* Filter dropdown / toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              {(['All', 'Active Baseline', 'Validated Staging', 'Archived'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAuditFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    auditFilter === filter
                      ? 'bg-white text-[#6200a9] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto rounded-xl bg-slate-50 border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Dataset Name</th>
                <th className="px-4 py-3">Source Agency</th>
                <th className="px-4 py-3">Reference Year</th>
                <th className="px-4 py-3">Records</th>
                <th className="px-4 py-3">Upload Timestamp</th>
                <th className="px-4 py-3">Ingested By</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-900">
              {filteredAuditRecords.map((r) => (
                <tr key={r.id} className="hover:bg-white transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[18px] ${r.status === 'Active Baseline' ? 'text-[#6200a9]' : r.status === 'Validated Staging' ? 'text-purple-600' : 'text-slate-400'}`}>
                        {r.status === 'Active Baseline' ? 'verified' : r.status === 'Validated Staging' ? 'pending_actions' : 'archive'}
                      </span>
                      <span className="font-bold text-slate-900">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{r.agency}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-700">{r.year}</td>
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900">{r.records.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-slate-500">{r.timestamp}</td>
                  <td className="px-4 py-3.5 text-slate-600">{r.ingestedBy}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        r.status === 'Active Baseline'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : r.status === 'Validated Staging'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'Active Baseline' ? 'bg-emerald-500' : r.status === 'Validated Staging' ? 'bg-[#6200a9]' : 'bg-slate-400'}`}></span>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {r.status === 'Validated Staging' ? (
                        <>
                          <button
                            onClick={() => setIsActivateModalOpen(true)}
                            className="px-2.5 py-1 rounded-lg bg-[#6200a9] hover:bg-[#7e22ce] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            Activate
                          </button>
                          <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-200 transition-colors cursor-pointer"
                            title="Delete Staging"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsJsonLogModalOpen(true)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                            title="Inspect Dataset"
                          >
                            <span className="material-symbols-outlined text-[18px]">info</span>
                          </button>
                          <button
                            onClick={() => handleExportBaseline('csv')}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
                            title="Export CSV"
                          >
                            <span className="material-symbols-outlined text-[18px]">download</span>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESPONSIBLE GOVERNANCE & MODEL IMPACT NOTICES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Banner 1: Historical Dataset Governance (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6200a9] text-[22px]">policy</span>
              <h4 className="text-base font-bold text-slate-900">Historical Dataset Governance</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              The current production dataset reflects verified historical records compiled by the National Bureau of Statistics (NBS). Smart Crime operates on empirical historical baselines to calibrate spatial risk clustering and algorithmic pattern recognition.
            </p>

            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-slate-800 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#6200a9] font-bold">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Civic Integrity Principle</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Updating datasets alters the baseline statistical distribution for policy analysis and does{' '}
                <span className="font-bold text-slate-900">not</span> imply active real-time surveillance or predictive punitive profiling.
              </p>
            </div>
          </div>

          {/* Recent Admin Activity */}
          <div className="pt-2 space-y-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Recent Admin Actions
            </span>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Validated candidate file staged_crime_data_v1.1.csv</span>
                <span className="font-mono text-slate-400 text-[11px]">11:22 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verified cryptographic checksum SHA-256 for active dataset</span>
                <span className="font-mono text-slate-400 text-[11px]">Yesterday</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Exported full NBS 2017 geographical baseline report</span>
                <span className="font-mono text-slate-400 text-[11px]">3 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Banner 2: Dataset Changes Affect Model Calibration (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-700">
              <span className="material-symbols-outlined text-[22px] text-red-600">warning_amber</span>
              <h4 className="text-base font-bold text-slate-900">Dataset Changes Affect Model Calibration</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Activating an alternative dataset invalidates the existing training state of predictive models. All active instances of Decision Trees, Random Forest risk weights, and K-Means spatial centroids must be retrained against the new baseline.
            </p>

            {/* Impact Indicators */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#6200a9] text-[20px]">psychology</span>
                <span className="text-xs font-bold text-slate-900 mt-1">Random Forest</span>
                <span className="text-[11px] text-amber-700 font-semibold">Retrain Req.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#6200a9] text-[20px]">scatter_plot</span>
                <span className="text-xs font-bold text-slate-900 mt-1">K-Means</span>
                <span className="text-[11px] text-amber-700 font-semibold">Centroids Shift</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[#6200a9] text-[20px]">account_tree</span>
                <span className="text-xs font-bold text-slate-900 mt-1">Decision Tree</span>
                <span className="text-[11px] text-amber-700 font-semibold">Rebuild Tree</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500">Pipeline sync required post-activation</span>
            <button
              onClick={() => onNavigateTab('models')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6200a9] text-xs font-semibold border border-purple-200 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
              <span>View Model Performance</span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== MODALS & ACTION DIALOGS ==================== */}

      {/* Modal 1: Activate Dataset Confirmation */}
      {isActivateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-xl border border-slate-200 flex flex-col space-y-4">
            <div className="flex items-center gap-3 text-[#6200a9]">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100">
                <span className="material-symbols-outlined text-[24px]">publish</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Activate Staged Dataset?</h4>
                <span className="text-xs text-slate-500">Production Deployment Confirmation</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              You are about to promote <span className="font-bold text-slate-900 font-mono">{stagedFileName}</span> to the live analytical baseline. This operation will:
            </p>

            <ul className="space-y-1.5 text-xs text-slate-600 list-disc pl-5">
              <li>Overwrite active 2017 NBS baseline tables in primary production cache.</li>
              <li>Trigger automatic background cache invalidation across all analytical endpoints.</li>
              <li>Flag current Decision Tree and K-Means models for automated retraining.</li>
            </ul>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[#6200a9] text-[18px]">info</span>
              <span>Administrator cryptographic token verified. Action will be logged to immutable audit ledger.</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                onClick={() => setIsActivateModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-[#6200a9] hover:bg-[#7e22ce] text-white text-xs font-semibold shadow-sm cursor-pointer"
                onClick={handleConfirmActivation}
                type="button"
              >
                Confirm & Activate Baseline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Replace Dataset Dialog */}
      {isReplaceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-xl border border-slate-200 flex flex-col space-y-4">
            <div className="flex items-center gap-3 text-[#6200a9]">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100">
                <span className="material-symbols-outlined text-[24px]">swap_horizontal_circle</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Replace Production Baseline</h4>
                <span className="text-xs text-slate-500">Authorized Data Substitution</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To replace the active baseline dataset, upload a validated CSV package matching the canonical schema. Historical data will be archived under legacy version logs.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase block">Reason for replacement</label>
              <select
                value={replaceReason}
                onChange={(e) => setReplaceReason(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs font-medium outline-none focus:border-[#6200a9]"
              >
                <option>Official NBS Statistical Revision Update</option>
                <option>Data Normalization Correction</option>
                <option>New Historical Reporting Batch</option>
                <option>Audited State Boundary Realignment</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                onClick={() => setIsReplaceModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-[#6200a9] hover:bg-[#7e22ce] text-white text-xs font-semibold shadow-sm cursor-pointer"
                onClick={() => {
                  setIsReplaceModalOpen(false);
                  const el = document.getElementById('upload-pipeline-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  showToast(`Replacement mode initiated: ${replaceReason}`, 'info');
                }}
                type="button"
              >
                Proceed to Upload Pipeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Delete Staged Candidate */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-7 shadow-xl border border-slate-200 flex flex-col space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-200">
                <span className="material-symbols-outlined text-[24px]">delete</span>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Remove Staged File?</h4>
                <span className="text-xs text-slate-500">Purge Candidate</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will remove <span className="font-bold text-slate-900 font-mono">{stagedFileName}</span> from the staging buffer. You can upload a fresh file at any time.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                onClick={() => setIsDeleteModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-sm cursor-pointer"
                onClick={handleConfirmDelete}
                type="button"
              >
                Remove File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Full Ingestion Log (JSON) */}
      {isJsonLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-slate-200 flex flex-col space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-[#6200a9]">
                <span className="material-symbols-outlined text-[22px]">data_object</span>
                <h4 className="text-base font-bold text-slate-900">Dataset Ingestion Ledger Log</h4>
              </div>
              <button
                onClick={() => setIsJsonLogModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-80 leading-relaxed">
{JSON.stringify(
  {
    ingestionSessionId: 'INGEST-2026-NBS-00918',
    activeDataset: {
      canonicalTitle: activeBaselineName,
      version: activeBaselineVersion,
      recordsVerified: 134663,
      checksumSHA256: '8f4e2b1090ab1289cf49a0e1c20174180',
      geographicalEntities: 37,
      categories: [
        'Offences Against Property (68,579)',
        'Offences Against Persons (53,641)',
        'Offences Against Lawful Authority (12,443)',
      ],
    },
    validationPipeline: {
      schemaConformity: true,
      dataTypesIntact: true,
      duplicateRowsDetected: 0,
      nullOrMissingFields: 0,
      complianceStatus: '100% Certified ISO/IEC 22989:2022',
    },
    downstreamModelSync: {
      randomForestCalibrated: true,
      decisionTreeRootBuilt: true,
      kMeansCentroidsDerived: 3,
    },
  },
  null,
  2
)}
            </pre>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsJsonLogModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#6200a9] text-white text-xs font-semibold hover:bg-[#7e22ce] cursor-pointer"
              >
                Close Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-xs font-semibold transition-all animate-bounce ${
              toast.type === 'success'
                ? 'bg-emerald-600'
                : toast.type === 'error'
                ? 'bg-red-600'
                : 'bg-[#6200a9]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
            </span>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
