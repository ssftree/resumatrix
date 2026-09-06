import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PORTFOLIO_CONFIG } from '../portfolio.config';
import {
  DEFAULT_RESUME_IMPORT_SETTINGS,
  extractJsonObject,
  loadResumeImportSettings,
  mergeResumeIntoConfig,
  parseResumeWithLLM,
  providerForSettings,
  RESUME_IMPORT_PROVIDERS,
  RESUME_IMPORT_SETTINGS_KEY,
  saveResumeImportSettings,
} from './resumeImport';

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('mergeResumeIntoConfig', () => {
  it('overlays partial profile/contact fields and keeps the rest of the current config', () => {
    const result = mergeResumeIntoConfig(DEFAULT_PORTFOLIO_CONFIG, {
      profile: { name: 'Ada Lovelace', title: '', bio: 'Analytical engine pioneer.' },
      contact: { email: 'ada@example.com' },
      version: 'ignored',
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.profile.name).toBe('Ada Lovelace');
    expect(result.data.profile.bio).toBe('Analytical engine pioneer.');
    // Empty string is pruned, so the existing title is preserved.
    expect(result.data.profile.title).toBe(DEFAULT_PORTFOLIO_CONFIG.profile.title);
    expect(result.data.contact.email).toBe('ada@example.com');
    expect(result.data.contact.github).toBe(DEFAULT_PORTFOLIO_CONFIG.contact.github);
    expect(result.data.version).toBe(DEFAULT_PORTFOLIO_CONFIG.version);
    expect(result.data.projects).toEqual(DEFAULT_PORTFOLIO_CONFIG.projects);
  });

  it('replaces list sections when the model supplies a complete entry', () => {
    const result = mergeResumeIntoConfig(DEFAULT_PORTFOLIO_CONFIG, {
      projects: [
        {
          id: 'p1',
          title: 'Nightingale',
          tagline: 'Data viz toolkit',
          description: 'Charts for everyone.',
          category: 'AI & Tools',
          tags: ['viz'],
          highlights: ['1k stars'],
          year: '2024',
        },
      ],
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.projects).toHaveLength(1);
    expect(result.data.projects[0].title).toBe('Nightingale');
  });

  it('surfaces validation errors for malformed model output', () => {
    const result = mergeResumeIntoConfig(DEFAULT_PORTFOLIO_CONFIG, {
      projects: [{ id: 'x', title: 'Broken', tagline: 't', description: 'd', year: '2024', category: 'Nope' }],
    });

    expect(result.success).toBe(false);
  });
});

describe('resume import providers', () => {
  it('defaults to DeepSeek', () => {
    expect(RESUME_IMPORT_PROVIDERS[0].id).toBe('deepseek');
    expect(DEFAULT_RESUME_IMPORT_SETTINGS.baseUrl).toBe('https://api.deepseek.com/v1');
    expect(DEFAULT_RESUME_IMPORT_SETTINGS.model).toBe('deepseek-chat');
  });

  it('matches saved base URLs back to a provider preset, ignoring trailing slashes', () => {
    expect(providerForSettings({ baseUrl: 'https://api.deepseek.com/v1/' }).id).toBe('deepseek');
    expect(providerForSettings({ baseUrl: 'https://api.openai.com/v1' }).id).toBe('openai');
  });

  it('falls back to the custom preset for an unknown base URL', () => {
    expect(providerForSettings({ baseUrl: 'https://gateway.internal/v1' }).id).toBe('custom');
  });
});

describe('extractJsonObject', () => {
  it('reads a bare JSON object', () => {
    expect(extractJsonObject('{"a":1}')).toEqual({ a: 1 });
  });

  it('pulls the object out of a fenced / prose-wrapped response', () => {
    const text = 'Here you go:\n```json\n{"a": {"b": "}"}, "c": 2}\n```\nHope that helps!';
    expect(extractJsonObject(text)).toEqual({ a: { b: '}' }, c: 2 });
  });

  it('throws when there is no object', () => {
    expect(() => extractJsonObject('no json here')).toThrow();
  });
});

describe('resume import settings persistence', () => {
  it('only persists the API key when remember is enabled', () => {
    saveResumeImportSettings({
      baseUrl: 'https://api.example.com/v1',
      model: 'm',
      apiKey: 'secret',
      remember: false,
    });
    expect(localStorage.getItem(RESUME_IMPORT_SETTINGS_KEY)).not.toContain('secret');
    expect(loadResumeImportSettings().apiKey).toBe('');

    saveResumeImportSettings({
      baseUrl: 'https://api.example.com/v1',
      model: 'm',
      apiKey: 'secret',
      remember: true,
    });
    expect(loadResumeImportSettings().apiKey).toBe('secret');
  });

  it('falls back to defaults for missing fields', () => {
    localStorage.setItem(RESUME_IMPORT_SETTINGS_KEY, '{"model":"custom"}');
    const loaded = loadResumeImportSettings();
    expect(loaded.model).toBe('custom');
    expect(loaded.baseUrl).toBe(DEFAULT_RESUME_IMPORT_SETTINGS.baseUrl);
  });
});

describe('parseResumeWithLLM', () => {
  const settings = {
    baseUrl: 'https://api.example.com/v1',
    model: 'gpt-4o-mini',
    apiKey: 'k',
    remember: false,
  };

  it('validates inputs before calling the network', async () => {
    const fetchImpl = vi.fn();
    const noKey = await parseResumeWithLLM({
      settings: { ...settings, apiKey: ' ' },
      resumeText: 'x',
      currentConfig: DEFAULT_PORTFOLIO_CONFIG,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });
    expect(noKey.success).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('merges a successful model response into the current config', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: JSON.stringify({ profile: { name: 'Grace Hopper' } }),
            },
          },
        ],
      }),
    });

    const result = await parseResumeWithLLM({
      settings,
      resumeText: 'Grace Hopper, computer scientist',
      currentConfig: DEFAULT_PORTFOLIO_CONFIG,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe('https://api.example.com/v1/chat/completions');
    expect((init as RequestInit).headers).toMatchObject({ Authorization: 'Bearer k' });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.profile.name).toBe('Grace Hopper');
  });

  it('reports HTTP failures with status detail', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      text: async () => 'unauthorized',
    });

    const result = await parseResumeWithLLM({
      settings,
      resumeText: 'x',
      currentConfig: DEFAULT_PORTFOLIO_CONFIG,
      fetchImpl: fetchImpl as unknown as typeof fetch,
    });

    expect(result.success).toBe(false);
    if (!('error' in result)) return;
    expect(result.error).toContain('401');
  });
});
