import React from 'react';

interface FoundationViewProps {
  onBackToOverview?: () => void;
  onOpenExportTokens?: () => void;
}

export const FoundationView: React.FC<FoundationViewProps> = ({
  onBackToOverview,
  onOpenExportTokens,
}) => {
  const colorTokens = [
    { name: 'Primary', hex: '#6200a9', role: 'Main actionable accents, brand anchors', class: 'bg-[#6200a9]', text: 'text-white' },
    { name: 'Primary Light', hex: '#7e22ce', role: 'Hover states & interactive buttons', class: 'bg-[#7e22ce]', text: 'text-white' },
    { name: 'Primary Container', hex: '#f0dbff', role: 'Active chips, badges, card accents', class: 'bg-[#f0dbff]', text: 'text-[#2c0051]' },
    { name: 'Secondary', hex: '#6e3aca', role: 'Engine cards, secondary badges', class: 'bg-[#6e3aca]', text: 'text-white' },
    { name: 'Surface', hex: '#ffffff', role: 'Card backgrounds, elevations', class: 'bg-[#ffffff]', text: 'text-[#1e1926]', border: true },
    { name: 'Surface Container Low', hex: '#faf0ff', role: 'Input fills, section backdrops', class: 'bg-[#faf0ff]', text: 'text-[#1e1926]' },
    { name: 'Outline Variant', hex: '#e9dff2', role: 'Card dividers, subtle borders', class: 'bg-[#e9dff2]', text: 'text-[#1e1926]' },
    { name: 'On Surface (Ink)', hex: '#1e1926', role: 'Primary high-contrast typography', class: 'bg-[#1e1926]', text: 'text-white' },
    { name: 'On Surface Variant', hex: '#4c4354', role: 'Body copy, descriptions, captions', class: 'bg-[#4c4354]', text: 'text-white' },
  ];

  const typeScale = [
    { role: 'Display Large', size: '48px', weight: 'Bold (700)', sample: 'Understand Crime Patterns' },
    { role: 'Headline Large', size: '34px', weight: 'Bold (700)', sample: 'Crime Intelligence at a Glance' },
    { role: 'Headline Medium', size: '28px', weight: 'Bold (700)', sample: 'Built Around Nigerian Crime Data' },
    { role: 'Title Large', size: '20px', weight: 'Bold (700)', sample: 'Geopolitical Regional Matrix' },
    { role: 'Body Large', size: '16px', weight: 'Regular (400)', sample: 'Turn historical crime data into meaningful insights.' },
    { role: 'Body Medium', size: '14px', weight: 'Regular (400)', sample: 'A strictly verified four-step pipeline.' },
    { role: 'Label Small', size: '11px', weight: 'Bold (700)', sample: 'LIGHT MODE CONSTITUTION' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e9dff2]">
        <div>
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#6200a9]">
            <span>DESIGN SYSTEM SPECIFICATION</span>
            <span>•</span>
            <span className="text-[#4c4354]">Foundation Bible v1.0</span>
          </div>
          <h1 className="text-[28px] sm:text-[36px] font-bold text-[#1e1926] tracking-tight mt-1">
            Light Mode Constitution & Tokens
          </h1>
          <p className="text-[14px] text-[#4c4354] max-w-2xl">
            Mathematical tokens, color contrast guarantees (WCAG AA compliant), typographic scales, and spatial geometry defining Smart Crime.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenExportTokens && (
            <button
              onClick={onOpenExportTokens}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7e22ce] text-white hover:bg-[#6200a9] text-[13px] font-semibold transition-all shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export Design Tokens</span>
            </button>
          )}
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#ffffff] border border-[#cfc2d6] hover:bg-[#faf0ff] text-[#1e1926] text-[13px] font-semibold transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Overview</span>
            </button>
          )}
        </div>
      </div>

      {/* Color Palette Grid */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#1e1926]">
            1. Chromatic System & Neutrals
          </h2>
          <p className="text-[13px] text-[#4c4354]">
            High-contrast light surfaces anchored with regal deep-violet primary tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {colorTokens.map((c) => (
            <div
              key={c.name}
              className="p-4 rounded-2xl bg-white border border-[#e9dff2] shadow-xs flex flex-col gap-3"
            >
              <div className={`w-full h-20 rounded-xl ${c.class} ${c.text} flex items-end p-2.5 font-mono text-[12px] font-bold ${c.border ? 'border border-[#cfc2d6]' : ''}`}>
                {c.hex}
              </div>
              <div>
                <span className="text-[14px] font-bold text-[#1e1926] block">
                  {c.name}
                </span>
                <span className="text-[12px] text-[#4c4354] leading-tight block mt-0.5">
                  {c.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography Scale */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#1e1926]">
            2. Typographic Scale Hierarchy
          </h2>
          <p className="text-[13px] text-[#4c4354]">
            Rendered with <strong>Plus Jakarta Sans</strong> for geometric legibility and modern clarity.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-[#e9dff2] divide-y divide-[#e9dff2]/60 overflow-hidden shadow-xs">
          {typeScale.map((t) => (
            <div key={t.role} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-[180px]">
                <span className="text-[13px] font-bold text-[#6200a9] block">{t.role}</span>
                <span className="text-[11px] text-[#4c4354]">{t.size} • {t.weight}</span>
              </div>
              <div className="flex-1 text-[#1e1926] truncate font-medium" style={{ fontSize: t.size }}>
                {t.sample}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spatial Geometry & Math Rules */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#1e1926]">
            3. Layout Math & Anti-Slop Principles
          </h2>
          <p className="text-[13px] text-[#4c4354]">
            Mathematical principles strictly enforced across Smart Crime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#faf0ff] border border-[#e9dff2] flex flex-col gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#6200a9]">
              Padding Formula
            </span>
            <h3 className="text-[16px] font-bold text-[#1e1926]">
              Button 2x Rule & Container Bounds
            </h3>
            <p className="text-[13px] text-[#4c4354] leading-relaxed">
              Horizontal button padding is always 2x vertical padding (e.g. py-3 px-6). Minimum card container padding is 16px.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#faf0ff] border border-[#e9dff2] flex flex-col gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#6e3aca]">
              Curvature Math
            </span>
            <h3 className="text-[16px] font-bold text-[#1e1926]">
              Nested Border Radius
            </h3>
            <p className="text-[13px] text-[#4c4354] leading-relaxed">
              Nested corner radii satisfy: <code>Inner Radius = Outer Radius - Distance Between The Two</code>. Cards capped at 16–24px.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#faf0ff] border border-[#e9dff2] flex flex-col gap-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#7e22ce]">
              Ethics Charter
            </span>
            <h3 className="text-[16px] font-bold text-[#1e1926]">
              Zero Militaristic Tropes
            </h3>
            <p className="text-[13px] text-[#4c4354] leading-relaxed">
              No crosshairs, tactical badges, or predictive bias. Only transparent statistical metrics, empirical NBS data, and explainable models.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
