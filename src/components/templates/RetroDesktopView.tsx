import React, { useState, useEffect, useRef } from 'react';
import { 
  Folder, 
  FileText, 
  Terminal, 
  SlidersHorizontal, 
  X, 
  Minus, 
  Square, 
  ExternalLink, 
  Github, 
  Play, 
  RotateCcw, 
  Volume2, 
  Check, 
  Copy, 
  Mail, 
  Maximize2,
  Minimize2,
  HardDrive,
  Cpu,
  Monitor,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import { AppTemplate, PortfolioConfig } from '../../types';
import { DEFAULT_PORTFOLIO_CONFIG } from '../../portfolio.config';

interface RetroDesktopViewProps {
  config?: PortfolioConfig;
  onSwitchTemplate: (tpl: AppTemplate) => void;
  onOpenResumeModal?: () => void;
}

interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  type: 'computer' | 'projects' | 'skills' | 'resume' | 'minesweeper' | 'notepad';
}

export const RetroDesktopView: React.FC<RetroDesktopViewProps> = ({
  config = DEFAULT_PORTFOLIO_CONFIG,
  onSwitchTemplate,
  onOpenResumeModal,
}) => {
  const profile = config.profile || DEFAULT_PORTFOLIO_CONFIG.profile;
  const contact = config.contact || DEFAULT_PORTFOLIO_CONFIG.contact;
  const skills = config.skills || DEFAULT_PORTFOLIO_CONFIG.skills;
  const experience = config.experience || DEFAULT_PORTFOLIO_CONFIG.experience;
  const projects = config.projects || DEFAULT_PORTFOLIO_CONFIG.projects;
  const system = config.system || DEFAULT_PORTFOLIO_CONFIG.system;

  const [currentTime, setCurrentTime] = useState<string>('');
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [activeWindowId, setActiveWindowId] = useState<string>('computer');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>(projects[0]?.id || '');
  const [notepadText, setNotepadText] = useState<string>(
    `README.TXT - ${profile.name.toUpperCase()} SYSTEM PROFILE\n\n` +
    `Role: ${profile.title}\n` +
    `Location: ${profile.location}\n` +
    `Status: ${profile.status}\n\n` +
    `Bio:\n${profile.bio}\n\n` +
    `========================================\n` +
    `Type or edit freely in this scratchpad!\n` +
    `========================================\n`
  );

  // Dragging state
  const [draggedWindow, setDraggedWindow] = useState<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const highestZRef = useRef<number>(10);

  // Minesweeper state
  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;
  type Cell = { r: number; c: number; isMine: boolean; revealed: boolean; flagged: boolean; neighborCount: number };
  const [mineGrid, setMineGrid] = useState<Cell[][]>([]);
  const [mineStatus, setMineStatus] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
  const [mineFlagsLeft, setMineFlagsLeft] = useState<number>(MINES);
  const [mineTimer, setMineTimer] = useState<number>(0);

  // Initialize Minesweeper
  const initMinesweeper = () => {
    // Generate empty board
    const board: Cell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: Cell[] = [];
      for (let c = 0; c < COLS; c++) {
        row.push({ r, c, isMine: false, revealed: false, flagged: false, neighborCount: 0 });
      }
      board.push(row);
    }
    // Place mines randomly
    let placed = 0;
    while (placed < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!board[r][c].isMine) {
        board[r][c].isMine = true;
        placed++;
      }
    }
    // Calculate neighbor counts
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!board[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) {
                count++;
              }
            }
          }
          board[r][c].neighborCount = count;
        }
      }
    }
    setMineGrid(board);
    setMineStatus('idle');
    setMineFlagsLeft(MINES);
    setMineTimer(0);
  };

  useEffect(() => {
    initMinesweeper();
  }, []);

  // Minesweeper timer
  useEffect(() => {
    let interval: any;
    if (mineStatus === 'playing') {
      interval = setInterval(() => {
        setMineTimer((t) => Math.min(999, t + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mineStatus]);

  const revealCell = (r: number, c: number) => {
    if (mineStatus === 'lost' || mineStatus === 'won') return;
    const cell = mineGrid[r][c];
    if (cell.flagged || cell.revealed) return;

    if (mineStatus === 'idle') {
      setMineStatus('playing');
    }

    const newGrid = mineGrid.map((row) => row.map((item) => ({ ...item })));

    if (cell.isMine) {
      // Reveal all mines
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (newGrid[row][col].isMine) {
            newGrid[row][col].revealed = true;
          }
        }
      }
      setMineGrid(newGrid);
      setMineStatus('lost');
      return;
    }

    // Flood fill reveal
    const queue: [number, number][] = [[r, c]];
    newGrid[r][c].revealed = true;

    while (queue.length > 0) {
      const [currR, currC] = queue.shift()!;
      if (newGrid[currR][currC].neighborCount === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = currR + dr;
            const nc = currC + dc;
            if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
              const neighbor = newGrid[nr][nc];
              if (!neighbor.revealed && !neighbor.flagged && !neighbor.isMine) {
                neighbor.revealed = true;
                if (neighbor.neighborCount === 0) {
                  queue.push([nr, nc]);
                }
              }
            }
          }
        }
      }
    }

    // Check win condition
    let unrevealedSafe = 0;
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!newGrid[row][col].isMine && !newGrid[row][col].revealed) {
          unrevealedSafe++;
        }
      }
    }

    setMineGrid(newGrid);
    if (unrevealedSafe === 0) {
      setMineStatus('won');
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (mineStatus === 'lost' || mineStatus === 'won') return;
    const cell = mineGrid[r][c];
    if (cell.revealed) return;

    const newGrid = mineGrid.map((row) => row.map((item) => ({ ...item })));
    const target = newGrid[r][c];
    if (target.flagged) {
      target.flagged = false;
      setMineFlagsLeft((prev) => prev + 1);
    } else {
      if (mineFlagsLeft > 0) {
        target.flagged = true;
        setMineFlagsLeft((prev) => prev - 1);
      }
    }
    setMineGrid(newGrid);
  };

  // Window list
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'computer',
      title: 'My Computer - Profile',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      x: 60,
      y: 40,
      width: 580,
      height: 440,
      zIndex: 1,
      type: 'computer',
    },
    {
      id: 'projects',
      title: 'C:\\Projects\\Explorer',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 120,
      y: 70,
      width: 640,
      height: 480,
      zIndex: 2,
      type: 'projects',
    },
    {
      id: 'skills',
      title: 'System Settings - Skills.dll',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 160,
      y: 90,
      width: 560,
      height: 420,
      zIndex: 3,
      type: 'skills',
    },
    {
      id: 'resume',
      title: 'WordPad - Curriculum Vitae.doc',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 100,
      y: 50,
      width: 620,
      height: 500,
      zIndex: 4,
      type: 'resume',
    },
    {
      id: 'minesweeper',
      title: 'Minesweeper.exe',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 220,
      y: 110,
      width: 320,
      height: 410,
      zIndex: 5,
      type: 'minesweeper',
    },
    {
      id: 'notepad',
      title: 'Notepad - Readme.txt',
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      x: 200,
      y: 80,
      width: 480,
      height: 380,
      zIndex: 6,
      type: 'notepad',
    },
  ]);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const bringToFront = (id: string) => {
    highestZRef.current += 1;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: highestZRef.current, isMinimized: false } : w))
    );
    setActiveWindowId(id);
  };

  const openWindow = (id: string) => {
    highestZRef.current += 1;
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: highestZRef.current } : w
      )
    );
    setActiveWindowId(id);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, isOpen: false } : w)));
  };

  const toggleMinimize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextMin = !w.isMinimized;
          return { ...w, isMinimized: nextMin };
        }
        return w;
      })
    );
  };

  const toggleMaximize = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  // Window drag handlers
  const handleMouseDown = (e: React.MouseEvent, win: WindowState) => {
    if (win.isMaximized) return;
    bringToFront(win.id);
    setDraggedWindow({
      id: win.id,
      startX: e.clientX,
      startY: e.clientY,
      origX: win.x,
      origY: win.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedWindow) return;
      const dx = e.clientX - draggedWindow.startX;
      const dy = e.clientY - draggedWindow.startY;
      setWindows((prev) =>
        prev.map((w) =>
          w.id === draggedWindow.id
            ? {
                ...w,
                x: Math.max(0, draggedWindow.origX + dx),
                y: Math.max(0, draggedWindow.origY + dy),
              }
            : w
        )
      );
    };

    const handleMouseUp = () => {
      setDraggedWindow(null);
    };

    if (draggedWindow) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedWindow]);

  const activeProjectData = projects.find((p) => p.id === selectedProject) || projects[0];

  return (
    <div 
      className="relative w-full h-screen overflow-hidden select-none font-sans"
      style={{
        backgroundColor: '#008080',
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
      onClick={() => {
        if (startMenuOpen) setStartMenuOpen(false);
      }}
    >
      {/* Desktop Top Banner Info */}
      <div className="absolute top-2 right-3 z-0 text-right opacity-40 text-white font-mono text-xs pointer-events-none hidden md:block">
        <p className="font-bold">RetroOS 95 Professional</p>
        <p>Memory: 640K OK • Mode: Standard VGA</p>
      </div>

      {/* Desktop Icons Grid */}
      <div className="absolute top-4 left-4 z-0 grid grid-flow-row auto-rows-max gap-6 w-24">
        {/* My Computer */}
        <div
          onDoubleClick={() => openWindow('computer')}
          onClick={() => bringToFront('computer')}
          className="flex flex-col items-center gap-1 group cursor-pointer p-1 rounded hover:bg-blue-900/30 text-white text-center"
        >
          <div className="w-10 h-10 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 flex items-center justify-center shadow-md">
            <Monitor className="w-6 h-6 text-blue-900" />
          </div>
          <span className="text-[11px] leading-tight px-1 py-0.5 bg-transparent group-hover:bg-[#000080] rounded text-white drop-shadow font-medium">
            My Computer
          </span>
        </div>

        {/* Projects Explorer */}
        <div
          onDoubleClick={() => openWindow('projects')}
          onClick={() => bringToFront('projects')}
          className="flex flex-col items-center gap-1 group cursor-pointer p-1 rounded hover:bg-blue-900/30 text-white text-center"
        >
          <div className="w-10 h-10 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 flex items-center justify-center shadow-md">
            <Folder className="w-6 h-6 text-amber-700 fill-amber-500" />
          </div>
          <span className="text-[11px] leading-tight px-1 py-0.5 bg-transparent group-hover:bg-[#000080] rounded text-white drop-shadow font-medium">
            Projects
          </span>
        </div>

        {/* Skills.dll */}
        <div
          onDoubleClick={() => openWindow('skills')}
          onClick={() => bringToFront('skills')}
          className="flex flex-col items-center gap-1 group cursor-pointer p-1 rounded hover:bg-blue-900/30 text-white text-center"
        >
          <div className="w-10 h-10 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 flex items-center justify-center shadow-md">
            <Cpu className="w-6 h-6 text-emerald-800" />
          </div>
          <span className="text-[11px] leading-tight px-1 py-0.5 bg-transparent group-hover:bg-[#000080] rounded text-white drop-shadow font-medium">
            Skills.sys
          </span>
        </div>

        {/* Resume.doc */}
        <div
          onDoubleClick={() => openWindow('resume')}
          onClick={() => bringToFront('resume')}
          className="flex flex-col items-center gap-1 group cursor-pointer p-1 rounded hover:bg-blue-900/30 text-white text-center"
        >
          <div className="w-10 h-10 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 flex items-center justify-center shadow-md">
            <FileText className="w-6 h-6 text-blue-700" />
          </div>
          <span className="text-[11px] leading-tight px-1 py-0.5 bg-transparent group-hover:bg-[#000080] rounded text-white drop-shadow font-medium">
            Resume.doc
          </span>
        </div>

        {/* Minesweeper */}
        <div
          onDoubleClick={() => openWindow('minesweeper')}
          onClick={() => bringToFront('minesweeper')}
          className="flex flex-col items-center gap-1 group cursor-pointer p-1 rounded hover:bg-blue-900/30 text-white text-center"
        >
          <div className="w-10 h-10 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 flex items-center justify-center shadow-md">
            <Flame className="w-6 h-6 text-red-600" />
          </div>
          <span className="text-[11px] leading-tight px-1 py-0.5 bg-transparent group-hover:bg-[#000080] rounded text-white drop-shadow font-medium">
            Minesweeper
          </span>
        </div>

        {/* Notepad */}
        <div
          onDoubleClick={() => openWindow('notepad')}
          onClick={() => bringToFront('notepad')}
          className="flex flex-col items-center gap-1 group cursor-pointer p-1 rounded hover:bg-blue-900/30 text-white text-center"
        >
          <div className="w-10 h-10 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-gray-800 border-b-gray-800 flex items-center justify-center shadow-md">
            <FileText className="w-6 h-6 text-neutral-700" />
          </div>
          <span className="text-[11px] leading-tight px-1 py-0.5 bg-transparent group-hover:bg-[#000080] rounded text-white drop-shadow font-medium">
            Notepad.exe
          </span>
        </div>

        {/* Terminal shortcut */}
        <div
          onClick={() => onSwitchTemplate('terminal')}
          className="flex flex-col items-center gap-1 group cursor-pointer p-1 rounded hover:bg-blue-900/30 text-white text-center"
        >
          <div className="w-10 h-10 bg-black border-2 border-t-gray-500 border-l-gray-500 border-r-gray-900 border-b-gray-900 flex items-center justify-center shadow-md">
            <Terminal className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[11px] leading-tight px-1 py-0.5 bg-transparent group-hover:bg-[#000080] rounded text-white drop-shadow font-medium">
            MS-DOS Prompt
          </span>
        </div>
      </div>

      {/* Windows Layer */}
      {windows.map((win) => {
        if (!win.isOpen || win.isMinimized) return null;
        const isActive = activeWindowId === win.id;

        const style: React.CSSProperties = win.isMaximized
          ? {
              top: 0,
              left: 0,
              width: '100%',
              height: 'calc(100% - 40px)',
              zIndex: win.zIndex,
            }
          : {
              top: win.y,
              left: win.x,
              width: Math.min(win.width, window.innerWidth - 20),
              height: Math.min(win.height, window.innerHeight - 80),
              zIndex: win.zIndex,
            };

        return (
          <div
            key={win.id}
            onClick={() => bringToFront(win.id)}
            style={style}
            className="absolute flex flex-col bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black shadow-[3px_3px_10px_rgba(0,0,0,0.5)] select-auto"
          >
            {/* Window Header Title Bar */}
            <div
              onMouseDown={(e) => handleMouseDown(e, win)}
              className={`h-7 px-1.5 flex items-center justify-between text-xs font-bold cursor-move select-none ${
                isActive
                  ? 'bg-gradient-to-r from-[#000080] to-[#1084d0] text-white'
                  : 'bg-[#808080] text-[#c0c0c0]'
              }`}
            >
              <div className="flex items-center gap-1.5 truncate">
                {win.type === 'computer' && <Monitor className="w-3.5 h-3.5 shrink-0" />}
                {win.type === 'projects' && <Folder className="w-3.5 h-3.5 shrink-0 text-amber-300" />}
                {win.type === 'skills' && <Cpu className="w-3.5 h-3.5 shrink-0" />}
                {win.type === 'resume' && <FileText className="w-3.5 h-3.5 shrink-0" />}
                {win.type === 'minesweeper' && <Flame className="w-3.5 h-3.5 shrink-0 text-red-400" />}
                {win.type === 'notepad' && <FileText className="w-3.5 h-3.5 shrink-0" />}
                <span className="truncate">{win.title}</span>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1 shrink-0 ml-2" onMouseDown={(e) => e.stopPropagation()}>
                <button
                  onClick={() => toggleMinimize(win.id)}
                  className="w-4 h-4 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-black border-b-black flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                  title="Minimize"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <button
                  onClick={() => toggleMaximize(win.id)}
                  className="w-4 h-4 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-black border-b-black flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                  title="Maximize"
                >
                  {win.isMaximized ? <Minimize2 className="w-2.5 h-2.5" /> : <Square className="w-2.5 h-2.5" />}
                </button>
                <button
                  onClick={() => closeWindow(win.id)}
                  className="w-4 h-4 bg-[#c0c0c0] text-black border border-t-white border-l-white border-r-black border-b-black flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white font-bold"
                  title="Close"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Menu Bar for classic feel */}
            <div className="h-6 bg-[#c0c0c0] border-b border-[#808080] flex items-center gap-3 px-2 text-xs text-black select-none">
              <span className="hover:bg-[#000080] hover:text-white px-1.5 cursor-pointer">File</span>
              <span className="hover:bg-[#000080] hover:text-white px-1.5 cursor-pointer">Edit</span>
              <span className="hover:bg-[#000080] hover:text-white px-1.5 cursor-pointer">View</span>
              <span className="hover:bg-[#000080] hover:text-white px-1.5 cursor-pointer">Help</span>
            </div>

            {/* Window Body */}
            <div className="flex-1 overflow-auto bg-[#c0c0c0] p-2 text-black">
              {/* MY COMPUTER CONTENT */}
              {win.type === 'computer' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-16 h-16 bg-blue-900 text-white font-bold text-xl flex items-center justify-center border-2 border-black shadow">
                      {profile.avatarInitials || profile.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                      <h2 className="text-base font-bold">{profile.name}</h2>
                      <p className="text-neutral-700 font-medium">{profile.title}</p>
                      <p className="text-neutral-500 font-mono text-[11px]">{profile.location} • Status: {profile.status}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white space-y-2">
                    <h3 className="font-bold border-b pb-1 text-blue-900">System Specifications & Overview</h3>
                    <p className="leading-relaxed text-neutral-800">{profile.bio}</p>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1 text-neutral-700">
                      <div><strong>OS:</strong> {system.os || 'RetroOS 95'}</div>
                      <div><strong>CPU:</strong> {system.cpu || 'Intel Pentium 133MHz'}</div>
                      <div><strong>RAM:</strong> {system.memory || '64MB EDO RAM'}</div>
                      <div><strong>Shell:</strong> {system.shell || 'COMMAND.COM'}</div>
                    </div>
                  </div>

                  <div className="p-3 bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-900" />
                      <span className="font-mono">{contact.email}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(contact.email);
                          setCopiedEmail(true);
                          setTimeout(() => setCopiedEmail(false), 2000);
                        }}
                        className="px-2 py-1 bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black text-xs font-bold active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                      >
                        {copiedEmail ? 'Copied!' : 'Copy'}
                      </button>
                      <a
                        href={`mailto:${contact.email}`}
                        className="px-2 py-1 bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black text-xs font-bold active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                      >
                        Send Mail
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* PROJECTS EXPLORER CONTENT */}
              {win.type === 'projects' && (
                <div className="h-full flex flex-col sm:flex-row gap-2 text-xs">
                  {/* Left folder tree */}
                  <div className="w-full sm:w-48 bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-1 overflow-auto max-h-48 sm:max-h-none">
                    <div className="font-bold px-1.5 py-1 text-blue-900 flex items-center gap-1 border-b">
                      <HardDrive className="w-3.5 h-3.5" /> (C:) Projects
                    </div>
                    <div className="py-1 space-y-0.5">
                      {projects.map((p) => {
                        const isSelected = p.id === activeProjectData?.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() => setSelectedProject(p.id)}
                            className={`flex items-center gap-1.5 px-1.5 py-1 cursor-pointer truncate ${
                              isSelected ? 'bg-[#000080] text-white font-bold' : 'hover:bg-blue-100 text-black'
                            }`}
                          >
                            <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-amber-600'}`} />
                            <span className="truncate">{p.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right project file details */}
                  <div className="flex-1 bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-3 overflow-auto space-y-3">
                    {activeProjectData && (
                      <>
                        <div className="border-b pb-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-blue-900">{activeProjectData.title}</h3>
                            <span className="font-mono text-[10px] bg-neutral-100 px-1 border border-neutral-300">
                              {activeProjectData.year}
                            </span>
                          </div>
                          <p className="text-neutral-600 italic mt-0.5">{activeProjectData.tagline}</p>
                        </div>

                        <p className="leading-relaxed text-neutral-800">{activeProjectData.description}</p>

                        <div>
                          <div className="font-bold text-[11px] text-neutral-700 mb-1">KEY HIGHLIGHTS:</div>
                          <ul className="list-disc pl-4 space-y-1 text-neutral-700">
                            {activeProjectData.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="font-bold text-[11px] text-neutral-700 mb-1">TECH ARCHITECTURE:</div>
                          <div className="flex flex-wrap gap-1">
                            {activeProjectData.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black text-[10px] font-mono"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t">
                          {activeProjectData.demoUrl && (
                            <a
                              href={activeProjectData.demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black font-bold text-xs flex items-center gap-1 active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                            >
                              <ExternalLink className="w-3 h-3" /> Run Demo
                            </a>
                          )}
                          {activeProjectData.githubUrl && (
                            <a
                              href={activeProjectData.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black font-bold text-xs flex items-center gap-1 active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                            >
                              <Github className="w-3 h-3" /> View Source
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* SKILLS.SYS CONTENT */}
              {win.type === 'skills' && (
                <div className="space-y-3 bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-3 text-xs overflow-auto h-full">
                  <div className="font-bold text-blue-900 border-b pb-1">INSTALLED HARDWARE & SOFTWARE CAPABILITIES</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {skills.map((category, idx) => (
                      <div key={idx} className="border p-2 bg-neutral-50 space-y-1.5">
                        <div className="font-bold text-neutral-800 flex items-center justify-between border-b pb-1">
                          <span>{category.title}</span>
                          <span className="font-mono text-[10px] text-neutral-500">{category.skills.length} modules</span>
                        </div>
                        <div className="space-y-1">
                          {category.skills.map((skill, sIdx) => (
                            <div key={sIdx} className="space-y-0.5">
                              <div className="flex justify-between text-[11px]">
                                <span>{skill.name}</span>
                                <span className="font-mono font-bold text-blue-900">{skill.level}%</span>
                              </div>
                              <div className="w-full h-2.5 bg-neutral-200 border border-t-[#808080] border-l-[#808080] border-r-white border-b-white overflow-hidden">
                                <div
                                  className="h-full bg-[#000080]"
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RESUME.DOC CONTENT */}
              {win.type === 'resume' && (
                <div className="bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-4 text-xs font-serif overflow-auto h-full space-y-4">
                  <div className="border-b pb-3 text-center space-y-1 font-sans">
                    <h1 className="text-xl font-bold tracking-wide">{profile.name}</h1>
                    <p className="font-medium text-neutral-600">{profile.title}</p>
                    <p className="text-[11px] text-neutral-500 font-mono">{contact.email} • {contact.location}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-bold font-sans text-xs uppercase tracking-wider text-blue-900 border-b pb-0.5">
                      Professional Experience
                    </h3>
                    <div className="space-y-4">
                      {experience.map((exp, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-baseline font-sans font-bold text-[12px]">
                            <span>{exp.role} — {exp.company}</span>
                            <span className="font-mono text-[10px] font-normal text-neutral-600">{exp.period}</span>
                          </div>
                          <p className="text-neutral-700 italic">{exp.description}</p>
                          <ul className="list-disc pl-4 space-y-0.5 text-neutral-800">
                            {exp.achievements.map((ach, aIdx) => (
                              <li key={aIdx}>{ach}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {onOpenResumeModal && (
                    <div className="pt-2 border-t font-sans flex justify-end">
                      <button
                        onClick={onOpenResumeModal}
                        className="px-3 py-1 bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black font-bold text-xs active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                      >
                        Print Full Formal CV...
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MINESWEEPER.EXE CONTENT */}
              {win.type === 'minesweeper' && (
                <div className="flex flex-col items-center justify-center p-2 bg-[#c0c0c0] h-full select-none">
                  <div className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-2 bg-[#c0c0c0] space-y-2">
                    {/* Top scoreboard */}
                    <div className="flex items-center justify-between bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-1.5">
                      <div className="bg-black text-red-600 font-mono text-lg font-bold px-2 py-0.5 tracking-widest border border-neutral-700">
                        {String(Math.max(0, mineFlagsLeft)).padStart(3, '0')}
                      </div>
                      
                      <button
                        onClick={initMinesweeper}
                        className="w-7 h-7 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black text-base flex items-center justify-center active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
                      >
                        {mineStatus === 'lost' ? '😵' : mineStatus === 'won' ? '😎' : '🙂'}
                      </button>

                      <div className="bg-black text-red-600 font-mono text-lg font-bold px-2 py-0.5 tracking-widest border border-neutral-700">
                        {String(mineTimer).padStart(3, '0')}
                      </div>
                    </div>

                    {/* Minefield */}
                    <div className="border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#808080] p-1">
                      <div 
                        className="grid gap-[1px]"
                        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
                      >
                        {mineGrid.map((row, r) =>
                          row.map((cell, c) => {
                            if (cell.revealed) {
                              return (
                                <div
                                  key={`${r}-${c}`}
                                  className="w-6 h-6 bg-[#c0c0c0] border border-[#808080] flex items-center justify-center font-bold text-xs font-mono"
                                >
                                  {cell.isMine ? (
                                    '💣'
                                  ) : cell.neighborCount > 0 ? (
                                    <span
                                      style={{
                                        color:
                                          cell.neighborCount === 1 ? '#0000ff' :
                                          cell.neighborCount === 2 ? '#008000' :
                                          cell.neighborCount === 3 ? '#ff0000' :
                                          cell.neighborCount === 4 ? '#000080' : '#800000'
                                      }}
                                    >
                                      {cell.neighborCount}
                                    </span>
                                  ) : null}
                                </div>
                              );
                            }

                            return (
                              <button
                                key={`${r}-${c}`}
                                onClick={() => revealCell(r, c)}
                                onContextMenu={(e) => toggleFlag(e, r, c)}
                                className="w-6 h-6 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] flex items-center justify-center text-xs font-bold active:border-none"
                              >
                                {cell.flagged ? '🚩' : ''}
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {mineStatus === 'lost' && (
                      <div className="text-center font-bold text-red-700 text-xs">Game Over! Click 🙂 to try again.</div>
                    )}
                    {mineStatus === 'won' && (
                      <div className="text-center font-bold text-emerald-800 text-xs">🎉 Victory! Code clean, no bugs!</div>
                    )}
                  </div>
                </div>
              )}

              {/* NOTEPAD.EXE CONTENT */}
              {win.type === 'notepad' && (
                <div className="h-full bg-white border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white p-1">
                  <textarea
                    value={notepadText}
                    onChange={(e) => setNotepadText(e.target.value)}
                    className="w-full h-full p-2 font-mono text-xs text-black border-none outline-none resize-none bg-transparent"
                    spellCheck={false}
                  />
                </div>
              )}
            </div>

            {/* Window Status Bar */}
            <div className="h-5 bg-[#c0c0c0] border-t border-t-white flex items-center justify-between px-2 text-[10px] text-neutral-700 select-none">
              <span>Ready</span>
              <span className="font-mono">100% OK</span>
            </div>
          </div>
        );
      })}

      {/* Retro Start Menu (Pop-up) */}
      {startMenuOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-10 left-1 z-50 w-64 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-black border-b-black shadow-[4px_4px_10px_rgba(0,0,0,0.6)] flex flex-row"
        >
          {/* Side vertical brand banner */}
          <div className="w-8 bg-gradient-to-t from-[#000080] to-[#1084d0] flex items-end justify-center py-3">
            <span className="text-white font-bold tracking-widest text-xs rotate-[-90deg] whitespace-nowrap drop-shadow">
              RetroOS 95
            </span>
          </div>

          {/* Menu items */}
          <div className="flex-1 py-1 text-xs">
            <div
              onClick={() => {
                openWindow('computer');
                setStartMenuOpen(false);
              }}
              className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
            >
              <Monitor className="w-4 h-4 text-blue-900" />
              <span>About Developer</span>
            </div>

            <div
              onClick={() => {
                openWindow('projects');
                setStartMenuOpen(false);
              }}
              className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
            >
              <Folder className="w-4 h-4 text-amber-600" />
              <span>Projects Folder</span>
            </div>

            <div
              onClick={() => {
                openWindow('skills');
                setStartMenuOpen(false);
              }}
              className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-emerald-800" />
              <span>Skills Matrix</span>
            </div>

            <div
              onClick={() => {
                openWindow('resume');
                setStartMenuOpen(false);
              }}
              className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-700" />
              <span>Resume.doc</span>
            </div>

            <div
              onClick={() => {
                openWindow('minesweeper');
                setStartMenuOpen(false);
              }}
              className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
            >
              <Flame className="w-4 h-4 text-red-600" />
              <span>Play Minesweeper</span>
            </div>

            <div className="my-1 border-t border-[#808080] border-b border-b-white" />

            <div className="px-3 py-1 text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
              Switch Presentation
            </div>

            <div
              onClick={() => onSwitchTemplate('terminal')}
              className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>Terminal CLI</span>
            </div>

            <div
              onClick={() => onSwitchTemplate('telemetry')}
              className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
            >
              <HardDrive className="w-4 h-4 text-amber-500" />
              <span>Telemetry Dashboard</span>
            </div>

            <div
              onClick={() => onSwitchTemplate('brutalism')}
              className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
            >
              <Square className="w-4 h-4 text-black" />
              <span>Swiss Brutalism</span>
            </div>

            <div className="my-1 border-t border-[#808080] border-b border-b-white" />

            <div
              onClick={() => {
                alert(`Shutting down ${profile.name}'s RetroOS... Just kidding! Thanks for visiting.`);
                setStartMenuOpen(false);
              }}
              className="px-3 py-1.5 flex items-center gap-2 hover:bg-[#000080] hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-red-600" />
              <span>Shut Down...</span>
            </div>
          </div>
        </div>
      )}

      {/* Classic Bottom Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#c0c0c0] border-t-2 border-white flex items-center justify-between px-1.5 z-40 shadow-lg">
        {/* Left Start Button & Open Windows */}
        <div className="flex items-center gap-1.5 flex-1 overflow-x-auto py-0.5">
          {/* Start Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setStartMenuOpen((v) => !v);
            }}
            className={`h-7 px-2.5 bg-[#c0c0c0] border-2 font-bold text-xs flex items-center gap-1.5 shadow-sm active:border-t-black active:border-l-black active:border-r-white active:border-b-white ${
              startMenuOpen
                ? 'border-t-black border-l-black border-r-white border-b-white bg-neutral-300'
                : 'border-t-white border-l-white border-r-black border-b-black'
            }`}
          >
            <div className="w-3.5 h-3.5 bg-gradient-to-br from-red-500 via-amber-400 to-blue-500 rounded-sm" />
            <span className="font-extrabold tracking-wide text-black">Start</span>
          </button>

          <div className="w-[1px] h-5 bg-[#808080] border-r border-white mx-1 shrink-0" />

          {/* Running Tasks / Window Buttons */}
          {windows
            .filter((w) => w.isOpen)
            .map((w) => {
              const isFocused = activeWindowId === w.id && !w.isMinimized;
              return (
                <button
                  key={w.id}
                  onClick={() => {
                    if (w.isMinimized) {
                      bringToFront(w.id);
                    } else if (activeWindowId === w.id) {
                      toggleMinimize(w.id);
                    } else {
                      bringToFront(w.id);
                    }
                  }}
                  className={`h-7 max-w-[150px] px-2 text-xs truncate flex items-center gap-1.5 border-2 shrink-0 ${
                    isFocused
                      ? 'border-t-black border-l-black border-r-white border-b-white bg-neutral-200 font-bold'
                      : 'border-t-white border-l-white border-r-black border-b-black bg-[#c0c0c0]'
                  }`}
                >
                  <span className="truncate">{w.title}</span>
                </button>
              );
            })}
        </div>

        {/* Right System Tray */}
        <div className="flex items-center gap-2 border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white px-2 py-1 bg-[#c0c0c0] shrink-0 text-xs text-black">
          <Volume2 className="w-3.5 h-3.5 text-neutral-700" />
          <span className="font-mono font-medium">{currentTime || '12:00 PM'}</span>
        </div>
      </div>
    </div>
  );
};
