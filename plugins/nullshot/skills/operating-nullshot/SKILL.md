---
name: operating-nullshot
description: Execute and remotely operate Nullshot work with a cost-aware executor choice. Use when a user asks to build, create, implement, fix, start or stop work, delegate through a Jam prompt, edit or commit app files, resolve a merge, or publish.
---

# Operate Nullshot

Use the smallest MCP operation that satisfies the explicit request. Prefer the connected coding agent for implementation so work does not add Nullshot-hosted agent usage. Planning authorization does not imply execution, but an original explicit build request remains valid after its spec and plan are synchronized.

## Before acting

1. Follow `using-nullshot`; verify the active Jam and target room.
2. Inspect the Jam overview, room session state, current plan, and affected app or branch.
3. Load relevant remote skills before editing code or managing infrastructure.
4. State the intended action and its target. Ask for clarification only when multiple targets or materially different outcomes remain.

## Select the execution path

- **Direct — default.** Call `get_room_session_status`, inspect the app, branch, and relevant files, then use `write_app_file` or `text_editor_app` and `commit_app_changes`. Do not call `send_jam_prompt`. Drive each plan task through the claim lifecycle below, never through `update_jam_todo`. Read back the plan, task status, app status, and changed files after each coherent task so the Spek visualization stays accurate.
- **Hosted — deliberate delegation.** Use `send_jam_prompt` when the user requests Nullshot-hosted execution. Otherwise, explain that it can consume hosted model usage and obtain explicit user acceptance before a direct-unavailable fallback or justified bounded delegation. Name the room and task, monitor the resulting session, and never fall back silently.
- **Hybrid — bounded.** Obtain explicit user acceptance, keep one executor responsible for each file or task, check session state before every handoff, and prevent concurrent edits to the same branch.

Do not describe direct execution as free; it uses the connected agent's own model or subscription. The savings are avoidance of additional Nullshot-hosted agent usage.

## Claim a task before building it

Spek task state belongs to an atomic claim, not to a todo write. More than one
connected client can hold the same grant, so two agents reading the same plan
will pick the same task; the claim is what makes exactly one of them the owner.

**Never call `update_jam_todo` to mark a Spek task started, in progress, or
finished.** It bypasses claim ownership, which is how two agents end up building
the same task and overwriting each other. Use it only for todo content the plan
does not own.

1. **Find work.** `list_available_work` returns dependency-ready tasks across
   every project you can reach, each with its `projectId`, `todoId`, and any
   live `claim`. `list_spek_projects` and `get_spek_project` narrow that to one
   project. A task whose `claim` is present and not `expired` belongs to someone
   else — leave it.
2. **Claim it.** `start_jam_task` with `projectId` and `todoId` returns a
   `claimId`, a `generation`, and a `workPacket` restating the contract with
   your ids in it. It creates no Nullshot branch and dispatches no hosted
   builder: you implement the task where your own code lives.
3. **Keep the lease alive.** `heartbeat_jam_task` with the same `claimId`,
   `generation`, `projectId` and `todoId`, optionally `ttlMs` (30s–1h). A claim
   that stops being heartbeated expires and another client may take the task, so
   heartbeat across long edits, builds, and test runs rather than only at the
   start.
4. **Complete it once.** `complete_jam_task` requires the `claimId`,
   `generation`, and `verificationEvidence` with at least one property — the
   commands you ran and what they returned. It reconciles `tasks.md` under a
   revision check and notifies the workspace inbox that the job is done, which
   is how a human learns the work finished.
5. **Or give it back.** `release_jam_task` with an optional `reason` when you
   stop before finishing, so another client can acquire it instead of waiting
   for the lease to lapse.

Claim calls are rejected when the `claimId`, `generation`, and authenticated
grant do not all match. On rejection, re-read with `list_available_work` rather
than retrying blindly: the task is usually claimed by someone else, or your
lease expired and its generation moved on.

## Operations

- Use read tools freely within the selected Jam.
- Send prompts or resume sessions only after hosted execution was explicitly requested or accepted.
- Stop or abort only the identified session and report the resulting state.
- Read an app file before writing it. Preserve unrelated content and commit only the requested change.
- Inspect merge status and proposals before applying a resolution.
- Require immediate, explicit confirmation before any destructive merge operation or `perform_publish`. This includes `apply_merge_resolution`, `apply_merge_user_choice`, `stage_merge_user_choice`, `clear_merge_user_choice`, `discard_merge_resolution`, `apply_selected_merge_features`, `abort_merge`, and `undo_merge`. Include Jam, room, branch, and effect in the confirmation.
- Never use secret-writing or administrative operations unless the user separately requests them and the grant contains the corresponding admin scope.

After acting, read back the resulting session, app, merge, or deployment state and report evidence. Do not claim success from a tool acknowledgement alone.
