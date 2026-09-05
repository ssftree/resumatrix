/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { TerminalHeader } from './components/TerminalHeader';
import { TerminalOutput } from './components/TerminalOutput';
import { TerminalInput } from './components/TerminalInput';
import { MatrixRain } from './components/MatrixRain';
import { ResumeModal } from './components/ResumeModal';
import { GuiPreview } from './components/GuiPreview';
import { 
  ASCII_BANNER, 
  VIRTUAL_FILESYSTEM 
} from './data/portfolioData';
import { TerminalHistoryItem, ThemeConfig, ThemeKey, AppTemplate, PortfolioConfig } from './types';
import { THEMES } from './utils/themes';
import { soundEngine } from './utils/sound';
import { TemplateSwitcher } from './components/TemplateSwitcher';
import { IdeView } from './components/templates/IdeView';
import { BentoView } from './components/templates/BentoView';
import { AcademicView } from './components/templates/AcademicView';
import { RetroDesktopView } from './components/templates/RetroDesktopView';
import { TelemetryView } from './components/templates/TelemetryView';
import { SwissBrutalismView } from './components/templates/SwissBrutalismView';
import { ConfigCustomizerModal } from './components/ConfigCustomizerModal';
import { DEFAULT_PORTFOLIO_CONFIG } from './portfolio.config';
import { parsePortfolioConfigJson } from './utils/portfolioConfig';

export default function App() {
  const [currentTemplate, setCurrentTemplate] = useState<AppTemplate>('terminal');
  const [themeKey, setThemeKey] = useState<ThemeKey>('matrix');
  const currentTheme: ThemeConfig = THEMES[themeKey];

  // Portfolio data-driven config state with localStorage persistence
  const [portfolioConfig, setPortfolioConfig] = useState<PortfolioConfig>(() => {
    try {
      const saved = localStorage.getItem('portfolio_config_v2');
      if (saved) {
        const parsed = parsePortfolioConfigJson(saved);
        if (parsed.success) {
          return parsed.data;
        }
        if ('error' in parsed) {
          console.warn('Ignoring invalid portfolio config from localStorage:', parsed.error);
        }
      }
    } catch (e) {
      console.error('Failed to load portfolio config from localStorage', e);
    }
    return DEFAULT_PORTFOLIO_CONFIG;
  });

  const [configModalOpen, setConfigModalOpen] = useState<boolean>(false);

  const handleSaveConfig = (newConfig: PortfolioConfig) => {
    setPortfolioConfig(newConfig);
    try {
      localStorage.setItem('portfolio_config_v2', JSON.stringify(newConfig));
    } catch (e) {
      console.error('Failed to persist portfolio config to localStorage', e);
    }
  };

  const handleResetConfig = () => {
    setPortfolioConfig(DEFAULT_PORTFOLIO_CONFIG);
    try {
      localStorage.removeItem('portfolio_config_v2');
    } catch (e) {
      console.error('Failed to reset config in localStorage', e);
    }
  };

  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [matrixActive, setMatrixActive] = useState<boolean>(false);
  const [splitMode, setSplitMode] = useState<boolean>(false);
  const [resumeOpen, setResumeOpen] = useState<boolean>(false);
  // Single commercial seam: flip to 'none' once an entitlement check exists. No payment wiring in this ticket.
  const [resumeWatermark] = useState<'brand' | 'none'>('brand');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [currentPath, setCurrentPath] = useState<string>('~');
  const [historyList, setHistoryList] = useState<TerminalHistoryItem[]>([]);
  const [commandHistoryLog, setCommandHistoryLog] = useState<string[]>([]);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize with greeting & banner
  useEffect(() => {
    const welcomeItem: TerminalHistoryItem = {
      id: 'welcome-init',
      command: '',
      timestamp: new Date().toLocaleTimeString(),
      output: {
        type: 'text',
        content: `${ASCII_BANNER}
  ╭──────────────────────────────────────────────────────────────╮
  │  Welcome to ssfu's Engineering Workspace (v2.5.0)            │
  │  Interactive Portfolio & Multi-Style Digital CV • ssfu.dev   │
  ╰──────────────────────────────────────────────────────────────╯

Styles: [terminal] [ide] [bento] [academic] (Use top switcher or type 'template <name>')
Quick commands: [help] [about] [skills] [projects] [exp] [contact] [theme] [template]`,
      },
    };

    setHistoryList([welcomeItem]);
  }, []);

  // Sync sound engine state
  useEffect(() => {
    soundEngine.enabled = soundEnabled;
  }, [soundEnabled]);

  // Scroll to bottom when history updates
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [historyList]);

  // Handle Fullscreen
  useEffect(() => {
    const syncFullscreenState = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreenState);
    return () => document.removeEventListener('fullscreenchange', syncFullscreenState);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  // Get current directory files
  const getCurrentDirectoryFiles = (): string[] => {
    if (currentPath === '~') {
      const rootDir = VIRTUAL_FILESYSTEM['~'];
      return Object.keys(rootDir?.children || {});
    }
    if (currentPath === '~/secrets') {
      const secretsDir = VIRTUAL_FILESYSTEM['~']?.children?.['secrets'];
      return Object.keys(secretsDir?.children || {});
    }
    return [];
  };

  // Command Execution Router
  const executeCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim();
    if (!trimmed) return;

    setCommandHistoryLog((prev) => [...prev, trimmed]);
    const parts = trimmed.split(' ').filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').trim();
    const time = new Date().toLocaleTimeString();

    let outputType: TerminalHistoryItem['output']['type'] = 'text';
    let outputContent = '';
    let outputData: any = null;

    switch (cmd) {
      case 'help':
      case '?':
        outputType = 'help';
        break;

      case 'about':
      case 'whoami':
        outputType = 'about';
        break;

      case 'skills':
      case 'tech':
      case 'stack':
        outputType = 'skills';
        break;

      case 'projects':
      case 'proj':
      case 'works':
        outputType = 'projects';
        break;

      case 'project': {
        if (!arg) {
          outputType = 'projects';
        } else {
          const match = portfolioConfig.projects.find(
            (p) => p.id.toLowerCase() === arg.toLowerCase() || p.title.toLowerCase().includes(arg.toLowerCase())
          );
          if (match) {
            outputType = 'text';
            outputContent = `┌─ [PROJECT DETAILS: ${match.title}] ───────────────────────────────────────
│ Tagline   : ${match.tagline}
│ Category  : ${match.category}
│ Year      : ${match.year}
│ Stars     : ${match.stars ? '★ ' + match.stars : 'N/A'}
│ Tech      : ${match.tags.join(', ')}
│
│ Description:
│ ${match.description}
│
│ Highlights:
${match.highlights.map((h) => `│  • ${h}`).join('\n')}
│
│ Links:
│  • GitHub : ${match.githubUrl || 'N/A'}
│  • Demo   : ${match.demoUrl || 'N/A'}
└──────────────────────────────────────────────────────────────────────────`;
          } else {
            outputType = 'error';
            outputContent = `Project '${arg}' not found. Type 'projects' to view all valid project keys.`;
          }
        }
        break;
      }

      case 'exp':
      case 'experience':
      case 'career':
        outputType = 'experience';
        break;

      case 'contact':
      case 'email':
        outputType = 'contact';
        break;

      case 'neofetch':
      case 'profile':
      case 'fetch':
        outputType = 'neofetch';
        break;

      case 'ls': {
        outputType = 'ls';
        const files = getCurrentDirectoryFiles();
        const currentChildren =
          currentPath === '~'
            ? VIRTUAL_FILESYSTEM['~'].children
            : VIRTUAL_FILESYSTEM['~'].children?.['secrets']?.children;

        const entries = files.map((fname) => {
          const node = currentChildren?.[fname];
          return {
            name: fname,
            type: node?.type || 'file',
            size: node?.size || '',
          };
        });

        outputData = { entries };
        break;
      }

      case 'cat': {
        if (!arg) {
          outputType = 'error';
          outputContent = `Usage: cat <filename> (e.g. cat about.txt)`;
          break;
        }

        const currentChildren =
          currentPath === '~'
            ? VIRTUAL_FILESYSTEM['~'].children
            : VIRTUAL_FILESYSTEM['~'].children?.['secrets']?.children;

        const targetFile = currentChildren?.[arg];
        if (!targetFile) {
          outputType = 'error';
          outputContent = `cat: ${arg}: No such file. Type 'ls' to see files in current directory.`;
        } else if (targetFile.type === 'dir') {
          outputType = 'error';
          outputContent = `cat: ${arg}: Is a directory. Use 'cd ${arg}' instead.`;
        } else {
          outputType = 'cat';
          outputContent = targetFile.content || '';
          outputData = { filename: arg };
        }
        break;
      }

      case 'cd': {
        if (!arg || arg === '~' || arg === '/') {
          setCurrentPath('~');
          outputType = 'text';
          outputContent = `Changed directory to ~`;
        } else if (arg === 'secrets' && currentPath === '~') {
          setCurrentPath('~/secrets');
          outputType = 'text';
          outputContent = `Changed directory to ~/secrets`;
        } else if (arg === '..' || arg === '../') {
          setCurrentPath('~');
          outputType = 'text';
          outputContent = `Changed directory to ~`;
        } else {
          outputType = 'error';
          outputContent = `cd: no such file or directory: ${arg}`;
        }
        break;
      }

      case 'pwd':
        outputType = 'text';
        outputContent = `/home/${portfolioConfig.profile.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user'}/${currentPath === '~' ? '' : 'secrets'}`;
        break;

      case 'config':
      case 'customize':
      case 'profile-edit': {
        if (arg === 'reset') {
          handleResetConfig();
          outputType = 'success';
          outputContent = `Reset portfolio configuration to default Frank (ssfu) preset.`;
        } else if (arg === 'export') {
          const blob = new Blob([JSON.stringify(portfolioConfig, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `portfolio.config.json`;
          a.click();
          URL.revokeObjectURL(url);
          outputType = 'success';
          outputContent = `Exported portfolio.config.json to browser downloads!`;
        } else {
          setConfigModalOpen(true);
          outputType = 'success';
          outputContent = `Opening Portfolio Config Customizer...\nYou can edit personal info, technical skills, projects, and career milestones, switch presets, or export/import JSON.`;
        }
        break;
      }

      case 'theme': {
        const themeArgs = Object.keys(THEMES) as ThemeKey[];
        if (!arg) {
          outputType = 'text';
          outputContent = `Current theme: ${themeKey} (${currentTheme.name})
Available themes: ${themeArgs.join(', ')}

Usage: theme <name> (e.g. theme dracula, theme cyberpunk, theme amber, theme nord)`;
        } else {
          const selected = arg.toLowerCase() as ThemeKey;
          if (THEMES[selected]) {
            setThemeKey(selected);
            outputType = 'success';
            outputContent = `Theme updated to '${THEMES[selected].name}'`;
          } else {
            outputType = 'error';
            outputContent = `Unknown theme '${arg}'. Options: ${themeArgs.join(', ')}`;
          }
        }
        break;
      }

      case 'template':
      case 'view':
      case 'layout': {
        if (!arg) {
          outputType = 'text';
          outputContent = `Active Resume/Portfolio Template: ${currentTemplate}

Available Templates:
  • terminal   - Interactive Retro CLI Terminal (current)
  • ide        - Visual Studio Code / Cloud IDE Code Layout
  • bento      - Modern Raycast / Linear Obsidian Bento Grid
  • retro      - Win95 / Classic Retro Desktop OS with Draggable Windows & Minesweeper
  • telemetry  - Grafana / SRE Engineer Production Metrics Dashboard
  • brutalism  - Swiss International / Minimalist Brutalism High-Contrast Layout
  • academic   - LaTeX Paper / Print-ready Academic CV

Usage: template <name> (e.g. template retro, template telemetry, template brutalism, template ide)`;
        } else {
          const chosen = arg.toLowerCase();
          if (chosen === 'ide' || chosen === 'vscode') {
            setCurrentTemplate('ide');
            outputType = 'success';
            outputContent = `Switching view to Cloud IDE (VS Code)...`;
          } else if (chosen === 'bento' || chosen === 'modern' || chosen === 'grid') {
            setCurrentTemplate('bento');
            outputType = 'success';
            outputContent = `Switching view to Modern Bento Grid...`;
          } else if (chosen === 'retro' || chosen === 'win95' || chosen === 'desktop' || chosen === 'os') {
            setCurrentTemplate('retro');
            outputType = 'success';
            outputContent = `Switching view to Retro Desktop OS (Win95)...`;
          } else if (chosen === 'telemetry' || chosen === 'grafana' || chosen === 'sre' || chosen === 'metrics') {
            setCurrentTemplate('telemetry');
            outputType = 'success';
            outputContent = `Switching view to SRE / Engineer Telemetry Dashboard...`;
          } else if (chosen === 'brutalism' || chosen === 'swiss' || chosen === 'minimal') {
            setCurrentTemplate('brutalism');
            outputType = 'success';
            outputContent = `Switching view to Swiss International Brutalism...`;
          } else if (chosen === 'academic' || chosen === 'latex' || chosen === 'cv' || chosen === 'paper') {
            setCurrentTemplate('academic');
            outputType = 'success';
            outputContent = `Switching view to LaTeX Academic CV...`;
          } else if (chosen === 'terminal' || chosen === 'cli') {
            setCurrentTemplate('terminal');
            outputType = 'success';
            outputContent = `Staying in Terminal CLI mode.`;
          } else {
            outputType = 'error';
            outputContent = `Unknown template '${arg}'. Valid options: terminal, ide, bento, retro, telemetry, brutalism, academic`;
          }
        }
        break;
      }

      case 'matrix':
        setMatrixActive((prev) => !prev);
        outputType = 'success';
        outputContent = `Matrix rain visual mode toggled. Press ESC or type 'matrix' to toggle.`;
        break;

      case 'crt':
        setCrtEnabled((prev) => {
          const next = !prev;
          return next;
        });
        outputType = 'success';
        outputContent = `Retro CRT scanlines & curvature shader ${!crtEnabled ? 'ENABLED' : 'DISABLED'}.`;
        break;

      case 'sound':
        setSoundEnabled((prev) => {
          const next = !prev;
          soundEngine.enabled = next;
          if (next) soundEngine.playBeep();
          return next;
        });
        outputType = 'success';
        outputContent = `Mechanical keyboard audio feedback ${!soundEnabled ? 'ENABLED' : 'MUTED'}.`;
        break;

      case 'gui':
      case 'mode':
      case 'split':
        setSplitMode((prev) => !prev);
        outputType = 'success';
        outputContent = `Side-by-side Visual Cards Preview toggled.`;
        break;

      case 'resume':
      case 'cv':
      case 'download':
        setResumeOpen(true);
        outputType = 'success';
        outputContent = `Opening Curriculum Vitae modal...`;
        break;

      case 'date':
        outputType = 'text';
        outputContent = `${new Date().toString()}`;
        break;

      case 'echo':
        outputType = 'text';
        outputContent = arg;
        break;

      case 'history':
        outputType = 'text';
        outputContent = commandHistoryLog
          .map((h, i) => `  ${i + 1}  ${h}`)
          .join('\n');
        break;

      case 'sudo':
        outputType = 'error';
        soundEngine.playError();
        outputContent = `guest is not in the sudoers file. This incident will be reported to ssfu.`;
        break;

      case 'clear':
      case 'cls':
        setHistoryList([]);
        return;

      default:
        soundEngine.playError();
        outputType = 'error';
        outputContent = `zsh: command not found: ${cmd}.`;
        break;
    }

    const newItem: TerminalHistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      command: trimmed,
      path: currentPath,
      timestamp: time,
      output: {
        type: outputType,
        content: outputContent,
        data: outputData,
      },
    };

    setHistoryList((prev) => [...prev, newItem]);
  };

  const handleClear = () => {
    setHistoryList([]);
  };

  const handleShowHelp = () => {
    executeCommand('help');
  };

  // Render IDE View
  if (currentTemplate === 'ide') {
    return (
      <div className="min-h-screen bg-[#181818] p-2 sm:p-6 flex flex-col justify-center relative">
        <div className="fixed top-3 right-4 z-40 print:hidden">
          <TemplateSwitcher
            currentTemplate={currentTemplate}
            onSelectTemplate={(tpl) => setCurrentTemplate(tpl)}
            onOpenCustomizer={() => setConfigModalOpen(true)}
          />
        </div>
        <div className="max-w-7xl mx-auto w-full pt-10 sm:pt-2">
          <IdeView 
            config={portfolioConfig}
            onSwitchTemplate={setCurrentTemplate} 
          />
        </div>
        <ConfigCustomizerModal
          isOpen={configModalOpen}
          onClose={() => setConfigModalOpen(false)}
          config={portfolioConfig}
          onSaveConfig={handleSaveConfig}
          onResetConfig={handleResetConfig}
        />
      </div>
    );
  }

  // Render Bento Grid View
  if (currentTemplate === 'bento') {
    return (
      <div className="min-h-screen bg-[#0d1117] relative">
        <div className="fixed top-3 right-4 z-40 print:hidden">
          <TemplateSwitcher
            currentTemplate={currentTemplate}
            onSelectTemplate={(tpl) => setCurrentTemplate(tpl)}
            onOpenCustomizer={() => setConfigModalOpen(true)}
          />
        </div>
        <div className="pt-10 sm:pt-4">
          <BentoView 
            config={portfolioConfig}
            onSwitchTemplate={setCurrentTemplate} 
            onOpenResumeModal={() => setResumeOpen(true)} 
          />
        </div>
        <ResumeModal
          isOpen={resumeOpen}
          onClose={() => setResumeOpen(false)}
          theme={currentTheme}
          config={portfolioConfig}
          watermark={resumeWatermark}
        />
        <ConfigCustomizerModal
          isOpen={configModalOpen}
          onClose={() => setConfigModalOpen(false)}
          config={portfolioConfig}
          onSaveConfig={handleSaveConfig}
          onResetConfig={handleResetConfig}
        />
      </div>
    );
  }

  // Render Academic LaTeX View
  if (currentTemplate === 'academic') {
    return (
      <div className="min-h-screen bg-neutral-900 relative">
        <div className="fixed top-3 right-4 z-40 print:hidden">
          <TemplateSwitcher
            currentTemplate={currentTemplate}
            onSelectTemplate={(tpl) => setCurrentTemplate(tpl)}
            onOpenCustomizer={() => setConfigModalOpen(true)}
          />
        </div>
        <div className="pt-10 sm:pt-4">
          <AcademicView
            config={portfolioConfig}
            watermark={resumeWatermark}
            onSwitchTemplate={setCurrentTemplate}
          />
        </div>
        <ConfigCustomizerModal
          isOpen={configModalOpen}
          onClose={() => setConfigModalOpen(false)}
          config={portfolioConfig}
          onSaveConfig={handleSaveConfig}
          onResetConfig={handleResetConfig}
        />
      </div>
    );
  }

  // Render Retro Desktop OS View (Win95 / Classic OS)
  if (currentTemplate === 'retro') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="fixed top-3 right-4 z-50 print:hidden">
          <TemplateSwitcher
            currentTemplate={currentTemplate}
            onSelectTemplate={(tpl) => setCurrentTemplate(tpl)}
            onOpenCustomizer={() => setConfigModalOpen(true)}
          />
        </div>
        <RetroDesktopView
          config={portfolioConfig}
          onSwitchTemplate={setCurrentTemplate}
          onOpenResumeModal={() => setResumeOpen(true)}
        />
        <ResumeModal
          isOpen={resumeOpen}
          onClose={() => setResumeOpen(false)}
          theme={currentTheme}
          config={portfolioConfig}
          watermark={resumeWatermark}
        />
        <ConfigCustomizerModal
          isOpen={configModalOpen}
          onClose={() => setConfigModalOpen(false)}
          config={portfolioConfig}
          onSaveConfig={handleSaveConfig}
          onResetConfig={handleResetConfig}
        />
      </div>
    );
  }

  // Render Telemetry / Grafana SRE Dashboard View
  if (currentTemplate === 'telemetry') {
    return (
      <div className="min-h-screen bg-[#0b0f17] relative">
        <div className="fixed top-3 right-4 z-40 print:hidden">
          <TemplateSwitcher
            currentTemplate={currentTemplate}
            onSelectTemplate={(tpl) => setCurrentTemplate(tpl)}
            onOpenCustomizer={() => setConfigModalOpen(true)}
          />
        </div>
        <div className="pt-12 sm:pt-4">
          <TelemetryView
            config={portfolioConfig}
            onSwitchTemplate={setCurrentTemplate}
            onOpenResumeModal={() => setResumeOpen(true)}
          />
        </div>
        <ResumeModal
          isOpen={resumeOpen}
          onClose={() => setResumeOpen(false)}
          theme={currentTheme}
          config={portfolioConfig}
          watermark={resumeWatermark}
        />
        <ConfigCustomizerModal
          isOpen={configModalOpen}
          onClose={() => setConfigModalOpen(false)}
          config={portfolioConfig}
          onSaveConfig={handleSaveConfig}
          onResetConfig={handleResetConfig}
        />
      </div>
    );
  }

  // Render Swiss Brutalism View
  if (currentTemplate === 'brutalism') {
    return (
      <div className="min-h-screen relative">
        <div className="fixed top-3 right-4 z-40 print:hidden">
          <TemplateSwitcher
            currentTemplate={currentTemplate}
            onSelectTemplate={(tpl) => setCurrentTemplate(tpl)}
            onOpenCustomizer={() => setConfigModalOpen(true)}
          />
        </div>
        <div className="pt-10 sm:pt-4">
          <SwissBrutalismView
            config={portfolioConfig}
            onSwitchTemplate={setCurrentTemplate}
            onOpenResumeModal={() => setResumeOpen(true)}
          />
        </div>
        <ResumeModal
          isOpen={resumeOpen}
          onClose={() => setResumeOpen(false)}
          theme={currentTheme}
          config={portfolioConfig}
          watermark={resumeWatermark}
        />
        <ConfigCustomizerModal
          isOpen={configModalOpen}
          onClose={() => setConfigModalOpen(false)}
          config={portfolioConfig}
          onSaveConfig={handleSaveConfig}
          onResetConfig={handleResetConfig}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 transition-colors duration-300 relative overflow-hidden"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
      }}
    >
      {/* Floating Template Style Switcher */}
      <div className="fixed top-3 right-4 z-40 print:hidden">
        <TemplateSwitcher
          currentTemplate={currentTemplate}
          onSelectTemplate={(tpl) => setCurrentTemplate(tpl)}
          onOpenCustomizer={() => setConfigModalOpen(true)}
        />
      </div>

      {/* Optional Matrix Rain Screen */}
      <MatrixRain
        active={matrixActive}
        color={currentTheme.accent}
        onClose={() => setMatrixActive(false)}
      />

      {/* Resume Modal */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        theme={currentTheme}
        config={portfolioConfig}
        watermark={resumeWatermark}
      />

      {/* Portfolio Config Customizer Modal */}
      <ConfigCustomizerModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        config={portfolioConfig}
        onSaveConfig={handleSaveConfig}
        onResetConfig={handleResetConfig}
      />

      {/* CRT Scanline & Screen Vignette Overlay */}
      {crtEnabled && (
        <>
          <div className="fixed inset-0 crt-overlay pointer-events-none z-30" />
          <div className="fixed inset-0 crt-vignette pointer-events-none z-30" />
        </>
      )}

      {/* Main Terminal Window Frame */}
      <main
        ref={containerRef}
        id="terminal-main-window"
        className={`w-full max-w-6xl h-screen sm:h-[88vh] flex flex-col rounded-none sm:rounded-xl border shadow-2xl overflow-hidden transition-all duration-300 relative z-10 ${
          currentTheme.glowClass || ''
        }`}
        style={{
          backgroundColor: currentTheme.surface,
          borderColor: currentTheme.border,
        }}
      >
        {/* Window Top Titlebar */}
        <TerminalHeader
          currentTheme={currentTheme}
          onSelectTheme={(t) => setThemeKey(t)}
          crtEnabled={crtEnabled}
          onToggleCrt={() => setCrtEnabled(!crtEnabled)}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          splitMode={splitMode}
          onToggleSplitMode={() => setSplitMode(!splitMode)}
          onClear={handleClear}
          onShowHelp={handleShowHelp}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          currentPath={currentPath}
        />

        {/* Window Interior: Terminal & Optional Split GUI */}
        <div className="flex-1 flex overflow-hidden">
          {/* Terminal Console View */}
          <div
            id="terminal-scroll-area"
            className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 flex flex-col justify-between font-mono"
            style={{
              backgroundColor: currentTheme.bg,
            }}
          >
            <div>
              {/* History Items Output */}
              {historyList.map((item) => (
                <TerminalOutput
                  key={item.id}
                  item={item}
                  theme={currentTheme}
                  config={portfolioConfig}
                  onExecuteCommand={executeCommand}
                  onOpenResumeModal={() => setResumeOpen(true)}
                />
              ))}

              {/* Active Command Input Line */}
              <TerminalInput
                currentPath={currentPath}
                theme={currentTheme}
                onSubmit={executeCommand}
                onClear={handleClear}
                availableFiles={getCurrentDirectoryFiles()}
              />

              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* Optional Split Graphical Preview Pane */}
          {splitMode && (
            <div className="w-full md:w-[420px] lg:w-[460px] hidden md:block shrink-0">
              <GuiPreview
                config={portfolioConfig}
                theme={currentTheme}
                onClose={() => setSplitMode(false)}
                onRunTerminalCommand={executeCommand}
              />
            </div>
          )}
        </div>

        {/* Terminal Bottom Status Bar */}
        <footer
          id="terminal-status-bar"
          className="flex items-center justify-between px-3 py-1.5 border-t text-[11px] font-mono select-none"
          style={{
            backgroundColor: currentTheme.surface,
            borderColor: currentTheme.border,
            color: currentTheme.textMuted,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="hidden xs:inline">ONLINE</span>
            </span>
            <span>zsh 5.9</span>
            <span className="hidden sm:inline">UTF-8</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline">{portfolioConfig.profile.name.toLowerCase().replace(/\s+/g, '')}.dev</span>
            <span>Theme: <strong style={{ color: currentTheme.accent }}>{currentTheme.name}</strong></span>
            <span className="hidden md:inline">Commands: {commandHistoryLog.length}</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
