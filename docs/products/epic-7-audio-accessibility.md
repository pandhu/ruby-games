# Epic 7: Audio, Narration & Accessibility

**Parent PRD:** [PRD.md](./PRD.md)
**Priority:** Must-have

---

## Goal

Deliver the multi-sensory feedback and pre-literate accessibility that make every other epic usable by a 4-year-old.

## User Story

> As a 4-year-old who cannot read, I always hear what to do and what just happened, so I never feel lost.

## Core Components

### 7.1 Voice Narration
- Every prompt and every correct answer is narrated by Ruby's voice.
- Numerals, shape names, comparison words, and pattern colours are spoken with a consistent voice across the game.
- Narration uses simple, repeatable phrasing ("One… two… three! Three apples!").
- v1: pre-recorded human VO, English only.

### 7.2 Sound Effects
- Distinct, gentle SFX for: tap, drag, drop, level complete, garden grow.
- **No** harsh "wrong" buzzers anywhere — incorrect input is silent or replays the prompt.
- All audio duckable when device is in silent mode.

### 7.3 Visual Feedback
- Every interaction has a paired animation (bloom, wobble, shimmer) within 100 ms of input.
- Reduced-motion mode swaps animations for static state changes.

### 7.4 Accessibility
- Hit targets ≥ 60×60 pt.
- Colour-blind safe palette; never rely on colour alone (shape + colour together for the Pattern Patch).
- Captions (parent-toggleable) for narration — for parents reading along with pre-literate children.
- Volume control behind the parent gate.

### 7.5 Parent Controls (behind parent gate)
- Mute / unmute.
- Captions on/off.
- Reduced motion on/off.
- Reset progress.

## Requirements

- All voice clips load on patch entry, not on demand, to avoid latency.
- Audio + animation latency < 100 ms after user input.
- App functions fully (silently) if audio is muted.

## Out of Scope (v1)

- Multiple voice/character options.
- Localisation beyond English.
- Screen-reader integration (the target user cannot read).

## Acceptance

- Every prompt in every patch is narrated — verified by QA checklist.
- Mute mode: every level remains completable using visual cues alone.
- No negative or punishing audio appears anywhere in the build.
