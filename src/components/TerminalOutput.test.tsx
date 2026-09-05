import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { TerminalOutput } from './TerminalOutput';
import { THEMES } from '../utils/themes';

describe('TerminalOutput command prompt', () => {
  it('renders the path captured when the command was executed', () => {
    const html = renderToStaticMarkup(
      <TerminalOutput
        item={{
          id: 'pwd-in-secrets',
          command: 'pwd',
          path: '~/secrets',
          timestamp: '12:00:00',
          output: { type: 'text', content: '/home/ssfu/secrets' },
        }}
        theme={THEMES.matrix}
        onExecuteCommand={vi.fn()}
      />,
    );

    expect(html).toContain('>~/secrets</span>');
  });

  it('discovers both easter egg commands from help when enabled', () => {
    const html = renderToStaticMarkup(
      <TerminalOutput
        item={{
          id: 'help',
          command: 'help',
          timestamp: '12:00:00',
          output: { type: 'help' },
        }}
        theme={THEMES.matrix}
        onExecuteCommand={vi.fn()}
      />,
    );

    expect(html).toContain('sudo hire me');
    expect(html).toContain('rps [move]');
  });
});
