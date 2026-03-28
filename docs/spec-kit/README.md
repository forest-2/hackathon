# spec-kit Workflow Guide

spec-kit is a set of Claude Code slash commands that guide a team from a rough idea to a fully planned, task-broken-down feature — before writing a single line of code.

This template comes pre-configured with spec-kit. Use it during the first hour of your hackathon to align the team and hit the ground running.

---

## Why spec-kit?

Hackathons often stall because:

- Team members have different mental models of what they're building
- Scope creep kills momentum halfway through
- No one knows what to build next after the initial rush

spec-kit solves this by producing structured artifacts (spec, plan, tasks) that keep everyone aligned and make individual tasks small enough to complete in 30-minute sprints.

---

## Workflow Overview

```
/speckit.specify  →  /speckit.clarify  →  /speckit.plan  →  /speckit.tasks  →  /speckit.implement
      ↓                     ↓                   ↓                  ↓                    ↓
   spec.md            (updated spec)     plan.md + more        tasks.md           code written
```

---

## Commands

### `/speckit.specify` — Write the specification

**Purpose**: Converts a natural-language feature description into a structured specification document.

**When to use**: At the start of your hackathon, before any coding begins.

**How to use**:
```
/speckit.specify Build a recipe sharing app where users can post recipes,
browse by ingredient, and save favorites. Mobile-first, deployed on Vercel.
```

**Output**: `specs/<N>-<name>/spec.md` — a structured spec with user stories, requirements, and success criteria.

---

### `/speckit.clarify` — Resolve ambiguities

**Purpose**: Asks up to 5 targeted questions about the spec to resolve ambiguities before planning begins.

**When to use**: After `/speckit.specify`, before `/speckit.plan`. Especially useful when the spec has `[NEEDS CLARIFICATION]` markers.

**How to use**:
```
/speckit.clarify
```

Claude will ask questions one at a time. Answer with the option letter or a short phrase. Run this in under 10 minutes.

**Output**: Updated `spec.md` with clarifications recorded.

---

### `/speckit.plan` — Generate the technical plan

**Purpose**: Researches technology choices and produces a full implementation plan, data model, API contracts, and integration guide.

**When to use**: After the spec is finalized (after `/speckit.clarify`).

**How to use**:
```
/speckit.plan
```

**Output**:
- `plan.md` — tech stack, architecture, file structure
- `data-model.md` — database schema and entity types
- `contracts/` — API endpoint specifications
- `research.md` — technology decisions with rationale
- `quickstart.md` — step-by-step integration guide

---

### `/speckit.tasks` — Break down into actionable tasks

**Purpose**: Generates a prioritized, dependency-ordered task list that maps directly to the plan and spec.

**When to use**: After `/speckit.plan` is complete.

**How to use**:
```
/speckit.tasks
```

**Output**: `tasks.md` — all implementation tasks organized by user story, with parallel execution markers.

---

### `/speckit.taskstoissues` — Create GitHub Issues

**Purpose**: Converts `tasks.md` into GitHub Issues, ready to assign to team members.

**When to use**: After `/speckit.tasks`, when you want to distribute work via GitHub Issues.

**How to use**:
```
/speckit.taskstoissues
```

**Output**: GitHub Issues created in the repository, one per task group or user story.

---

### `/speckit.implement` — Execute the task plan

**Purpose**: Works through `tasks.md` phase by phase, writing code, running tests, and marking tasks complete.

**When to use**: After `tasks.md` is finalized and the team is ready to code.

**How to use**:
```
/speckit.implement
```

Claude will implement tasks in order, respecting dependencies and running checkpoints between phases.

---

## Recommended Hackathon Workflow

### First 30 minutes — Align the team

1. One person runs `/speckit.specify` with the feature idea
2. Team reviews the generated `spec.md` together
3. Run `/speckit.clarify` to answer any open questions
4. Everyone agrees on scope (especially "Out of Scope")

### Next 30 minutes — Plan and decompose

1. Run `/speckit.plan` to generate the technical plan
2. Team reviews `plan.md` and `data-model.md`
3. Run `/speckit.tasks` to generate the task list
4. Optionally run `/speckit.taskstoissues` to create GitHub Issues

### Coding phase — Build in parallel

1. Run `/speckit.implement` to start coding, or
2. Divide `tasks.md` among team members manually
3. Each PR runs CI automatically (lint + build + test)
4. Vercel generates a preview URL for every PR

### Before the presentation

1. Fill in `docs/demo-runbook.md` with your demo steps
2. Update `docs/architecture.md` with your actual system design
3. Verify the production Vercel deployment is healthy

---

## Output File Locations

All spec-kit artifacts are stored under `specs/<N>-<name>/`:

```
specs/
└── 001-my-feature/
    ├── spec.md           ← Feature specification
    ├── plan.md           ← Technical implementation plan
    ├── research.md       ← Technology decisions
    ├── data-model.md     ← Database schema
    ├── tasks.md          ← Task breakdown
    ├── quickstart.md     ← Integration guide
    └── contracts/
        ├── api-*.md      ← API endpoint contracts
        └── env-schema.md ← Environment variable schema
```

---

## Tips

- **Keep specs short** — aim for 1-2 user stories per spec. Scope creep is the enemy.
- **Use "recommended"** — during `/speckit.clarify`, accepting the recommended option is almost always correct for a hackathon context.
- **Skip clarify if you're in a rush** — you can go straight from `/speckit.specify` to `/speckit.plan` if the spec is clear enough.
- **Commit after each phase** — `git commit` after spec, after plan, after tasks. This makes it easy to roll back if something goes wrong.
