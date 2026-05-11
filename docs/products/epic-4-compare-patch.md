# Epic 4: Compare Patch

**Parent PRD:** [PRD.md](./PRD.md)
**Priority:** High
**Skill targets (research §2.2):** More / fewer / same; magnitude (how much greater).

---

## Goal

Develop intuitive quantity comparison — the child should "see" which set has more without necessarily counting, then have it confirmed by counting.

## User Story

> As a 4-year-old, I tap the tree with more apples so I learn what "more" and "fewer" mean.

## Core Mechanic

- Two trees side-by-side, each holding a visible set of apples.
- Ruby asks (voice): "**Which tree has more apples?**" (or "fewer", or "the same").
- Child taps a tree.
- Correct → both trees re-count out loud ("This one has 3, this one has 5 — five is **more**!").
- Incorrect → no negative sound; Ruby re-asks; after 2 misses the correct tree shimmers.

## Levels

| Level | Set sizes | Prompt |
|---|---|---|
| 1 | 1 vs 5 (large gap) | "more" only |
| 2 | 2 vs 4, 3 vs 6 (medium gap) | "more" / "fewer" |
| 3 | 4 vs 5, 6 vs 7 (close) | "more" / "fewer" |
| 4 | Equal sets included | "more" / "fewer" / "same" |

## Requirements

- Apples in each tree are arranged in **non-aligned** layouts so the child cannot win by visual length alone — they must perceive quantity.
- Voice always re-counts both sets after a correct answer (reinforces magnitude).
- "Same" is introduced only at Level 4 to avoid early confusion.

## Out of Scope

- Comparing more than 2 sets.
- Numerical comparison ("5 > 3" with symbols).

## Acceptance

- Child correctly identifies "more" in ≥ 80% of Level 1–2 rounds.
- Child uses the words "more" / "fewer" spontaneously in adult conversation after ~2 weeks.
