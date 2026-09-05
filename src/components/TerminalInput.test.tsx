import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TerminalInput } from './TerminalInput';
import { THEMES } from '../utils/themes';

describe('TerminalInput autocomplete', () => {
  it('completes the multi-word sudo hire me command', () => {
    render(
      <TerminalInput
        currentPath="~"
        theme={THEMES.matrix}
        onSubmit={vi.fn()}
        onClear={vi.fn()}
      />,
    );
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'sudo h' } });
    fireEvent.keyDown(input, { key: 'Tab' });

    expect(input).toHaveProperty('value', 'sudo hire me');
  });
});
