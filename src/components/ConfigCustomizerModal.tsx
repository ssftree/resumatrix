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
  AlertCircle,
  Plus,
  Trash2,
  GraduationCap,
  Server,
} from 'lucide-react';
import {
  PortfolioConfig,
  Project,
  SkillCategory,
  Experience,
  EducationItem,
  DeveloperProfile,
} from '../types';
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

const PROJECT_CATEGORIES: Project['category'][] = [
  'Full-Stack',
  'CLI & Systems',
  'AI & Tools',
  'Graphics & Web',
];

const SYSTEM_FIELDS: (keyof NonNullable<PortfolioConfig['system']>)[] = [
  'os',
  'host',
  'kernel',
  'uptime',
  'shell',
  'resolution',
  'wm',
  'terminal',
  'cpu',
  'memory',
];

const inputClass =
  'w-full px-3 py-2 rounded-lg bg-black/40 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500';

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
}> = ({ label, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="block text-neutral-400 mb-1 font-mono">{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  </div>
);

const TextAreaField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  hint?: string;
}> = ({ label, value, onChange, rows = 3, hint }) => (
  <div>
    <label className="block text-neutral-400 mb-1 font-mono">
      {label}
      {hint && <span className="text-neutral-600 ml-2 normal-case">{hint}</span>}
    </label>
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} leading-relaxed`}
    />
  </div>
);

const addButtonClass =
  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-medium transition-colors text-xs';

const iconButtonClass =
  'p-1.5 rounded-md text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors';

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

  // Single source of truth for mutations: update the local draft and persist it.
  const commit = (next: PortfolioConfig) => {
    setDraft(next);
    onSaveConfig(next);
  };

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

  const handleProfileFieldChange = (field: keyof DeveloperProfile, val: string) => {
    commit({ ...draft, profile: { ...draft.profile, [field]: val } });
  };

  const handleContactFieldChange = (field: keyof typeof draft.contact, val: string) => {
    commit({ ...draft, contact: { ...draft.contact, [field]: val } });
  };

  const handleMadeWithChange = (showMadeWith: boolean) => {
    const next = {
      ...draft,
      branding: { ...draft.branding, showMadeWith },
    };
    setDraft(next);
    onSaveConfig(next);
  };

  // ---- Profile stats -------------------------------------------------------
  const stats = draft.profile.stats ?? [];
  const setStats = (nextStats: NonNullable<DeveloperProfile['stats']>) =>
    commit({ ...draft, profile: { ...draft.profile, stats: nextStats } });
  const updateStat = (idx: number, patch: Partial<{ metric: string; label: string }>) =>
    setStats(stats.map((s, i) => (i === idx ? { ...s, ...patch } : s)));

  // ---- Education ----------------------------------------------------------
  const education = draft.education ?? [];
  const setEducation = (next: EducationItem[]) => commit({ ...draft, education: next });
  const updateEducation = (idx: number, patch: Partial<EducationItem>) =>
    setEducation(education.map((e, i) => (i === idx ? { ...e, ...patch } : e)));

  // ---- System (neofetch) -------------------------------------------------
  const system = draft.system ?? {};
  const updateSystem = (field: keyof NonNullable<PortfolioConfig['system']>, val: string) =>
    commit({ ...draft, system: { ...system, [field]: val } });

  // ---- Skills ----------------------------------------------------------
  const setSkills = (next: SkillCategory[]) => commit({ ...draft, skills: next });
  const updateSkillGroup = (gIdx: number, patch: Partial<SkillCategory>) =>
    setSkills(draft.skills.map((g, i) => (i === gIdx ? { ...g, ...patch } : g)));
  const updateSkill = (
    gIdx: number,
    sIdx: number,
    patch: Partial<SkillCategory['skills'][number]>,
  ) =>
    updateSkillGroup(gIdx, {
      skills: draft.skills[gIdx].skills.map((s, i) => (i === sIdx ? { ...s, ...patch } : s)),
    });

  // ---- Experience ----------------------------------------------------------
  const setExperience = (next: Experience[]) => commit({ ...draft, experience: next });
  const updateExperience = (idx: number, patch: Partial<Experience>) =>
    setExperience(draft.experience.map((e, i) => (i === idx ? { ...e, ...patch } : e)));

  // ---- Projects ----------------------------------------------------------
  const setProjects = (next: Project[]) => commit({ ...draft, projects: next });
  const updateProject = (idx: number, patch: Partial<Project>) =>
    setProjects(draft.projects.map((p, i) => (i === idx ? { ...p, ...patch } : p)));

  // Keep raw lines (including blanks) so pressing Enter mid-edit is not swallowed
  // by the config round-trip; blank-only lists collapse to an empty array.
  const toList = (value: string) => {
    const lines = value.split('\n');
    return lines.every((line) => line.trim() === '') ? [] : lines;
  };
  const toTokens = (value: string) =>
    value
      .split(',')
      .map((token) => token.trim())
      .filter(Boolean);

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
                  <Field
                    label="Display Name"
                    value={draft.profile.name}
                    onChange={(v) => handleProfileFieldChange('name', v)}
                  />
                  <Field
                    label="Avatar Initials"
                    value={draft.profile.avatarInitials || ''}
                    onChange={(v) => handleProfileFieldChange('avatarInitials', v)}
                  />
                  <Field
                    label="Professional Title"
                    value={draft.profile.title}
                    onChange={(v) => handleProfileFieldChange('title', v)}
                  />
                  <Field
                    label="Location / Timezone"
                    value={draft.profile.location}
                    onChange={(v) => handleProfileFieldChange('location', v)}
                  />
                  <Field
                    label="Years of Experience"
                    value={draft.profile.yearsOfExperience || ''}
                    onChange={(v) => handleProfileFieldChange('yearsOfExperience', v)}
                    placeholder="6+ Years"
                  />
                  <Field
                    label="Availability Status Badge"
                    value={draft.profile.status}
                    onChange={(v) => handleProfileFieldChange('status', v)}
                  />
                </div>

                <TextAreaField
                  label="Bio & Executive Summary"
                  value={draft.profile.bio}
                  onChange={(v) => handleProfileFieldChange('bio', v)}
                  rows={4}
                />
              </div>

              {/* Headline stats */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                    Headline Stats
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStats([...stats, { metric: '', label: '' }])}
                    className={addButtonClass}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Stat</span>
                  </button>
                </div>
                {stats.length === 0 && (
                  <p className="text-neutral-500 text-[11px]">No headline stats yet.</p>
                )}
                <div className="space-y-2">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-end gap-2">
                      <div className="flex-1">
                        <Field
                          label="Metric"
                          value={stat.metric}
                          onChange={(v) => updateStat(idx, { metric: v })}
                          placeholder="50+"
                        />
                      </div>
                      <div className="flex-1">
                        <Field
                          label="Label"
                          value={stat.label}
                          onChange={(v) => updateStat(idx, { label: v })}
                          placeholder="Projects shipped"
                        />
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove stat ${idx + 1}`}
                        onClick={() => setStats(stats.filter((_, i) => i !== idx))}
                        className={iconButtonClass}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-neutral-800">
                <h3 className="font-mono text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  Contact & Social Graph
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Email Address"
                    value={draft.contact.email}
                    onChange={(v) => handleContactFieldChange('email', v)}
                  />
                  <Field
                    label="Location"
                    value={draft.contact.location}
                    onChange={(v) => handleContactFieldChange('location', v)}
                  />
                  <Field
                    label="GitHub Profile Link"
                    value={draft.contact.github}
                    onChange={(v) => handleContactFieldChange('github', v)}
                  />
                  <Field
                    label="LinkedIn URL"
                    value={draft.contact.linkedin}
                    onChange={(v) => handleContactFieldChange('linkedin', v)}
                  />
                  <Field
                    label="Twitter / X URL"
                    value={draft.contact.twitter}
                    onChange={(v) => handleContactFieldChange('twitter', v)}
                  />
                  <Field
                    label="Blog / Website URL"
                    value={draft.contact.blog}
                    onChange={(v) => handleContactFieldChange('blog', v)}
                  />
                </div>
                <p className="text-neutral-600 text-[11px]">
                  Social links must be HTTP(S) URLs or bare hosts; other values are dropped on reload.
                </p>
              </div>

              {/* Education */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Education
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      setEducation([
                        ...education,
                        { degree: '', field: '', institution: '', location: '', period: '', notes: '' },
                      ])
                    }
                    className={addButtonClass}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Entry</span>
                  </button>
                </div>
                {education.length === 0 && (
                  <p className="text-neutral-500 text-[11px]">No education entries yet.</p>
                )}
                <div className="space-y-3">
                  {education.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-black/40 border border-neutral-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500 font-mono text-[11px]">Entry {idx + 1}</span>
                        <button
                          type="button"
                          aria-label={`Remove education entry ${idx + 1}`}
                          onClick={() => setEducation(education.filter((_, i) => i !== idx))}
                          className={iconButtonClass}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Field label="Degree" value={item.degree} onChange={(v) => updateEducation(idx, { degree: v })} />
                        <Field label="Field of Study" value={item.field} onChange={(v) => updateEducation(idx, { field: v })} />
                        <Field label="Institution" value={item.institution} onChange={(v) => updateEducation(idx, { institution: v })} />
                        <Field label="Location" value={item.location} onChange={(v) => updateEducation(idx, { location: v })} />
                        <Field label="Period" value={item.period} onChange={(v) => updateEducation(idx, { period: v })} placeholder="2016 – 2020" />
                        <Field label="Notes (optional)" value={item.notes || ''} onChange={(v) => updateEducation(idx, { notes: v })} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System / neofetch */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <h3 className="font-mono text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  System (neofetch)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SYSTEM_FIELDS.map((field) => (
                    <Field
                      key={field}
                      label={field}
                      value={system[field] || ''}
                      onChange={(v) => updateSystem(field, v)}
                    />
                  ))}
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
                <button
                  type="button"
                  onClick={() =>
                    setProjects([
                      ...draft.projects,
                      {
                        id: `project-${Date.now()}`,
                        title: 'New Project',
                        tagline: '',
                        description: '',
                        category: 'Full-Stack',
                        tags: [],
                        year: String(new Date().getFullYear()),
                        highlights: [],
                      },
                    ])
                  }
                  className={addButtonClass}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {draft.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="p-4 rounded-xl bg-black/40 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-neutral-500 font-mono text-[11px]">Project {idx + 1}</span>
                      <button
                        type="button"
                        aria-label={`Remove project ${idx + 1}`}
                        disabled={draft.projects.length <= 1}
                        onClick={() => setProjects(draft.projects.filter((_, i) => i !== idx))}
                        className={`${iconButtonClass} disabled:opacity-30 disabled:cursor-not-allowed`}
                        title={draft.projects.length <= 1 ? 'At least one project is required' : undefined}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <Field label="Title" value={proj.title} onChange={(v) => updateProject(idx, { title: v })} />
                    <Field label="Tagline" value={proj.tagline} onChange={(v) => updateProject(idx, { tagline: v })} />
                    <TextAreaField
                      label="Description"
                      value={proj.description}
                      onChange={(v) => updateProject(idx, { description: v })}
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-400 mb-1 font-mono">Category</label>
                        <select
                          value={proj.category}
                          onChange={(e) => updateProject(idx, { category: e.target.value as Project['category'] })}
                          className={inputClass}
                        >
                          {PROJECT_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Field label="Year" value={proj.year} onChange={(v) => updateProject(idx, { year: v })} />
                    </div>
                    <Field
                      label="Demo URL (optional)"
                      value={proj.demoUrl || ''}
                      onChange={(v) => updateProject(idx, { demoUrl: v })}
                    />
                    <Field
                      label="GitHub URL (optional)"
                      value={proj.githubUrl || ''}
                      onChange={(v) => updateProject(idx, { githubUrl: v })}
                    />
                    <Field
                      label="Tags"
                      value={proj.tags.join(', ')}
                      onChange={(v) => updateProject(idx, { tags: toTokens(v) })}
                      placeholder="React, TypeScript, Rust"
                    />
                    <TextAreaField
                      label="Highlights"
                      hint="one per line"
                      value={proj.highlights.join('\n')}
                      onChange={(v) => updateProject(idx, { highlights: toList(v) })}
                      rows={3}
                    />
                  </div>
                ))}
              </div>
              <p className="text-neutral-600 text-[11px]">
                Demo / GitHub URLs must be HTTP(S) links; other values are dropped on reload.
              </p>
            </div>
          )}

          {/* TAB 3: Skills */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">
                  {draft.skills.length} skill groups
                </span>
                <button
                  type="button"
                  onClick={() => setSkills([...draft.skills, { title: 'New Group', icon: '', skills: [] }])}
                  className={addButtonClass}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Group</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draft.skills.map((group, gIdx) => (
                  <div key={gIdx} className="p-4 rounded-xl bg-black/40 border border-neutral-800 space-y-3">
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Field
                          label="Group Title"
                          value={group.title}
                          onChange={(v) => updateSkillGroup(gIdx, { title: v })}
                        />
                      </div>
                      <div className="w-24">
                        <Field
                          label="Icon"
                          value={group.icon}
                          onChange={(v) => updateSkillGroup(gIdx, { icon: v })}
                        />
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove skill group ${gIdx + 1}`}
                        onClick={() => setSkills(draft.skills.filter((_, i) => i !== gIdx))}
                        className={iconButtonClass}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {group.skills.map((s, sIdx) => (
                        <div key={sIdx} className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 space-y-2">
                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <Field
                                label="Name"
                                value={s.name}
                                onChange={(v) => updateSkill(gIdx, sIdx, { name: v })}
                              />
                            </div>
                            <div className="w-20">
                              <label className="block text-neutral-400 mb-1 font-mono">Level</label>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={Number.isFinite(s.level) ? s.level : 0}
                                onChange={(e) => {
                                  const parsed = Number(e.target.value);
                                  updateSkill(gIdx, sIdx, {
                                    level: Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : 0,
                                  });
                                }}
                                className={inputClass}
                              />
                            </div>
                            <button
                              type="button"
                              aria-label={`Remove skill ${sIdx + 1} from ${group.title}`}
                              onClick={() =>
                                updateSkillGroup(gIdx, {
                                  skills: group.skills.filter((_, i) => i !== sIdx),
                                })
                              }
                              className={iconButtonClass}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Field
                              label="Category (optional)"
                              value={s.category || ''}
                              onChange={(v) => updateSkill(gIdx, sIdx, { category: v })}
                            />
                            <Field
                              label="Note (optional)"
                              value={s.note || ''}
                              onChange={(v) => updateSkill(gIdx, sIdx, { note: v })}
                            />
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          updateSkillGroup(gIdx, {
                            skills: [...group.skills, { name: '', level: 50 }],
                          })
                        }
                        className="flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add competency</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Experience */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">{draft.experience.length} roles</span>
                <button
                  type="button"
                  onClick={() =>
                    setExperience([
                      ...draft.experience,
                      {
                        period: '',
                        role: '',
                        company: '',
                        location: '',
                        description: '',
                        achievements: [],
                        skills: [],
                      },
                    ])
                  }
                  className={addButtonClass}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Role</span>
                </button>
              </div>
              {draft.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-black/40 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-mono text-[11px]">Role {idx + 1}</span>
                    <button
                      type="button"
                      aria-label={`Remove role ${idx + 1}`}
                      onClick={() => setExperience(draft.experience.filter((_, i) => i !== idx))}
                      className={iconButtonClass}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Role" value={exp.role} onChange={(v) => updateExperience(idx, { role: v })} />
                    <Field label="Period" value={exp.period} onChange={(v) => updateExperience(idx, { period: v })} placeholder="2021 – Present" />
                    <Field label="Company" value={exp.company} onChange={(v) => updateExperience(idx, { company: v })} />
                    <Field label="Location" value={exp.location} onChange={(v) => updateExperience(idx, { location: v })} />
                  </div>
                  <TextAreaField
                    label="Description"
                    value={exp.description}
                    onChange={(v) => updateExperience(idx, { description: v })}
                    rows={2}
                  />
                  <TextAreaField
                    label="Achievements"
                    hint="one per line"
                    value={exp.achievements.join('\n')}
                    onChange={(v) => updateExperience(idx, { achievements: toList(v) })}
                    rows={3}
                  />
                  <Field
                    label="Skills"
                    value={exp.skills.join(', ')}
                    onChange={(v) => updateExperience(idx, { skills: toTokens(v) })}
                    placeholder="TypeScript, Kubernetes, Go"
                  />
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
