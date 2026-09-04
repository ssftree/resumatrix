import React, { useState } from 'react';
import { 
  FolderGit2, 
  Sparkles, 
  Star, 
  ExternalLink, 
  Github, 
  Mail, 
  Terminal, 
  Layers, 
  User, 
  Cpu, 
  Briefcase,
  X
} from 'lucide-react';
import { CONTACT_DATA, EXPERIENCE_DATA, PROJECTS_DATA, SKILLS_DATA } from '../data/portfolioData';
import { ThemeConfig } from '../types';

interface GuiPreviewProps {
  theme: ThemeConfig;
  onClose: () => void;
  onRunTerminalCommand: (cmd: string) => void;
}

export const GuiPreview: React.FC<GuiPreviewProps> = ({
  theme,
  onClose,
  onRunTerminalCommand,
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'exp' | 'about'>('projects');

  return (
    <div
      className="h-full flex flex-col border-l transition-all overflow-hidden"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        color: theme.text,
      }}
    >
      {/* Drawer Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b"
        style={{ borderColor: theme.border }}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4" style={{ color: theme.accent }} />
          <span className="font-bold text-xs uppercase tracking-wider">Visual Showcase</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
          title="Close Split View"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Switcher */}
      <div
        className="flex items-center border-b px-2 py-1 gap-1 text-xs select-none overflow-x-auto no-scrollbar"
        style={{ borderColor: theme.border, backgroundColor: theme.bg }}
      >
        {[
          { id: 'projects', label: 'Projects', icon: FolderGit2 },
          { id: 'skills', label: 'Skills', icon: Cpu },
          { id: 'exp', label: 'Timeline', icon: Briefcase },
          { id: 'about', label: 'Bio & Contact', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap ${
                isActive ? 'font-bold bg-white/10' : 'opacity-70 hover:opacity-100 hover:bg-white/5'
              }`}
              style={{
                color: isActive ? theme.accent : theme.text,
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'projects' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                Featured Works ({PROJECTS_DATA.length})
              </span>
              <button
                onClick={() => onRunTerminalCommand('projects')}
                className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer"
                style={{ color: theme.accent }}
              >
                CLI: projects
              </button>
            </div>

            {PROJECTS_DATA.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-lg border border-white/10 bg-white/5 space-y-2 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm" style={{ color: theme.accent }}>
                        {p.title}
                      </h4>
                      {p.stars && (
                        <span className="flex items-center gap-0.5 text-[11px] opacity-75">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          {p.stars}
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-75">{p.tagline}</p>
                  </div>
                  <span className="text-[10px] font-mono opacity-50">{p.year}</span>
                </div>

                <p className="text-xs opacity-85 leading-relaxed">{p.description}</p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {p.tags.map((t, ti) => (
                    <span
                      key={ti}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-black/20 border border-white/10 opacity-80 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <button
                    onClick={() => onRunTerminalCommand(`project ${p.id}`)}
                    className="opacity-70 hover:opacity-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Terminal className="w-3 h-3" /> Inspect CLI
                  </button>
                  <div className="flex items-center gap-2">
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="opacity-70 hover:opacity-100 flex items-center gap-1"
                      >
                        <Github className="w-3 h-3" /> Repo
                      </a>
                    )}
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="opacity-90 hover:opacity-100 flex items-center gap-1 font-semibold"
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
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                Core Competencies
              </span>
              <button
                onClick={() => onRunTerminalCommand('skills')}
                className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer"
                style={{ color: theme.accent }}
              >
                CLI: skills
              </button>
            </div>

            {SKILLS_DATA.map((cat, i) => (
              <div key={i} className="p-3 rounded-lg border border-white/10 bg-white/5 space-y-2">
                <span className="font-bold text-xs uppercase" style={{ color: theme.accent }}>
                  {cat.title}
                </span>
                <div className="space-y-2 pt-1">
                  {cat.skills.map((s, si) => (
                    <div key={si} className="space-y-0.5">
                      <div className="flex justify-between text-xs">
                        <span>{s.name}</span>
                        <span className="font-mono text-[11px] opacity-70">{s.level}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${s.level}%`,
                            backgroundColor: theme.accent,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'exp' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                Career Timeline
              </span>
              <button
                onClick={() => onRunTerminalCommand('exp')}
                className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer"
                style={{ color: theme.accent }}
              >
                CLI: exp
              </button>
            </div>

            <div className="space-y-4 border-l-2 ml-2 pl-3" style={{ borderColor: theme.border }}>
              {EXPERIENCE_DATA.map((exp, i) => (
                <div key={i} className="space-y-1">
                  <span className="font-bold text-xs" style={{ color: theme.accent }}>
                    {exp.role}
                  </span>
                  <div className="text-[11px] opacity-80">
                    {exp.company} • <span className="font-mono">{exp.period}</span>
                  </div>
                  <p className="text-xs opacity-75 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-lg border border-white/10 bg-white/5 space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
                  style={{ backgroundColor: theme.accentBg, color: theme.accent }}
                >
                  SF
                </div>
                <div>
                  <h4 className="font-bold text-sm">ssfu (Frank)</h4>
                  <p className="text-xs opacity-70">Full-Stack Software Engineer</p>
                </div>
              </div>

              <p className="text-xs opacity-85 leading-relaxed">
                Focused on low-latency systems, distributed tools, and modern web applications.
                Always curious about software engineering fundamentals, performance optimization, and delightful developer experiences.
              </p>

              <div className="pt-2 border-t border-white/10 space-y-2 text-xs">
                <a
                  href={`mailto:${CONTACT_DATA.email}`}
                  className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2 font-mono">
                    <Mail className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    {CONTACT_DATA.email}
                  </span>
                  <span className="text-[10px] uppercase font-bold" style={{ color: theme.accent }}>
                    Email
                  </span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={CONTACT_DATA.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span className="text-xs">GitHub</span>
                  </a>
                  <a
                    href={CONTACT_DATA.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2"
                  >
                    <span className="text-xs">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
