---
name: writing-nullshot-plans
description: Convert an approved Nullshot specification into a complete, revision-aware task DAG. Use before implementation when defining stable tasks, dependencies, expected files, verification checks, or atomically replacing the live plan in a Jam room.
---

# Write Nullshot Plans

Announce that you are using this skill. Produce a decision-complete plan that a fresh worker can execute without reconstructing intent.

## Prepare

1. Follow `using-nullshot` and call `get_jam_plan`.
2. Require an approved spec-stage goal. If it is missing or materially ambiguous, return to `creating-nullshot-specs`.
3. Inspect the relevant repository entrypoints, existing patterns, tests, configuration, and remote skills.
4. Confirm product priority, slice order, and the observable done bar. Decide technical implementation from evidence.

## Design the DAG

Create outcome-sized tasks with:

- A stable lowercase key that survives title edits, such as `oauth-consent`.
- An imperative title and precise intent.
- One surface: `general`, `ui`, `api`, `data`, `integration`, or `research`.
- Priority: `low`, `medium`, `high`, or `urgent`.
- Concrete expected files or paths.
- Observable verification checks and exact commands where known.
- `blockedBy` keys referring only to tasks in this plan.

Every task must produce a coherent outcome. Avoid placeholder tasks, duplicate file ownership among parallel tasks, hidden dependencies, implementation prose without verification, and tasks that merely say to investigate without a bounded deliverable.

Validate the graph for duplicate keys, missing dependencies, self-dependencies, and cycles. Ensure each user story and success criterion is covered.

Dispatch the packaged plan reviewer with the specification, constraints, and full task graph. Fix only serious omissions, unsafe sequencing, conflicting ownership, or unverifiable outcomes.

## Replace atomically

1. Re-read with `get_jam_plan` immediately before the write.
2. Call `upsert_jam_plan` with `stage: "plan"`, `expectedRevision`, the complete goal, and the entire task list.
3. Treat omission as deletion of a pending draft task. Never send a partial task array.
4. On conflict, reconcile visibly and retry once. If any task has started or completed, stop; the plan can no longer be replaced as a draft.
5. Report the new revision, stable task keys, and dependency order.

Leave the room in planning. Execution requires a separate explicit request and `operating-nullshot`.
