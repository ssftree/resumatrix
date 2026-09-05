# Agent Guide

This repository is a client-only React portfolio with seven visual templates and an interactive terminal. Read [DESIGN.md](./DESIGN.md) before changing shared state, portfolio data, template navigation, or visual behavior.

## Working agreement

- Treat `src/portfolio.config.ts` as the canonical editable portfolio data source. `src/data/portfolioData.ts` still contains terminal fixtures and legacy duplicate data; do not add more profile data there.
- Keep every template driven by the `PortfolioConfig` received from `App`. A customization must produce the same content in every view.
- Add terminal commands in `App.tsx`, then update command discovery and autocomplete in `TerminalOutput.tsx` and `TerminalInput.tsx` in the same change.
- Preserve the distinct visual language of each template. Shared behavior belongs in typed utilities or shared components; template-specific presentation stays in `src/components/templates/`.
- Treat imported JSON and `localStorage` as untrusted input. Validate before placing either into application state.
- Interactive overlays must support keyboard dismissal, labelled controls, focus management, and reduced-motion preferences.
- Preserve user changes in a dirty worktree. Do not edit generated `dist/` output directly.

## Verification gate

Before handing off a change:

1. Run `npm run lint`.
2. Run `npm run build`.
3. For behavior or layout changes, run the app and exercise the affected flow in a real browser at desktop and 390 px widths.
4. When shared portfolio data changes, verify Terminal, IDE, Bento, Retro, Telemetry, Brutalism, Academic, Resume, and the split preview.

Run `npm test` for the Vitest regression suite. Add focused tests when fixing behavior that can regress; do not use a successful production build as proof of runtime correctness.
