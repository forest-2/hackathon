# Contributing to hackathon-starter

## Branch Strategy

This repository serves two roles simultaneously:

1. **A GitHub Template Repository** — teams click "Use this template" and get a clean slate
2. **An actively developed project** — improved over time using the spec-kit workflow

These two roles require different branch states, managed as follows:

### Branch roles

| Branch | Role | `specs/` |
|--------|------|----------|
| `main` | Template artifact — clean state for end users | ❌ Empty |
| `00N-<name>` | Development branch — spec-kit workflow for each improvement | ✅ Present |

`main` must never contain `specs/00N-*` directories. These are meta-artifacts documenting the process of *building the template*, not something hackathon teams need.

---

## Workflow: Improving the template

### 1. Start a new improvement

Use spec-kit to create a feature branch:

```bash
/speckit.specify <description of the improvement>
# → creates branch 00N-<name> and specs/00N-<name>/spec.md
```

Then plan, task, and implement as usual:

```
/speckit.clarify → /speckit.plan → /speckit.tasks → /speckit.implement
```

### 2. Release to `main`

When the improvement is ready, sync **only the code artifacts** to `main` — not `specs/`:

```bash
git checkout main
git merge <dev-branch> --no-commit --no-ff
git restore --staged specs/
git checkout -- specs/
git commit -m "chore: sync template improvements from <dev-branch>"
git push origin main
```

> **Why `--no-ff`?** Keeps the merge commit visible in `main`'s history so you can trace which dev branch each change came from.

### 3. Keep the dev branch

Do **not** delete the dev branch after merging. It holds the full spec-kit history (spec, plan, tasks) for reference when making related future improvements.

---

## What belongs in `main`

✅ Merge to `main`:
- `app/`, `components/`, `lib/`, `types/` — Next.js source code
- `supabase/` — database schema and seed data
- `.github/` — CI workflow, PR/Issue templates
- `docs/` — user-facing documentation
- `.specify/` — spec-kit tooling (scripts, templates, constitution)
- `CLAUDE.md`, `README.md`, `CONTRIBUTING.md` — project docs
- Config files: `package.json`, `tsconfig.json`, `biome.json`, etc.

❌ Never merge to `main`:
- `specs/00N-*/` — feature specs for template development
- `.claude/` session artifacts (if any end up committed)

---

## `specs/` on `main`

`main` keeps a `specs/README.md` that explains the directory to template users:

```
specs/
└── README.md   ← explains that teams run /speckit.specify to populate this
```

This file must never be deleted from `main`.

---

## Local setup

```bash
bun install
cp .env.example .env.local  # fill in Supabase credentials
bun dev
```

See README.md for full setup instructions.
