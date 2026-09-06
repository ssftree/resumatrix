import React from 'react';
import {
  Terminal,
  Code2,
  LayoutGrid,
  FileText,
  SlidersHorizontal,
  Monitor,
  Activity,
  GitBranch,
  Square,
} from 'lucide-react';
import { AppTemplate } from '../types';
import { SocialShareMenu, ShareContext } from './SocialShareMenu';

interface TemplateSwitcherProps {
  currentTemplate: AppTemplate;
  onSelectTemplate: (template: AppTemplate) => void;
  onOpenCustomizer?: () => void;
  getShareContext?: () => ShareContext;
}

export const TemplateSwitcher: React.FC<TemplateSwitcherProps> = ({
  currentTemplate,
  onSelectTemplate,
  onOpenCustomizer,
  getShareContext,
}) => {
  const templates: { id: AppTemplate; label: string; icon: React.ReactNode; badge: string }[] = [
    {
      id: 'terminal',
      label: 'Terminal',
      icon: <Terminal className="w-3.5 h-3.5" />,
      badge: 'CLI',
    },
    {
      id: 'retro',
      label: 'Retro OS',
      icon: <Monitor className="w-3.5 h-3.5" />,
      badge: 'Win95',
    },
    {
      id: 'telemetry',
      label: 'Telemetry',
      icon: <Activity className="w-3.5 h-3.5" />,
      badge: 'Grafana',
    },
    {
      id: 'devops',
      label: 'DevOps Control',
      icon: <GitBranch className="w-3.5 h-3.5" />,
      badge: 'CI/CD',
    },
    {
      id: 'brutalism',
      label: 'Brutalism',
      icon: <Square className="w-3.5 h-3.5" />,
      badge: 'Swiss',
    },
    {
      id: 'academic',
      label: 'LaTeX CV',
      icon: <FileText className="w-3.5 h-3.5" />,
      badge: 'Print',
    },
    {
      id: 'bento',
      label: 'Bento Grid',
      icon: <LayoutGrid className="w-3.5 h-3.5" />,
      badge: 'Modern',
    },
    {
      id: 'ide',
      label: 'Cloud IDE',
      icon: <Code2 className="w-3.5 h-3.5" />,
      badge: 'VS Code',
    },
  ];

  return (
    <nav
      aria-label="Portfolio layouts"
      className="flex items-center gap-1.5 bg-black/85 backdrop-blur-md p-1.5 rounded-xl border border-neutral-800 shadow-2xl text-xs select-none overflow-x-auto scrollbar-none"
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      <span className="text-[10px] text-neutral-500 font-mono px-1 hidden lg:inline-block uppercase tracking-wider shrink-0">
        Style:
      </span>
      <div className="flex items-center gap-1 shrink-0">
        {templates.map((tpl) => {
          const isActive = currentTemplate === tpl.id;
          return (
            <button
              key={tpl.id}
              id={`template-switch-${tpl.id}`}
              onClick={() => onSelectTemplate(tpl.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-mono whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60 border border-transparent'
              }`}
              title={`Switch to ${tpl.label} layout`}
            >
              {tpl.icon}
              <span className="font-medium">{tpl.label}</span>
              <span
                className={`text-[9px] px-1 rounded ${
                  isActive ? 'bg-emerald-500/30 text-emerald-300' : 'bg-neutral-800 text-neutral-500'
                }`}
              >
                {tpl.badge}
              </span>
            </button>
          );
        })}
      </div>

      {onOpenCustomizer && (
        <>
          <div className="w-[1px] h-4 bg-neutral-800 mx-0.5 shrink-0" />
          <button
            id="open-customizer-btn"
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 font-mono transition-all shrink-0 whitespace-nowrap"
            title="Customize personal data, import/export config"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="font-medium">Customize</span>
          </button>
        </>
      )}

      {getShareContext && (
        <>
          <div className="w-[1px] h-4 bg-neutral-800 mx-0.5 shrink-0" />
          <SocialShareMenu getShareContext={getShareContext} />
        </>
      )}
    </nav>
  );
};
