import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Palette, 
  Trash2, 
  HelpCircle, 
  Maximize2, 
  Minimize2, 
  Layout, 
  Check,
  Radio
} from 'lucide-react';
import { ThemeConfig, ThemeKey } from '../types';
import { THEMES } from '../utils/themes';

interface TerminalHeaderProps {
  currentTheme: ThemeConfig;
  onSelectTheme: (theme: ThemeKey) => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  splitMode: boolean;
  onToggleSplitMode: () => void;
  onClear: () => void;
  onShowHelp: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  currentPath: string;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  currentTheme,
  onSelectTheme,
  crtEnabled,
  onToggleCrt,
  soundEnabled,
  onToggleSound,
  splitMode,
  onToggleSplitMode,
  onClear,
  onShowHelp,
  isFullscreen,
  onToggleFullscreen,
  currentPath,
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <header
      id="terminal-header-bar"
      className="relative flex items-center justify-between px-4 py-2.5 border-b select-none transition-colors duration-200"
      style={{
        backgroundColor: currentTheme.surface,
        borderColor: currentTheme.border,
      }}
    >
      {/* Left: Window controls & Terminal Tab info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5" aria-label="Window Controls">
          <button
            onClick={onClear}
            title="Close / Clear Terminal Output"
            className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-opacity hover:opacity-100 cursor-pointer flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold">×</span>
          </button>
          <button
            onClick={onToggleSplitMode}
            title="Toggle Split Cards Preview"
            className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-opacity hover:opacity-100 cursor-pointer flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold">-</span>
          </button>
          <button
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-opacity hover:opacity-100 cursor-pointer flex items-center justify-center group"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] text-black font-bold">+</span>
          </button>
        </div>

        {/* Tab badge */}
        <div
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded text-xs border font-medium"
          style={{
            backgroundColor: currentTheme.bg,
            borderColor: currentTheme.border,
            color: currentTheme.text,
          }}
        >
          <TerminalIcon className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
          <span className="opacity-80">guest@ssfu.dev:</span>
          <span style={{ color: currentTheme.promptPath }}>{currentPath}</span>
          <span className="text-[10px] opacity-50 px-1 py-0.2 rounded bg-white/5">(zsh)</span>
        </div>
      </div>

      {/* Center: Mobile compact title */}
      <div className="sm:hidden flex items-center gap-1.5 text-xs font-semibold" style={{ color: currentTheme.accent }}>
        <TerminalIcon className="w-3.5 h-3.5" />
        <span>ssfu.dev</span>
      </div>

      {/* Right: Interactive Tools & Settings */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Split UI Preview toggle */}
        <button
          id="btn-toggle-split"
          onClick={onToggleSplitMode}
          title={splitMode ? "Switch to Terminal Only" : "Show Side-by-Side Visual Preview"}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs border transition-colors cursor-pointer ${
            splitMode ? 'bg-white/10 font-medium' : 'hover:bg-white/5 opacity-80'
          }`}
          style={{
            borderColor: splitMode ? currentTheme.accent : currentTheme.border,
            color: splitMode ? currentTheme.accent : currentTheme.text,
          }}
        >
          <Layout className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{splitMode ? 'Cards View ON' : 'Visual Cards'}</span>
        </button>

        {/* Sound toggle */}
        <button
          id="btn-toggle-sound"
          onClick={onToggleSound}
          title={soundEnabled ? "Mute Mechanical Audio FX" : "Enable Mechanical Audio FX"}
          className="p-1.5 rounded text-xs border transition-colors cursor-pointer hover:bg-white/5"
          style={{
            borderColor: soundEnabled ? currentTheme.accent : currentTheme.border,
            color: soundEnabled ? currentTheme.accent : currentTheme.textMuted,
          }}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* CRT toggle */}
        <button
          id="btn-toggle-crt"
          onClick={onToggleCrt}
          title={crtEnabled ? "Disable Retro CRT Scanlines" : "Enable Retro CRT Scanlines"}
          className="p-1.5 rounded text-xs border transition-colors cursor-pointer hover:bg-white/5"
          style={{
            borderColor: crtEnabled ? currentTheme.accent : currentTheme.border,
            color: crtEnabled ? currentTheme.accent : currentTheme.textMuted,
          }}
        >
          <Monitor className="w-3.5 h-3.5" />
        </button>

        {/* Theme Picker */}
        <div className="relative">
          <button
            id="btn-theme-menu"
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            title="Select Color Palette"
            className="flex items-center gap-1 p-1.5 sm:px-2 sm:py-1 rounded text-xs border transition-colors cursor-pointer hover:bg-white/5"
            style={{
              borderColor: currentTheme.border,
              color: currentTheme.text,
            }}
          >
            <Palette className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />
            <span className="hidden lg:inline text-xs">{currentTheme.name}</span>
          </button>

          {showThemeMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowThemeMenu(false)} 
              />
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-lg border shadow-2xl p-2 z-50 text-xs backdrop-blur-md"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.text,
                }}
              >
                <div className="px-2 py-1 font-semibold uppercase tracking-wider text-[10px] opacity-60 border-b pb-1 mb-1" style={{ borderColor: currentTheme.border }}>
                  Terminal Themes
                </div>
                <div className="space-y-1">
                  {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
                    const t = THEMES[key];
                    const isSelected = currentTheme.id === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          onSelectTheme(key);
                          setShowThemeMenu(false);
                        }}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded transition-colors text-left hover:bg-white/10 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-black/30"
                            style={{ backgroundColor: t.accent }}
                          />
                          <span>{t.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5" style={{ color: currentTheme.accent }} />}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 pt-2 border-t text-[10px] opacity-60 px-1" style={{ borderColor: currentTheme.border }}>
                  Tip: Type <code className="px-1 py-0.5 rounded bg-white/10">theme [name]</code>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Clear */}
        <button
          id="btn-clear-terminal"
          onClick={onClear}
          title="Clear Screen (Ctrl+L)"
          className="p-1.5 rounded text-xs border transition-colors cursor-pointer hover:bg-white/5"
          style={{
            borderColor: currentTheme.border,
            color: currentTheme.textMuted,
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Help */}
        <button
          id="btn-help-dialog"
          onClick={onShowHelp}
          title="Show Command Help"
          className="p-1.5 rounded text-xs border transition-colors cursor-pointer hover:bg-white/5"
          style={{
            borderColor: currentTheme.border,
            color: currentTheme.accent,
          }}
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen */}
        <button
          id="btn-fullscreen"
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          className="p-1.5 rounded text-xs border transition-colors cursor-pointer hover:bg-white/5 hidden sm:block"
          style={{
            borderColor: currentTheme.border,
            color: currentTheme.textMuted,
          }}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </header>
  );
};
