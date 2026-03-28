# Architecture

> Document your system architecture here. Run `/speckit.plan` to generate architecture artifacts.

## System Overview

<!-- Describe the high-level architecture. What are the main components and how do they interact? -->

## Component Diagram

```
┌─────────────────────────────────────────────────┐
│                    Browser                       │
│          (React Client Components)               │
└───────────────────┬─────────────────────────────┘
                    │ HTTPS
┌───────────────────▼─────────────────────────────┐
│                  Vercel Edge                     │
│         (Next.js App Router + Middleware)        │
│  ┌─────────────────────────────────────────┐    │
│  │         Server Components               │    │
│  │    Route Handlers  │  Server Actions    │    │
│  └─────────────────────────────────────────┘    │
└────────────────┬──────────────┬─────────────────┘
                 │              │
    ┌────────────▼──┐   ┌───────▼────────┐
    │   Supabase    │   │   Supabase     │
    │   Database    │   │     Auth       │
    │  (PostgreSQL) │   │  (Sessions)    │
    └───────────────┘   └────────────────┘
```

<!-- Replace with your actual architecture diagram. -->

## Data Flow

<!-- Describe how data moves through the system for the primary user actions. -->

## Technology Stack

| Layer      | Technology          | Purpose                        |
|------------|---------------------|--------------------------------|
| Frontend   | Next.js 15          | UI + Server-Side Rendering     |
| Runtime    | Bun                 | Package manager + test runner  |
| Database   | Supabase (Postgres) | Data storage + auth            |
| Styling    | CSS Modules / CSS   | Component styles               |
| CI/CD      | GitHub Actions      | Lint, build, test on every PR  |
| Hosting    | Vercel              | Edge deployment + preview URLs |

## Deployment Architecture

<!-- Describe how the app is deployed. Include environment differences (dev/prod). -->

```
main branch → Vercel Production (your-app.vercel.app)
feature branches → Vercel Preview (pr-123.your-app.vercel.app)
```
