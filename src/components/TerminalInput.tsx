import React, { useState, useRef, useEffect } from 'react';
import { ThemeConfig } from '../types';
import { soundEngine } from '../utils/sound';

interface TerminalInputProps {
  currentPath: string;
  theme: ThemeConfig;
  onSubmit: (command: string) => void;
  onClear: () => void;
  availableFiles?: string[];
}

const COMMON_COMMANDS = [
  'help',
  'about',
  'skills',
  'projects',
  'exp',
  'contact',
  'neofetch',
  'ls',
  'cat',
  'resume',
  'theme',
  'template',
  'matrix',
  'crt',
  'sound',
  'clear',
];

export const TerminalInput: React.FC<TerminalInputProps> = ({
  currentPath,
  theme,
  onSubmit,
  onClear,
  availableFiles = [],
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Keep input focused automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    soundEngine.playKeyClick();

    // Ctrl+L -> Clear
    if (e.ctrlKey && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      onClear();
      return;
    }

    // Ctrl+C -> Cancel line
    if (e.ctrlKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      setInputVal('');
      return;
    }

    // Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputVal.trim();
      if (trimmed) {
        soundEngine.playEnter();
        setHistory((prev) => [...prev, trimmed]);
        setHistoryIndex(-1);
        onSubmit(trimmed);
        setInputVal('');
      }
      return;
    }

    // Up Arrow (Previous command in history)
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(history[nextIndex]);
      return;
    }

    // Down Arrow (Next command in history)
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
      return;
    }

    // Tab (Autocomplete)
    if (e.key === 'Tab') {
      e.preventDefault();
      const trimmed = inputVal.trimStart();
      const parts = trimmed.split(' ');

      if (parts.length === 1) {
        // Complete command
        const prefix = parts[0].toLowerCase();
        const matches = COMMON_COMMANDS.filter((c) => c.startsWith(prefix));
        if (matches.length === 1) {
          setInputVal(matches[0] + ' ');
        } else if (matches.length > 1) {
          // Fill common prefix or cycle
          setInputVal(matches[0]);
        }
      } else if (parts.length >= 2) {
        // Autocomplete file argument
        const cmd = parts[0].toLowerCase();
        const filePrefix = parts[1].toLowerCase();
        if (cmd === 'cat' || cmd === 'cd') {
          const matchedFiles = availableFiles.filter((f) => f.toLowerCase().startsWith(filePrefix));
          if (matchedFiles.length === 1) {
            setInputVal(`${cmd} ${matchedFiles[0]}`);
          }
        }
      }
    }
  };

  const handleChipClick = (cmd: string) => {
    soundEngine.playEnter();
    onSubmit(cmd);
    inputRef.current?.focus();
  };

  return (
    <div className="pt-2 pb-6 space-y-3 font-mono">
      {/* Active command line */}
      <div 
        className="flex items-center gap-2 text-xs sm:text-sm"
        onClick={() => inputRef.current?.focus()}
      >
        <span style={{ color: theme.promptUser }} className="font-semibold select-none">
          guest@ssfu.dev
        </span>
        <span className="opacity-50 select-none">:</span>
        <span style={{ color: theme.promptPath }} className="font-semibold select-none">
          {currentPath}
        </span>
        <span style={{ color: theme.accent }} className="font-bold select-none">
          $
        </span>

        <div className="relative flex-1 flex items-center">
          <input
            ref={inputRef}
            id="terminal-active-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
            spellCheck="false"
            className="w-full bg-transparent outline-none border-none text-xs sm:text-sm font-mono caret-transparent"
            style={{ color: theme.text }}
          />

          {/* Authentic block blinking cursor aligned to text */}
          <span
            className="pointer-events-none inline-block w-2 sm:w-2.5 h-4 sm:h-4.5 -ml-[1px] animate-cursor-blink"
            style={{ backgroundColor: theme.cursor }}
          />
        </div>
      </div>

      {/* Quick Action Suggestion Chips for Mobile & Rapid Exploration */}
      <div className="pt-2 border-t border-white/10 select-none">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          <span className="opacity-50 uppercase tracking-wider text-[10px] shrink-0 mr-1">Quick:</span>
          {['help', 'about', 'skills', 'projects', 'exp', 'contact', 'resume', 'neofetch', 'theme', 'matrix', 'clear'].map(
            (cmd) => (
              <button
                key={cmd}
                onClick={() => handleChipClick(cmd)}
                className="px-2 py-0.5 rounded border border-white/10 bg-white/5 hover:bg-white/15 transition-colors shrink-0 opacity-80 hover:opacity-100 cursor-pointer font-mono"
                style={{ color: theme.text }}
              >
                {cmd}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
