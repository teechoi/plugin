---
name: using-nullshot
description: Bootstrap authenticated Nullshot work from a coding agent. Use when selecting a Jam, loading Jam context or remote Nullshot skills, deciding whether to specify, plan, or operate, or recovering from MCP authentication and revision conflicts.
---

# Use Nullshot

Treat the active Nullshot Jam as the source of truth for intent, plans, tasks, and execution state.

## Start every Nullshot workflow

1. Call `mcp_auth` and complete OAuth if authentication is required.
2. Call `get_active_jam_context`. If no Jam is active, call `list_accessible_jams`, ask the user which Jam to use when more than one is plausible, then call `set_active_jam_context`.
3. Call `get_jam_overview` and `list_jam_rooms`. Select a room explicitly before writing a specification or plan.
4. Call `list_skills` with a query matching the work. Load relevant remote instructions with `read_skill` and, when needed, `read_skill_reference`.
5. Inspect the repository's `AGENTS.md`, README, and governing project documentation before making claims about local constraints.

Never embed or request bearer tokens. Let the client perform OAuth against `https://mcp.nullshot.ai/mcp`.

## Route the request

- Establish durable repository and product constraints with `shaping-nullshot-context`.
- Turn a rough idea into an approved live specification with `creating-nullshot-specs`.
- Turn an approved specification into an atomic task DAG with `writing-nullshot-plans`.
- Inspect or remotely control builds, code, merges, and publishing with `operating-nullshot` only when the user explicitly requests that action.

This plugin intentionally contains no coding-discipline, debugging, TDD, worktree, or implementation skills. Load any needed implementation guidance from the repository or Nullshot's remote skill catalog.

## Subagent boundary

Use the packaged context scout, specification reviewer, and plan reviewer only for read-only analysis. Give them the minimum relevant artifact and ask for findings. The parent agent owns all MCP writes, conflict reconciliation, user approvals, and repository mutations.

## Write safety

- Read the current plan immediately before every plan update.
- Pass its `revision` as `expectedRevision`; omit the revision only when no plan exists.
- On a conflict, call `get_jam_plan`, reconcile the newer content visibly, and retry once with the new revision. Never overwrite blindly.
- Keep a room in planning after specification or plan sync. Do not send a build prompt, edit app files, merge, or publish without an explicit user request.
- Confirm the exact Jam, room, branch, and intended outcome immediately before merge or publish operations.
