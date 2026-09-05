import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ResumeModal } from './ResumeModal';
import { AcademicView } from './templates/AcademicView';
import { DEFAULT_PORTFOLIO_CONFIG } from '../portfolio.config';
import { PortfolioConfig, ThemeConfig } from '../types';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const theme: ThemeConfig = {
  id: 'matrix',
  name: 'Matrix',
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
  accentBg: '#010',
  cursor: '#0f0',
  highlight: '#050',
  error: '#f00',
  success: '#0f0',
};

const configWithLocalization: PortfolioConfig = {
  ...DEFAULT_PORTFOLIO_CONFIG,
  locale: 'en',
  localizations: {
    'zh-CN': {
      label: '中文',
      profile: { bio: '经验丰富的全栈工程师。' },
    },
  },
};

describe('ResumeModal export shell', () => {
  it('renders the shared resume document and calls window.print', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    render(<ResumeModal isOpen onClose={vi.fn()} theme={theme} config={DEFAULT_PORTFOLIO_CONFIG} />);

    expect(document.querySelector('[data-resume-document]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /print/i }));

    expect(printSpy).toHaveBeenCalledOnce();
  });

  it('hides the language selector when the config has no localizations', () => {
    render(<ResumeModal isOpen onClose={vi.fn()} theme={theme} config={DEFAULT_PORTFOLIO_CONFIG} />);

    expect(screen.queryByRole('combobox', { name: /resume language/i })).toBeNull();
  });

  it('shows a language selector and switches visible content when localizations exist', () => {
    render(<ResumeModal isOpen onClose={vi.fn()} theme={theme} config={configWithLocalization} />);

    const select = screen.getByRole('combobox', { name: /resume language/i });
    expect(screen.queryByText('经验丰富的全栈工程师。')).toBeNull();

    fireEvent.change(select, { target: { value: 'zh-CN' } });

    expect(screen.getByText('经验丰富的全栈工程师。')).toBeTruthy();
  });
});

describe('AcademicView export shell', () => {
  it('renders the shared resume document and calls window.print', () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    render(<AcademicView onSwitchTemplate={vi.fn()} config={DEFAULT_PORTFOLIO_CONFIG} />);

    expect(document.querySelector('[data-resume-document]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /print/i }));

    expect(printSpy).toHaveBeenCalledOnce();
  });

  it('shows a language selector and switches visible content when localizations exist', () => {
    render(<AcademicView onSwitchTemplate={vi.fn()} config={configWithLocalization} />);

    const select = screen.getByRole('combobox', { name: /resume language/i });
    fireEvent.change(select, { target: { value: 'zh-CN' } });

    expect(screen.getByText('经验丰富的全栈工程师。')).toBeTruthy();
  });
});
