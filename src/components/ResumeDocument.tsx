import React from 'react';
import { PortfolioConfig, ResumeLabels } from '../types';
import { safeExternalHref } from '../utils/url';

export interface ResumeDocumentProps {
  config: PortfolioConfig;
  labels: ResumeLabels;
  presentation: 'themed' | 'academic';
  watermark: 'brand' | 'none';
  accentColor?: string;
  borderColor?: string;
}

const bareUrl = (url: string): string => url.replace(/^https?:\/\//, '');

/**
 * The one semantic resume document shared by the Resume modal and the
 * Academic template. Both entry points render this instead of maintaining
 * independent DOM trees, so ATS-facing structure and locale/watermark
 * behavior can't drift between them.
 */
export const ResumeDocument: React.FC<ResumeDocumentProps> = ({
  config,
  labels,
  presentation,
  watermark,
  accentColor,
  borderColor,
}) => {
  const { profile, contact, skills, experience, projects, education } = config;
  const isAcademic = presentation === 'academic';
  const accentStyle = !isAcademic && accentColor ? { color: accentColor } : undefined;
  const borderStyle = !isAcademic && borderColor ? { borderColor } : undefined;

  const headingClassName = isAcademic
    ? 'text-xs font-bold uppercase tracking-widest border-b-2 border-neutral-900 pb-0.5 mb-2'
    : 'text-xs font-bold uppercase tracking-wider font-mono opacity-70';

  return (
    <article
      data-resume-document
      className={
        isAcademic
          ? 'font-serif text-[13px] leading-relaxed text-neutral-900'
          : 'font-sans text-xs sm:text-sm leading-relaxed'
      }
    >
      <header
        className={isAcademic ? 'text-center pb-4 border-b border-neutral-300' : 'pb-6 space-y-2 border-b'}
        style={borderStyle}
      >
        <h1
          className={
            isAcademic
              ? 'text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black font-sans'
              : 'text-2xl sm:text-3xl font-bold tracking-tight'
          }
          style={accentStyle}
        >
          {profile.name}
        </h1>
        <p className={isAcademic ? 'text-sm mt-1 font-medium text-neutral-700 font-sans' : 'text-sm font-medium opacity-90'}>
          {profile.title}
        </p>
        <address
          className={
            isAcademic
              ? 'not-italic flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-neutral-600 mt-2 font-sans'
              : 'not-italic flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono opacity-80 pt-1'
          }
        >
          <span>{contact.location}</span>
          <a href={`mailto:${contact.email}`} className="hover:underline">
            {contact.email}
          </a>
          {contact.github && (
            <a href={safeExternalHref(contact.github)} target="_blank" rel="noreferrer" className="hover:underline">
              {bareUrl(contact.github)}
            </a>
          )}
          {contact.blog && (
            <a href={safeExternalHref(contact.blog)} target="_blank" rel="noreferrer" className="hover:underline">
              {bareUrl(contact.blog)}
            </a>
          )}
        </address>
      </header>

      <section aria-labelledby="resume-summary-heading" className="mt-5 space-y-2">
        <h2 id="resume-summary-heading" className={headingClassName} style={accentStyle}>
          {labels.summary}
        </h2>
        <p className={isAcademic ? 'text-neutral-800 text-justify' : 'opacity-90'}>{profile.bio}</p>
      </section>

      <section aria-labelledby="resume-skills-heading" className="mt-5 space-y-2">
        <h2 id="resume-skills-heading" className={headingClassName} style={accentStyle}>
          {labels.skills}
        </h2>
        <dl className="space-y-1.5 m-0">
          {skills.map((group) => (
            <div key={group.title} className="flex flex-col sm:flex-row text-xs gap-x-2">
              <dt className="font-bold sm:w-44 shrink-0">{group.title}</dt>
              <dd className="m-0 opacity-90">{group.skills.map((skill) => skill.name).join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="resume-experience-heading" className="mt-5 space-y-4">
        <h2 id="resume-experience-heading" className={headingClassName} style={accentStyle}>
          {labels.experience}
        </h2>
        <ol className="space-y-4 list-none pl-0 m-0">
          {experience.map((exp, idx) => (
            <li key={idx} className="space-y-1.5" style={{ breakInside: 'avoid' }}>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <span className="font-bold text-sm">
                  {exp.role} — <span className="font-normal italic">{exp.company}</span>
                </span>
                <span className="font-mono text-xs opacity-70">{exp.period}</span>
              </div>
              <div className="text-xs opacity-80">{exp.location}</div>
              <p className="text-xs opacity-85 leading-relaxed">{exp.description}</p>
              <ul className="list-disc list-inside text-xs opacity-80 space-y-1 pl-1">
                {exp.achievements.map((achievement, achievementIdx) => (
                  <li key={achievementIdx}>{achievement}</li>
                ))}
              </ul>
              {exp.skills.length > 0 && (
                <p className="text-[11px] opacity-70">
                  <strong>{labels.technologies}: </strong>
                  {exp.skills.join(', ')}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="resume-projects-heading" className="mt-5 space-y-3">
        <h2 id="resume-projects-heading" className={headingClassName} style={accentStyle}>
          {labels.projects}
        </h2>
        <ul className="space-y-3 list-none pl-0 m-0">
          {projects.slice(0, 4).map((project) => (
            <li key={project.id} className="space-y-1" style={{ breakInside: 'avoid' }}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-bold text-xs">{project.title}</span>
                <span className="text-[10px] opacity-60 font-mono">{project.year}</span>
              </div>
              <p className="text-[11px] opacity-80">{project.tagline}</p>
              {project.tags.length > 0 && (
                <p className="text-[11px] opacity-70">
                  <strong>{labels.stack}: </strong>
                  {project.tags.join(', ')}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {education && education.length > 0 && (
        <section
          aria-labelledby="resume-education-heading"
          className={isAcademic ? 'mt-5 space-y-3' : 'mt-5 space-y-3 border-t pt-4'}
          style={borderStyle}
        >
          <h2 id="resume-education-heading" className={headingClassName} style={accentStyle}>
            {labels.education}
          </h2>
          <ol className="space-y-2 list-none pl-0 m-0">
            {education.map((edu, eduIdx) => (
              <li key={eduIdx} className="space-y-1" style={{ breakInside: 'avoid' }}>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                  <span className="font-bold">
                    {edu.degree} in {edu.field}
                  </span>
                  <span className="font-mono opacity-70">{edu.period}</span>
                </div>
                <div className="text-xs opacity-80">
                  {edu.institution} • {edu.location}
                </div>
                {edu.notes && <p className="text-xs opacity-75">{edu.notes}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {watermark === 'brand' && (
        <footer data-resume-watermark className="mt-6 pt-3 border-t text-[10px] opacity-60 text-center">
          {labels.watermark} {profile.name}&rsquo;s Terminal Portfolio
        </footer>
      )}
    </article>
  );
};
