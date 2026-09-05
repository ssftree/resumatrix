import React, { useState } from 'react';
import { Printer, Terminal, LayoutGrid, Code2 } from 'lucide-react';
import { AppTemplate, PortfolioConfig } from '../../types';
import { DEFAULT_PORTFOLIO_CONFIG } from '../../portfolio.config';
import { ResumeDocument } from '../ResumeDocument';
import { listResumeLocales, resolveResumeLocale } from '../../utils/resumeLocale';

interface AcademicViewProps {
  onSwitchTemplate: (template: AppTemplate) => void;
  config?: PortfolioConfig;
  watermark?: 'brand' | 'none';
}

export const AcademicView: React.FC<AcademicViewProps> = ({
  onSwitchTemplate,
  config = DEFAULT_PORTFOLIO_CONFIG,
  watermark = 'brand',
}) => {
  const [selectedLocale, setSelectedLocale] = useState<string | undefined>(undefined);
  const localeOptions = listResumeLocales(config);
  const { config: resolvedConfig, labels } = resolveResumeLocale(config, selectedLocale);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-900 py-8 px-4 sm:px-6 flex flex-col items-center">
      {/* Top action bar (hidden on print) */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-6 print:hidden text-xs font-mono">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSwitchTemplate('terminal')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-neutral-700 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>
          <button
            onClick={() => onSwitchTemplate('ide')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-blue-400 border border-neutral-700 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>IDE</span>
          </button>
          <button
            onClick={() => onSwitchTemplate('bento')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-purple-400 border border-neutral-700 transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Bento</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {localeOptions.length > 0 && (
            <label className="flex items-center gap-1.5">
              <span className="sr-only">Resume language</span>
              <select
                aria-label="Resume language"
                value={selectedLocale ?? localeOptions[0].value}
                onChange={(event) => setSelectedLocale(event.target.value)}
                className="bg-neutral-800 border border-neutral-700 rounded px-1.5 py-1.5 text-xs cursor-pointer"
              >
                {localeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-medium shadow-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{labels.print}</span>
          </button>
        </div>
      </div>

      {/* Paper Sheet (Academic LaTeX Style) */}
      <div
        id="academic-resume-sheet"
        className="w-full max-w-4xl bg-white text-neutral-900 p-8 sm:p-12 rounded-lg shadow-2xl print:p-0 print:shadow-none print:rounded-none"
      >
        <ResumeDocument
          config={resolvedConfig}
          labels={labels}
          presentation="academic"
          watermark={watermark}
        />
      </div>
    </div>
  );
};
