import { describe, expect, it } from 'vitest';
import { DEFAULT_PORTFOLIO_CONFIG } from '../portfolio.config';
import type { PortfolioConfig } from '../types';
import {
  createPortfolioShareHash,
  parsePortfolioConfigJson,
  parsePortfolioShareHash,
  validatePortfolioConfig,
} from './portfolioConfig';

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

  it('keeps older configurations without terminal preferences compatible', () => {
    const legacyConfig = structuredClone(DEFAULT_PORTFOLIO_CONFIG) as unknown as Record<string, unknown>;
    delete legacyConfig.terminal;

    const result = validatePortfolioConfig(legacyConfig);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.terminal).toBeUndefined();
  });

  it('preserves a valid setting that disables terminal easter eggs', () => {
    const config = structuredClone(DEFAULT_PORTFOLIO_CONFIG);
    config.terminal = { easterEggsEnabled: false };

    const result = validatePortfolioConfig(config);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.terminal).toEqual({ easterEggsEnabled: false });
  });

  it('rejects a non-boolean terminal easter egg setting', () => {
    const config = structuredClone(DEFAULT_PORTFOLIO_CONFIG) as unknown as Record<string, unknown>;
    config.terminal = { easterEggsEnabled: 'yes' };

    expect(validatePortfolioConfig(config)).toEqual({
      success: false,
      error: 'Invalid portfolio configuration: terminal.easterEggsEnabled must be a boolean.',
    });
  });

  it('defaults legacy configurations to showing the Made with badge', () => {
    const legacyConfig = structuredClone(DEFAULT_PORTFOLIO_CONFIG) as PortfolioConfig;
    delete legacyConfig.branding;

    const result = validatePortfolioConfig(legacyConfig);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.branding).toEqual({ showMadeWith: true });
  });

  it('preserves an explicitly disabled Made with badge', () => {
    const config = structuredClone(DEFAULT_PORTFOLIO_CONFIG);
    config.branding = { showMadeWith: false };

    const result = validatePortfolioConfig(config);

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.branding?.showMadeWith).toBe(false);
  });
});

describe('portfolio share hash', () => {
  it('round-trips the selected template and Unicode portfolio content through validation', () => {
    const config = structuredClone(DEFAULT_PORTFOLIO_CONFIG);
    config.profile.name = '傅杉杉';

    const result = parsePortfolioShareHash(createPortfolioShareHash('bento', config));

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.template).toBe('bento');
    expect(result.data.config.profile.name).toBe('傅杉杉');
  });

  it('rejects malformed share data without throwing', () => {
    const result = parsePortfolioShareHash('#portfolio=%7Bbroken');

    expect(result.success).toBe(false);
  });

  it('rejects an unsupported shared template', () => {
    const payload = encodeURIComponent(JSON.stringify({
      template: 'unknown',
      config: DEFAULT_PORTFOLIO_CONFIG,
    }));

    const result = parsePortfolioShareHash(`#portfolio=${payload}`);

    expect(result).toEqual({ success: false, error: 'Invalid portfolio share: unsupported template.' });
  });
});
