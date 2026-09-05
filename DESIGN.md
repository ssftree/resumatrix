# Terminal Portfolio — Design and Architecture

## Product intent

Terminal Portfolio presents one developer profile through seven deliberately different interfaces. The content should remain consistent while each view demonstrates a different design vocabulary:

| Template | Purpose | Visual language |
| --- | --- | --- |
| Terminal | Primary interactive experience | Unix shell, command history, themes, CRT effects |
| IDE | Source-oriented résumé | VS Code-like explorer, tabs, editor and terminal |
| Bento | Fast visual scan | Dashboard cards, metrics and project filters |
| Retro | Playful exploration | Desktop windows, taskbar and Minesweeper |
| Telemetry | Operations narrative | SRE dashboards, traces and service metrics |
| Brutalism | Editorial portfolio | Swiss grid, high contrast and strong typography |
| Academic | Printable résumé | Paper layout optimized for print/PDF |

The primary invariant is **one profile, many projections**: changing a portfolio field should update every place where that field appears.

## Technical shape

The site is a client-only React 19 application built by Vite and styled with Tailwind CSS 4. There is no server, router, database, authentication layer, or active AI integration.

```text
src/main.tsx
  └─ App.tsx                         application state and command router
      ├─ TemplateSwitcher            global view navigation
      ├─ TerminalHeader/Input/Output terminal interface
      ├─ GuiPreview                  terminal split preview
      ├─ ConfigCustomizerModal       live editing and JSON import/export
      ├─ ResumeModal                 printable résumé overlay
      └─ templates/*                 seven independent presentations

portfolio.config.ts ──> PortfolioConfig ──> App state ──> active presentation
                               ▲
                               └──── localStorage: portfolio_config_v2
```

`App.tsx` currently owns all long-lived UI state: active template, terminal theme and history, visual effects, modals, virtual path, and the active `PortfolioConfig`. Template changes are conditional renders rather than URL routes, so refreshing always returns to Terminal while saved portfolio content persists.

## Data model and ownership

`src/types.ts` defines `PortfolioConfig` and its nested profile, contact, skills, experience, project, education, and system shapes. `src/portfolio.config.ts` is the intended source of truth for default content and presets.

`src/data/portfolioData.ts` predates the unified config. It remains authoritative only for terminal-specific fixtures such as the ASCII banner, neofetch art, and virtual filesystem. Its duplicated profile, project, skill, experience, and contact records are migration debt and should not be used by new UI.

Runtime customization follows this flow:

1. Initialize from validated `portfolio_config_v2` data, otherwise use `DEFAULT_PORTFOLIO_CONFIG`.
2. Edit a local draft in `ConfigCustomizerModal`.
3. Persist an accepted complete config through `App.handleSaveConfig`.
4. Pass the same config into every visible presentation.

Downloaded JSON is currently an export/backup format. Placing it in the repository root does not change a deployment; production defaults still come from `src/portfolio.config.ts`.

## Terminal behavior

`App.executeCommand` parses a trimmed command into a command name and one string argument, performs state changes, and appends a `TerminalHistoryItem`. `TerminalOutput` renders structured result types, while `TerminalInput` owns interactive command history and autocomplete.

Command discovery is distributed across three locations:

- execution aliases in `App.tsx`;
- help content and command chips in `TerminalOutput.tsx`;
- autocomplete and quick actions in `TerminalInput.tsx`.

Until this metadata is centralized, command changes must keep all three synchronized. File commands operate on a small virtual filesystem, not the user's machine.

## Presentation boundaries

Each template accepts `PortfolioConfig` and navigation callbacks. A template may own ephemeral presentation state—selected tabs, open desktop windows, filters, mock telemetry, or copied indicators—but must not own a second copy of portfolio content.

Shared overlays are mounted by `App`. Resume availability is inconsistent today: Terminal, Bento, Retro, Telemetry, and Brutalism can open it, while IDE and Academic provide their own résumé-oriented experiences.

Theme selection affects the Terminal and its shared résumé modal. The other templates intentionally use fixed palettes. This is a product choice rather than a theme propagation defect.

## Responsive and accessibility contract

- At 390 px, global navigation must keep every template and Customize reachable by touch.
- Page content must not introduce document-level horizontal overflow.
- Icon-only controls need accessible names.
- Modals and full-screen effects need an appropriate dialog semantic, initial focus, focus containment, Escape dismissal, and focus restoration.
- Decorative animation should stop when hidden and honor `prefers-reduced-motion`.
- Print actions must exclude controls and preserve readable contrast on white paper.

## Reliability safeguards

- `src/utils/portfolioConfig.ts` validates and normalizes persisted and imported JSON before it reaches application state.
- Every active presentation, including the Terminal split preview, consumes the same `PortfolioConfig` instance.
- External project/contact links pass through a shared URL normalizer that adds HTTPS to bare hosts and rejects non-HTTP(S) schemes.
- Matrix, Resume, and Config overlays expose dialog semantics, contain keyboard focus, restore focus, and close with Escape.
- The global template navigation is viewport-bounded and horizontally scrollable on small screens.
- Fullscreen state follows the browser `fullscreenchange` event.
- Vitest covers configuration recovery, cross-template data consistency, links, overlays, fullscreen state, terminal paths, and static shell assets.

Remaining debt is deliberately narrower: the virtual filesystem still contains static profile prose, terminal-command metadata is distributed across three files, and a social preview image/canonical production URL must be supplied before launch.

## Change direction

Prioritize correctness before adding more templates:

1. Derive virtual-filesystem profile files from `PortfolioConfig` and remove the remaining duplicated profile records.
2. Centralize template and terminal-command metadata.
3. Expand automated tests around command routing, Retro window interactions, and print output.

Avoid a broad visual component abstraction: the templates are valuable because they are structurally different. Share data contracts and behavior, not their layouts.
