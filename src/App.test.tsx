import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { DEFAULT_PORTFOLIO_CONFIG } from './portfolio.config';

const runCommand = (command: string) => {
  const input = document.querySelector<HTMLInputElement>('#terminal-active-input');
  expect(input).not.toBeNull();
  fireEvent.change(input!, { target: { value: command } });
  fireEvent.keyDown(input!, { key: 'Enter' });
};

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

  it('builds the sudo hire me result from the active portfolio configuration', async () => {
    const config = structuredClone(DEFAULT_PORTFOLIO_CONFIG);
    config.profile.name = 'Ada Lovelace';
    config.profile.title = 'Computing Pioneer';
    config.profile.status = 'Available for impossible problems';
    config.contact.email = 'ada@example.test';
    localStorage.setItem('portfolio_config_v2', JSON.stringify(config));
    render(<App />);

    runCommand('sudo hire me');

    expect(await screen.findByText(/PRIVILEGE ESCALATION GRANTED/)).toBeTruthy();
    expect(screen.getByText(/Candidate\s+: Ada Lovelace/)).toBeTruthy();
    expect(screen.getByText(/Role\s+: Computing Pioneer/)).toBeTruthy();
    expect(screen.getByText(/Status\s+: Available for impossible problems/)).toBeTruthy();
    expect(screen.getByText(/Next step\s+: mailto:ada@example\.test/)).toBeTruthy();
  });

  it('plays one deterministic rock-paper-scissors round', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<App />);

    runCommand('rps paper');

    expect(await screen.findByText(/You: paper \| Terminal: rock/)).toBeTruthy();
    expect(screen.getByText(/Result: You win/)).toBeTruthy();
  });

  it('reports rps usage for an invalid move', async () => {
    render(<App />);

    runCommand('rps lizard');

    expect(await screen.findByText('Usage: rps <rock|paper|scissors>')).toBeTruthy();
  });

  it('makes easter egg commands unavailable when configuration disables them', async () => {
    const config = structuredClone(DEFAULT_PORTFOLIO_CONFIG);
    config.terminal = { easterEggsEnabled: false };
    localStorage.setItem('portfolio_config_v2', JSON.stringify(config));
    render(<App />);

    runCommand('sudo hire me');

    expect(await screen.findByText('Terminal easter eggs are disabled in this portfolio configuration.')).toBeTruthy();
  });
});
