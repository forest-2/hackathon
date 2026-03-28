<!--
SYNC IMPACT REPORT
==================
Version change: N/A (placeholder template) → 1.0.0
Bump type: MINOR (initial ratification — all placeholder tokens replaced, four principles defined,
two supporting sections added)

Modified principles:
  - [PRINCIPLE_1_NAME] → I. Code Quality (new)
  - [PRINCIPLE_2_NAME] → II. Testing Standards (new)
  - [PRINCIPLE_3_NAME] → III. User Experience Consistency (new)
  - [PRINCIPLE_4_NAME] → IV. Performance Requirements (new)
  - [PRINCIPLE_5_NAME] → REMOVED (only four principles defined per user request)

Sections added:
  - Quality Gates (replacing [SECTION_2_NAME])
  - Development Workflow (replacing [SECTION_3_NAME])

Sections removed:
  - None (template sections repurposed above)

Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ Constitution Check section already uses
    "[Gates determined based on constitution file]" — aligns with the four principles defined here.
  - .specify/templates/spec-template.md: ✅ Success Criteria section supports measurable performance
    and UX goals; no structural changes required.
  - .specify/templates/tasks-template.md: ✅ Polish phase already includes performance optimization,
    security hardening, and testing tasks — consistent with Testing Standards and Performance
    Requirements principles.
  - .specify/templates/agent-file-template.md: ✅ No outdated references; no changes required.

Deferred TODOs:
  - None. All placeholders resolved.
-->

# Hackathon Starter Constitution

## Core Principles

### I. Code Quality

All production code MUST be clean, maintainable, and reviewable. Every module, function, or component
MUST have a single, clear responsibility. Code MUST pass automated linting and formatting checks before
merge. Complexity MUST be justified — if a simpler alternative exists, it MUST be preferred. Dead code,
unused imports, and commented-out blocks MUST NOT be committed. All public interfaces MUST use naming
that communicates intent without requiring supplementary comments.

**Rationale**: Hackathon codebases accumulate expedient hacks quickly. This principle keeps the starter
a model codebase that teams can build on confidently rather than one they must first excavate.

### II. Testing Standards

Tests MUST be written before or alongside implementation — never after. Unit tests MUST cover all
business logic; integration tests MUST cover all user-facing flows end-to-end. A feature is NOT
considered complete until its tests pass in CI. Test coverage MUST remain at or above 80% for core
modules. Tests MUST be deterministic — flaky tests MUST be fixed or deleted immediately. Each user story
MUST include at least one acceptance scenario verified by an automated test.

**Rationale**: Fast-moving projects accumulate silent bugs without enforced testing discipline. Clear
standards prevent regression debt from day one and make demos reliably repeatable.

### III. User Experience Consistency

All user-facing interfaces MUST follow a single, consistent design language: shared components,
typography scale, spacing system, and color tokens. New UI elements MUST reuse existing components and
tokens before introducing new ones; any addition MUST be justified. User flows MUST be validated against
the acceptance scenarios defined in the feature spec. Error messages MUST be human-readable and
actionable. Loading states, empty states, and error states MUST be handled for every interactive feature
— absent states are not acceptable gaps.

**Rationale**: Consistency reduces cognitive load and lets team members work across features without
re-learning design decisions. A cohesive UX is especially critical in hackathon demos where first
impressions are evaluated quickly.

### IV. Performance Requirements

All API endpoints MUST respond within 200ms at p95 under expected load. Frontend pages MUST achieve a
Largest Contentful Paint (LCP) ≤ 2.5 seconds on a standard broadband connection. Database queries MUST
be reviewed for N+1 issues before merge. Memory usage MUST NOT grow unboundedly — any long-running
process MUST be profiled before shipping. Performance regressions MUST be caught in CI before reaching
production. Performance targets MUST be documented in the plan's Technical Context section for each
feature.

**Rationale**: Performance is a feature. Slow defaults in a starter template propagate into every
project built on it and make demos less compelling. Explicit targets make regressions visible early.

## Quality Gates

All pull requests MUST satisfy the following gates before merge:

- **Linting & Formatting**: Zero lint errors; code style matches project formatter configuration.
- **Tests Pass**: All existing tests pass; new tests for changed behavior are included and passing.
- **Coverage**: Core module coverage MUST NOT drop below 80%.
- **Performance Review**: Any new query MUST include an index review; no synchronous blocking
  operations on hot paths without documented justification.
- **UX Consistency Check**: Any user-facing change MUST include screenshots or a screen recording
  demonstrating consistency with the established design language.
- **Complexity Justification**: Any deviation from the four core principles MUST be documented in the
  plan's Complexity Tracking table with a concrete rationale and rejected simpler alternatives.

## Development Workflow

1. **Spec first**: Features begin with a spec and prioritized user stories before any code is written.
2. **Tests first**: Tests MUST be written and confirmed failing before implementation begins
   (Red → Green → Refactor).
3. **Incremental delivery**: Each user story MUST be independently deployable and demonstrable as an
   MVP increment.
4. **Peer review**: All code changes require at least one peer review with an explicit constitution
   compliance check.
5. **Performance baseline**: Before closing a feature, benchmark results MUST be recorded and verified
   against the targets defined in Principle IV.

## Governance

This constitution supersedes all other project guidelines and practices. Amendments require:

1. A written proposal describing the change and its rationale.
2. Review by at least one team member who did not author the change.
3. A migration plan if existing code or workflow is affected.
4. A version increment per semantic versioning rules:
   - **MAJOR**: Backward-incompatible governance changes or principle removals/redefinitions.
   - **MINOR**: New principle or section added, or materially expanded guidance.
   - **PATCH**: Clarifications, wording improvements, or non-semantic refinements.

All PRs and code reviews MUST verify compliance with this constitution. Complexity deviations MUST be
justified in the plan's Complexity Tracking table. Refer to the agent guidance file (if present) for
runtime development context specific to active technologies in the project.

**Version**: 1.0.0 | **Ratified**: 2026-02-23 | **Last Amended**: 2026-02-23
