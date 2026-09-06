import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Copy, 
  Sparkles, 
  FileCode, 
  User, 
  Layers, 
  Briefcase, 
  Cpu, 
  AlertCircle
} from 'lucide-react';
import { PortfolioConfig } from '../types';
import { PRESET_CONFIGS } from '../portfolio.config';
import { useModalA11y } from '../hooks/useModalA11y';
import { parsePortfolioConfigJson } from '../utils/portfolioConfig';

interface ConfigCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PortfolioConfig;
  onSaveConfig: (newConfig: PortfolioConfig) => void;
  onResetConfig: () => void;
}

export const ConfigCustomizerModal: React.FC<ConfigCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetConfig,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'experience' | 'json'>('profile');
  const [copied, setCopied] = useState(false);
  const [jsonInput, setJsonInput] = useState(() => JSON.stringify(config, null, 2));
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Local editable draft state
  const [draft, setDraft] = useState<PortfolioConfig>(config);

  // Sync draft when config prop changes
  React.useEffect(() => {
    setDraft(config);
    setJsonInput(JSON.stringify(config, null, 2));
  }, [config]);

  useModalA11y({
    isOpen,
    onClose,
    dialogRef,
    initialFocusRef: closeButtonRef,
  });

  if (!isOpen) return null;

  const handleApplyPreset = (presetKey: string) => {
    const selected = PRESET_CONFIGS[presetKey]?.config;
    if (selected) {
      setDraft(selected);
      setJsonInput(JSON.stringify(selected, null, 2));
      onSaveConfig(selected);
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(draft, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(draft, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'portfolio.config.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = parsePortfolioConfigJson(event.target?.result as string);
      if (!result.success) {
        setJsonError('error' in result ? result.error : 'Invalid portfolio configuration.');
        return;
      }

      setDraft(result.data);
      setJsonInput(JSON.stringify(result.data, null, 2));
      onSaveConfig(result.data);
      setJsonError(null);
    };
    reader.readAsText(file);
  };

  const handleApplyJsonText = () => {
    const result = parsePortfolioConfigJson(jsonInput);
    if (!result.success) {
      setJsonError('error' in result ? result.error : 'Invalid portfolio configuration.');
      return;
    }

    setDraft(result.data);
    setJsonInput(JSON.stringify(result.data, null, 2));
    onSaveConfig(result.data);
    setJsonError(null);
  };

  const handleProfileFieldChange = (field: keyof typeof draft.profile, val: string) => {
    const next = {
      ...draft,
      profile: {
        ...draft.profile,
        [field]: val,
      },
    };
    setDraft(next);
    onSaveConfig(next);
  };

  const handleContactFieldChange = (field: keyof typeof draft.contact, val: string) => {
    const next = {
      ...draft,
      contact: {
        ...draft.contact,
        [field]: val,
      },
    };
    setDraft(next);
    onSaveConfig(next);
  };

  const handleMadeWithChange = (showMadeWith: boolean) => {
    const next = {
      ...draft,
      branding: { ...draft.branding, showMadeWith },
    };
    setDraft(next);
    onSaveConfig(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        ref={dialogRef}
        id="config-customizer-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="config-customizer-title"
        className="w-full max-w-4xl h-[88vh] max-h-[780px] bg-[#161b22] border border-neutral-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-200 font-sans"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 bg-[#0d1117] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="config-customizer-title" className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-mono">
                Portfolio Replicator & Config Engine
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-normal border border-emerald-500/30">
                  Live Sync
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Edit once, instantly replicate across all 7 styles.
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close customizer"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Quick Picker Bar */}
        <div className="px-6 py-2.5 bg-neutral-900/90 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-mono text-[11px]">Load Preset Profile:</span>
            {Object.entries(PRESET_CONFIGS).map(([key, item]) => (
              <button
                key={key}
                onClick={() => handleApplyPreset(key)}
                className="px-2.5 py-1 rounded-md bg-black/40 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white transition-colors text-[11px]"
                title={item.desc}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={onResetConfig}
            className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-red-400 transition-colors"
            title="Restore original default demo data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-neutral-800 bg-[#0d1117] text-xs font-mono select-none overflow-x-auto">
          {[
            { id: 'profile', label: 'Basic Profile', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'projects', label: `Projects (${draft.projects.length})`, icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'skills', label: `Skills (${draft.skills.length} groups)`, icon: <Cpu className="w-3.5 h-3.5" /> },
            { id: 'experience', label: `Experience (${draft.experience.length})`, icon: <Briefcase className="w-3.5 h-3.5" /> },
            { id: 'json', label: 'Raw JSON / Export', icon: <FileCode className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs leading-normal">
          {/* TAB 1: Profile & Contact */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-3xl">
              <div className="space-y-4">
                <h3 className="font-mono text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  Personal Identity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">Display Name</label>
                    <input
                      type="text"
                      value={draft.profile.name}
                      onChange={(e) => handleProfileFieldChange('name', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">Avatar Initials</label>
                    <input
                      type="text"
                      value={draft.profile.avatarInitials || ''}
                      onChange={(e) => handleProfileFieldChange('avatarInitials', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">Professional Title</label>
                    <input
                      type="text"
                      value={draft.profile.title}
                      onChange={(e) => handleProfileFieldChange('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">Location / Timezone</label>
                    <input
                      type="text"
                      value={draft.profile.location}
                      onChange={(e) => handleProfileFieldChange('location', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-mono">Availability Status Badge</label>
                  <input
                    type="text"
                    value={draft.profile.status}
                    onChange={(e) => handleProfileFieldChange('status', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-mono">Bio & Executive Summary</label>
                  <textarea
                    rows={4}
                    value={draft.profile.bio}
                    onChange={(e) => handleProfileFieldChange('bio', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <h3 className="font-mono text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  Contact & Social Graph
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">Email Address</label>
                    <input
                      type="text"
                      value={draft.contact.email}
                      onChange={(e) => handleContactFieldChange('email', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">GitHub Profile Link</label>
                    <input
                      type="text"
                      value={draft.contact.github}
                      onChange={(e) => handleContactFieldChange('github', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">LinkedIn URL</label>
                    <input
                      type="text"
                      value={draft.contact.linkedin}
                      onChange={(e) => handleContactFieldChange('linkedin', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-mono">Twitter / X URL</label>
                    <input
                      type="text"
                      value={draft.contact.twitter}
                      onChange={(e) => handleContactFieldChange('twitter', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <h3 className="font-mono text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  Sharing & Branding
                </h3>
                <label className="flex items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-black/40 p-4 cursor-pointer">
                  <span>
                    <span className="block font-medium text-neutral-100">Made with badge</span>
                    <span className="mt-1 block text-[11px] text-neutral-400">
                      Show a small Terminal Portfolio credit on every layout.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    aria-label="Show Made with Terminal Portfolio badge"
                    checked={draft.branding?.showMadeWith !== false}
                    onChange={(event) => handleMadeWithChange(event.target.checked)}
                    className="h-4 w-4 accent-emerald-500"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-neutral-400">
                  Total featured projects: <strong className="text-white">{draft.projects.length}</strong>
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  Tip: Use the "Raw JSON" tab to bulk edit or import items.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {draft.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="p-4 rounded-xl bg-black/40 border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...draft.projects];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          const next = { ...draft, projects: updated };
                          setDraft(next);
                          onSaveConfig(next);
                        }}
                        className="font-bold text-white bg-transparent border-b border-transparent hover:border-neutral-600 focus:border-emerald-500 focus:outline-none text-xs"
                      />
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {proj.category}
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...draft.projects];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        const next = { ...draft, projects: updated };
                        setDraft(next);
                        onSaveConfig(next);
                      }}
                      className="w-full text-neutral-300 text-[11px] bg-black/30 p-1.5 rounded border border-neutral-800 focus:outline-none focus:border-neutral-600"
                    />
                    <div className="flex flex-wrap gap-1">
                      {proj.tags.map((t) => (
                        <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Skills */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draft.skills.map((group, gIdx) => (
                  <div key={group.title || gIdx} className="p-4 rounded-xl bg-black/40 border border-neutral-800 space-y-3">
                    <div className="font-semibold text-emerald-400 font-mono flex items-center justify-between">
                      <span>{group.title}</span>
                      <span className="text-[10px] text-neutral-500">{group.skills.length} competencies</span>
                    </div>
                    <div className="space-y-1.5">
                      {group.skills.map((s, sIdx) => (
                        <div key={s.name || sIdx} className="flex items-center justify-between text-[11px] bg-neutral-900/80 px-2.5 py-1.5 rounded border border-neutral-800">
                          <span className="text-neutral-200">{s.name}</span>
                          <span className="text-emerald-400 font-mono font-bold">{s.level}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Experience */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              {draft.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-black/40 border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{exp.role}</span>
                    <span className="text-neutral-400 font-mono text-[11px]">{exp.period}</span>
                  </div>
                  <div className="text-emerald-400 font-mono text-[11px]">{exp.company} • {exp.location}</div>
                  <p className="text-neutral-300 text-[11px]">{exp.description}</p>
                  <ul className="list-disc list-inside text-neutral-400 text-[11px] space-y-0.5 pt-1">
                    {exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx}>{ach}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: Raw JSON / Import & Export */}
          {activeTab === 'json' && (
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 cursor-pointer transition-colors text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Import JSON File</span>
                    <input type="file" accept=".json" onChange={handleImportJsonFile} className="hidden" />
                  </label>

                  <button
                    onClick={handleDownloadJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download portfolio.config.json</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyJson}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={handleApplyJsonText}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors text-xs"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>

              {jsonError && (
                <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/50 text-red-300 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{jsonError}</span>
                </div>
              )}

              <div className="flex-1 min-h-[360px] relative">
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="w-full h-full min-h-[360px] p-4 font-mono text-xs text-neutral-200 bg-black/60 border border-neutral-800 rounded-xl focus:outline-none focus:border-emerald-500 resize-none font-medium leading-5"
                  spellCheck={false}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#0d1117] border-t border-neutral-800 flex items-center justify-between text-xs font-mono">
          <div className="text-neutral-400 text-[11px]">
            Download <code className="text-emerald-400">portfolio.config.json</code> as a backup or transfer file.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
