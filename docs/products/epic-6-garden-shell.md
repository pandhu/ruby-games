# Epic 6: Garden Shell & Progression

**Parent PRD:** [PRD.md](./PRD.md)
**Priority:** Must-have

---

## Goal

Provide the predictable, low-cognitive-load wrapper around all five math patches: a hub world, navigation between patches, and a non-competitive progression system.

## User Story

> As a 4-year-old, I see Ruby's garden grow a little every time I play, so I feel proud and want to come back.

## Core Components

### 6.1 Hub Garden
- A single illustrated garden screen with **5 patches** as visual locations (counting flowers, numeral fruits, shape leaves, comparison apple-trees, pattern caterpillar).
- Tapping a patch enters that mini-game (Epics 1–5).
- Always-visible **pause/parent-gate** button (top corner).

### 6.2 Progression
- Completing any level adds **one visual element** to the garden (a new flower, a butterfly, a sun ray).
- **No scores. No stars. No timers. No lives.**
- Garden state persists locally per device profile.

### 6.3 Navigation
- Tap-to-enter, swipe-to-return — no menus, no text buttons.
- Back navigation always returns to the hub; never to a sub-menu.

### 6.4 First-Run Experience
- A 30-second guided intro: Ruby waves, walks to one patch, plays a single round, returns. No tutorial text.

### 6.5 Parent Gate
- Triggered by pause button.
- Drag-and-hold gesture (research-standard pattern) to confirm — no reading required from the child, but trivial for an adult.
- Behind the gate: reset progress, mute audio, exit.

## Requirements

- Hub loads in < 2 seconds on a mid-tier tablet.
- Progress persists across app restarts without an account.
- All UI elements are tappable with a 4-year-old's finger (≥ 60×60 pt hit targets).

## Out of Scope (v1)

- Multiple child profiles.
- Cloud sync.
- Daily-streak / calendar mechanics (could promote unhealthy habits in this age group).

## Acceptance

- Child can navigate hub → patch → back to hub unaided after one demo.
- Garden visibly changes after every completed level.
- Parents can exit / mute without the child being able to bypass the gate.
