import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DEFAULT_PORTFOLIO_CONFIG } from '../portfolio.config';
import type { PortfolioConfig, ThemeConfig } from '../types';
import { GuiPreview } from './GuiPreview';
import { BentoView } from './templates/BentoView';
import { IdeView } from './templates/IdeView';

const customConfig: PortfolioConfig = {
  ...DEFAULT_PORTFOLIO_CONFIG,
  profile: {
    ...DEFAULT_PORTFOLIO_CONFIG.profile,
    name: 'Config Driven Developer',
  },
  contact: {
    ...DEFAULT_PORTFOLIO_CONFIG.contact,
    email: 'config@example.test',
    github: 'https://github.com/config-driven',
  },
  skills: [
    {
      title: 'Config Skills',
      icon: 'code',
      skills: [{ name: 'Config TypeScript', level: 100 }],
    },
  ],
  experience: [
    {
      period: 'Now',
      role: 'Config Engineer',
      company: 'Config Co',
      location: 'Remote',
      description: 'Builds configurable products.',
      achievements: ['Configured every view'],
      skills: ['Config TypeScript'],
    },
  ],
  projects: [
    {
      id: 'config-project',
      title: 'Config Project',
      tagline: 'A project supplied by PortfolioConfig',
      description: 'Renders consistently across templates.',
      category: 'Full-Stack',
      tags: ['Config TypeScript'],
      githubUrl: 'https://github.com/config-driven/project',
      demoUrl: 'config.example.test/demo',
      year: '2026',
      highlights: ['Config-first'],
    },
  ],
};

const theme: ThemeConfig = {
  id: 'matrix',
  name: 'Test',
  description: 'Test theme',
  bg: '#000',
  surface: '#111',
  border: '#222',
  text: '#fff',
  textMuted: '#aaa',
  promptUser: '#fff',
  promptHost: '#fff',
  promptPath: '#fff',
  accent: '#0f0',
  accentBg: '#030',
  cursor: '#0f0',
  highlight: '#0f0',
  error: '#f00',
  success: '#0f0',
};

describe('config-driven template content', () => {
  it('renders GuiPreview project content from PortfolioConfig', () => {
    const markup = renderToStaticMarkup(
      <GuiPreview
        config={customConfig}
        theme={theme}
        onClose={() => undefined}
        onRunTerminalCommand={() => undefined}
      />
    );

    expect(markup).toContain('Config Project');
    expect(markup).not.toContain('HyperShell');
  });

  it('renders Bento contact, content, and normalized project links from PortfolioConfig', () => {
    const markup = renderToStaticMarkup(
      <BentoView
        config={customConfig}
        onSwitchTemplate={() => undefined}
        onOpenResumeModal={() => undefined}
      />
    );

    expect(markup).toContain('Config Driven Developer');
    expect(markup).toContain('config@example.test');
    expect(markup).toContain('Config Skills');
    expect(markup).toContain('Config Engineer');
    expect(markup).toContain('Config Project');
    expect(markup).toContain('href="https://github.com/config-driven/project"');
    expect(markup).toContain('href="https://config.example.test/demo"');
  });

  it('renders IDE identity from PortfolioConfig rather than the legacy profile fixture', () => {
    const markup = renderToStaticMarkup(
      <IdeView config={customConfig} onSwitchTemplate={() => undefined} />
    );

    expect(markup).toContain('config-driven-developer-portfolio');
    expect(markup).toContain('Config Driven Developer');
    expect(markup).not.toContain('ssfu');
  });

  it('never emits unsafe project protocols even for an in-progress customizer draft', () => {
    const unsafeDraft: PortfolioConfig = {
      ...customConfig,
      projects: [{ ...customConfig.projects[0], demoUrl: 'javascript:alert(1)' }],
    };

    const markup = renderToStaticMarkup(
      <GuiPreview
        config={unsafeDraft}
        theme={theme}
        onClose={() => undefined}
        onRunTerminalCommand={() => undefined}
      />
    );

    expect(markup).not.toContain('javascript:');
  });
});
