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
});
