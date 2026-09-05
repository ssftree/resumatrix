import type {
  ContactInfo,
  DeveloperProfile,
  EducationItem,
  Experience,
  PortfolioConfig,
  Project,
  SkillCategory,
} from '../types';
import { normalizeExternalUrl } from './url';

export type PortfolioConfigValidationResult =
  | { success: true; data: PortfolioConfig }
  | { success: false; error: string };

type UnknownRecord = Record<string, unknown>;
type ValidationError = Extract<PortfolioConfigValidationResult, { success: false }>;

const projectCategories = new Set<Project['category']>([
  'Full-Stack',
  'CLI & Systems',
  'AI & Tools',
  'Graphics & Web',
]);

const invalid = (message: string): ValidationError => ({
  success: false,
  error: `Invalid portfolio configuration: ${message}`,
});

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readString = (value: unknown, path: string): string | ValidationError =>
  typeof value === 'string' ? value : invalid(`${path} must be a string.`);

const readOptionalString = (value: unknown, path: string): string | undefined | ValidationError =>
  value === undefined ? undefined : readString(value, path);

const readExternalUrl = (value: unknown, path: string): string | ValidationError => {
  const stringValue = readString(value, path);
  if (isFailure(stringValue)) return stringValue;
  if (stringValue === '') return '';
  const normalized = normalizeExternalUrl(stringValue);
  return normalized ?? invalid(`${path} must be an HTTP(S) URL or bare host.`);
};

const readOptionalExternalUrl = (
  value: unknown,
  path: string,
): string | undefined | ValidationError => {
  if (value === undefined) return undefined;
  return readExternalUrl(value, path);
};

const readStringArray = (value: unknown, path: string): string[] | ValidationError => {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    return invalid(`${path} must be an array of strings.`);
  }

  return [...value];
};

const isFailure = (value: unknown): value is ValidationError =>
  isRecord(value) && value.success === false && typeof value.error === 'string';

const readProfile = (value: unknown): DeveloperProfile | ValidationError => {
  if (!isRecord(value)) return invalid('profile must be an object.');

  const name = readString(value.name, 'profile.name');
  const title = readString(value.title, 'profile.title');
  const location = readString(value.location, 'profile.location');
  const status = readString(value.status, 'profile.status');
  const bio = readString(value.bio, 'profile.bio');
  const avatarInitials = readOptionalString(value.avatarInitials, 'profile.avatarInitials');
  const yearsOfExperience = readOptionalString(value.yearsOfExperience, 'profile.yearsOfExperience');

  for (const result of [name, title, location, status, bio, avatarInitials, yearsOfExperience]) {
    if (isFailure(result)) return result;
  }

  let stats: DeveloperProfile['stats'];
  if (value.stats !== undefined) {
    if (!Array.isArray(value.stats)) return invalid('profile.stats must be an array.');
    stats = [];
    for (let index = 0; index < value.stats.length; index += 1) {
      const stat = value.stats[index];
      if (!isRecord(stat)) return invalid(`profile.stats[${index}] must be an object.`);
      const metric = readString(stat.metric, `profile.stats[${index}].metric`);
      const label = readString(stat.label, `profile.stats[${index}].label`);
      if (isFailure(metric)) return metric;
      if (isFailure(label)) return label;
      stats.push({ metric, label });
    }
  }

  return {
    name: name as string,
    title: title as string,
    location: location as string,
    status: status as string,
    bio: bio as string,
    avatarInitials: avatarInitials as string | undefined,
    yearsOfExperience: yearsOfExperience as string | undefined,
    stats,
  };
};

const readContact = (value: unknown): ContactInfo | ValidationError => {
  if (!isRecord(value)) return invalid('contact must be an object.');

  const contact: Partial<ContactInfo> = {};
  for (const key of ['email', 'location'] as const) {
    const stringValue = readString(value[key], `contact.${key}`);
    if (isFailure(stringValue)) return stringValue;
    contact[key] = stringValue;
  }
  for (const key of ['github', 'linkedin', 'twitter', 'blog'] as const) {
    const stringValue = readExternalUrl(value[key], `contact.${key}`);
    if (isFailure(stringValue)) return stringValue;
    contact[key] = stringValue;
  }

  return contact as ContactInfo;
};

const readSkills = (value: unknown): SkillCategory[] | ValidationError => {
  if (!Array.isArray(value)) return invalid('skills must be an array.');

  const categories: SkillCategory[] = [];
  for (let categoryIndex = 0; categoryIndex < value.length; categoryIndex += 1) {
    const category = value[categoryIndex];
    const path = `skills[${categoryIndex}]`;
    if (!isRecord(category)) return invalid(`${path} must be an object.`);

    const title = readString(category.title, `${path}.title`);
    const icon = readString(category.icon, `${path}.icon`);
    if (isFailure(title)) return title;
    if (isFailure(icon)) return icon;
    if (!Array.isArray(category.skills)) return invalid(`${path}.skills must be an array.`);

    const skills: SkillCategory['skills'] = [];
    for (let skillIndex = 0; skillIndex < category.skills.length; skillIndex += 1) {
      const skill = category.skills[skillIndex];
      const skillPath = `${path}.skills[${skillIndex}]`;
      if (!isRecord(skill)) return invalid(`${skillPath} must be an object.`);
      const name = readString(skill.name, `${skillPath}.name`);
      const categoryName = readOptionalString(skill.category, `${skillPath}.category`);
      const note = readOptionalString(skill.note, `${skillPath}.note`);
      if (isFailure(name)) return name;
      if (typeof skill.level !== 'number' || !Number.isFinite(skill.level)) {
        return invalid(`${skillPath}.level must be a finite number.`);
      }
      if (isFailure(categoryName)) return categoryName;
      if (isFailure(note)) return note;
      skills.push({ name, level: skill.level, category: categoryName, note });
    }

    categories.push({ title, icon, skills });
  }

  return categories;
};

const readExperience = (value: unknown): Experience[] | ValidationError => {
  if (!Array.isArray(value)) return invalid('experience must be an array.');

  const experience: Experience[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const item = value[index];
    const path = `experience[${index}]`;
    if (!isRecord(item)) return invalid(`${path} must be an object.`);

    const fields = ['period', 'role', 'company', 'location', 'description'] as const;
    const entry: Partial<Experience> = {};
    for (const field of fields) {
      const fieldValue = readString(item[field], `${path}.${field}`);
      if (isFailure(fieldValue)) return fieldValue;
      entry[field] = fieldValue;
    }
    const achievements = readStringArray(item.achievements, `${path}.achievements`);
    const skills = readStringArray(item.skills, `${path}.skills`);
    if (isFailure(achievements)) return achievements;
    if (isFailure(skills)) return skills;
    experience.push({ ...entry, achievements, skills } as Experience);
  }

  return experience;
};

const readProjects = (value: unknown): Project[] | ValidationError => {
  if (!Array.isArray(value)) return invalid('projects must be an array.');
  if (value.length === 0) return invalid('projects must include at least one project.');

  const projects: Project[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const item = value[index];
    const path = `projects[${index}]`;
    if (!isRecord(item)) return invalid(`${path} must be an object.`);

    const fields = ['id', 'title', 'tagline', 'description', 'year'] as const;
    const project: Partial<Project> = {};
    for (const field of fields) {
      const fieldValue = readString(item[field], `${path}.${field}`);
      if (isFailure(fieldValue)) return fieldValue;
      project[field] = fieldValue;
    }
    if (typeof item.category !== 'string' || !projectCategories.has(item.category as Project['category'])) {
      return invalid(`${path}.category must be a supported project category.`);
    }
    const tags = readStringArray(item.tags, `${path}.tags`);
    const highlights = readStringArray(item.highlights, `${path}.highlights`);
    if (isFailure(tags)) return tags;
    if (isFailure(highlights)) return highlights;
    if (item.stars !== undefined && (typeof item.stars !== 'number' || !Number.isFinite(item.stars))) {
      return invalid(`${path}.stars must be a finite number.`);
    }
    if (item.featured !== undefined && typeof item.featured !== 'boolean') {
      return invalid(`${path}.featured must be a boolean.`);
    }
    const demoUrl = readOptionalExternalUrl(item.demoUrl, `${path}.demoUrl`);
    const githubUrl = readOptionalExternalUrl(item.githubUrl, `${path}.githubUrl`);
    if (isFailure(demoUrl)) return demoUrl;
    if (isFailure(githubUrl)) return githubUrl;
    projects.push({
      ...project,
      category: item.category as Project['category'],
      tags,
      highlights,
      stars: item.stars as number | undefined,
      featured: item.featured as boolean | undefined,
      demoUrl,
      githubUrl,
    } as Project);
  }

  return projects;
};

const readEducation = (value: unknown): EducationItem[] | undefined | ValidationError => {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return invalid('education must be an array.');

  const education: EducationItem[] = [];
  for (let index = 0; index < value.length; index += 1) {
    const item = value[index];
    const path = `education[${index}]`;
    if (!isRecord(item)) return invalid(`${path} must be an object.`);
    const fields = ['degree', 'field', 'institution', 'location', 'period'] as const;
    const entry: Partial<EducationItem> = {};
    for (const field of fields) {
      const fieldValue = readString(item[field], `${path}.${field}`);
      if (isFailure(fieldValue)) return fieldValue;
      entry[field] = fieldValue;
    }
    const notes = readOptionalString(item.notes, `${path}.notes`);
    if (isFailure(notes)) return notes;
    education.push({ ...entry, notes } as EducationItem);
  }

  return education;
};

const readSystem = (value: unknown): PortfolioConfig['system'] | ValidationError => {
  if (value === undefined) return undefined;
  if (!isRecord(value)) return invalid('system must be an object.');

  const system: NonNullable<PortfolioConfig['system']> = {};
  for (const key of ['os', 'host', 'kernel', 'uptime', 'shell', 'resolution', 'wm', 'terminal', 'cpu', 'memory'] as const) {
    const fieldValue = readOptionalString(value[key], `system.${key}`);
    if (isFailure(fieldValue)) return fieldValue;
    if (fieldValue !== undefined) system[key] = fieldValue;
  }
  return system;
};

const readTerminal = (value: unknown): PortfolioConfig['terminal'] | ValidationError => {
  if (value === undefined) return undefined;
  if (!isRecord(value)) return invalid('terminal must be an object.');
  const easterEggsEnabled = value.easterEggsEnabled;
  if (easterEggsEnabled === undefined) return {};
  if (typeof easterEggsEnabled !== 'boolean') {
    return invalid('terminal.easterEggsEnabled must be a boolean.');
  }

  return { easterEggsEnabled };
};

/**
 * Validates untrusted persisted/imported data and returns a fresh, typed copy.
 * The copy also discards unknown fields so all consumers receive one predictable shape.
 */
export const validatePortfolioConfig = (value: unknown): PortfolioConfigValidationResult => {
  if (!isRecord(value)) return invalid('root value must be an object.');

  const version = readString(value.version, 'version');
  const profile = readProfile(value.profile);
  const contact = readContact(value.contact);
  const skills = readSkills(value.skills);
  const experience = readExperience(value.experience);
  const projects = readProjects(value.projects);
  const education = readEducation(value.education);
  const terminal = readTerminal(value.terminal);
  const system = readSystem(value.system);

  for (const result of [version, profile, contact, skills, experience, projects, education, terminal, system]) {
    if (isFailure(result)) return result;
  }

  return {
    success: true,
    data: {
      version: version as string,
      profile: profile as DeveloperProfile,
      contact: contact as ContactInfo,
      skills: skills as SkillCategory[],
      experience: experience as Experience[],
      projects: projects as Project[],
      education: education as EducationItem[] | undefined,
      terminal: terminal as PortfolioConfig['terminal'],
      system: system as PortfolioConfig['system'],
    },
  };
};

export const parsePortfolioConfigJson = (json: string): PortfolioConfigValidationResult => {
  try {
    return validatePortfolioConfig(JSON.parse(json));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to parse JSON.';
    return { success: false, error: `Invalid JSON: ${message}` };
  }
};
