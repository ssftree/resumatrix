import type { PortfolioConfig } from '../types';
import {
  validatePortfolioConfig,
  type PortfolioConfigValidationResult,
} from './portfolioConfig';

/**
 * AI resume import.
 *
 * The site has no server, so parsing runs entirely in the browser: the user
 * supplies an OpenAI-compatible endpoint plus key, and the resume text and key
 * are sent directly from the browser to that endpoint. The model is asked to
 * return a full {@link PortfolioConfig}; we merge it onto the current config so
 * unfilled fields keep their existing values, then run the same validation used
 * for imported JSON before it can reach application state.
 */

export const RESUME_IMPORT_SETTINGS_KEY = 'resume_import_settings_v1';

export interface ResumeImportSettings {
  /** OpenAI-compatible base URL, e.g. https://api.openai.com/v1 */
  baseUrl: string;
  /** Chat completion model id. */
  model: string;
  /** Bearer token for the endpoint. Only persisted when `remember` is true. */
  apiKey: string;
  /** Persist the API key on this device. */
  remember: boolean;
}

/**
 * Known OpenAI-compatible providers, offered as one-click presets in the UI.
 * `id` `custom` lets the user type an arbitrary base URL / model.
 */
export interface ResumeImportProvider {
  id: string;
  label: string;
  /** Empty for `custom`; otherwise the OpenAI-compatible base URL. */
  baseUrl: string;
  /** Suggested chat model for this provider. */
  model: string;
  /** Where to create an API key. */
  keysUrl?: string;
}

export const RESUME_IMPORT_PROVIDERS: ResumeImportProvider[] = [
  {
    id: 'deepseek',
    label: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    keysUrl: 'https://platform.deepseek.com/api_keys',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    keysUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'moonshot',
    label: 'Moonshot (Kimi)',
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-8k',
    keysUrl: 'https://platform.moonshot.cn/console/api-keys',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    model: 'deepseek/deepseek-chat',
    keysUrl: 'https://openrouter.ai/keys',
  },
  { id: 'custom', label: 'Custom (OpenAI-compatible)', baseUrl: '', model: '' },
];

/** Matches saved settings back to a provider preset by base URL. */
export const providerForSettings = (settings: {
  baseUrl: string;
}): ResumeImportProvider => {
  const normalize = (url: string) => url.trim().replace(/\/+$/, '').toLowerCase();
  const target = normalize(settings.baseUrl);
  return (
    RESUME_IMPORT_PROVIDERS.find(
      (provider) => provider.baseUrl && normalize(provider.baseUrl) === target,
    ) ?? RESUME_IMPORT_PROVIDERS[RESUME_IMPORT_PROVIDERS.length - 1]
  );
};

export const DEFAULT_RESUME_IMPORT_SETTINGS: ResumeImportSettings = {
  baseUrl: RESUME_IMPORT_PROVIDERS[0].baseUrl,
  model: RESUME_IMPORT_PROVIDERS[0].model,
  apiKey: '',
  remember: false,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const loadResumeImportSettings = (): ResumeImportSettings => {
  try {
    const raw = localStorage.getItem(RESUME_IMPORT_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_RESUME_IMPORT_SETTINGS };
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return { ...DEFAULT_RESUME_IMPORT_SETTINGS };
    return {
      baseUrl:
        typeof parsed.baseUrl === 'string' && parsed.baseUrl.trim()
          ? parsed.baseUrl
          : DEFAULT_RESUME_IMPORT_SETTINGS.baseUrl,
      model:
        typeof parsed.model === 'string' && parsed.model.trim()
          ? parsed.model
          : DEFAULT_RESUME_IMPORT_SETTINGS.model,
      apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : '',
      remember: parsed.apiKey ? true : Boolean(parsed.remember),
    };
  } catch {
    return { ...DEFAULT_RESUME_IMPORT_SETTINGS };
  }
};

export const saveResumeImportSettings = (settings: ResumeImportSettings): void => {
  try {
    const persisted = {
      baseUrl: settings.baseUrl,
      model: settings.model,
      remember: settings.remember,
      ...(settings.remember && settings.apiKey ? { apiKey: settings.apiKey } : {}),
    };
    localStorage.setItem(RESUME_IMPORT_SETTINGS_KEY, JSON.stringify(persisted));
  } catch {
    /* storage is best-effort */
  }
};

/** Recursively drops empty strings, nulls, empty arrays and empty objects. */
const pruneEmpty = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    const next = value.map(pruneEmpty).filter((item) => item !== undefined);
    return next.length ? next : undefined;
  }
  if (isRecord(value)) {
    const next: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      const cleaned = pruneEmpty(item);
      if (cleaned !== undefined) next[key] = cleaned;
    }
    return Object.keys(next).length ? next : undefined;
  }
  if (typeof value === 'string') return value.trim() === '' ? undefined : value;
  if (value === null) return undefined;
  return value;
};

/**
 * Overlays a model-produced (possibly partial) config onto the current one.
 * `profile` and `contact` merge field-by-field; list sections replace wholesale
 * when the model supplied a non-empty list, otherwise the current list is kept.
 * `version` is always preserved from the current config.
 */
export const mergeResumeIntoConfig = (
  current: PortfolioConfig,
  raw: unknown,
): PortfolioConfigValidationResult => {
  const patch = (pruneEmpty(raw) as Record<string, unknown> | undefined) ?? {};

  const merged: PortfolioConfig = {
    ...current,
    ...patch,
    version: current.version,
    profile: {
      ...current.profile,
      ...(isRecord(patch.profile) ? patch.profile : {}),
    },
    contact: {
      ...current.contact,
      ...(isRecord(patch.contact) ? patch.contact : {}),
    },
  } as PortfolioConfig;

  return validatePortfolioConfig(merged);
};

/** Pulls the first balanced top-level JSON object out of a model response. */
export const extractJsonObject = (text: string): unknown => {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    /* fall through to brace scan */
  }

  const start = trimmed.indexOf('{');
  if (start === -1) throw new Error('Model response did not contain a JSON object.');

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let index = start; index < trimmed.length; index += 1) {
    const char = trimmed[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') inString = false;
      continue;
    }
    if (char === '"') inString = true;
    else if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return JSON.parse(trimmed.slice(start, index + 1));
    }
  }

  throw new Error('Model response contained an unterminated JSON object.');
};

const SCHEMA_GUIDE = `Return a single JSON object matching this shape:
{
  "profile": { "name": string, "title": string, "location": string, "status": string,
               "bio": string, "avatarInitials"?: string, "yearsOfExperience"?: string,
               "stats"?: [{ "metric": string, "label": string }] },
  "contact": { "email": string, "location": string, "github": string, "linkedin": string,
               "twitter": string, "blog": string },  // links may be full URLs or bare hosts; use "" if unknown
  "skills": [{ "title": string, "icon": string, "skills": [{ "name": string, "level": number /* 1-100 */ }] }],
  "experience": [{ "period": string, "role": string, "company": string, "location": string,
                   "description": string, "achievements": string[], "skills": string[] }],
  "projects": [{ "id": string, "title": string, "tagline": string, "description": string,
                 "category": "Full-Stack" | "CLI & Systems" | "AI & Tools" | "Graphics & Web",
                 "tags": string[], "highlights": string[], "year": string,
                 "demoUrl"?: string, "githubUrl"?: string }],
  "education"?: [{ "degree": string, "field": string, "institution": string, "location": string,
                   "period": string, "notes"?: string }]
}`;

export const buildResumeMessages = (
  resumeText: string,
  currentConfig: PortfolioConfig,
): Array<{ role: 'system' | 'user'; content: string }> => [
  {
    role: 'system',
    content: [
      'You extract structured data from a resume/CV for a developer portfolio.',
      'Respond with ONLY a JSON object, no markdown fences, no commentary.',
      SCHEMA_GUIDE,
      'Rules:',
      '- Fill every field you can infer from the resume.',
      '- For anything the resume does not mention, copy the value from CURRENT_CONFIG unchanged.',
      '- Keep every required field present; never invent contact URLs — use "" when unknown.',
      '- "category" must be exactly one of the four listed values; pick the closest.',
      '- Skill "level" is your best estimate of proficiency from 1 to 100.',
    ].join('\n'),
  },
  {
    role: 'user',
    content: `CURRENT_CONFIG:\n${JSON.stringify(currentConfig, null, 2)}\n\nRESUME:\n${resumeText}\n\nReturn the updated portfolio config as a single JSON object.`,
  },
];

export interface ParseResumeParams {
  settings: ResumeImportSettings;
  resumeText: string;
  currentConfig: PortfolioConfig;
  signal?: AbortSignal;
  /** Injectable for tests; defaults to global fetch. */
  fetchImpl?: typeof fetch;
}

export const parseResumeWithLLM = async ({
  settings,
  resumeText,
  currentConfig,
  signal,
  fetchImpl,
}: ParseResumeParams): Promise<PortfolioConfigValidationResult> => {
  const doFetch = fetchImpl ?? globalThis.fetch;
  if (typeof doFetch !== 'function') {
    return { success: false, error: 'This browser does not support fetch.' };
  }
  if (!settings.apiKey.trim()) {
    return { success: false, error: 'Add an API key before parsing.' };
  }
  if (!resumeText.trim()) {
    return { success: false, error: 'Paste or upload your resume text first.' };
  }

  const endpoint = `${settings.baseUrl.replace(/\/+$/, '')}/chat/completions`;

  let response: Response;
  try {
    response = await doFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: settings.model,
        temperature: 0.2,
        messages: buildResumeMessages(resumeText, currentConfig),
        response_format: { type: 'json_object' },
      }),
      signal,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network request failed.';
    return { success: false, error: `Could not reach the model endpoint: ${message}` };
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    return {
      success: false,
      error: `Model endpoint returned ${response.status}. ${detail.slice(0, 300)}`.trim(),
    };
  }

  let content: string;
  try {
    const data: unknown = await response.json();
    const choice = isRecord(data) && Array.isArray(data.choices) ? data.choices[0] : undefined;
    const message = isRecord(choice) && isRecord(choice.message) ? choice.message.content : undefined;
    if (typeof message !== 'string' || !message.trim()) {
      return { success: false, error: 'Model response did not include any content.' };
    }
    content = message;
  } catch {
    return { success: false, error: 'Could not read the model response as JSON.' };
  }

  let parsed: unknown;
  try {
    parsed = extractJsonObject(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unparseable model response.';
    return { success: false, error: message };
  }

  return mergeResumeIntoConfig(currentConfig, parsed);
};
