import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ResumeDocument } from './ResumeDocument';
import { DEFAULT_PORTFOLIO_CONFIG } from '../portfolio.config';
import { DEFAULT_RESUME_LABELS } from '../utils/resumeLocale';
import { PortfolioConfig } from '../types';

afterEach(() => {
  cleanup();
});

describe('ResumeDocument', () => {
  it('renders one semantic article with the expected heading and list structure', () => {
    render(
      <ResumeDocument
        config={DEFAULT_PORTFOLIO_CONFIG}
        labels={DEFAULT_RESUME_LABELS}
        presentation="themed"
        watermark="none"
      />,
    );

    const article = screen.getByRole('article');
    expect(article.hasAttribute('data-resume-document')).toBe(true);
    expect(screen.getByRole('heading', { level: 1, name: DEFAULT_PORTFOLIO_CONFIG.profile.name })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: DEFAULT_RESUME_LABELS.summary })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: DEFAULT_RESUME_LABELS.experience })).toBeTruthy();
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);
  });

  it('shows full contact link text rather than an icon-only affordance', () => {
    render(
      <ResumeDocument
        config={DEFAULT_PORTFOLIO_CONFIG}
        labels={DEFAULT_RESUME_LABELS}
        presentation="themed"
        watermark="none"
      />,
    );

    const githubLink = screen.getByRole('link', { name: /github\.com/i });
    expect(githubLink.getAttribute('href')).toBe(DEFAULT_PORTFOLIO_CONFIG.contact.github);
  });

  it('omits the education section when the config has no education entries', () => {
    const withoutEducation: PortfolioConfig = { ...DEFAULT_PORTFOLIO_CONFIG, education: undefined };
    render(
      <ResumeDocument
        config={withoutEducation}
        labels={DEFAULT_RESUME_LABELS}
        presentation="themed"
        watermark="none"
      />,
    );

    expect(screen.queryByRole('heading', { name: DEFAULT_RESUME_LABELS.education })).toBeNull();
  });

  it('renders the education section when the config includes entries', () => {
    const withEducation: PortfolioConfig = {
      ...DEFAULT_PORTFOLIO_CONFIG,
      education: [
        { degree: 'B.S.', field: 'Computer Science', institution: 'Example University', location: 'Remote', period: '2016 - 2020' },
      ],
    };
    render(
      <ResumeDocument
        config={withEducation}
        labels={DEFAULT_RESUME_LABELS}
        presentation="themed"
        watermark="none"
      />,
    );

    expect(screen.getByRole('heading', { name: DEFAULT_RESUME_LABELS.education })).toBeTruthy();
    expect(screen.getByText('Example University', { exact: false })).toBeTruthy();
  });

  it('includes the watermark footer only when the policy is brand', () => {
    const { rerender } = render(
      <ResumeDocument
        config={DEFAULT_PORTFOLIO_CONFIG}
        labels={DEFAULT_RESUME_LABELS}
        presentation="themed"
        watermark="brand"
      />,
    );

    expect(document.querySelector('[data-resume-watermark]')).not.toBeNull();

    rerender(
      <ResumeDocument
        config={DEFAULT_PORTFOLIO_CONFIG}
        labels={DEFAULT_RESUME_LABELS}
        presentation="themed"
        watermark="none"
      />,
    );

    expect(document.querySelector('[data-resume-watermark]')).toBeNull();
  });
});
