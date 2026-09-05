import React, { useState } from 'react';
import { 
  Terminal, 
  Code2, 
  FileText, 
  ExternalLink, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Copy, 
  Check, 
  Download, 
  MapPin, 
  Briefcase, 
  Cpu, 
  Sparkles, 
  Layers, 
  Compass, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { 
  PROJECTS_DATA, 
  SKILLS_DATA, 
  EXPERIENCE_DATA, 
  CONTACT_DATA, 
  ABOUT_DATA,
  NEOFETCH_DATA
} from '../../data/portfolioData';
import { AppTemplate, PortfolioConfig } from '../../types';
import { DEFAULT_PORTFOLIO_CONFIG } from '../../portfolio.config';

interface BentoViewProps {
  onSwitchTemplate: (template: AppTemplate) => void;
  onOpenResumeModal: () => void;
  config?: PortfolioConfig;
}

export const BentoView: React.FC<BentoViewProps> = ({ 
  onSwitchTemplate, 
  onOpenResumeModal,
  config = DEFAULT_PORTFOLIO_CONFIG 
}) => {
  const profile = config.profile || DEFAULT_PORTFOLIO_CONFIG.profile;
  const contact = config.contact || DEFAULT_PORTFOLIO_CONFIG.contact;
  const skills = config.skills || DEFAULT_PORTFOLIO_CONFIG.skills;
  const experience = config.experience || DEFAULT_PORTFOLIO_CONFIG.experience;
  const projects = config.projects || DEFAULT_PORTFOLIO_CONFIG.projects;
  const system = config.system || DEFAULT_PORTFOLIO_CONFIG.system;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Dynamic category tags from projects
  const uniqueCategories = Array.from(new Set(projects.map((p) => p.category)));
  const categories = ['all', ...uniqueCategories];

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Mock GitHub commit activity squares for 16 weeks
  const weeks = Array.from({ length: 24 }).map((_, w) =>
    Array.from({ length: 7 }).map((_, d) => {
      // Deterministic pseudo-random pattern
      const val = (w * 7 + d * 3) % 5;
      return val === 0 ? 0 : val === 1 ? 1 : val === 2 ? 2 : val === 3 ? 3 : 4;
    })
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-neutral-200 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hero Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-blue-500/20 to-purple-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl font-mono font-bold text-emerald-400 shadow-inner">
              {profile.avatarInitials || profile.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">{profile.name}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {profile.status}
                </span>
              </div>
              <p className="text-sm text-neutral-400 mt-0.5">{profile.title}</p>
              <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {profile.location} • {contact.blog || 'ssfu.dev'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedEmail ? 'Email Copied!' : CONTACT_DATA.email}</span>
            </button>
            <button
              onClick={onOpenResumeModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-lg shadow-emerald-900/30 transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Resume</span>
            </button>
            <button
              onClick={() => onSwitchTemplate('terminal')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-emerald-500/30 font-mono transition-colors"
              title="Switch to CLI Terminal"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>CLI Mode</span>
            </button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card 1: Bio & Engineering Core (col-span-8) */}
          <div className="md:col-span-8 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  Engineering Philosophy
                </div>
                <span className="text-xs font-mono text-neutral-500">{profile.yearsOfExperience || '10+ Years Experience'}</span>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                {profile.bio}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {(profile.stats || [
                  { metric: '100M+', label: 'Daily API Events Scaled' },
                  { metric: '99.99%', label: 'SLA Architecture Uptime' },
                  { metric: '45%', label: 'CI/CD Latency Reduction' },
                ]).map((st, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-black/40 border border-neutral-800">
                    <div className="text-lg font-bold text-white font-mono">{st.metric}</div>
                    <div className="text-xs text-neutral-400">{st.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-mono">Specializing in Go • Rust • Gemini LLMs • Kubernetes</span>
              <button 
                onClick={() => onSwitchTemplate('ide')}
                className="hover:text-emerald-400 flex items-center gap-1 font-mono"
              >
                View Source Code in IDE <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: GitHub & Activity Radar (col-span-4) */}
          <div className="md:col-span-4 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-400">
                  <Activity className="w-4 h-4" />
                  Activity & Commits
                </div>
                <a
                  href={`https://${CONTACT_DATA.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="text-xs text-neutral-400 mb-3">
                Continuous open-source commits and infrastructure deployment:
              </div>

              {/* Mock Heatmap */}
              <div className="p-3 bg-black/40 rounded-xl border border-neutral-800/80 overflow-x-auto">
                <div className="flex gap-1">
                  {weeks.map((week, wIdx) => (
                    <div key={wIdx} className="flex flex-col gap-1">
                      {week.map((level, dIdx) => (
                        <div
                          key={dIdx}
                          className={`w-2 h-2 rounded-xs ${
                            level === 0
                              ? 'bg-neutral-800'
                              : level === 1
                              ? 'bg-emerald-950 text-emerald-400'
                              : level === 2
                              ? 'bg-emerald-800 text-emerald-300'
                              : level === 3
                              ? 'bg-emerald-600 text-emerald-200'
                              : 'bg-emerald-400'
                          }`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-2 font-mono">
                  <span>Less</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-xs bg-neutral-800" />
                    <span className="w-2 h-2 rounded-xs bg-emerald-900" />
                    <span className="w-2 h-2 rounded-xs bg-emerald-700" />
                    <span className="w-2 h-2 rounded-xs bg-emerald-400" />
                  </div>
                  <span>More</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-mono">GitHub: github.com/{CONTACT_DATA.github.split('/').pop()}</span>
            </div>
          </div>

          {/* Card 3: Skills & Tech Radar (col-span-12 lg:col-span-5) */}
          <div className="md:col-span-12 lg:col-span-5 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-400">
                <Cpu className="w-4 h-4" />
                Technical Competencies
              </div>
              <span className="text-xs font-mono text-neutral-500">Core Stack</span>
            </div>

            <div className="space-y-3">
              {skills.map((group) => (
                <div key={group.title} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-medium text-neutral-300">
                    <span>{group.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="text-xs font-mono px-2.5 py-1 rounded-md bg-black/40 border border-neutral-800 hover:border-neutral-700 text-neutral-300 transition-colors"
                      >
                        {skill.name}
                        <span className="ml-1.5 text-[10px] text-emerald-400 font-semibold">{skill.level}%</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Career Experience (col-span-12 lg:col-span-7) */}
          <div className="md:col-span-12 lg:col-span-7 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                <Briefcase className="w-4 h-4" />
                Career Trajectory
              </div>
              <button
                onClick={onOpenResumeModal}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-mono"
              >
                Detailed CV <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4">
              {experience.slice(0, 3).map((exp, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-neutral-800 space-y-1">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                    <span className="text-sm font-semibold text-white">{exp.role}</span>
                    <span className="text-xs font-mono text-neutral-400">{exp.period}</span>
                  </div>
                  <div className="text-xs text-emerald-400/90 font-mono">{exp.company}</div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {exp.achievements[0]}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {exp.skills.slice(0, 4).map((tech) => (
                      <span key={tech} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800/80 text-neutral-400">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 5: Projects Showcase (col-span-12) */}
          <div className="md:col-span-12 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                <Layers className="w-4 h-4" />
                Featured Engineering Work
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-mono transition-colors whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-neutral-400 hover:text-white bg-black/40 border border-neutral-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-5 rounded-xl bg-black/40 border border-neutral-800/80 hover:border-neutral-700 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">
                        {project.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800/60 space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {project.tags.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      {project.githubUrl ? (
                        <a
                          href={`https://${project.githubUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
                        >
                          <Github className="w-3 h-3" /> Code
                        </a>
                      ) : <span />}

                      {project.demoUrl && (
                        <a
                          href={`https://${project.demoUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono text-[11px]"
                        >
                          Demo <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 py-6 border-t border-neutral-800/80 font-mono gap-3">
          <div>
            © {new Date().getFullYear()} {profile.name} • {contact.blog || 'ssfu.dev'}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onSwitchTemplate('terminal')}
              className="hover:text-emerald-400 transition-colors"
            >
              Terminal Mode
            </button>
            <span>•</span>
            <button
              onClick={() => onSwitchTemplate('ide')}
              className="hover:text-blue-400 transition-colors"
            >
              IDE Mode
            </button>
            <span>•</span>
            <button
              onClick={() => onSwitchTemplate('academic')}
              className="hover:text-neutral-300 transition-colors"
            >
              LaTeX CV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
