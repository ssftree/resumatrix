import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ConfigCustomizerModal } from './ConfigCustomizerModal';
import { DEFAULT_PORTFOLIO_CONFIG } from '../portfolio.config';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

const openAiTab = () => {
  const onSaveConfig = vi.fn();
  render(
    <ConfigCustomizerModal
      isOpen
      onClose={vi.fn()}
      config={DEFAULT_PORTFOLIO_CONFIG}
      onSaveConfig={onSaveConfig}
      onResetConfig={vi.fn()}
    />,
  );
  fireEvent.click(screen.getByRole('button', { name: /AI Import/i }));
  return { onSaveConfig };
};

describe('ConfigCustomizerModal — AI Import tab', () => {
  it('exposes the endpoint, key and résumé inputs', () => {
    openAiTab();
    expect(screen.getByLabelText('API Base URL')).toBeTruthy();
    expect(screen.getByLabelText('Model')).toBeTruthy();
    expect(screen.getByLabelText('API Key')).toBeTruthy();
    expect(screen.getByLabelText('Résumé Text')).toBeTruthy();
  });

  it('offers PDF and Word résumé uploads', () => {
    const { container } = render(
      <ConfigCustomizerModal
        isOpen
        onClose={vi.fn()}
        config={DEFAULT_PORTFOLIO_CONFIG}
        onSaveConfig={vi.fn()}
        onResetConfig={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /AI Import/i }));

    expect(screen.getByRole('button', { name: /Upload PDF \/ Word/i })).toBeTruthy();
    const fileInput = container.querySelector('input[type="file"][accept*=".pdf"]');
    expect(fileInput).toBeTruthy();
    expect(fileInput?.getAttribute('accept')).toContain('.docx');
  });

  it('defaults to DeepSeek and swaps the endpoint when another provider is picked', () => {
    openAiTab();
    expect((screen.getByLabelText('Provider') as HTMLSelectElement).value).toBe('deepseek');
    expect((screen.getByLabelText('API Base URL') as HTMLInputElement).value).toBe(
      'https://api.deepseek.com/v1',
    );

    fireEvent.change(screen.getByLabelText('Provider'), { target: { value: 'openai' } });
    expect((screen.getByLabelText('API Base URL') as HTMLInputElement).value).toBe(
      'https://api.openai.com/v1',
    );
    expect((screen.getByLabelText('Model') as HTMLInputElement).value).toBe('gpt-4o-mini');
  });

  it('blocks parsing and shows guidance when the key is missing', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    openAiTab();

    fireEvent.change(screen.getByLabelText('Résumé Text'), {
      target: { value: 'Grace Hopper — compiler pioneer' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Parse & Autofill/i }));

    expect(await screen.findByText(/Add an API key/i)).toBeTruthy();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('applies a parsed résumé to the config', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ profile: { name: 'Radia Perlman' } }) } }],
      }),
    } as Response);

    const { onSaveConfig } = openAiTab();
    fireEvent.change(screen.getByLabelText('API Key'), { target: { value: 'sk-test' } });
    fireEvent.change(screen.getByLabelText('Résumé Text'), {
      target: { value: 'Radia Perlman — network engineer' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Parse & Autofill/i }));

    await waitFor(() => expect(onSaveConfig).toHaveBeenCalled());
    const applied = onSaveConfig.mock.calls.at(-1)?.[0];
    expect(applied.profile.name).toBe('Radia Perlman');
    expect(screen.getByText(/parsed and applied/i)).toBeTruthy();
  });
});
