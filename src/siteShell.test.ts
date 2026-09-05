import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

describe('static site shell', () => {
  it('declares a favicon that exists in public assets', async () => {
    const html = await readFile(resolve(root, 'index.html'), 'utf8');
    const match = html.match(/<link[^>]+rel=["']icon["'][^>]+href=["']([^"']+)["']/i);

    expect(match?.[1]).toBe('/favicon.svg');
    await expect(access(resolve(root, 'public/favicon.svg'))).resolves.toBeUndefined();
  });
});
