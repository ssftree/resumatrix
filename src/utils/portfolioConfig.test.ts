import { describe, expect, it } from 'vitest';
import { DEFAULT_PORTFOLIO_CONFIG } from '../portfolio.config';
import { parsePortfolioConfigJson, validatePortfolioConfig } from './portfolioConfig';

describe('validatePortfolioConfig', () => {
  it('returns a typed, independent config for a complete portfolio', () => {
    const result = validatePortfolioConfig(DEFAULT_PORTFOLIO_CONFIG);

    expect(result.success).toBe(true);
    if (!result.success) return;

    expect(result.data).toEqual(DEFAULT_PORTFOLIO_CONFIG);
    expect(result.data).not.toBe(DEFAULT_PORTFOLIO_CONFIG);
    expect(result.data.projects).not.toBe(DEFAULT_PORTFOLIO_CONFIG.projects);
  });

  it('rejects a configuration with a project missing its highlights array', () => {
    const incomplete = structuredClone(DEFAULT_PORTFOLIO_CONFIG) as unknown as Record<string, unknown>;
    const projects = incomplete.projects as Array<Record<string, unknown>>;
    delete projects[0].highlights;

    const result = validatePortfolioConfig(incomplete);

    expect(result).toEqual({
      success: false,
      error: 'Invalid portfolio configuration: projects[0].highlights must be an array of strings.',
    });
  });

  it('rejects a configuration with a non-string contact URL before templates call startsWith', () => {
    const incomplete = structuredClone(DEFAULT_PORTFOLIO_CONFIG) as unknown as Record<string, unknown>;
    (incomplete.contact as Record<string, unknown>).github = 42;

    const result = validatePortfolioConfig(incomplete);

    expect(result).toEqual({
      success: false,
      error: 'Invalid portfolio configuration: contact.github must be a string.',
    });
  });

  it('reports malformed JSON without throwing so every import path can recover safely', () => {
    const result = parsePortfolioConfigJson('{"profile":');

    expect(result.success).toBe(false);
    if (result.success) return;
    expect('error' in result && result.error).toMatch(/^Invalid JSON: /);
  });

  it('rejects unsafe external URL protocols from imported configuration', () => {
    const unsafe = structuredClone(DEFAULT_PORTFOLIO_CONFIG);
    unsafe.projects[0].githubUrl = 'javascript:alert(1)';

    const result = validatePortfolioConfig(unsafe);

    expect(result).toEqual({
      success: false,
      error: 'Invalid portfolio configuration: projects[0].githubUrl must be an HTTP(S) URL or bare host.',
    });
  });

  it('normalizes bare external hosts before configuration reaches a template', () => {
    const config = structuredClone(DEFAULT_PORTFOLIO_CONFIG);
    config.contact.github = 'github.com/example';
    config.projects[0].demoUrl = 'demo.example.test/app';

    const result = validatePortfolioConfig(config);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.contact.github).toBe('https://github.com/example');
    expect(result.data.projects[0].demoUrl).toBe('https://demo.example.test/app');
  });

  it('accepts a config with a resume locale and a validated partial localization', () => {
    const withLocale = structuredClone(DEFAULT_PORTFOLIO_CONFIG) as unknown as Record<string, unknown>;
    withLocale.locale = 'en';
    withLocale.localizations = {
      'zh-CN': {
        label: '中文',
        labels: { summary: '个人简介' },
        profile: { bio: '经验丰富的全栈工程师。' },
        contact: { location: '杭州 / 远程' },
      },
    };

    const result = validatePortfolioConfig(withLocale);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.locale).toBe('en');
    expect(result.data.localizations?.['zh-CN']).toEqual({
      label: '中文',
      labels: { summary: '个人简介' },
      profile: { bio: '经验丰富的全栈工程师。' },
      contact: { location: '杭州 / 远程' },
      skills: undefined,
      experience: undefined,
      projects: undefined,
      education: undefined,
    });
  });

  it('rejects a localization with an unsupported resume label key', () => {
    const withLocale = structuredClone(DEFAULT_PORTFOLIO_CONFIG) as unknown as Record<string, unknown>;
    withLocale.localizations = {
      'zh-CN': { label: '中文', labels: { unsupported: 'x' } },
    };

    const result = validatePortfolioConfig(withLocale);

    expect(result).toEqual({
      success: false,
      error: 'Invalid portfolio configuration: localizations.zh-CN.labels.unsupported is not a supported resume label.',
    });
  });

  it('rejects a localization that nests another localizations map', () => {
    const withLocale = structuredClone(DEFAULT_PORTFOLIO_CONFIG) as unknown as Record<string, unknown>;
    withLocale.localizations = {
      'zh-CN': { label: '中文', localizations: {} },
    };

    const result = validatePortfolioConfig(withLocale);

    expect(result).toEqual({
      success: false,
      error: 'Invalid portfolio configuration: localizations.zh-CN must not contain nested localizations or system data.',
    });
  });

  it('rejects an empty-string locale', () => {
    const withLocale = structuredClone(DEFAULT_PORTFOLIO_CONFIG) as unknown as Record<string, unknown>;
    withLocale.locale = '   ';

    const result = validatePortfolioConfig(withLocale);

    expect(result).toEqual({
      success: false,
      error: 'Invalid portfolio configuration: locale must be a non-empty string.',
    });
  });

  it('rejects an unsafe external URL inside a localized contact override', () => {
    const withLocale = structuredClone(DEFAULT_PORTFOLIO_CONFIG) as unknown as Record<string, unknown>;
    withLocale.localizations = {
      'zh-CN': { label: '中文', contact: { github: 'javascript:alert(1)' } },
    };

    const result = validatePortfolioConfig(withLocale);

    expect(result).toEqual({
      success: false,
      error: 'Invalid portfolio configuration: localizations.zh-CN.contact.github must be an HTTP(S) URL or bare host.',
    });
  });
});
