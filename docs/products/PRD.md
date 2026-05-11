# PRD: Ruby's Math Garden

**Date:** 2026-05-11
**Status:** Draft
**Source research:** [docs/researches/ruby-game.md](../researches/ruby-game.md)

---

## 1. Overview

**Ruby's Math Garden** is a multi-sensory, story-driven math game for **4-year-old children**. The child guides a single character (Ruby) through a garden world made of small "patches" — each patch is a self-contained mini-game that practices one early-math skill from the research.

The product is intentionally small in scope per session (5–10 minutes total, 1–3 minute levels) and intentionally rich in feedback (audio + visual on every interaction). No reading is required, no failure states exist, and there are no scores or timers.

---

## 2. Goals & Non-Goals

### Goals
- Support the **must-have** and **high-priority** math targets from the research: counting 1–10, numeral recognition 0–9, shape recognition, comparing quantities, simple patterns.
- Be playable **independently by a 4-year-old** after one adult-guided session.
- Produce **measurable skill improvement** after 2–3 weeks of ~10 min/day play.
- Feel safe and trustworthy for parents (no IAP, no ads, easy pause).

### Non-Goals (v1)
- Multi-player, leaderboards, or competitive modes.
- Reading-based instructions or text UI.
- Skills above the 4-year-old band (multi-digit arithmetic, time, money).
- Account systems / cloud sync.

---

## 3. Target User

- **Primary:** Children aged **3.5–5 years**, pre-literate, short attention span (5–15 min).
- **Secondary:** A parent or caregiver who installs, supervises the first session, and trusts the product enough to leave the child playing.

See research §1 for full developmental context.

---

## 4. Product Pillars

Derived from research §4 design principles:

1. **One concept per level** — no mixed skills in a single screen.
2. **Multi-sensory feedback** — audio + visual on every correct tap.
3. **Forgiving failure** — incorrect taps gently re-prompt; never punish.
4. **Concrete before abstract** — show *5 apples* before showing the digit *5*.
5. **No reading, ever** — all instructions visual or spoken.
6. **Predictable shell** — same character, UI, and reward pattern across every patch.

---

## 5. Epic Breakdown

The product splits into **7 epics**. Epics 1–5 are the math "patches" from the research; Epics 6–7 are the supporting shell.

| # | Epic | Skill targets | Priority | File |
|---|---|---|---|---|
| 1 | Counting Patch | Rote counting, 1:1 correspondence, cardinality | Must-have | [epic-1-counting-patch.md](./epic-1-counting-patch.md) |
| 2 | Numeral Patch | Numeral recognition 0–9, subitising | Must-have | [epic-2-numeral-patch.md](./epic-2-numeral-patch.md) |
| 3 | Shape Patch | 2D shape recognition, sorting by attribute | Must-have | [epic-3-shape-patch.md](./epic-3-shape-patch.md) |
| 4 | Compare Patch | More / fewer / same, magnitude | High | [epic-4-compare-patch.md](./epic-4-compare-patch.md) |
| 5 | Pattern Patch | Copy & extend AB / ABB / AAB patterns | High | [epic-5-pattern-patch.md](./epic-5-pattern-patch.md) |
| 6 | Garden Shell & Progression | Hub world, navigation, "garden grows" progress | Must-have | [epic-6-garden-shell.md](./epic-6-garden-shell.md) |
| 7 | Audio, Narration & Accessibility | Voice prompts, SFX, parent controls | Must-have | [epic-7-audio-accessibility.md](./epic-7-audio-accessibility.md) |

**Stretch (post-v1):** Sorting Patch (two-attribute), Addition Patch (combining sets ≤5), Measurement Patch (longer/shorter).

---

## 6. Cross-Cutting Requirements

- **Session length:** any patch level completable in ≤ 3 minutes.
- **Failure model:** incorrect input plays no negative sound; after 2 misses, the correct answer gently animates ("hint shimmer").
- **Persistence:** local-only progress per device profile; no login.
- **Pause:** a single, always-visible pause button → parent gate (drag-and-hold, no reading) → exit.
- **Platforms (v1 target):** Mobile-first responsive web (tablet primary, phone supported).

---

## 7. Success Criteria

From research §6:
- Child plays independently after one guided session.
- Any patch level completes in < 3 minutes.
- After 2–3 weeks of ~10 min/day:
  - counts to 10 with 1:1 correspondence,
  - names 4 basic shapes,
  - extends a simple AB pattern,
  - identifies "more" vs "fewer" in sets ≤ 10.

---

## 8. Open Questions

- Single-child vs multi-profile per device for v1?
- Native app shell or PWA only?
- Voice-over: recorded human VO vs TTS for v1?
- Localisation scope — English only at launch?
