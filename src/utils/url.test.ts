import { describe, expect, it } from 'vitest';
import { normalizeExternalUrl, safeExternalHref } from './url';

describe('normalizeExternalUrl', () => {
  it('keeps an absolute HTTPS URL intact', () => {
    expect(normalizeExternalUrl('https://github.com/example/project')).toBe(
      'https://github.com/example/project'
    );
  });

  it('adds HTTPS to a bare external host', () => {
    expect(normalizeExternalUrl('github.com/example/project')).toBe(
      'https://github.com/example/project'
    );
  });

  it.each(['javascript:alert(1)', 'data:text/html,hello', 'file:///etc/passwd']) (
    'rejects the unsafe protocol in %s',
    (url) => {
      expect(normalizeExternalUrl(url)).toBeNull();
    }
  );

  it('rejects empty or malformed external URLs', () => {
    expect(normalizeExternalUrl('')).toBeNull();
    expect(normalizeExternalUrl('https://')).toBeNull();
  });

  it('provides an href-safe undefined fallback for renderers', () => {
    expect(safeExternalHref('javascript:alert(1)')).toBeUndefined();
  });
});
