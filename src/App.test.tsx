import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

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
});
