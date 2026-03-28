# hackathon-starter Development Guidelines

## Active Technologies

- TypeScript 5.3+ + Next.js 15 (App Router), @supabase/supabase-js v2, @supabase/ssr v0.1+, Biome v1.8+, Vitest v1+

## Project Structure

```text
app/          # Next.js App Router (routes, pages, API handlers)
components/   # React components (ui/, features/, layout/)
lib/          # Shared utilities (supabase/, utils.ts, env.ts)
types/        # TypeScript type definitions
supabase/     # seed.sql for demo_items table
docs/         # Project documentation (spec-kit workflow)
.github/      # CI workflow, PR template, Issue templates
```

## Commands

```bash
bun install           # Install dependencies
bun dev               # Start dev server (localhost:3000)
bunx biome check .    # Lint + format check (CI)
bunx biome check --apply .  # Lint + format fix (local)
bun run build         # Type check + production build (CI)
bun test              # Run tests in watch mode
bun run test:ci       # Run tests single pass (CI)
bun run test:coverage # Run tests with coverage report
```

## Code Style

- TypeScript strict mode; prefer explicit types over `any`
- Biome enforces formatting (2-space indent, 100 char line width)
- Server Components by default; add `"use client"` only when needed
- All public functions must have self-documenting names (no comments for obvious intent)

<!-- MANUAL ADDITIONS START -->

## Branch Strategy (CRITICAL — read before any git operation)

This repo is a **GitHub Template Repository**. Two branch roles exist:

| Branch | Purpose | Contains `specs/` |
|--------|---------|-------------------|
| `main` | Clean template — what teams get when they click "Use this template" | ❌ Empty (`specs/README.md` only) |
| `001-hackathon-starter` (and future `00N-*` branches) | Template development via spec-kit | ✅ Yes |

**Rule: never merge `specs/` into `main`.**

When syncing improvements from a dev branch to `main`:
```bash
git checkout main
git merge <dev-branch> --no-commit --no-ff
git restore --staged specs/
git checkout -- specs/
git commit -m "chore: sync template improvements from <dev-branch>"
```

See CONTRIBUTING.md for the full workflow.

<!-- MANUAL ADDITIONS END -->
