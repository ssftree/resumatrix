import { PortfolioConfig, ResumeLabels } from '../types';

export const DEFAULT_RESUME_LABELS: ResumeLabels = {
  documentTitle: 'Résumé',
  summary: 'Professional Summary',
  skills: 'Skills',
  experience: 'Experience',
  technologies: 'Technologies',
  projects: 'Projects',
  stack: 'Stack',
  education: 'Education',
  print: 'Print / PDF',
  watermark: 'Generated with',
};

export interface ResumeLocaleOption {
  value: string;
  label: string;
}

export interface ResolvedResumeLocale {
  config: PortfolioConfig;
  labels: ResumeLabels;
  locale: string;
}

/** Base locale identifier for a config that does not declare one. */
const baseLocaleOf = (config: PortfolioConfig): string => config.locale ?? 'en';

/**
 * Projects `config` through a requested resume locale without mutating it.
 * An unknown or missing locale deterministically falls back to the base
 * content and English default labels, so a translated selector never throws.
 */
export const resolveResumeLocale = (
  config: PortfolioConfig,
  requestedLocale: string | undefined,
): ResolvedResumeLocale => {
  const baseLocale = baseLocaleOf(config);

  if (!requestedLocale || requestedLocale === baseLocale) {
    return { config, labels: DEFAULT_RESUME_LABELS, locale: baseLocale };
  }

  const localization = config.localizations?.[requestedLocale];
  if (!localization) {
    return { config, labels: DEFAULT_RESUME_LABELS, locale: baseLocale };
  }

  const mergedConfig: PortfolioConfig = {
    ...config,
    profile: { ...config.profile, ...localization.profile },
    contact: { ...config.contact, ...localization.contact },
    skills: localization.skills ?? config.skills,
    experience: localization.experience ?? config.experience,
    projects: localization.projects ?? config.projects,
    education: localization.education ?? config.education,
  };

  return {
    config: mergedConfig,
    labels: { ...DEFAULT_RESUME_LABELS, ...localization.labels },
    locale: requestedLocale,
  };
};

/** Options for a resume locale selector; empty when no translations exist. */
export const listResumeLocales = (config: PortfolioConfig): ResumeLocaleOption[] => {
  const entries = Object.entries(config.localizations ?? {});
  if (entries.length === 0) return [];

  const baseLocale = baseLocaleOf(config);
  return [
    { value: baseLocale, label: baseLocale },
    ...entries.map(([value, localization]) => ({ value, label: localization.label })),
  ];
};
