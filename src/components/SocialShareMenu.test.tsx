import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SocialShareMenu } from './SocialShareMenu';

const context = {
  url: 'https://example.test/#portfolio=%7B%22template%22%3A%22bento%22%7D',
  title: 'Ada Lovelace — Engineer',
  text: "View Ada Lovelace's portfolio in the bento theme.",
};

describe('SocialShareMenu', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('toggles the menu and exposes one intent per network', () => {
    render(<SocialShareMenu getShareContext={() => context} />);

    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Share to social media' }));

    expect(screen.getByRole('menuitem', { name: 'Share on X' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Share on LinkedIn' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Share on Facebook' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Share on Telegram' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'Share via email' })).toBeTruthy();
  });

  it('opens the LinkedIn intent in a new tab with the share url', () => {
    const open = vi.fn();
    vi.stubGlobal('open', open);
    render(<SocialShareMenu getShareContext={() => context} />);

    fireEvent.click(screen.getByRole('button', { name: 'Share to social media' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Share on LinkedIn' }));

    expect(open).toHaveBeenCalledWith(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(context.url)}`,
      '_blank',
      'noopener,noreferrer',
    );
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('closes on Escape', () => {
    render(<SocialShareMenu getShareContext={() => context} />);
    fireEvent.click(screen.getByRole('button', { name: 'Share to social media' }));
    expect(screen.getByRole('menu')).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
  });
});
