---
name: operating-nullshot
description: Safely inspect and remotely operate Nullshot Jams, sessions, apps, code, merges, and publishing. Use only when a user explicitly asks to start or stop work, send a Jam prompt, edit or commit app files, resolve a merge, or publish.
---

# Operate Nullshot

Use the smallest MCP operation that satisfies the explicit request. Planning authorization does not imply authorization to execute.

## Before acting

1. Follow `using-nullshot`; verify the active Jam and target room.
2. Inspect the Jam overview, room session state, current plan, and affected app or branch.
3. Load relevant remote skills before editing code or managing infrastructure.
4. State the intended action and its target. Ask for clarification only when multiple targets or materially different outcomes remain.

## Operations

- Use read tools freely within the selected Jam.
- Send prompts or resume sessions only when the user asks Nullshot to perform work.
- Stop or abort only the identified session and report the resulting state.
- Read an app file before writing it. Preserve unrelated content and commit only the requested change.
- Inspect merge status and proposals before applying a resolution.
- Require immediate, explicit confirmation before `apply_merge_resolution`, `apply_selected_merge_features`, `undo_merge`, or `perform_publish`. Include Jam, room, branch, and effect in the confirmation.
- Never use secret-writing or administrative operations unless the user separately requests them and the grant contains the corresponding admin scope.

After acting, read back the resulting session, app, merge, or deployment state and report evidence. Do not claim success from a tool acknowledgement alone.
