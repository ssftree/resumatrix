import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TemplateSwitcher } from './TemplateSwitcher';

describe('TemplateSwitcher', () => {
  afterEach(cleanup);

  it('offers the DevOps template and selects it', () => {
    const onSelectTemplate = vi.fn();

    render(
      <TemplateSwitcher
        currentTemplate="terminal"
        onSelectTemplate={onSelectTemplate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /devops/i }));

    expect(onSelectTemplate).toHaveBeenCalledWith('devops');
  });
});
