import React from 'react';
import { Terminal, Code2, LayoutGrid, FileText } from 'lucide-react';
import { AppTemplate } from '../types';

interface TemplateSwitcherProps {
  currentTemplate: AppTemplate;
  onSelectTemplate: (template: AppTemplate) => void;
}

export const TemplateSwitcher: React.FC<TemplateSwitcherProps> = ({
  currentTemplate,
  onSelectTemplate,
}) => {
  const templates: { id: AppTemplate; label: string; icon: React.ReactNode; badge: string }[] = [
    {
      id: 'terminal',
      label: 'Terminal',
      icon: <Terminal className="w-3.5 h-3.5" />,
      badge: 'CLI',
    },
    {
      id: 'ide',
      label: 'Cloud IDE',
      icon: <Code2 className="w-3.5 h-3.5" />,
      badge: 'VS Code',
    },
    {
      id: 'bento',
      label: 'Bento Grid',
      icon: <LayoutGrid className="w-3.5 h-3.5" />,
      badge: 'Modern',
    },
    {
      id: 'academic',
      label: 'LaTeX CV',
      icon: <FileText className="w-3.5 h-3.5" />,
      badge: 'Print',
    },
  ];

  return (
    <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-neutral-800 shadow-xl text-xs select-none">
      <span className="text-[10px] text-neutral-500 font-mono px-2 hidden sm:inline-block uppercase tracking-wider">
        Style:
      </span>
      {templates.map((tpl) => {
        const isActive = currentTemplate === tpl.id;
        return (
          <button
            key={tpl.id}
            id={`template-switch-${tpl.id}`}
            onClick={() => onSelectTemplate(tpl.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all font-mono ${
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
  );
};
