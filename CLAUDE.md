# Claude Code Guide

Follow [AGENTS.md](./AGENTS.md) for repository-wide working rules and verification. Use [DESIGN.md](./DESIGN.md) when a task affects architecture, content flow, templates, commands, accessibility, or responsive behavior.

## Repository workflow

1. Inspect `git status` and preserve unrelated changes.
2. Trace data from `App.tsx` and `PortfolioConfig` into the affected view before editing.
3. Make the smallest coherent change at the source of truth; avoid duplicating profile content or command metadata.
4. Verify with `npm run lint` and `npm run build`.
5. Exercise user-facing changes in a browser. Check the console and repeat responsive work at 390 px.

## Project-specific cautions

- `portfolio.config.json` downloads are backups in the current implementation; the app does not load a repository-root JSON file at build time.
- Route every `portfolio_config_v2` or imported JSON value through `src/utils/portfolioConfig.ts`; never place parsed JSON directly into state.
- Route every external project/contact `href` through `src/utils/url.ts`; only HTTP(S) links may become navigable.
- Keep split preview and template content driven by `PortfolioConfig`; `src/data/portfolioData.ts` is limited to terminal-specific fixtures and its remaining legacy records are migration debt.
- Keep fullscreen state tied to the browser `fullscreenchange` event, because users can leave fullscreen outside the app's button.
- Animation and sound are enhancements. Keep primary content usable without either and honor `prefers-reduced-motion` for non-essential motion.
