import { describe, expect, it } from 'vitest';
import { DEFAULT_PORTFOLIO_CONFIG } from '../portfolio.config';
import { PortfolioConfig } from '../types';
import { DEFAULT_RESUME_LABELS, listResumeLocales, resolveResumeLocale } from './resumeLocale';

const withLocalization = (): PortfolioConfig => ({
  ...DEFAULT_PORTFOLIO_CONFIG,
  locale: 'en',
  localizations: {
    'zh-CN': {
      label: '中文',
      labels: { summary: '个人简介' },
      profile: { bio: '经验丰富的全栈工程师。' },
    },
  },
});

describe('resolveResumeLocale', () => {
  it('returns the base config and default labels when no locale is requested', () => {
    const config = withLocalization();

    const resolved = resolveResumeLocale(config, undefined);

    expect(resolved.locale).toBe('en');
    expect(resolved.config).toBe(config);
    expect(resolved.labels).toEqual(DEFAULT_RESUME_LABELS);
  });

  it('merges a known localization over the base config without mutating it', () => {
    const config = withLocalization();
    const snapshot = structuredClone(config);

    const resolved = resolveResumeLocale(config, 'zh-CN');

    expect(resolved.locale).toBe('zh-CN');
    expect(resolved.config.profile.bio).toBe('经验丰富的全栈工程师。');
    expect(resolved.labels.summary).toBe('个人简介');
    expect(config).toEqual(snapshot);
  });

  it('falls back to the base field when a localized profile omits it', () => {
    const config = withLocalization();

    const resolved = resolveResumeLocale(config, 'zh-CN');

    expect(resolved.config.profile.name).toBe(config.profile.name);
    expect(resolved.config.profile.title).toBe(config.profile.title);
  });

  it('falls back to base content and default labels for an unknown locale', () => {
    const config = withLocalization();

    const resolved = resolveResumeLocale(config, 'fr-FR');

    expect(resolved.locale).toBe('en');
    expect(resolved.config).toBe(config);
    expect(resolved.labels).toEqual(DEFAULT_RESUME_LABELS);
  });

  it('replaces a whole collection rather than merging it entry by entry', () => {
    const config: PortfolioConfig = {
      ...DEFAULT_PORTFOLIO_CONFIG,
      localizations: {
        'zh-CN': {
          label: '中文',
          education: [
            { degree: '硕士', field: '计算机科学', institution: '示例大学', location: '杭州', period: '2016 - 2018' },
          ],
        },
      },
    };

    const resolved = resolveResumeLocale(config, 'zh-CN');

    expect(resolved.config.education).toHaveLength(1);
    expect(resolved.config.education?.[0].institution).toBe('示例大学');
  });
});

describe('listResumeLocales', () => {
  it('returns no options when a config has no localizations', () => {
    expect(listResumeLocales(DEFAULT_PORTFOLIO_CONFIG)).toEqual([]);
  });

  it('lists the base locale alongside every configured localization', () => {
    const config = withLocalization();

    expect(listResumeLocales(config)).toEqual([
      { value: 'en', label: 'en' },
      { value: 'zh-CN', label: '中文' },
    ]);
  });
});
