import React from 'react';
import { X, Printer, Download, Mail, ExternalLink, MapPin, Briefcase, GraduationCap, Code } from 'lucide-react';
import { CONTACT_DATA, EXPERIENCE_DATA, PROJECTS_DATA, SKILLS_DATA } from '../data/portfolioData';
import { ThemeConfig } from '../types';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
          color: theme.text,
        }}
      >
        {/* Header Toolbar */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: theme.border }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="font-bold text-sm sm:text-base">Curriculum Vitae — ssfu.dev</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded text-xs border border-white/20 hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resume Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 text-xs sm:text-sm font-sans">
          {/* Header Info */}
          <div className="border-b pb-6 space-y-2" style={{ borderColor: theme.border }}>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: theme.accent }}>
                Frank (ssfu)
              </h1>
              <span className="text-xs font-mono opacity-80 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {CONTACT_DATA.location}
              </span>
            </div>
            <p className="text-sm font-medium opacity-90">
              Senior Full-Stack Engineer & Systems Enthusiast
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono pt-1 opacity-80">
              <a href={`mailto:${CONTACT_DATA.email}`} className="hover:underline flex items-center gap-1">
                <Mail className="w-3 h-3" /> {CONTACT_DATA.email}
              </a>
              <a href={CONTACT_DATA.github} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                GitHub: ssfu-dev
              </a>
              <a href={CONTACT_DATA.blog} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">
                Portfolio: ssfu.dev
              </a>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono opacity-70" style={{ color: theme.accent }}>
              Professional Summary
            </h3>
            <p className="leading-relaxed opacity-90 text-sm">
              Full-Stack Software Engineer with 6+ years of engineering experience across high-performance
              web architecture, distributed Node.js/Go backend infrastructure, and low-latency systems in Rust.
              Track record of building developer tooling, GPU-accelerated interfaces, and mission-critical cloud pipelines.
            </p>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono opacity-70 flex items-center gap-1.5" style={{ color: theme.accent }}>
              <Briefcase className="w-3.5 h-3.5" /> Work Experience
            </h3>
            <div className="space-y-5">
              {EXPERIENCE_DATA.map((exp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <span className="font-bold text-sm">{exp.role}</span>
                    <span className="font-mono text-xs opacity-70">{exp.period}</span>
                  </div>
                  <div className="text-xs font-medium opacity-80" style={{ color: theme.accent }}>
                    {exp.company} • {exp.location}
                  </div>
                  <p className="text-xs opacity-85 leading-relaxed">{exp.description}</p>
                  <ul className="list-disc list-inside text-xs opacity-80 space-y-1 pl-1">
                    {exp.achievements.map((ach, aIdx) => (
                      <li key={aIdx}>{ach}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono opacity-70 flex items-center gap-1.5" style={{ color: theme.accent }}>
              <Code className="w-3.5 h-3.5" /> Selected Open-Source & Projects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PROJECTS_DATA.slice(0, 4).map((p) => (
                <div key={p.id} className="p-3 rounded-lg border border-white/10 bg-black/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs" style={{ color: theme.accent }}>{p.title}</span>
                    <span className="text-[10px] opacity-60 font-mono">{p.year}</span>
                  </div>
                  <p className="text-[11px] opacity-80">{p.tagline}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.tags.slice(0, 3).map((t, ti) => (
                      <span key={ti} className="text-[9px] px-1 py-0.2 rounded bg-white/5 font-mono opacity-70">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-2 border-t pt-4" style={{ borderColor: theme.border }}>
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono opacity-70 flex items-center gap-1.5" style={{ color: theme.accent }}>
              <GraduationCap className="w-3.5 h-3.5" /> Education
            </h3>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
              <span className="font-bold">B.S. in Computer Science & Technology</span>
              <span className="font-mono opacity-70">2015 – 2019</span>
            </div>
            <p className="text-xs opacity-75">Graduated with Honors • Focus on Distributed Systems & Graphics</p>
          </div>
        </div>
      </div>
    </div>
  );
};
