import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  ExternalLink, 
  Folder, 
  FileText, 
  Star, 
  Download, 
  Mail, 
  Github, 
  Linkedin, 
  Twitter, 
  Globe, 
  Sparkles,
  Terminal as TerminalIcon,
  Cpu,
  Layers,
  Award
} from 'lucide-react';
import { TerminalHistoryItem, ThemeConfig, ThemeKey, PortfolioConfig } from '../types';
import { 
  ASCII_BANNER, 
  NEOFETCH_ART 
} from '../data/portfolioData';
import { DEFAULT_PORTFOLIO_CONFIG } from '../portfolio.config';
import { THEMES } from '../utils/themes';
import { safeExternalHref } from '../utils/url';

interface TerminalOutputProps {
  item: TerminalHistoryItem;
  theme: ThemeConfig;
  onExecuteCommand: (cmd: string) => void;
  onOpenResumeModal?: () => void;
  config?: PortfolioConfig;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({
  item,
  theme,
  onExecuteCommand,
  onOpenResumeModal,
  config = DEFAULT_PORTFOLIO_CONFIG,
}) => {
  const [copied, setCopied] = useState(false);

  const profile = config.profile || DEFAULT_PORTFOLIO_CONFIG.profile;
  const contact = config.contact || DEFAULT_PORTFOLIO_CONFIG.contact;
  const skills = config.skills || DEFAULT_PORTFOLIO_CONFIG.skills;
  const experience = config.experience || DEFAULT_PORTFOLIO_CONFIG.experience;
  const projects = config.projects || DEFAULT_PORTFOLIO_CONFIG.projects;
  const system = config.system || DEFAULT_PORTFOLIO_CONFIG.system;

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const renderContent = () => {
    switch (item.output.type) {
      case 'help':
        return (
          <div className="space-y-4 my-2 text-xs sm:text-sm">
            <p className="font-semibold" style={{ color: theme.highlight }}>
              Available Terminal Commands
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded border border-white/10 space-y-2 bg-white/5">
                <span className="text-xs uppercase font-bold tracking-wider opacity-70" style={{ color: theme.accent }}>
                  Portfolio & Profile
                </span>
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex items-start">
                    <button 
                      onClick={() => onExecuteCommand('about')} 
                      className="hover:underline font-bold text-left cursor-pointer w-28" 
                      style={{ color: theme.accent }}
                    >
                      about / whoami
                    </button>
                    <span className="opacity-80 text-neutral-300">Personal bio, mission & info</span>
                  </div>
                  <div className="flex items-start">
                    <button 
                      onClick={() => onExecuteCommand('skills')} 
                      className="hover:underline font-bold text-left cursor-pointer w-28" 
                      style={{ color: theme.accent }}
                    >
                      skills
                    </button>
                    <span className="opacity-80 text-neutral-300">Technical stack & proficiency</span>
                  </div>
                  <div className="flex items-start">
                    <button 
                      onClick={() => onExecuteCommand('projects')} 
                      className="hover:underline font-bold text-left cursor-pointer w-28" 
                      style={{ color: theme.accent }}
                    >
                      projects
                    </button>
                    <span className="opacity-80 text-neutral-300">Interactive project portfolio</span>
                  </div>
                  <div className="flex items-start">
                    <button 
                      onClick={() => onExecuteCommand('exp')} 
                      className="hover:underline font-bold text-left cursor-pointer w-28" 
                      style={{ color: theme.accent }}
                    >
                      exp / career
                    </button>
                    <span className="opacity-80 text-neutral-300">Work history & milestones</span>
                  </div>
                  <div className="flex items-start">
                    <button 
                      onClick={() => onExecuteCommand('contact')} 
                      className="hover:underline font-bold text-left cursor-pointer w-28" 
                      style={{ color: theme.accent }}
                    >
                      contact
                    </button>
                    <span className="opacity-80 text-neutral-300">Social channels & email</span>
                  </div>
                  <div className="flex items-start">
                    <button 
                      onClick={() => onExecuteCommand('resume')} 
                      className="hover:underline font-bold text-left cursor-pointer w-28" 
                      style={{ color: theme.accent }}
                    >
                      resume
                    </button>
                    <span className="opacity-80 text-neutral-300">Curriculum Vitae viewer</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded border border-white/10 space-y-2 bg-white/5">
                <span className="text-xs uppercase font-bold tracking-wider opacity-70" style={{ color: theme.accent }}>
                  System & Exploration
                </span>
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex items-start">
                    <button 
                      onClick={() => onExecuteCommand('neofetch')} 
                      className="hover:underline font-bold text-left cursor-pointer w-28" 
                      style={{ color: theme.accent }}
                    >
                      neofetch
                    </button>
                    <span className="opacity-80 text-neutral-300">System specs & ASCII banner</span>
                  </div>
                  <div className="flex items-start">
                    <button 
                      onClick={() => onExecuteCommand('ls')} 
                      className="hover:underline font-bold text-left cursor-pointer w-28" 
                      style={{ color: theme.accent }}
                    >
                      ls
                    </button>
                    <span className="opacity-80 text-neutral-300">List files in directory</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold w-28" style={{ color: theme.accent }}>cat [file]</span>
                    <span className="opacity-80 text-neutral-300">View file contents (e.g. cat about.txt)</span>
                  </div>
                  <div className="flex items-start">
                    <button 
                      onClick={() => onExecuteCommand('theme')} 
                      className="hover:underline font-bold text-left cursor-pointer w-28" 
                      style={{ color: theme.accent }}
                    >
                      theme [name]
                    </button>
                    <span className="opacity-80 text-neutral-300">Change palette (matrix, dracula...)</span>
                  </div>
                  <div className="flex items-start">
                    <button 
                      onClick={() => onExecuteCommand('template')} 
                      className="hover:underline font-bold text-left cursor-pointer w-28" 
                      style={{ color: theme.accent }}
                    >
                      template
                    </button>
                    <span className="opacity-80 text-neutral-300">Switch template (ide, bento, devops, academic, terminal)</span>
                  </div>
                  <div className="flex items-start">
                    <button 
                      onClick={() => onExecuteCommand('matrix')} 
                      className="hover:underline font-bold text-left cursor-pointer w-28" 
                      style={{ color: theme.accent }}
                    >
                      matrix
                    </button>
                    <span className="opacity-80 text-neutral-300">Toggle green digital rain screen</span>
                  </div>
                  <div className="flex items-start">
                    <button 
                      onClick={() => onExecuteCommand('clear')} 
                      className="hover:underline font-bold text-left cursor-pointer w-28" 
                      style={{ color: theme.accent }}
                    >
                      clear (Ctrl+L)
                    </button>
                    <span className="opacity-80 text-neutral-300">Clear terminal screen</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded border border-white/10 bg-white/5 flex flex-wrap items-center gap-2 text-xs">
              <span className="opacity-70">Shortcuts:</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/20">Tab</kbd> Autocomplete
              <span className="opacity-40">•</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/20">↑ / ↓</kbd> History
              <span className="opacity-40">•</span>
              <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/20">Ctrl+L</kbd> Clear
              <span className="opacity-40">•</span>
              <span className="text-neutral-400">Click any command chip below for instant execution!</span>
            </div>
          </div>
        );

      case 'neofetch':
        return (
          <div className="my-3 font-mono text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
              {/* ASCII Art */}
              <div 
                className="whitespace-pre font-bold leading-none select-none hidden xs:block"
                style={{ color: theme.accent }}
              >
                {NEOFETCH_ART.join('\n')}
              </div>

              {/* Specs */}
              <div className="space-y-1 flex-1">
                <div className="font-bold text-base pb-1 border-b border-white/10 flex items-center gap-2">
                  <span style={{ color: theme.promptUser }}>{profile.name.toLowerCase().replace(/\s+/g, '')}</span>
                  <span className="opacity-60">@</span>
                  <span style={{ color: theme.promptHost }}>devbox</span>
                </div>
                <div className="pt-1 space-y-1">
                  <div className="flex"><span className="w-24 font-bold" style={{ color: theme.accent }}>OS:</span> <span className="opacity-90">{system.os}</span></div>
                  <div className="flex"><span className="w-24 font-bold" style={{ color: theme.accent }}>Host:</span> <span className="opacity-90">{system.host}</span></div>
                  <div className="flex"><span className="w-24 font-bold" style={{ color: theme.accent }}>Kernel:</span> <span className="opacity-90">{system.kernel}</span></div>
                  <div className="flex"><span className="w-24 font-bold" style={{ color: theme.accent }}>Uptime:</span> <span className="opacity-90">{system.uptime}</span></div>
                  <div className="flex"><span className="w-24 font-bold" style={{ color: theme.accent }}>Shell:</span> <span className="opacity-90">{system.shell}</span></div>
                  <div className="flex"><span className="w-24 font-bold" style={{ color: theme.accent }}>Resolution:</span> <span className="opacity-90">{system.resolution}</span></div>
                  <div className="flex"><span className="w-24 font-bold" style={{ color: theme.accent }}>WM:</span> <span className="opacity-90">{system.wm}</span></div>
                  <div className="flex"><span className="w-24 font-bold" style={{ color: theme.accent }}>Terminal:</span> <span className="opacity-90">{system.terminal}</span></div>
                  <div className="flex"><span className="w-24 font-bold" style={{ color: theme.accent }}>CPU:</span> <span className="opacity-90">{system.cpu}</span></div>
                  <div className="flex"><span className="w-24 font-bold" style={{ color: theme.accent }}>Memory:</span> <span className="opacity-90">{system.memory}</span></div>
                </div>

                {/* Color blocks */}
                <div className="flex gap-1 pt-2">
                  {['#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7'].map((c, i) => (
                    <span key={i} className="w-4 h-3 rounded-sm" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="my-3 space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-lg border border-white/10 bg-white/5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-base" style={{ backgroundColor: theme.accentBg, color: theme.accent }}>
                    {profile.avatarInitials || profile.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">{profile.name}</h3>
                    <p className="text-xs opacity-70">{profile.title}</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {profile.status}
                </span>
              </div>

              <p className="leading-relaxed opacity-90 text-sm">
                {profile.bio}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded bg-black/20 border border-white/5">
                  <span className="font-semibold block mb-1" style={{ color: theme.accent }}>🚀 Location & Experience</span>
                  <span className="opacity-80">{profile.location} • {profile.yearsOfExperience || '10+ Years of Experience'}</span>
                </div>
                <div className="p-2 rounded bg-black/20 border border-white/5">
                  <span className="font-semibold block mb-1" style={{ color: theme.accent }}>🎯 Engineering Ethos</span>
                  <span className="opacity-80">Speed by default, zero clutter, robust type systems, and software craftsmanship.</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 text-xs">
                <button
                  onClick={() => onExecuteCommand('projects')}
                  className="px-3 py-1 rounded border border-white/20 hover:bg-white/10 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                  style={{ color: theme.accent }}
                >
                  <Layers className="w-3.5 h-3.5" /> View Projects
                </button>
                <button
                  onClick={() => onExecuteCommand('contact')}
                  className="px-3 py-1 rounded border border-white/20 hover:bg-white/10 transition-colors font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" /> Get in Touch
                </button>
              </div>
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="my-3 space-y-4 text-xs sm:text-sm">
            <p className="font-semibold" style={{ color: theme.highlight }}>
              Technical Capabilities & Proficiency
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {skills.map((cat, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-white/10 bg-white/5 space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="font-bold text-xs uppercase tracking-wider" style={{ color: theme.accent }}>
                      {cat.title}
                    </span>
                    <span className="text-[10px] opacity-60">Verified Skills</span>
                  </div>
                  <div className="space-y-2">
                    {cat.skills.map((s, sIdx) => {
                      const filledChars = Math.round(s.level / 10);
                      const emptyChars = 10 - filledChars;
                      const bar = '█'.repeat(filledChars) + '░'.repeat(emptyChars);
                      return (
                        <div key={sIdx} className="space-y-0.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-neutral-200">{s.name}</span>
                            <span className="text-[11px] font-mono opacity-80" style={{ color: theme.accent }}>
                              {s.level}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[11px] tracking-tighter" style={{ color: theme.accent }}>
                              [{bar}]
                            </span>
                            {s.note && <span className="text-[10px] opacity-60 truncate">{s.note}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="my-3 space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold" style={{ color: theme.highlight }}>
                Featured Engineering Projects ({projects.length})
              </p>
              <span className="text-xs opacity-60">Click a project to view case details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-lg border border-white/10 bg-white/5 hover:border-white/20 transition-all space-y-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onExecuteCommand(`project ${p.id}`)}
                          className="font-bold text-sm hover:underline text-left cursor-pointer"
                          style={{ color: theme.accent }}
                        >
                          {p.title}
                        </button>
                        {p.featured && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs opacity-75 mt-0.5">{p.tagline}</p>
                    </div>

                    {p.stars && (
                      <span className="flex items-center gap-1 text-xs opacity-80 px-2 py-0.5 rounded bg-white/5 border border-white/10 shrink-0">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        {p.stars}
                      </span>
                    )}
                  </div>

                  <p className="text-xs opacity-80 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tags.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-1.5 py-0.5 rounded text-[10px] border border-white/10 bg-white/5 opacity-80 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <button
                      onClick={() => onExecuteCommand(`project ${p.id}`)}
                      className="opacity-70 hover:opacity-100 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <span>Read info</span> →
                    </button>
                    <div className="flex items-center gap-3">
                      {p.githubUrl && (
                        <a
                          href={safeExternalHref(p.githubUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="opacity-70 hover:opacity-100 flex items-center gap-1 hover:underline"
                        >
                          <Github className="w-3 h-3" /> Code
                        </a>
                      )}
                      {p.demoUrl && (
                        <a
                          href={safeExternalHref(p.demoUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="opacity-70 hover:opacity-100 flex items-center gap-1 hover:underline font-medium"
                          style={{ color: theme.accent }}
                        >
                          <ExternalLink className="w-3 h-3" /> Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs opacity-60 text-center pt-1">
              Tip: Type <code className="px-1 py-0.5 rounded bg-white/10">project &lt;name&gt;</code> (e.g. <code className="px-1 py-0.5 rounded bg-white/10 cursor-pointer" onClick={() => onExecuteCommand(`project ${projects[0]?.id || 'hypershell'}`)}>project {projects[0]?.id || 'hypershell'}</code>)
            </p>
          </div>
        );

      case 'experience':
        return (
          <div className="my-3 space-y-4 text-xs sm:text-sm">
            <p className="font-semibold" style={{ color: theme.highlight }}>
              Career Milestones & Experience
            </p>
            <div className="border-l-2 ml-2 pl-4 space-y-5" style={{ borderColor: theme.border }}>
              {experience.map((exp, i) => (
                <div key={i} className="relative group">
                  <span
                    className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-black"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between flex-wrap gap-2">
                      <span className="font-bold text-sm" style={{ color: theme.accent }}>
                        {exp.role}
                      </span>
                      <span className="text-xs opacity-70 font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10">
                        {exp.period}
                      </span>
                    </div>
                    <div className="text-xs opacity-80 font-medium">
                      {exp.company} <span className="opacity-50">• {exp.location}</span>
                    </div>
                    <p className="text-xs opacity-80 pt-1 leading-relaxed">{exp.description}</p>
                    <ul className="list-disc list-inside text-xs opacity-75 space-y-1 pt-1">
                      {exp.achievements.map((ach, aIdx) => (
                        <li key={aIdx}>{ach}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {exp.skills.map((s, sIdx) => (
                        <span key={sIdx} className="px-1.5 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 opacity-70">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="my-3 space-y-3 text-xs sm:text-sm">
            <p className="font-semibold" style={{ color: theme.highlight }}>
              Contact Channels & Inquiries
            </p>
            <div className="p-4 rounded-lg border border-white/10 bg-white/5 space-y-3 max-w-xl">
              <p className="opacity-80 text-xs">
                Feel free to reach out for collaboration inquiries, architecture consulting, or technical chats:
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-black/20 border border-white/5">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: theme.accent }} />
                    <span className="font-medium">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(contact.email)}
                      className="px-2 py-1 rounded text-xs border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <a
                      href={`mailto:${contact.email}`}
                      className="px-2 py-1 rounded text-xs font-semibold hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: theme.accent, color: theme.bg }}
                    >
                      Send Mail
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <a
                    href={safeExternalHref(contact.github)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-center"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">GitHub</span>
                  </a>
                  <a
                    href={safeExternalHref(contact.linkedin)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-center"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">LinkedIn</span>
                  </a>
                  <a
                    href={safeExternalHref(contact.twitter)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-center"
                  >
                    <Twitter className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">Twitter/X</span>
                  </a>
                  {contact.blog && (
                    <a
                      href={safeExternalHref(contact.blog)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded border border-white/10 bg-white/5 hover:bg-white/10 transition-colors flex flex-col items-center gap-1 text-center"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="text-[11px] font-semibold">Blog</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'ls':
        return (
          <div className="my-2 space-y-2 text-xs sm:text-sm font-mono">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {item.output.data?.entries?.map((file: any, i: number) => (
                <div
                  key={i}
                  onClick={() => {
                    if (file.type === 'dir') {
                      onExecuteCommand(`cd ${file.name}`);
                    } else {
                      onExecuteCommand(`cat ${file.name}`);
                    }
                  }}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-white/10 cursor-pointer transition-colors"
                >
                  {file.type === 'dir' ? (
                    <Folder className="w-4 h-4 text-blue-400 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                  <div className="truncate">
                    <span className={file.type === 'dir' ? 'font-bold text-blue-300' : 'text-neutral-200'}>
                      {file.name}
                    </span>
                    {file.size && <span className="block text-[10px] opacity-50">{file.size}</span>}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] opacity-60">Tip: Click on any file to 'cat' or 'cd' into it.</p>
          </div>
        );

      case 'cat':
        return (
          <div className="my-2 text-xs sm:text-sm font-mono">
            <div className="flex items-center justify-between px-3 py-1.5 rounded-t border-t border-x border-white/10 bg-white/10 text-xs">
              <span className="opacity-70">{item.output.data?.filename || 'File'}</span>
              <button
                onClick={() => handleCopyText(item.output.content || '')}
                className="hover:opacity-100 opacity-60 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-3 rounded-b border border-white/10 bg-black/30 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {item.output.content}
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="my-1 text-xs sm:text-sm space-y-1">
            <p style={{ color: theme.error }}>
              {item.output.content || `zsh: command not found: ${item.command}.`}
            </p>
            <p className="text-xs opacity-70">
              Type <button onClick={() => onExecuteCommand('help')} className="underline hover:opacity-100 cursor-pointer font-bold" style={{ color: theme.accent }}>help</button> to see all available commands.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="my-1 text-xs sm:text-sm" style={{ color: theme.success }}>
            {item.output.content}
          </div>
        );

      default:
        return (
          <div className="my-1 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed opacity-90">
            {item.output.content}
          </div>
        );
    }
  };

  return (
    <div className="space-y-1 my-2">
      {/* Prompt & Command Echo */}
      {item.command && (
        <div className="flex items-center gap-2 font-mono text-xs sm:text-sm select-text flex-wrap">
          <span style={{ color: theme.promptUser }} className="font-semibold">guest@ssfu.dev</span>
          <span className="opacity-50">:</span>
          <span style={{ color: theme.promptPath }}>{item.path || '~'}</span>
          <span style={{ color: theme.accent }} className="font-bold">$</span>
          <span className="font-semibold text-neutral-100">{item.command}</span>
          <span className="text-[10px] opacity-40 ml-auto hidden sm:inline">{item.timestamp}</span>
        </div>
      )}

      {/* Output Content */}
      <div className="pl-0 sm:pl-2">
        {renderContent()}
      </div>
    </div>
  );
};
