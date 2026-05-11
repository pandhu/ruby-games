# Epic 3: Shape Patch

**Parent PRD:** [PRD.md](./PRD.md)
**Priority:** Must-have
**Skill targets (research §2.3, §2.5):** Recognise & name circle, square, triangle, rectangle (stretch: hexagon, oval, star); sort by one attribute.

---

## Goal

Build shape vocabulary and visual discrimination by sorting falling leaves into matching shape baskets.

## User Story

> As a 4-year-old, I drag each leaf into the basket with the same shape, so I learn what a circle, square, and triangle look and sound like.

## Core Mechanic

- 3–4 baskets at the bottom of the screen, each labelled with a single shape outline.
- Leaves of various shapes drift down slowly from the top.
- Child drags each leaf into the matching basket.
- On correct drop: basket "smiles", Ruby names the shape ("**Triangle!**").
- On wrong drop: leaf gently floats back to where it was; no negative sound.

## Levels

| Level | Shapes | Variations |
|---|---|---|
| 1 | Circle, Square | Same colour, same size |
| 2 | + Triangle | Same colour, mixed size |
| 3 | + Rectangle | Mixed colour, mixed size (size/colour are distractors) |
| 4 (stretch) | + Hexagon, Oval, Star | Mixed everything |

## Requirements

- Drag-and-drop must be very forgiving: a drop within ~30% of the basket bounds counts.
- Falling speed is slow and pausable; no time-pressure failure.
- Each shape has a consistent voice label across the game.
- A "show me" button (always visible) re-narrates the basket labels in sequence.

## Out of Scope

- 3D shapes.
- Shape composition / decomposition.
- Shape tracing (future).

## Acceptance

- Child correctly sorts ≥ 80% of leaves in Levels 1–3 after 2 sessions.
- Child can name circle, square, triangle, rectangle out loud when asked by an adult.
