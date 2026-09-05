export function normalizeExternalUrl(url: string): string | null {
  const value = url.trim();
  if (!value) return null;

  const candidate = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`;

  try {
    const parsed = new URL(candidate);
    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) return null;
    return candidate;
  } catch {
    return null;
  }
}

export function safeExternalHref(url: string): string | undefined {
  return normalizeExternalUrl(url) ?? undefined;
}
