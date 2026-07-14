---
name: shaping-nullshot-context
description: Gather and normalize durable project context for Nullshot planning. Use when a repository or Jam lacks clear constraints, when beginning work in an unfamiliar codebase, or before a specification needs architecture, product, verification, and workflow rules.
---

# Shape Nullshot Context

Build a concise, evidence-backed constraint set. Do not create a separate constitution service or disconnected local document.

## Gather

1. Follow `using-nullshot` to authenticate and select the Jam and room.
2. Read repository instructions, README files, package manifests, architecture documents, and existing tests relevant to the requested surface.
3. Read the Jam overview, room state, current plan, and recent activity.
4. Search Nullshot's remote skill catalog for domain-specific constraints and load only relevant skills and references.
5. Optionally dispatch the packaged context scout for a read-only pass. Verify important findings against source files yourself.

## Normalize

Produce these short groups with a source path or MCP result for every non-obvious claim:

- Product intent and audience.
- Repository workflow and ownership rules.
- Architecture and data boundaries.
- Security, authentication, and secret-handling rules.
- Verification commands and observable acceptance expectations.
- Execution owner and budget preference: direct coding agent, Nullshot-hosted delegation, or a bounded hybrid.
- Known deployment, compatibility, or migration constraints.
- Open product questions that cannot be answered from evidence.

Ask users only about product intent, priority, behavior, and acceptance. Resolve discoverable technical facts from the repository and remote skills.

## Persist

Feed the normalized rules into `creating-nullshot-specs` as `constraints` and `discoveredContext`. Record direct execution as the default when the user asked the connected coding agent to build and did not request hosted delegation. If a live spec already exists, read its revision and update it only after explaining material changes to the user. Preserve existing constraints unless evidence makes them obsolete; call out removals explicitly.
