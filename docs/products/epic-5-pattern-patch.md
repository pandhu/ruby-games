# Epic 5: Pattern Patch

**Parent PRD:** [PRD.md](./PRD.md)
**Priority:** High
**Skill targets (research §2.4):** Recognise, copy, and extend AB / ABB / AAB patterns — foundational algebraic thinking.

---

## Goal

Train the child to perceive a repeating sequence and predict the next element.

## User Story

> As a 4-year-old, I pick the colour that comes next on Ruby's caterpillar so I learn how patterns repeat.

## Core Mechanic

- A caterpillar made of coloured segments crosses the screen with the **last segment missing** (a question-mark bubble).
- Below, 2–3 candidate segments float on lily pads.
- Child drags the correct segment onto the caterpillar's tail.
- Correct → caterpillar wiggles, Ruby reads the pattern out loud ("**red, blue, red, blue, red!**").
- Incorrect → segment floats back, no negative sound.

## Levels

| Level | Pattern type | Example | Distractors |
|---|---|---|---|
| 1 | AB (2-colour) | red-blue-red-blue-? | 1 wrong colour |
| 2 | AB (3 attribute types) | circle-square-circle-? | shape distractors |
| 3 | ABB | red-blue-blue-red-blue-blue-? | trickier |
| 4 | AAB / ABC | red-red-blue / red-blue-green | mixed |

## Requirements

- Patterns use both **colour** and **shape** as the changing attribute (not always colour).
- Voice reads the full completed pattern after every correct answer.
- A "show me again" button replays the caterpillar's pattern slowly with audio.

## Out of Scope

- Growing patterns (1, 2, 3, …).
- Patterns longer than 8 elements.

## Acceptance

- Child completes Level 1 (AB) unaided in ≥ 80% of attempts after 2 sessions.
- Child can extend an AB pattern with physical objects (blocks) outside the game.
