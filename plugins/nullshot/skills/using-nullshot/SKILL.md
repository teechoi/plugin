---
name: using-nullshot
description: Bootstrap authenticated Nullshot work and choose a cost-aware executor. Use when selecting or creating a Jam, loading context or remote skills, routing specification and planning work, deciding between direct coding-agent execution and a Nullshot-hosted prompt, or recovering from authentication and revision conflicts.
---

# Use Nullshot

Treat the active Nullshot Jam as the source of truth for intent, plans, tasks, and execution state.

## Start every Nullshot workflow

1. Call `mcp_auth` and complete OAuth if authentication is required.
2. Call `get_active_jam_context`. If the user requested a new app or Jam, call `create_jam_room` with no prompt and `initialState: "planning"`; it selects the new Jam automatically. Otherwise, if no Jam is active, call `list_accessible_jams`, ask which plausible Jam to use, then call `set_active_jam_context`.
3. Call `get_jam_overview` and `list_jam_rooms`. Select a room explicitly before writing a specification or plan.
4. Call `list_skills` with a query matching the work. Load relevant remote instructions with `read_skill` and, when needed, `read_skill_reference`.
5. Call `list_workspace_inbox` when you resume, and after any long-running work. This gateway cannot push notifications, so nothing that happened while you were away reaches you unless you read it.
6. To pick up existing work rather than start something new, call `list_spek_projects` and `list_available_work` before selecting a task, then claim it as `operating-nullshot` describes.
7. Inspect the repository's `AGENTS.md`, README, and governing project documentation before making claims about local constraints.

Never embed or request bearer tokens. Let the client perform OAuth against `https://mcp.nullshot.ai/mcp`.

## Choose the executor

Preserve the authorization in the user's original request through specification and planning:

- **Direct execution — default for explicit build work.** When the user asks to build, implement, fix, or create an app or feature and the connected coding agent can use the app file tools, let that agent execute. Synchronize the spec and plan first, then use `operating-nullshot` without asking for a redundant second start message. This avoids additional Nullshot-hosted agent usage, though the caller may have its own model costs.
- **Hosted delegation.** Call `send_jam_prompt` when the user asks Nullshot or a hosted agent to execute. If direct execution is unavailable or a bounded delegated task has a clear benefit, explain the Nullshot-hosted model usage and obtain explicit user acceptance before sending. Never treat unavailable direct execution as permission to fall back silently.
- **Hybrid execution.** After explicit user acceptance, keep the connected coding agent as owner and delegate only the named bounded task. Never let both executors modify the same branch concurrently.
- **Planning only.** Requests to brainstorm, specify, review, or plan do not authorize implementation.

Before either execution path, call `get_room_session_status`. Do not edit directly while a hosted session is active unless the user explicitly coordinates that overlap.

During direct execution, take each Spek task through the atomic claim lifecycle in `operating-nullshot`: `start_jam_task`, `heartbeat_jam_task` while the work runs, then one `complete_jam_task` carrying verification evidence. Do not mark Spek task state with `update_jam_todo` — it bypasses claim ownership, and two clients on the same grant will build the same task.

## Route the request

- Establish durable repository and product constraints with `shaping-nullshot-context`.
- Turn a rough idea into an approved live specification with `creating-nullshot-specs`.
- Turn an approved specification into an atomic task DAG with `writing-nullshot-plans`.
- Execute explicit build requests with `operating-nullshot`, preferring direct app editing over hosted prompting.

This plugin intentionally contains no coding-discipline, debugging, TDD, worktree, or implementation skills. Load any needed implementation guidance from the repository or Nullshot's remote skill catalog.

## Subagent boundary

Use the packaged context scout, specification reviewer, and plan reviewer only for read-only analysis. Give them the minimum relevant artifact and ask for findings. The parent agent owns all MCP writes, conflict reconciliation, user approvals, and repository mutations.

## Write safety

- Read the current plan immediately before every plan update.
- Pass its `revision` as `expectedRevision`; omit the revision only when no plan exists.
- On a conflict, call `get_jam_plan`, reconcile the newer content visibly, and retry once with the new revision. Never overwrite blindly.
- Keep planning-only work in planning. An original explicit request to build, implement, fix, or create an app or feature authorizes direct implementation after the spec and plan are synchronized; it does not authorize hosted delegation, merge, or publish unless those actions were also requested or separately accepted after disclosure.
- Confirm the exact Jam, room, branch, and intended outcome immediately before merge or publish operations.
