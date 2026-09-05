import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Copy, 
  Check, 
  Terminal, 
  FileText, 
  Github, 
  ExternalLink, 
  Moon, 
  Sun,
  Globe,
  SlidersHorizontal,
  Mail,
  MapPin,
  Circle
} from 'lucide-react';
import { AppTemplate, PortfolioConfig } from '../../types';
import { DEFAULT_PORTFOLIO_CONFIG } from '../../portfolio.config';
import { safeExternalHref } from '../../utils/url';

interface SwissBrutalismViewProps {
  config?: PortfolioConfig;
  onSwitchTemplate: (tpl: AppTemplate) => void;
  onOpenResumeModal?: () => void;
}

export const SwissBrutalismView: React.FC<SwissBrutalismViewProps> = ({
  config = DEFAULT_PORTFOLIO_CONFIG,
  onSwitchTemplate,
  onOpenResumeModal,
}) => {
  const profile = config.profile || DEFAULT_PORTFOLIO_CONFIG.profile;
  const contact = config.contact || DEFAULT_PORTFOLIO_CONFIG.contact;
  const skills = config.skills || DEFAULT_PORTFOLIO_CONFIG.skills;
  const experience = config.experience || DEFAULT_PORTFOLIO_CONFIG.experience;
  const projects = config.projects || DEFAULT_PORTFOLIO_CONFIG.projects;
  const education = config.education || DEFAULT_PORTFOLIO_CONFIG.education;

  const [darkMode, setDarkMode] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const bgClass = darkMode ? 'bg-black text-white' : 'bg-[#fafafa] text-black';
  const borderClass = darkMode ? 'border-white' : 'border-black';
  const subBorderClass = darkMode ? 'border-neutral-800' : 'border-neutral-200';
  const mutedText = darkMode ? 'text-neutral-400' : 'text-neutral-600';
  const accentBox = darkMode ? 'bg-white text-black' : 'bg-black text-white';

  return (
    <div className={`w-full min-h-screen ${bgClass} font-sans selection:bg-black selection:text-white transition-colors duration-200 pb-24`}>
      {/* Top Swiss Monograph Bar */}
      <header className={`border-b-2 ${borderClass} sticky top-0 z-30 ${darkMode ? 'bg-black/95' : 'bg-[#fafafa]/95'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-0.5 font-bold uppercase tracking-widest ${accentBox}`}>
              SWISS NO. 01
            </span>
            <span className="font-bold tracking-tight text-sm">
              {profile.name.toUpperCase()} / FOLIO
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className={`hidden md:inline-block ${mutedText}`}>
              LOC: {contact.location.toUpperCase()}
            </span>
            <span className={`hidden sm:inline-block ${mutedText}`}>
              STATUS: {profile.status.toUpperCase()}
            </span>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-1.5 border ${borderClass} rounded-none hover:opacity-75 transition-opacity`}
              title="Toggle Light / Dark Brutalism"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* CLI Jump */}
            <button
              onClick={() => onSwitchTemplate('terminal')}
              className={`px-2.5 py-1 border ${borderClass} font-mono font-bold text-[11px] flex items-center gap-1.5 hover:opacity-80 transition-opacity`}
            >
              <Terminal className="w-3 h-3" />
              <span>TERMINAL</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-16">
        
        {/* SECTION 1: MANIFESTO & DISPLAY TYPOGRAPHY */}
        <section className={`border-2 ${borderClass} p-6 sm:p-12 relative overflow-hidden`}>
          <div className="flex flex-col gap-6">
            {/* Header indexing */}
            <div className="flex justify-between items-baseline border-b pb-4 font-mono text-xs uppercase tracking-widest font-bold">
              <span>[01 / MANIFESTO]</span>
              <span>INDEX: 2026 EDITION</span>
            </div>

            {/* Giant Display Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter leading-none uppercase">
                {profile.name}
              </h1>
              <p className="text-xl sm:text-2xl font-bold tracking-tight opacity-90">
                — {profile.title}
              </p>
            </div>

            {/* Bio with mathematical Swiss leading */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              <div className="lg:col-span-8">
                <p className="text-base sm:text-lg leading-relaxed font-normal opacity-95">
                  {profile.bio}
                </p>
              </div>

              {/* Stat metadata block */}
              <div className={`lg:col-span-4 border-l-2 ${borderClass} pl-6 space-y-4 font-mono text-xs`}>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider opacity-60">EXPERIENCE</span>
                  <span className="text-base font-bold">{profile.yearsOfExperience || '6+ YEARS'}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider opacity-60">DISCIPLINE</span>
                  <span className="font-bold">SYSTEMS & FULL-STACK</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider opacity-60">PHILOSOPHY</span>
                  <span className="font-bold">SPEED, DETERMINISM, ZERO CLUTTER</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: CAPABILITIES MATRIX (SKILLS) */}
        <section className="space-y-4">
          <div className="flex justify-between items-baseline font-mono text-xs uppercase tracking-widest font-bold border-b-2 border-current pb-2">
            <span>[02 / TECHNICAL CAPABILITIES]</span>
            <span>SYSTEM AUDIT</span>
          </div>

          <div className={`border-2 ${borderClass} divide-y-2 ${borderClass}`}>
            {skills.map((category, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 gap-4 items-start">
                <div className="md:col-span-4 font-mono">
                  <span className="text-xs opacity-60 block">CAT. 0{idx + 1}</span>
                  <h3 className="text-lg font-bold uppercase tracking-tight">{category.title}</h3>
                </div>

                <div className="md:col-span-8 flex flex-wrap gap-2">
                  {category.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className={`px-3 py-1.5 border ${borderClass} text-xs font-mono font-medium flex items-center gap-2`}
                    >
                      <span>{skill.name}</span>
                      <span className="opacity-50 text-[10px] font-bold">[{skill.level}%]</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: WORK CATALOGUE (PROJECTS) */}
        <section className="space-y-4">
          <div className="flex justify-between items-baseline font-mono text-xs uppercase tracking-widest font-bold border-b-2 border-current pb-2">
            <span>[03 / SELECTED WORKS CATALOGUE]</span>
            <span>{projects.length} ARTIFACTS</span>
          </div>

          <div className={`border-2 ${borderClass} divide-y-2 ${borderClass}`}>
            {projects.map((p, idx) => (
              <div
                key={p.id}
                className="p-6 sm:p-8 space-y-4 group hover:bg-neutral-500/5 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-sm font-bold opacity-50">
                      /{String(idx + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight group-hover:underline">
                      {p.title}
                    </h3>
                  </div>
                  <div className="font-mono text-xs flex items-center gap-3">
                    <span className="px-2 py-0.5 border border-current">{p.category}</span>
                    <span>{p.year}</span>
                  </div>
                </div>

                <p className="text-sm sm:text-base font-normal opacity-90 max-w-4xl leading-relaxed">
                  {p.description}
                </p>

                {/* Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-2">
                  {p.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2">
                      <span className="font-bold opacity-60">—</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Tech tags and links */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-current/20">
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {p.tags.map((t, tIdx) => (
                      <span key={tIdx} className="underline underline-offset-2 opacity-75">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 font-mono text-xs font-bold">
                    {p.githubUrl && (
                      <a
                        href={safeExternalHref(p.githubUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 hover:underline"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>SOURCE CODE</span>
                      </a>
                    )}
                    {p.demoUrl && (
                      <a
                        href={safeExternalHref(p.demoUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className={`px-3 py-1 border ${borderClass} flex items-center gap-1.5 hover:opacity-80 transition-opacity`}
                      >
                        <span>LIVE DEPLOYMENT</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: CAREER CHRONOLOGY (EXPERIENCE) */}
        <section className="space-y-4">
          <div className="flex justify-between items-baseline font-mono text-xs uppercase tracking-widest font-bold border-b-2 border-current pb-2">
            <span>[04 / CAREER CHRONOLOGY]</span>
            {onOpenResumeModal && (
              <button onClick={onOpenResumeModal} className="hover:underline flex items-center gap-1">
                <span>VIEW COMPLETE RESUME</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className={`border-2 ${borderClass} divide-y-2 ${borderClass}`}>
            {experience.map((exp, idx) => (
              <div key={idx} className="p-6 sm:p-8 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4 className="text-xl font-bold uppercase tracking-tight">
                      {exp.role}
                    </h4>
                    <p className="font-mono text-sm font-semibold opacity-75">
                      {exp.company} — {exp.location}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 border border-current">
                    {exp.period}
                  </span>
                </div>

                <p className="text-sm opacity-90 leading-relaxed max-w-4xl">
                  {exp.description}
                </p>

                <div className="space-y-1.5 pt-2">
                  {exp.achievements.map((ach, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-2 text-xs opacity-85 font-mono">
                      <span className="font-bold opacity-50">•</span>
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: TRANSMISSION & CONTACT */}
        <section className={`border-2 ${borderClass} p-6 sm:p-12 space-y-8`}>
          <div className="flex justify-between items-baseline font-mono text-xs uppercase tracking-widest font-bold border-b border-current pb-3">
            <span>[05 / TRANSMISSION]</span>
            <span>AVAILABLE FOR SELECT HIGH-IMPACT ROLES</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight">
              INITIATE CONTACT / START COLLABORATION
            </h2>
            <p className="text-sm sm:text-base opacity-85 max-w-2xl">
              Interested in discussing low-latency systems, full-stack architecture, or high-impact engineering leadership?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <a
              href={`mailto:${contact.email}`}
              className={`px-6 py-3 font-mono font-bold text-sm tracking-wider uppercase border-2 ${borderClass} ${accentBox} flex items-center gap-2 hover:opacity-85 transition-opacity`}
            >
              <Mail className="w-4 h-4" />
              <span>DISPATCH DIRECT EMAIL</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => {
                navigator.clipboard.writeText(contact.email);
                setCopiedEmail(true);
                setTimeout(() => setCopiedEmail(false), 2000);
              }}
              className={`px-4 py-3 font-mono font-bold text-xs uppercase border-2 ${borderClass} flex items-center gap-2 hover:opacity-75 transition-opacity`}
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmail ? 'COPIED TO CLIPBOARD' : `COPY [${contact.email}]`}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-current font-mono text-xs">
            {contact.github && (
              <a href={safeExternalHref(contact.github)} target="_blank" rel="noreferrer" className="hover:underline">
                GITHUB: {contact.github.replace(/^https?:\/\//, '')}
              </a>
            )}
            {contact.linkedin && (
              <a href={safeExternalHref(contact.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">
                LINKEDIN
              </a>
            )}
            {contact.twitter && (
              <a href={safeExternalHref(contact.twitter)} target="_blank" rel="noreferrer" className="hover:underline">
                X / TWITTER
              </a>
            )}
          </div>
        </section>

      </main>

      {/* Swiss Footer */}
      <footer className={`max-w-7xl mx-auto px-4 sm:px-8 pt-12 flex flex-col sm:flex-row justify-between items-baseline gap-4 font-mono text-xs ${mutedText}`}>
        <div>
          <span>DESIGN ARCHETYPE: SWISS INTERNATIONAL & NEO-BRUTALISM</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{profile.name} © 2026</span>
          <span>ALL RIGHTS RESERVED</span>
        </div>
      </footer>
    </div>
  );
};
