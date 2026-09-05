import React, { useRef, useState } from 'react';
import { X, Printer } from 'lucide-react';
import { PortfolioConfig, ThemeConfig } from '../types';
import { DEFAULT_PORTFOLIO_CONFIG } from '../portfolio.config';
import { useModalA11y } from '../hooks/useModalA11y';
import { ResumeDocument } from './ResumeDocument';
import { listResumeLocales, resolveResumeLocale } from '../utils/resumeLocale';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  config?: PortfolioConfig;
  watermark?: 'brand' | 'none';
}

export const ResumeModal: React.FC<ResumeModalProps> = ({
  isOpen,
  onClose,
  theme,
  config = DEFAULT_PORTFOLIO_CONFIG,
  watermark = 'brand',
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [selectedLocale, setSelectedLocale] = useState<string | undefined>(undefined);

  useModalA11y({
    isOpen,
    onClose,
    dialogRef,
    initialFocusRef: closeButtonRef,
  });

  if (!isOpen) return null;

  const localeOptions = listResumeLocales(config);
  const { config: resolvedConfig, labels } = resolveResumeLocale(config, selectedLocale);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm print:static print:block print:bg-transparent print:backdrop-blur-none print:p-0">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-modal-title"
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:static print:max-w-none print:max-h-none print:h-auto print:border-0 print:rounded-none print:shadow-none print:overflow-visible"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
          color: theme.text,
        }}
      >
        {/* Header Toolbar */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b print:hidden"
          style={{ borderColor: theme.border }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 id="resume-modal-title" className="font-bold text-sm sm:text-base">Curriculum Vitae — {resolvedConfig.profile.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            {localeOptions.length > 0 && (
              <label className="flex items-center gap-1.5 text-xs">
                <span className="sr-only">Resume language</span>
                <select
                  aria-label="Resume language"
                  value={selectedLocale ?? localeOptions[0].value}
                  onChange={(event) => setSelectedLocale(event.target.value)}
                  className="bg-transparent border border-white/20 rounded px-1.5 py-1 text-xs cursor-pointer"
                >
                  {localeOptions.map((option) => (
                    <option key={option.value} value={option.value} className="text-black">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded text-xs border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> {labels.print}
            </button>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close résumé"
              className="p-1.5 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 print:overflow-visible print:p-0">
          <ResumeDocument
            config={resolvedConfig}
            labels={labels}
            presentation="themed"
            watermark={watermark}
            accentColor={theme.accent}
            borderColor={theme.border}
          />
        </div>
      </div>
    </div>
  );
};
