# CI, Vercel, and Cloudflare Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add repeatable GitHub CI and publish the existing Vite portfolio to production on Vercel and Cloudflare Pages.

**Architecture:** GitHub Actions will install the locked dependency graph and run the repository's lint, test, and production-build gates for pushes and pull requests. Provider-specific declarative files keep both static-host builds reproducible, while each provider imports the existing GitHub repository and continuously deploys `main` without cloning or creating another repository.

**Tech Stack:** GitHub Actions, Node.js 24.15, npm, Vite 6, Vercel Git integration, Cloudflare Pages Git integration

**Spec:** `DESIGN.md`

## Global Constraints

- Keep the application client-only and deploy the generated `dist/` directory.
- Use Node.js 24.15.0 or later, pinned for CI and Cloudflare Pages through `.node-version`.
- Do not modify generated `dist/` output directly.
- Preserve existing portfolio data and visual behavior.
- Before handoff run `npm run lint`, `npm test`, and `npm run build`.
- The site has no client-side router, so no SPA fallback rewrite is required.

---

### Task 1: Continuous integration workflow

**Files:**
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: `package-lock.json` and the `lint`, `test`, and `build` scripts in `package.json`.
- Produces: a GitHub Actions check named `CI / verify` for pushes to `main` and all pull requests.

- [ ] **Step 1: Add the CI workflow**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: .node-version
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Type-check
        run: npm run lint
      - name: Test
        run: npm test
      - name: Build
        run: npm run build
```

- [ ] **Step 2: Validate the workflow syntax and commands**

Run: parse `.github/workflows/ci.yml` with an available YAML parser, then run `npm ci`, `npm run lint`, `npm test`, and `npm run build`.

Expected: YAML parses successfully and all four commands exit with status 0.

- [ ] **Step 3: Commit the CI workflow**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: verify lint tests and build"
```

### Task 2: Reproducible provider configuration and documentation

**Files:**
- Create: `vercel.json`
- Create: `wrangler.jsonc`
- Modify: `README.md`

**Interfaces:**
- Consumes: `npm run build`, which writes the production site to `dist/`.
- Produces: explicit Vercel and Cloudflare Pages build settings plus maintainer deployment commands.

- [ ] **Step 1: Add Vercel configuration**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

- [ ] **Step 2: Add Cloudflare Pages configuration**

```jsonc
{
  "name": "resumatrix",
  "compatibility_date": "2026-09-03",
  "pages_build_output_dir": "./dist"
}
```

- [ ] **Step 3: Document CI and both deployment paths**

Add a README section explaining the CI triggers, verification commands, and how both providers import the existing canonical repository `ssftree/resumatrix` (redirected from `ssftree/terminal-website`) with `main` as the production branch.

- [ ] **Step 4: Validate both configuration files**

Run: parse `vercel.json` as JSON and validate the Cloudflare Pages build settings against the repository build.

Expected: JSON parsing succeeds and Wrangler prints Pages deploy help without errors.

- [ ] **Step 5: Commit provider configuration and documentation**

```bash
git add vercel.json wrangler.jsonc README.md
git commit -m "chore: configure static hosting providers"
```

### Task 3: Production publication and verification

**Files:**
- No tracked files.
- No generated provider metadata is required because both providers use Git integration.

**Interfaces:**
- Consumes: the verified GitHub repository and authenticated Vercel/Cloudflare dashboard sessions.
- Produces: one production Vercel URL and one production Cloudflare Pages URL serving the same build.

- [ ] **Step 1: Confirm provider authentication**

Open the authenticated Vercel and Cloudflare dashboards.

Expected: both dashboards show the intended account without exposing credentials.

- [ ] **Step 2: Publish to Vercel production**

Import the existing canonical repository `ssftree/resumatrix` through **New Project → Import Git Repository**, retain the Vite preset, and deploy with `main` as production.

Expected: Vercel returns a production deployment URL.

- [ ] **Step 3: Publish to Cloudflare Pages production**

Import the existing canonical repository `ssftree/resumatrix` through **Workers & Pages → Create → Import an existing Git repository**, set `main`, `npm run build`, and `dist`, then deploy.

Expected: Cloudflare reports a successful deployment and a `pages.dev` URL.

- [ ] **Step 4: Verify both production endpoints**

Run: issue HTTPS requests to both returned URLs and inspect the status, content type, title, and favicon response.

Expected: both pages return HTTP 200 HTML containing the portfolio title, and both favicon requests return HTTP 200 with SVG content.

- [ ] **Step 5: Record final repository state**

Run: `git status --short`, `git log --oneline -3`, and `git diff main...HEAD --stat`.

Expected: no accidental generated files are tracked and the diff contains only CI, provider configuration, plan, and documentation changes.
