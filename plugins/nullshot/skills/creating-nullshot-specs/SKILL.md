---
name: creating-nullshot-specs
description: Turn an idea into an approved, live Nullshot specification. Use when brainstorming a feature, clarifying requirements, writing user stories and success criteria, reviewing a specification, or syncing a spec-stage GoalPlan into a Jam room.
---

# Create Nullshot Specifications

Do not write tasks or start implementation until the product intent is aligned.

## Align intent

1. Follow `using-nullshot` and `shaping-nullshot-context`.
2. Restate the requested outcome in one sentence, then ask one focused product question at a time where the answer materially changes behavior or acceptance.
3. Cover audience, primary journey, important states, exclusions, edge cases, failure behavior, and the observable definition of success.
4. Present the resulting design in small sections. For planning-only work, obtain explicit approval before persisting it. For an explicit build request with no material ambiguity, state the assumptions and treat the original request as authorization to sync the specification and continue.

Do not ask the user to choose frameworks, storage engines, or internal architecture when repository evidence and remote skills can decide them.

## Draft the spec

Create:

- A concise title and objective.
- A canonical Markdown `planDocument` describing the problem, scope, user experience, requirements, edge cases, and exclusions.
- Stable user stories with role, capability, benefit, and observable acceptance steps.
- Measurable success criteria.
- Evidence-backed constraints and discovered context.
- A high-level strategy and verification plan. Keep implementation task detail out of this stage.

Dispatch the packaged specification reviewer with the draft and relevant constraints. Accept only issues that would cause the plan to build the wrong behavior or leave a material ambiguity. Resolve findings with the user when they change product intent.

## Sync live

1. Call `get_jam_plan` for the selected room immediately before writing.
2. Call `upsert_jam_plan` with `stage: "spec"`, the current `expectedRevision`, the approved goal fields, and `tasks: []`.
3. If the write conflicts, re-read, show the material difference, reconcile, and retry with the newer revision.
4. Report the Jam, room, new revision, and a concise specification summary.

The terminal state is an aligned spec-stage GoalPlan in Nullshot. Continue with `writing-nullshot-plans`. Do not execute during specification, but preserve any direct-execution authorization from the original build request.
