# Epic 1: Counting Patch

**Parent PRD:** [PRD.md](./PRD.md)
**Priority:** Must-have
**Skill targets (research §2.1):** Rote counting 1–10, one-to-one correspondence, cardinality.

---

## Goal

Help the child count out loud while touching each object exactly once, and understand that the last number said is the total of the set.

## User Story

> As a 4-year-old, I want to water Ruby's flowers one by one so that I learn to count from 1 to 10 with my finger and my voice.

## Core Mechanic

- A row of N flowers (N = level number, 1 → 10) appears on screen.
- The child taps each flower; on tap, a watering-can animation plays and Ruby's voice says "**one**", "**two**", "**three**" …
- After the last flower is tapped, Ruby says "**Three flowers!**" (cardinality reinforcement) and the flowers bloom together.

## Levels

| Level | Set size | Layout |
|---|---|---|
| 1 | 1–3 | Single row, large spacing |
| 2 | 4–5 | Single row |
| 3 | 6–7 | Single row |
| 4 | 8–10 | Two rows, still 1:1 traceable |

## Requirements

- Each flower can be tapped **only once** (prevents double-counting; reinforces 1:1).
- Tapping out of order is allowed — the count follows the tap order, not position.
- Voice narration plays for every count, every level.
- Visual count badge (`1`, `2`, `3` …) appears above each watered flower (concrete + abstract pairing).
- Level completes when all flowers are watered; auto-advance after 2s.

## Out of Scope

- Counting beyond 10.
- Skip-counting, backward counting.
- Numeral input (covered by Epic 2).

## Acceptance

- A child can complete Levels 1–3 unaided after one demo.
- Median completion time per level < 90 seconds.
- No "wrong" sound is ever played in this patch.
