# Epic 2: Numeral Patch

**Parent PRD:** [PRD.md](./PRD.md)
**Priority:** Must-have
**Skill targets (research §2.1):** Numeral recognition 0–9, subitising 1–3, digit ↔ quantity matching.

---

## Goal

Bridge the concrete (a set of objects) and the abstract (the written digit) so the child can recognise digits 0–9 and connect each digit to a quantity.

## User Story

> As a 4-year-old, I see a number and tap the basket that holds that many fruits, so I learn what the squiggle "5" actually means.

## Core Mechanic

- A large digit appears at the top of the screen and Ruby's voice says it ("**Five!**").
- 3 baskets appear below, each holding a different number of fruits.
- Child taps the basket whose count matches the digit.
- Correct → fruits jump out and Ruby says "Five! One-two-three-four-five!" (subitise + count back).
- Incorrect → no negative sound; the wrong basket gently wobbles "no"; after 2 misses, the correct basket shimmers.

## Levels

| Level | Digits | Distractor gap |
|---|---|---|
| 1 | 1–3 (subitising range) | Far (e.g. 1 vs 5 vs 8) |
| 2 | 1–5 | Medium |
| 3 | 0–7 (introduces 0 = empty basket) | Close |
| 4 | 0–9 | Close (e.g. 6 vs 7 vs 8) |

## Requirements

- Digit font is large, high-contrast, child-friendly (rounded sans).
- Voice narrates the digit on appearance and again on correct answer.
- The "0 = empty" case is introduced explicitly with an empty basket animation.
- Each level: 5 rounds, then auto-advance.

## Out of Scope

- Numeral writing / tracing (future epic).
- Digits above 9.

## Acceptance

- After 3 sessions, child correctly matches digits 1–5 in ≥ 80% of rounds without hint.
- No reading required; all prompts are visual + spoken.
