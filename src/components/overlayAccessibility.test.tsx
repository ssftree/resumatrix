import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ConfigCustomizerModal } from './ConfigCustomizerModal';
import { MatrixRain } from './MatrixRain';
import { ResumeModal } from './ResumeModal';
import { TemplateSwitcher } from './TemplateSwitcher';
import { DEFAULT_PORTFOLIO_CONFIG } from '../portfolio.config';
import { ThemeConfig } from '../types';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

beforeEach(() => {
  vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    fillRect: vi.fn(),
    fillText: vi.fn(),
    fillStyle: '',
    font: '',
  } as unknown as CanvasRenderingContext2D);
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

describe('overlay accessibility', () => {
  it('keeps every template option inside a horizontally scrollable navigation region', () => {
    render(
      <TemplateSwitcher
        currentTemplate="terminal"
        onSelectTemplate={vi.fn()}
        onOpenCustomizer={vi.fn()}
      />,
    );

    const navigation = screen.getByRole('navigation', { name: 'Portfolio layouts' });

    expect(navigation.style.maxWidth).toBe('calc(100vw - 2rem)');
    expect(screen.getByRole('button', { name: /customize/i })).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(8);
  });

  it('lets a keyboard user exit the Matrix overlay', () => {
    const onClose = vi.fn();
    render(<MatrixRain active onClose={onClose} />);

    expect(screen.getByRole('dialog', { name: 'Matrix stream' })).toBeTruthy();
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('gives the resume dialog a labelled initial close control and restores focus after Escape', () => {
    const onClose = vi.fn();
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    render(<ResumeModal isOpen onClose={onClose} theme={theme} />);

    expect(screen.getByRole('dialog', { name: /curriculum vitae/i })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close résumé' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    cleanup();

    expect(onClose).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(opener);
    opener.remove();
  });

  it('contains Tab navigation within the resume dialog', () => {
    render(<ResumeModal isOpen onClose={vi.fn()} theme={theme} />);
    const lastLink = screen.getAllByRole('link').at(-1)!;
    lastLink.focus();
    fireEvent.keyDown(document, { key: 'Tab' });

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Print / PDF' }));
  });

  it('gives the customizer dialog a labelled initial close control and contains Tab navigation', () => {
    render(
      <ConfigCustomizerModal
        isOpen
        onClose={vi.fn()}
        config={DEFAULT_PORTFOLIO_CONFIG}
        onSaveConfig={vi.fn()}
        onResetConfig={vi.fn()}
      />,
    );

    expect(screen.getByRole('dialog', { name: /portfolio replicator/i })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close customizer' }));
    const done = screen.getByRole('button', { name: 'Done' });
    done.focus();
    fireEvent.keyDown(document, { key: 'Tab' });

    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close customizer' }));
  });

  it('describes all seven layouts and treats exported JSON as a backup', () => {
    render(
      <ConfigCustomizerModal
        isOpen
        onClose={vi.fn()}
        config={DEFAULT_PORTFOLIO_CONFIG}
        onSaveConfig={vi.fn()}
        onResetConfig={vi.fn()}
      />,
    );

    expect(screen.getByText(/all 7 styles/i)).toBeTruthy();
    expect(screen.getByText(/backup or transfer/i)).toBeTruthy();
    expect(screen.queryByText(/place in repository root/i)).toBeNull();
  });
});
