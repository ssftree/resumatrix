# ATS-friendly resume export design

## Goal

Create one semantic, printable resume document for both the shared resume modal and the Academic template. The export must remain selectable HTML text, support validated locale-specific content with a deterministic fallback, and expose one watermark policy seam for a future entitlement check.

This change remains entirely client-side. It does not add translation, payment, account, or server-rendering services, and the default portfolio will not ship with a machine-generated Chinese translation.

## Current constraints

- `PortfolioConfig` remains the only profile data source, including localized resume content.
- Imported JSON and `localStorage` are untrusted and must pass the existing validator before reaching React state.
- The seven templates, Resume view, and split preview continue to receive the same base `PortfolioConfig`; selecting a resume locale affects only the export projection and does not mutate the saved base profile.
- Template navigation and non-resume visual languages are unchanged.
- Print output must be readable on white paper and must not include controls, overlay chrome, decorative icons, or other application content.

## Architecture

### Shared document boundary

Add a pure `ResumeDocument` component responsible for the resume's content hierarchy. `ResumeModal` and `AcademicView` keep their existing shells and navigation, but both render this document instead of maintaining independent resume markup.

The component receives:

```ts
interface ResumeDocumentProps {
  config: PortfolioConfig;
  labels: ResumeLabels;
  presentation: 'themed' | 'academic';
  watermark: 'brand' | 'none';
  accentColor?: string;
}
```

`presentation` preserves the two screen contexts without forking content markup. Print styles normalize both variants to the same single-column black-on-white document.

The semantic outline is:

```html
<article data-resume-document>
  <header>
    <h1>...</h1>
    <address>...</address>
  </header>
  <section aria-labelledby="resume-summary-heading"><h2>...</h2></section>
  <section aria-labelledby="resume-skills-heading"><h2>...</h2><dl>...</dl></section>
  <section aria-labelledby="resume-experience-heading"><h2>...</h2><ol><li>...</li></ol></section>
  <section aria-labelledby="resume-projects-heading"><h2>...</h2><ul><li>...</li></ul></section>
  <section aria-labelledby="resume-education-heading"><h2>...</h2><ol><li>...</li></ol></section>
  <footer data-resume-watermark>...</footer>
</article>
```

Headings use a consistent hierarchy, contact values remain literal link text, and every experience, project, and education record is a list item. Decorative Lucide icons stay in the surrounding toolbar rather than the exported document. Each record receives `break-inside: avoid`, while sections may flow across pages.

### Locale data model

Extend `PortfolioConfig` with optional resume-only locale metadata:

```ts
interface ResumeLabels {
  documentTitle: string;
  summary: string;
  skills: string;
  experience: string;
  technologies: string;
  projects: string;
  stack: string;
  education: string;
  print: string;
  watermark: string;
}

interface PortfolioLocalization {
  label: string;
  labels?: Partial<ResumeLabels>;
  profile?: Partial<DeveloperProfile>;
  contact?: Partial<ContactInfo>;
  skills?: SkillCategory[];
  experience?: Experience[];
  projects?: Project[];
  education?: EducationItem[];
}

interface PortfolioConfig {
  // existing fields
  locale?: string;
  localizations?: Record<string, PortfolioLocalization>;
}
```

The base content is identified by `locale`, defaulting to `en`. Each key in `localizations` is a non-empty locale identifier; authors should use BCP 47 tags such as `zh-CN`. A locale entry contains only translated resume-facing fields: profile and contact objects merge shallowly; collection fields replace the corresponding collection as a unit when present. Whole-section replacement avoids unstable index matching and does not duplicate unrelated `system` data.

`resolveResumeLocale(config, requestedLocale)` returns `{ config, labels, locale }` without mutating the input. It applies a validated matching localization when present. A missing or unknown locale returns the base config and English default labels. Missing fields inside a known localization fall back to the base field or default label.

Both export shells own ephemeral selected-locale state. A labelled `<select>` appears only when at least one localization exists, includes the base locale and configured localizations, and resets to the base locale when a changed config no longer contains the selection. Locale selection is not persisted and does not alter other templates.

### Validation and trust boundary

The existing `validatePortfolioConfig` function validates `locale` and every `localizations` entry before storing imported or persisted data:

- locale keys, `locale`, and localization `label` must be non-empty strings;
- `labels` may contain only the known string fields;
- localized profile/contact fields use the same string and URL validation as base data;
- localized collections use the same readers as their base counterparts;
- localization entries cannot contain nested `localizations` or `system` data;
- unknown fields continue to be discarded by normalization.

This keeps the resolver simple: it only accepts an already normalized `PortfolioConfig` and never interprets arbitrary JSON.

## Export and watermark flow

`App` owns a single `resumeWatermark` value and passes it to every `ResumeModal` instance and to `AcademicView`. The initial value is `'brand'`. A future entitlement result can change this one value to `'none'`; no resume DOM or portfolio data changes are needed.

`ResumeDocument` renders the brand footer only when the policy is `'brand'`. The footer is ordinary text so it remains accessible and predictable in print; it is not a background image or pseudo-element. The `'none'` branch omits the footer entirely.

Each shell retains a normal button that calls `window.print()`. Print CSS hides the application outside the active document, removes modal/paper decoration, expands scroll containers, uses one column, prints full URLs, and sets A4-friendly margins. Screen-only controls use the existing `print:hidden` convention and explicit accessible labels.

## Error and fallback behavior

- An invalid imported localization rejects the full imported config with a field-specific validation error, matching current all-or-nothing import behavior.
- Selecting a removed or unknown locale falls back to the base locale without throwing.
- Optional empty education data omits the Education section rather than rendering hard-coded credentials.
- Empty optional contact links are omitted. Present links use the existing normalized HTTP(S) values.
- Printing remains a browser-native action; cancellation is not treated as an error.

## Test strategy

Follow red-green-refactor for each behavior.

1. Utility tests prove locale merge, partial-field fallback, unknown-locale fallback, input immutability, URL normalization, and rejection of malformed localization fields.
2. Component tests prove one semantic `article` with the expected heading/list structure, full contact link text, optional education behavior, and exact watermark inclusion/omission.
3. Shell tests prove the Modal and Academic entry points render the shared document, expose the locale selector when translations exist, update visible content, and call `window.print()`.
4. Existing accessibility tests continue to cover dialog focus and Escape behavior; the new selector has an accessible label and print button names remain explicit.
5. Run the full Vitest suite, `npm run lint`, and `npm run build`.
6. In a real browser, inspect Resume Modal and Academic at desktop and 390 px. For each entry point, switch a fixture locale, open print preview, confirm only the single-column resume prints, verify selectable text/full URLs/page breaks, and exercise both watermark policies.

## Acceptance mapping

- ATS-friendly structure: the shared `article/header/address/section/h2/dl/ol/ul/li` document replaces two divergent presentation-first DOM trees and remains text-based.
- Multilingual export: validated optional `localizations`, a pure resolver, selectors in both export shells, and explicit fallback deliver an end-to-end extension point without translation infrastructure.
- Commercial seam: the App-owned `'brand' | 'none'` policy controls one optional footer.
- Canonical data: all base and localized resume content stays inside the validated `PortfolioConfig` passed from `App`.
