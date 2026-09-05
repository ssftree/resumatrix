import React from 'react';
import {
  ArrowUpRight,
  Check,
  CircleDot,
  CloudCog,
  CodeXml,
  GitBranch,
  Mail,
  MapPin,
  Play,
  Printer,
  ServerCog,
  ShieldCheck,
  Terminal,
  Workflow,
} from 'lucide-react';
import type { AppTemplate, PortfolioConfig } from '../../types';
import { safeExternalHref } from '../../utils/url';

interface DevOpsControlViewProps {
  config: PortfolioConfig;
  onSwitchTemplate: (template: AppTemplate) => void;
}

export const DevOpsControlView: React.FC<DevOpsControlViewProps> = ({
  config,
  onSwitchTemplate,
}) => {
  const { profile, contact, skills, experience, projects, education = [] } = config;
  const skillCount = skills.reduce((total, category) => total + category.skills.length, 0);
  const contactLinks = [
    { label: 'GitHub', value: contact.github },
    { label: 'LinkedIn', value: contact.linkedin },
    { label: 'Blog', value: contact.blog },
  ].filter((item) => item.value);

  return (
    <main className="min-h-screen bg-[#07100d] text-[#d8e5df] font-mono print:bg-white print:text-slate-950">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pt-16 lg:px-8 print:max-w-none print:p-0">
        <header className="relative overflow-hidden border border-emerald-400/20 bg-[#0a1712] p-5 sm:p-8 print:border-slate-300 print:bg-white print:p-5">
          <div className="pointer-events-none absolute inset-0 opacity-20 print:hidden" aria-hidden="true">
            <div className="absolute -right-10 -top-24 h-72 w-72 rounded-full bg-emerald-400/25 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-emerald-300 print:text-emerald-800">
                <span className="flex items-center gap-1.5 border border-emerald-400/30 bg-emerald-400/10 px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 motion-safe:animate-pulse print:animate-none" />
                  Production ready
                </span>
                <span>portfolio.pipeline / v{config.version}</span>
              </div>
              <h1 className="text-3xl font-black uppercase leading-none tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl print:text-slate-950">
                Delivery Control Plane
              </h1>
              <div className="mt-6 flex flex-col gap-2 border-l-2 border-emerald-400 pl-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xl font-bold text-white sm:text-2xl print:text-slate-950">{profile.name}</p>
                  <p className="mt-1 text-sm text-emerald-200 print:text-emerald-800">{profile.title}</p>
                </div>
                <p className="max-w-xl text-xs leading-5 text-slate-400 print:text-slate-700">{profile.bio}</p>
              </div>
            </div>

            <div className="flex gap-2 print:hidden">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 border border-slate-600 bg-slate-900 px-3 py-2 text-xs text-slate-200 transition-colors hover:border-slate-400 hover:text-white"
              >
                <Printer className="h-3.5 w-3.5" />
                Print report
              </button>
              <button
                type="button"
                onClick={() => onSwitchTemplate('terminal')}
                className="inline-flex items-center gap-2 border border-emerald-400/50 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200 transition-colors hover:bg-emerald-400/20"
              >
                <Terminal className="h-3.5 w-3.5" />
                Open CLI
              </button>
            </div>
          </div>
        </header>

        <section aria-label="Deployment summary" className="grid grid-cols-2 border-x border-b border-emerald-400/20 sm:grid-cols-4 print:border-slate-300">
          {[
            { label: 'Pipeline stages', value: experience.length, icon: Workflow },
            { label: 'Toolchain units', value: skillCount, icon: ServerCog },
            { label: 'Deployed services', value: projects.length, icon: CloudCog },
            { label: 'Operational state', value: profile.status, icon: ShieldCheck },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="min-w-0 border-b border-r border-emerald-400/15 bg-[#0b1814] p-4 last:border-r-0 sm:border-b-0 print:border-slate-200 print:bg-white">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-500">
                <Icon className="h-3.5 w-3.5 text-emerald-400 print:text-emerald-700" />
                {label}
              </div>
              <p className="mt-2 truncate text-lg font-bold text-white print:text-slate-950">{value}</p>
            </div>
          ))}
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.75fr)] print:mt-4 print:grid-cols-[1.4fr_0.8fr] print:gap-4">
          <div className="space-y-6 print:space-y-4">
            <section className="border border-emerald-400/20 bg-[#0a1712] print:border-slate-300 print:bg-white">
              <div className="flex items-center justify-between border-b border-emerald-400/20 px-4 py-3 print:border-slate-300">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-300 print:text-emerald-800">Release pipeline</p>
                  <h2 className="mt-1 text-lg font-bold text-white print:text-slate-950">Career deployments</h2>
                </div>
                <GitBranch className="h-5 w-5 text-emerald-400" />
              </div>

              <ol className="divide-y divide-emerald-400/10 print:divide-slate-200">
                {experience.map((item, index) => (
                  <li key={`${item.company}-${item.period}`} className="grid grid-cols-[38px_minmax(0,1fr)] gap-3 px-4 py-5 sm:grid-cols-[74px_minmax(0,1fr)]">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center border border-emerald-400/40 bg-emerald-400/10 text-xs font-bold text-emerald-300 print:text-emerald-800">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      {index < experience.length - 1 && <div className="mt-2 h-full min-h-10 w-px bg-emerald-400/25 print:bg-slate-300" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="font-bold text-white print:text-slate-950">{item.role}</h3>
                          <p className="text-sm text-emerald-200 print:text-emerald-800">{item.company} · {item.location}</p>
                        </div>
                        <span className="shrink-0 text-[10px] uppercase tracking-wider text-slate-500">{item.period}</span>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-slate-400 print:text-slate-700">{item.description}</p>
                      <ul className="mt-3 space-y-1.5">
                        {item.achievements.map((achievement) => (
                          <li key={achievement} className="flex gap-2 text-xs leading-5 text-slate-300 print:text-slate-800">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400 print:text-emerald-700" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="border border-emerald-400/20 bg-[#0a1712] print:border-slate-300 print:bg-white">
              <div className="border-b border-emerald-400/20 px-4 py-3 print:border-slate-300">
                <p className="text-[10px] uppercase tracking-[0.18em] text-cyan-300 print:text-cyan-800">Service catalog</p>
                <h2 className="mt-1 text-lg font-bold text-white print:text-slate-950">Deployable projects</h2>
              </div>
              <div className="grid grid-cols-1 gap-px bg-emerald-400/10 md:grid-cols-2 print:grid-cols-2 print:bg-slate-200">
                {projects.map((project) => {
                  const projectHref =
                    (project.demoUrl ? safeExternalHref(project.demoUrl) : null) ||
                    (project.githubUrl ? safeExternalHref(project.githubUrl) : null);
                  return (
                    <article key={project.id} className="min-w-0 bg-[#0a1712] p-4 print:bg-white">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-emerald-300 print:text-emerald-800">
                            <CircleDot className="h-3 w-3" /> Healthy · {project.year}
                          </div>
                          <h3 className="mt-2 truncate font-bold text-white print:text-slate-950">{project.title}</h3>
                        </div>
                        {projectHref && (
                          <a
                            href={projectHref}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${project.title}`}
                            className="text-slate-500 transition-colors hover:text-emerald-300 print:hidden"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                      <p className="mt-2 text-xs font-medium text-cyan-200 print:text-cyan-800">{project.tagline}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-400 print:text-slate-700">{project.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span key={tag} className="border border-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400 print:border-slate-300 print:text-slate-700">{tag}</span>
                        ))}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-6 print:space-y-4">
            <section className="border border-emerald-400/20 bg-[#0a1712] p-4 print:border-slate-300 print:bg-white">
              <div className="flex items-center gap-2 border-b border-emerald-400/20 pb-3 print:border-slate-300">
                <CodeXml className="h-4 w-4 text-cyan-300 print:text-cyan-800" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white print:text-slate-950">Runner inventory</h2>
              </div>
              <div className="mt-4 space-y-5">
                {skills.map((category) => (
                  <div key={category.title}>
                    <h3 className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{category.title}</h3>
                    <div className="mt-2 space-y-2.5">
                      {category.skills.map((skill) => (
                        <div key={skill.name}>
                          <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                            <span className="truncate text-slate-200 print:text-slate-800">{skill.name}</span>
                            <span className="text-emerald-300 print:text-emerald-800">{skill.level}%</span>
                          </div>
                          <div className="h-1 overflow-hidden bg-slate-800 print:bg-slate-200">
                            <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 print:bg-emerald-700" style={{ width: `${skill.level}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-emerald-400/20 bg-[#0a1712] p-4 print:border-slate-300 print:bg-white">
              <div className="flex items-center gap-2 text-emerald-300 print:text-emerald-800">
                <Play className="h-4 w-4" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Operator channel</h2>
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-400 print:text-slate-700">{profile.status}</p>
              <div className="mt-4 space-y-2 text-xs">
                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-slate-200 hover:text-emerald-300 print:text-slate-800">
                  <Mail className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="truncate">{contact.email}</span>
                </a>
                <div className="flex items-center gap-2 text-slate-400 print:text-slate-700">
                  <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                  {contact.location || profile.location}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {contactLinks.map((item) => {
                  const href = safeExternalHref(item.value);
                  return href ? (
                    <a key={item.label} href={href} target="_blank" rel="noreferrer" className="border border-slate-700 px-2 py-1 text-[10px] uppercase text-slate-400 hover:border-emerald-400 hover:text-emerald-300 print:border-slate-300 print:text-slate-700">
                      {item.label}
                    </a>
                  ) : null;
                })}
              </div>
            </section>

            {education.length > 0 && (
              <section className="border border-emerald-400/20 bg-[#0a1712] p-4 print:border-slate-300 print:bg-white">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white print:text-slate-950">Provisioning history</h2>
                <div className="mt-3 space-y-3">
                  {education.map((item) => (
                    <div key={`${item.institution}-${item.period}`} className="border-l border-cyan-400/40 pl-3">
                      <p className="text-xs font-bold text-slate-200 print:text-slate-800">{item.degree} · {item.field}</p>
                      <p className="mt-1 text-[10px] leading-4 text-slate-500">{item.institution} · {item.period}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};
