import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { DEFAULT_PORTFOLIO_CONFIG } from './portfolio.config';

describe('App browser state integration', () => {
  let fullscreenElement: Element | null;

  beforeEach(() => {
    localStorage.clear();
    fullscreenElement = null;
    Element.prototype.scrollIntoView = vi.fn();
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => fullscreenElement,
    });
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      configurable: true,
      value: vi.fn(async () => {
        fullscreenElement = document.documentElement;
      }),
    });
    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: vi.fn(async () => {
        fullscreenElement = null;
      }),
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('tracks fullscreen changes initiated outside the app button', async () => {
    render(<App />);

    const fullscreenButton = document.querySelector<HTMLButtonElement>('#btn-fullscreen');
    expect(fullscreenButton).not.toBeNull();
    fireEvent.click(fullscreenButton!);
    await waitFor(() => expect(fullscreenButton?.title).toBe('Exit Fullscreen'));

    fullscreenElement = null;
    document.dispatchEvent(new Event('fullscreenchange'));

    await waitFor(() => expect(fullscreenButton?.title).toBe('Fullscreen'));
  });

  it('renders the DevOps control plane from the saved PortfolioConfig', () => {
    localStorage.setItem(
      'portfolio_config_v2',
      JSON.stringify({
        ...DEFAULT_PORTFOLIO_CONFIG,
        profile: {
          ...DEFAULT_PORTFOLIO_CONFIG.profile,
          name: 'Pipeline Operator',
          title: 'Platform Engineer',
          status: 'Shipping safely',
        },
        contact: {
          ...DEFAULT_PORTFOLIO_CONFIG.contact,
          email: 'ops@example.test',
        },
        skills: [
          {
            title: 'Delivery Toolchain',
            icon: 'terminal',
            skills: [{ name: 'Release Automation', level: 96 }],
          },
        ],
        experience: [
          {
            period: '2024 — Now',
            role: 'Release Engineer',
            company: 'Reliable Systems',
            location: 'Remote',
            description: 'Keeps delivery boring.',
            achievements: ['Zero-downtime migrations'],
            skills: ['Release Automation'],
          },
        ],
        projects: [
          {
            id: 'safe-deploy',
            title: 'Safe Deploy',
            tagline: 'Progressive delivery controller',
            description: 'Automates guarded releases.',
            category: 'CLI & Systems',
            tags: ['Release Automation'],
            year: '2026',
            highlights: ['Automatic rollback'],
          },
        ],
      })
    );

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /devops/i }));

    expect(screen.getByRole('heading', { name: /delivery control plane/i })).toBeTruthy();
    expect(screen.getByText('Pipeline Operator')).toBeTruthy();
    expect(screen.getByText('Release Engineer')).toBeTruthy();
    expect(screen.getAllByText('Release Automation').length).toBeGreaterThan(0);
    expect(screen.getByText('Safe Deploy')).toBeTruthy();
    expect(screen.getByText('ops@example.test')).toBeTruthy();
  });

  it('switches to the DevOps template from the terminal command', () => {
    render(<App />);

    const input = document.querySelector<HTMLInputElement>('#terminal-active-input');
    expect(input).not.toBeNull();
    fireEvent.change(input!, { target: { value: 'template devops' } });
    fireEvent.keyDown(input!, { key: 'Enter' });

    expect(screen.getByRole('heading', { name: /delivery control plane/i })).toBeTruthy();
  });
});
