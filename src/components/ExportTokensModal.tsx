import React, { useState } from 'react';
import { DESIGN_TOKENS_YAML } from '../data/crimeData';

interface ExportTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportTokensModal: React.FC<ExportTokensModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState<'yaml' | 'json'>('yaml');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const jsonContent = JSON.stringify(
    {
      version: '1.0.0',
      design_tokens: {
        colors: {
          primary: '#6200a9',
          primary_light: '#7e22ce',
          primary_container: '#f0dbff',
          secondary: '#6e3aca',
          surface: '#ffffff',
          surface_container_low: '#faf0ff',
          outline_variant: '#e9dff2',
          on_surface: '#1e1926',
          on_surface_variant: '#4c4354'
        },
        typography: {
          font_family: 'Plus Jakarta Sans, sans-serif',
          scale: {
            display_lg: '48px',
            headline_lg: '34px',
            headline_md: '28px',
            title_lg: '20px',
            body_lg: '16px',
            body_md: '14px',
            label_sm: '11px'
          }
        },
        geometry: {
          border_radius: '16px',
          padding_outer: '16px',
          button_ratio: '2:1 (horizontal : vertical)'
        }
      }
    },
    null,
    2
  );

  const textToCopy = format === 'yaml' ? DESIGN_TOKENS_YAML : jsonContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([textToCopy], { type: format === 'yaml' ? 'text/yaml' : 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `smart_crime_tokens.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-2xl rounded-3xl bg-white border border-[#e9dff2] shadow-2xl p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#f0dbff] flex items-center justify-center text-[#6200a9]">
              <span className="material-symbols-outlined text-[20px]">file_download</span>
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#1e1926]">
                Export Design Tokens
              </h3>
              <span className="text-[12px] text-[#4c4354]">
                Light Mode Constitution tokens for Figma, Tailwind v4, & Style Dictionary
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#faf0ff] hover:bg-[#efe4f8] flex items-center justify-center text-[#4c4354] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#faf0ff] border border-[#e9dff2]">
            <button
              onClick={() => setFormat('yaml')}
              className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-colors ${
                format === 'yaml' ? 'bg-[#7e22ce] text-white' : 'text-[#4c4354] hover:text-[#1e1926]'
              }`}
            >
              YAML Tokens
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`px-3 py-1 rounded-lg text-[12px] font-bold transition-colors ${
                format === 'json' ? 'bg-[#7e22ce] text-white' : 'text-[#4c4354] hover:text-[#1e1926]'
              }`}
            >
              JSON Schema
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl border border-[#cfc2d6] hover:bg-[#faf0ff] text-[12px] font-semibold text-[#1e1926] flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download .{format}</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 rounded-xl bg-[#6200a9] hover:bg-[#7e22ce] text-white text-[12px] font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
        </div>

        {/* Code View */}
        <div className="w-full h-80 rounded-2xl bg-[#faf0ff] border border-[#e9dff2] p-4 font-mono text-[11px] text-[#1e1926] overflow-y-auto whitespace-pre leading-relaxed">
          {textToCopy}
        </div>
      </div>
    </div>
  );
};
