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

- **Direct — default.** Call `get_room_session_status`, inspect the app, branch, and relevant files, then use `write_app_file` or `text_editor_app` and `commit_app_changes`. Do not call `send_jam_prompt`. Use each synchronized plan task's `todoId` with `update_jam_todo`: mark it `in_progress` before editing and `completed` only after its verification passes. Read back the plan, todo status, app status, and changed files after each coherent task so the Spek visualization stays accurate.
- **Hosted — deliberate delegation.** Use `send_jam_prompt` when the user requests Nullshot-hosted execution. Otherwise, explain that it can consume hosted model usage and obtain explicit user acceptance before a direct-unavailable fallback or justified bounded delegation. Name the room and task, monitor the resulting session, and never fall back silently.
- **Hybrid — bounded.** Obtain explicit user acceptance, keep one executor responsible for each file or task, check session state before every handoff, and prevent concurrent edits to the same branch.

Do not describe direct execution as free; it uses the connected agent's own model or subscription. The savings are avoidance of additional Nullshot-hosted agent usage.

## Operations

- Use read tools freely within the selected Jam.
- Send prompts or resume sessions only after hosted execution was explicitly requested or accepted.
- Stop or abort only the identified session and report the resulting state.
- Read an app file before writing it. Preserve unrelated content and commit only the requested change.
- Inspect merge status and proposals before applying a resolution.
- Require immediate, explicit confirmation before any destructive merge operation or `perform_publish`. This includes `apply_merge_resolution`, `apply_merge_user_choice`, `stage_merge_user_choice`, `clear_merge_user_choice`, `discard_merge_resolution`, `apply_selected_merge_features`, `abort_merge`, and `undo_merge`. Include Jam, room, branch, and effect in the confirmation.
- Never use secret-writing or administrative operations unless the user separately requests them and the grant contains the corresponding admin scope.

After acting, read back the resulting session, app, merge, or deployment state and report evidence. Do not claim success from a tool acknowledgement alone.
