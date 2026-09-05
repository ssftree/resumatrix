import React, { useState } from 'react';
import { 
  FileCode, 
  FileJson, 
  FileText, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  Copy, 
  Check, 
  Terminal, 
  GitBranch, 
  Play, 
  Search, 
  Layers, 
  Settings, 
  Download,
  ExternalLink,
  Code2
} from 'lucide-react';
import { AppTemplate, PortfolioConfig } from '../../types';
import { DEFAULT_PORTFOLIO_CONFIG } from '../../portfolio.config';

interface IdeViewProps {
  onSwitchTemplate: (template: AppTemplate) => void;
  config?: PortfolioConfig;
}

type FileId = 'readme' | 'profile' | 'experience' | 'skills' | 'projects' | 'contact' | 'config';

interface IdeFile {
  id: FileId;
  name: string;
  extension: string;
  path: string;
  icon: React.ReactNode;
  content: string;
  language: string;
}

export const IdeView: React.FC<IdeViewProps> = ({ onSwitchTemplate, config = DEFAULT_PORTFOLIO_CONFIG }) => {
  const profile = config.profile || DEFAULT_PORTFOLIO_CONFIG.profile;
  const contact = config.contact || DEFAULT_PORTFOLIO_CONFIG.contact;
  const skills = config.skills || DEFAULT_PORTFOLIO_CONFIG.skills;
  const experience = config.experience || DEFAULT_PORTFOLIO_CONFIG.experience;
  const projects = config.projects || DEFAULT_PORTFOLIO_CONFIG.projects;
  const system = config.system || DEFAULT_PORTFOLIO_CONFIG.system;

  const [activeFileId, setActiveFileId] = useState<FileId>('profile');
  const [openFiles, setOpenFiles] = useState<FileId[]>(['profile', 'experience', 'projects', 'config']);
  const [srcFolderOpen, setSrcFolderOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [bottomTerminalOpen, setBottomTerminalOpen] = useState(false);
  const [quickSearch, setQuickSearch] = useState('');

  const files: Record<FileId, IdeFile> = {
    profile: {
      id: 'profile',
      name: 'Profile.tsx',
      extension: 'tsx',
      path: 'src/Profile.tsx',
      icon: <FileCode className="w-4 h-4 text-blue-400" />,
      language: 'typescript',
      content: `import React from 'react';

export interface DeveloperProfile {
  name: string;
  title: string;
  location: string;
  status: string;
  philosophy: string;
  yearsOfExperience: string;
}

export const devProfile: DeveloperProfile = {
  name: "${profile.name}",
  title: "${profile.title}",
  location: "${profile.location}",
  status: "${profile.status}",
  philosophy: "${profile.bio.split('\n')[0].replace(/"/g, '\\"')}",
  yearsOfExperience: "${profile.yearsOfExperience || '10+ Years'}"
};

export default function ProfileView() {
  return (
    <div className="profile-container">
      <h1>{devProfile.name}</h1>
      <h2>{devProfile.title}</h2>
      <p className="status-badge">🟢 {devProfile.status}</p>
      <blockquote>{devProfile.philosophy}</blockquote>
    </div>
  );
}`,
    },
    experience: {
      id: 'experience',
      name: 'Experience.ts',
      extension: 'ts',
      path: 'src/Experience.ts',
      icon: <FileCode className="w-4 h-4 text-blue-400" />,
      language: 'typescript',
      content: `export interface WorkExperience {
  role: string;
  company: string;
  period: string;
  highlights: string[];
  techStack: string[];
}

export const CAREER_HISTORY: WorkExperience[] = ${JSON.stringify(
        experience.map((exp) => ({
          role: exp.role,
          company: exp.company,
          period: exp.period,
          highlights: exp.achievements,
          techStack: exp.skills,
        })),
        null,
        2
      )};`,
    },
    skills: {
      id: 'skills',
      name: 'skills.config.json',
      extension: 'json',
      path: 'src/skills.config.json',
      icon: <FileJson className="w-4 h-4 text-amber-400" />,
      language: 'json',
      content: JSON.stringify(
        {
          version: config.version || '2.5.0',
          developer: profile.name,
          competencies: skills,
        },
        null,
        2
      ),
    },
    projects: {
      id: 'projects',
      name: 'Projects.tsx',
      extension: 'tsx',
      path: 'src/Projects.tsx',
      icon: <FileCode className="w-4 h-4 text-blue-400" />,
      language: 'typescript',
      content: `export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  description: string;
  highlights: string[];
  techStack: string[];
  demoUrl?: string;
  githubUrl?: string;
}

export const SHOWCASE_PROJECTS: ProjectItem[] = ${JSON.stringify(
        projects.map((p) => ({
          id: p.id,
          name: p.title,
          category: p.category,
          description: p.description,
          highlights: p.highlights,
          techStack: p.tags,
          demoUrl: p.demoUrl,
          githubUrl: p.githubUrl,
        })),
        null,
        2
      )};`,
    },
    config: {
      id: 'config',
      name: 'portfolio.config.json',
      extension: 'json',
      path: 'portfolio.config.json',
      icon: <Settings className="w-4 h-4 text-emerald-400" />,
      language: 'json',
      content: JSON.stringify(config, null, 2),
    },
    readme: {
      id: 'readme',
      name: 'README.md',
      extension: 'md',
      path: 'README.md',
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
      language: 'markdown',
      content: `# ${profile.name} - Engineering Portfolio & Resume

> ${profile.title} | ${profile.location}
> Status: ${profile.status}

## ⚡ Overview
${profile.bio}

## 🛠️ Core Capabilities
${skills.map((s) => `- **${s.title}**: ${s.skills.map((k) => k.name).join(', ')}`).join('\n')}

## 🚀 Key Achievements
- Scaled distributed services handling mission-critical workloads.
- Modularized architecture supporting Terminal, Bento, IDE, and LaTeX Academic modes.
- Config-driven replicable portfolio system.

---
*Built with React, TypeScript & Tailwind CSS. Switch to Terminal CLI, Bento Grid, or LaTeX Academic view anytime!*`,
    },
    contact: {
      id: 'contact',
      name: '.env.contacts',
      extension: 'env',
      path: '.env.contacts',
      icon: <Settings className="w-4 h-4 text-yellow-400" />,
      language: 'bash',
      content: `# Contact Information & Social Graph
DEV_EMAIL="${contact.email}"
DEV_GITHUB="${contact.github}"
DEV_LINKEDIN="${contact.linkedin}"
DEV_TWITTER="${contact.twitter}"
DEV_LOCATION="${contact.location}"
DEV_WEBSITE="${contact.blog || 'https://ssfu.dev'}"
DEV_AVAILABILITY="${profile.status}"`,
    },
  };

  const activeFile = files[activeFileId];

  const handleOpenFile = (id: FileId) => {
    if (!openFiles.includes(id)) {
      setOpenFiles([...openFiles, id]);
    }
    setActiveFileId(id);
  };

  const handleCloseFile = (e: React.MouseEvent, id: FileId) => {
    e.stopPropagation();
    const remaining = openFiles.filter((f) => f !== id);
    if (remaining.length === 0) {
      setOpenFiles(['profile']);
      setActiveFileId('profile');
    } else {
      setOpenFiles(remaining);
      if (activeFileId === id) {
        setActiveFileId(remaining[remaining.length - 1]);
      }
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileList = Object.values(files).filter(
    (f) => !quickSearch || f.name.toLowerCase().includes(quickSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#1e1e1e] text-[#cccccc] font-mono rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
      {/* Top VS Code Window Bar */}
      <div className="h-10 bg-[#323233] border-b border-[#252526] px-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-3">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <Code2 className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-neutral-300 font-medium">
            {profile.name.toLowerCase().replace(/\s+/g, '-')}-portfolio — {activeFile.path} — Visual Studio Code
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 transition-colors"
            title="Copy current file content"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
          <button
            onClick={() => onSwitchTemplate('terminal')}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 rounded border border-emerald-500/30 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Launch CLI</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Activity Bar + Sidebar + Editor */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-3 gap-4 border-r border-[#252526] select-none text-neutral-400">
          <button className="p-2 text-white border-l-2 border-white hover:text-white" title="Explorer">
            <Layers className="w-5 h-5" />
          </button>
          <button
            className="p-2 hover:text-white transition-colors"
            title="Toggle Bottom Terminal"
            onClick={() => setBottomTerminalOpen(!bottomTerminalOpen)}
          >
            <Terminal className="w-5 h-5" />
          </button>
          <div className="mt-auto flex flex-col items-center gap-3">
            <button
              onClick={() => onSwitchTemplate('bento')}
              className="p-2 hover:text-white text-xs text-neutral-400"
              title="Switch to Bento View"
            >
              🍱
            </button>
            <button
              onClick={() => onSwitchTemplate('academic')}
              className="p-2 hover:text-white text-xs text-neutral-400"
              title="Switch to LaTeX CV"
            >
              📄
            </button>
          </div>
        </div>

        {/* Sidebar: File Explorer */}
        <div className="w-64 bg-[#252526] border-r border-[#1e1e1e] flex flex-col select-none">
          <div className="px-4 py-2.5 text-xs uppercase font-bold tracking-wider text-neutral-400 flex items-center justify-between border-b border-[#333333]">
            <span>Explorer</span>
            <span className="text-[10px] text-neutral-500 font-normal">{profile.name.toUpperCase()}-WORKSPACE</span>
          </div>

          <div className="p-2 border-b border-[#333333]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-neutral-500" />
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="Filter files..."
                className="w-full bg-[#1e1e1e] text-xs text-neutral-300 pl-8 pr-2 py-1 rounded border border-[#3c3c3c] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 text-xs space-y-0.5">
            {/* README */}
            <div
              onClick={() => handleOpenFile('readme')}
              className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
                activeFileId === 'readme' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-neutral-300'
              }`}
            >
              {files.readme.icon}
              <span>README.md</span>
            </div>

            {/* src folder */}
            <div>
              <div
                onClick={() => setSrcFolderOpen(!srcFolderOpen)}
                className="flex items-center gap-1 px-1 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer text-neutral-400"
              >
                {srcFolderOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                {srcFolderOpen ? <FolderOpen className="w-3.5 h-3.5 text-blue-400" /> : <Folder className="w-3.5 h-3.5 text-blue-400" />}
                <span className="text-neutral-300 font-medium">src</span>
              </div>

              {srcFolderOpen && (
                <div className="pl-4 space-y-0.5 mt-0.5">
                  {(['profile', 'experience', 'skills', 'projects'] as FileId[]).map((id) => {
                    const f = files[id];
                    if (quickSearch && !f.name.toLowerCase().includes(quickSearch.toLowerCase())) return null;
                    return (
                      <div
                        key={id}
                        onClick={() => handleOpenFile(id)}
                        className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
                          activeFileId === id ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-neutral-300'
                        }`}
                      >
                        {f.icon}
                        <span>{f.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* .env */}
            <div
              onClick={() => handleOpenFile('contact')}
              className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
                activeFileId === 'contact' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] text-neutral-300'
              }`}
            >
              {files.contact.icon}
              <span>.env.contacts</span>
            </div>
          </div>

          {/* Mini Author Card */}
          <div className="p-3 bg-[#1e1e1e] border-t border-[#333333] text-xs">
            <div className="font-semibold text-neutral-200">{profile.name}</div>
            <div className="text-neutral-400 text-[11px] truncate">{profile.title}</div>
            <div className="text-emerald-400 text-[10px] mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {profile.status}
            </div>
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
          {/* Tabs Bar */}
          <div className="h-9 bg-[#252526] flex items-center overflow-x-auto border-b border-[#1e1e1e] select-none scrollbar-thin">
            {openFiles.map((fileId) => {
              const file = files[fileId];
              const isActive = activeFileId === fileId;
              return (
                <div
                  key={fileId}
                  onClick={() => setActiveFileId(fileId)}
                  className={`flex items-center gap-2 px-3 h-full border-r border-[#1e1e1e] cursor-pointer text-xs font-mono transition-colors ${
                    isActive
                      ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500'
                      : 'bg-[#2d2d2d] text-neutral-400 hover:bg-[#2a2a2a]'
                  }`}
                >
                  {file.icon}
                  <span>{file.name}</span>
                  <button
                    onClick={(e) => handleCloseFile(e, fileId)}
                    className="ml-1 text-neutral-500 hover:text-white rounded-full p-0.5"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {/* Breadcrumbs Bar */}
          <div className="h-6 bg-[#1e1e1e] px-4 flex items-center text-[11px] text-neutral-500 gap-1 border-b border-[#2d2d2d] select-none">
            <span>portfolio</span>
            <ChevronRight className="w-3 h-3" />
            <span>{activeFile.path}</span>
          </div>

          {/* Code Viewer with Line Numbers */}
          <div className="flex-1 overflow-auto flex font-mono text-xs leading-5">
            {/* Line numbers */}
            <div className="py-3 px-3 select-none text-neutral-600 text-right bg-[#1e1e1e] border-r border-[#2d2d2d]">
              {activeFile.content.split('\n').map((_, index) => (
                <div key={index} className="h-5">
                  {index + 1}
                </div>
              ))}
            </div>

            {/* Code Content */}
            <pre className="py-3 px-4 text-[#d4d4d4] flex-1 overflow-x-auto focus:outline-none">
              <code>{activeFile.content}</code>
            </pre>
          </div>

          {/* Collapsible Bottom Terminal */}
          {bottomTerminalOpen && (
            <div className="h-44 bg-[#181818] border-t border-[#333333] flex flex-col font-mono text-xs">
              <div className="h-7 bg-[#252526] px-3 flex items-center justify-between text-neutral-400 select-none">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] font-semibold text-neutral-200">INTEGRATED TERMINAL (zsh)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSwitchTemplate('terminal')}
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    Expand Full CLI →
                  </button>
                  <button
                    onClick={() => setBottomTerminalOpen(false)}
                    className="text-neutral-500 hover:text-white text-xs px-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-3 text-neutral-300 overflow-y-auto flex-1 space-y-1">
                <div className="text-neutral-500">Last login: {new Date().toLocaleDateString()} on ttys002</div>
                <div className="text-emerald-400">{profile.name.toLowerCase().replace(/\s+/g, '-')}@portfolio ~ % neofetch --short</div>
                <div className="text-neutral-300">
                  OS: {system?.os || 'Unknown'} | Host: {system?.host || 'Unknown'} | Kernel: {system?.kernel || 'Unknown'}
                </div>
                <div className="text-neutral-400">
                  Uptime: {system?.uptime || 'Unknown'} | Shell: {system?.shell || 'Unknown'} | Status: {profile.status}
                </div>
                <div className="text-emerald-400 flex items-center gap-1.5 mt-2">
                  <span>{profile.name.toLowerCase().replace(/\s+/g, '-')}@portfolio ~ %</span>
                  <span className="w-2 h-4 bg-emerald-400 animate-pulse inline-block" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VS Code Bottom Status Bar */}
      <div className="h-6 bg-[#007acc] text-white text-[11px] px-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <GitBranch className="w-3 h-3" />
            <span>main*</span>
          </div>
          <span>0 errors, 0 warnings</span>
          <button
            onClick={() => setBottomTerminalOpen(!bottomTerminalOpen)}
            className="hover:bg-white/20 px-1.5 py-0.5 rounded flex items-center gap-1"
          >
            <Terminal className="w-3 h-3" />
            <span>Terminal</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span>Ln {activeFile.content.split('\n').length}, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>TypeScript JSX</span>
          <span className="bg-blue-800 px-1.5 py-0.5 rounded font-bold">Prettier</span>
        </div>
      </div>
    </div>
  );
};
