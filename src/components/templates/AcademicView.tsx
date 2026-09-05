import React from 'react';
import { Printer, Download, ArrowLeft, Terminal, LayoutGrid, Code2, Mail, Github, Globe } from 'lucide-react';
import { 
  ABOUT_DATA, 
  EXPERIENCE_DATA, 
  PROJECTS_DATA, 
  SKILLS_DATA, 
  CONTACT_DATA 
} from '../../data/portfolioData';
import { AppTemplate } from '../../types';

interface AcademicViewProps {
  onSwitchTemplate: (template: AppTemplate) => void;
}

export const AcademicView: React.FC<AcademicViewProps> = ({ onSwitchTemplate }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-900 py-8 px-4 sm:px-6 flex flex-col items-center">
      {/* Top action bar (hidden on print) */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-6 print:hidden text-xs font-mono">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSwitchTemplate('terminal')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-neutral-700 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>
          <button
            onClick={() => onSwitchTemplate('ide')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-blue-400 border border-neutral-700 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>IDE</span>
          </button>
          <button
            onClick={() => onSwitchTemplate('bento')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-purple-400 border border-neutral-700 transition-colors"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Bento</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-medium shadow-md transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Paper Sheet (Academic LaTeX Style) */}
      <div 
        id="academic-resume-sheet"
        className="w-full max-w-4xl bg-white text-neutral-900 p-8 sm:p-12 rounded-lg shadow-2xl font-serif text-[13px] leading-relaxed print:p-0 print:shadow-none print:rounded-none"
      >
        {/* Header */}
        <div className="text-center pb-4 border-b border-neutral-300">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-black font-sans uppercase">
            {ABOUT_DATA.name}
          </h1>
          <p className="text-sm font-sans text-neutral-700 mt-1 font-medium">
            {ABOUT_DATA.title} • {ABOUT_DATA.location}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-600 mt-2 font-sans">
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-neutral-500" /> {CONTACT_DATA.email}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-neutral-500" /> ssfu.dev
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Github className="w-3 h-3 text-neutral-500" /> {CONTACT_DATA.github}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-neutral-900 pb-0.5 mb-2 font-sans">
            Executive Summary
          </h2>
          <p className="text-neutral-800 leading-normal text-justify">
            {ABOUT_DATA.bio}
          </p>
        </div>

        {/* Technical Competencies */}
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-neutral-900 pb-0.5 mb-2 font-sans">
            Technical Competencies
          </h2>
          <div className="space-y-1.5">
            {SKILLS_DATA.map((group) => (
              <div key={group.title} className="flex flex-col sm:flex-row text-xs">
                <span className="font-bold sm:w-44 text-neutral-900 shrink-0 font-sans">
                  {group.title}:
                </span>
                <span className="text-neutral-800">
                  {group.skills.map((i) => i.name).join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Experience */}
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-neutral-900 pb-0.5 mb-3 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {EXPERIENCE_DATA.map((exp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                  <span className="font-bold text-neutral-900 font-sans text-sm">
                    {exp.role} — <span className="italic font-normal">{exp.company}</span>
                  </span>
                  <span className="text-xs text-neutral-600 font-sans italic">
                    {exp.period}
                  </span>
                </div>
                <ul className="list-disc list-outside pl-4 text-neutral-800 space-y-1 text-xs">
                  {exp.achievements.map((item, hIdx) => (
                    <li key={hIdx}>{item}</li>
                  ))}
                </ul>
                <div className="text-[11px] text-neutral-600 font-sans pt-0.5">
                  <span className="font-semibold text-neutral-700">Technologies: </span>
                  {exp.skills.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Systems & Open Source Projects */}
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-neutral-900 pb-0.5 mb-3 font-sans">
            Key Systems & Architecture Projects
          </h2>
          <div className="space-y-3">
            {PROJECTS_DATA.slice(0, 3).map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-bold text-neutral-900 font-sans text-xs">
                    {proj.title} — <span className="font-normal italic text-neutral-600">{proj.category}</span>
                  </span>
                  {proj.githubUrl && (
                    <span className="text-[11px] font-mono text-neutral-500">{proj.githubUrl}</span>
                  )}
                </div>
                <p className="text-xs text-neutral-800">{proj.description}</p>
                <div className="text-[11px] text-neutral-600 font-sans">
                  <span className="font-semibold text-neutral-700">Stack: </span>
                  {proj.tags.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Credentials */}
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-neutral-900 pb-0.5 mb-2 font-sans">
            Education & Certifications
          </h2>
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-bold text-neutral-900 font-sans">
              B.S. in Computer Science & Information Engineering
            </span>
            <span className="text-neutral-600 italic font-sans">Honors Graduate</span>
          </div>
          <div className="text-[11px] text-neutral-700 font-sans mt-0.5">
            Certified Kubernetes Administrator (CKA) • Google Cloud Certified Professional Cloud Architect
          </div>
        </div>
      </div>
    </div>
  );
};
