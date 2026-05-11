import './style.css';

// ── Level definitions ──────────────────────────────────────────────────────
const LEVELS = [
  { count: 3 },   // Level 1: 1-3 flowers (small set, easy intro)
  { count: 5 },   // Level 2: 4-5 flowers
  { count: 7 },   // Level 3: 6-7 flowers
  { count: 10 },  // Level 4: 8-10 flowers, wraps to 2 rows
] as const;

const WORDS = [
  'satu','dua','tiga','empat','lima',
  'enam','tujuh','delapan','sembilan','sepuluh',
] as const;

// ── State ──────────────────────────────────────────────────────────────────
let levelIndex = parseInt(localStorage.getItem('ep1level') ?? '0');
let tapCount = 0;
let wateredIds = new Set<number>();
let transitioning = false;

// ── Audio via Web Speech API ───────────────────────────────────────────────
function speak(text: string, rate = 0.9): void {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID';
  u.rate = rate;
  u.pitch = 1.15;
  window.speechSynthesis.speak(u);
}

// ── DOM helpers ────────────────────────────────────────────────────────────
function $<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function showBubble(text: string): void {
  const bubble = $('speech-bubble');
  bubble.textContent = text;
  bubble.classList.remove('hidden');
  // force reflow so transition fires even if already shown
  bubble.getBoundingClientRect();
  bubble.classList.add('show');

  clearTimeout((bubble as HTMLElement & { _hideTimer?: ReturnType<typeof setTimeout> })._hideTimer);
  (bubble as HTMLElement & { _hideTimer?: ReturnType<typeof setTimeout> })._hideTimer = setTimeout(() => {
    bubble.classList.remove('show');
    setTimeout(() => bubble.classList.add('hidden'), 300);
  }, 3500);
}

// ── Flower builder ─────────────────────────────────────────────────────────
function buildFlower(id: number): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'flower-wrapper';
  wrapper.dataset.flowerId = String(id);

  // Badge
  const badge = document.createElement('div');
  badge.className = 'flower-badge';
  wrapper.appendChild(badge);

  // Head + petals
  const head = document.createElement('div');
  head.className = 'flower-head';

  for (let i = 0; i < 6; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    // CSS var used by bloom animation to keep rotation
    petal.style.setProperty('--pr', `${i * 60}deg`);
    petal.style.transform = `rotate(${i * 60}deg)`;
    head.appendChild(petal);
  }

  const center = document.createElement('div');
  center.className = 'flower-center';
  head.appendChild(center);

  const stem = document.createElement('div');
  stem.className = 'flower-stem';

  wrapper.appendChild(head);
  wrapper.appendChild(stem);

  // Tap / touch — prevent double-fire on mobile
  let touching = false;
  wrapper.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  wrapper.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleTap(id);
  });
  wrapper.addEventListener('click', () => {
    if (touching) { touching = false; return; } // already handled via touchend
    handleTap(id);
  });

  return wrapper;
}

// ── Level setup ────────────────────────────────────────────────────────────
function buildLevel(idx: number): void {
  tapCount = 0;
  wateredIds = new Set();

  const level = LEVELS[idx];
  const area = $('flower-area');
  area.innerHTML = '';

  for (let i = 1; i <= level.count; i++) {
    area.appendChild(buildFlower(i));
  }

  // Level indicator
  $('level-num').textContent = String(idx + 1);

  // Progress dots
  const dots = $('progress-dots');
  dots.innerHTML = '';
  LEVELS.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = [
      'progress-dot',
      i < idx ? 'completed' : i === idx ? 'current' : '',
    ].filter(Boolean).join(' ');
    dots.appendChild(dot);
  });

  const prompt = 'Ketuk setiap bunga untuk menyiramnya!';
  showBubble(prompt);
  setTimeout(() => speak(prompt, 0.85), 500);
}

// ── Tap handler ────────────────────────────────────────────────────────────
function handleTap(id: number): void {
  if (transitioning) return;
  if (wateredIds.has(id)) return;

  tapCount++;
  wateredIds.add(id);

  const wrapper = document.querySelector(`[data-flower-id="${id}"]`) as HTMLElement;
  if (!wrapper) return;

  // Water drop particle
  const drop = document.createElement('div');
  drop.className = 'water-drop';
  drop.textContent = '💧';
  wrapper.appendChild(drop);
  setTimeout(() => drop.remove(), 800);

  // Watered state after brief delay (let drop fall first)
  setTimeout(() => wrapper.classList.add('watered'), 300);

  // Badge
  const badge = wrapper.querySelector('.flower-badge') as HTMLElement;
  badge.textContent = String(tapCount);
  setTimeout(() => badge.classList.add('visible'), 350);

  // Speak count number
  speak(WORDS[tapCount - 1]);

  // Check completion
  if (wateredIds.size === LEVELS[levelIndex].count) {
    transitioning = true;
    setTimeout(() => completeLevel(), 900);
  }
}

// ── Level completion ───────────────────────────────────────────────────────
function completeLevel(): void {
  const count = LEVELS[levelIndex].count;

  // Bloom all flowers with stagger
  document.querySelectorAll<HTMLElement>('.flower-wrapper').forEach((el, i) => {
    setTimeout(() => el.classList.add('bloomed'), i * 60);
  });

  // Cardinality reinforcement: "Three flowers! Well done!"
  const word = WORDS[count - 1];
  const msg = `${word.charAt(0).toUpperCase()}${word.slice(1)} bunga! Bagus sekali!`;
  setTimeout(() => {
    showBubble(msg);
    speak(msg, 0.8);
  }, 300);

  // Confetti
  spawnConfetti();

  // Advance after 2.5 s
  setTimeout(() => {
    $('celebration').innerHTML = '';

    if (levelIndex < LEVELS.length - 1) {
      levelIndex++;
      localStorage.setItem('ep1level', String(levelIndex));
      transitioning = false;
      buildLevel(levelIndex);
    } else {
      showEndScreen();
    }
  }, 2500);
}

// ── Confetti ───────────────────────────────────────────────────────────────
function spawnConfetti(): void {
  const container = $('celebration');
  const colors = ['#e91e63','#ffc107','#4caf50','#2196f3','#ff9800','#9c27b0'];

  for (let i = 0; i < 30; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    const dur = 1.8 + Math.random() * 1.5;
    piece.style.animationDuration = `${dur}s`;
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    container.appendChild(piece);
  }
}

// ── End screen ─────────────────────────────────────────────────────────────
function showEndScreen(): void {
  $('game-screen').classList.add('hidden');
  $('end-screen').classList.remove('hidden');
  speak("Luar biasa! Kamu sudah menyiram semua bunga Ruby! Kebunnya indah sekali!", 0.8);
}

// ── Start / restart ────────────────────────────────────────────────────────
function startGame(): void {
  $('start-screen').classList.add('hidden');
  $('end-screen').classList.add('hidden');
  $('game-screen').classList.remove('hidden');
  $('speech-bubble').classList.add('hidden');
  $('speech-bubble').classList.remove('show');

  levelIndex = parseInt(localStorage.getItem('ep1level') ?? '0');
  // Clamp in case saved value is out of range
  if (levelIndex >= LEVELS.length) levelIndex = 0;
  transitioning = false;

  buildLevel(levelIndex);
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  $('start-btn').addEventListener('click', () => {
    speak("Ayo hitung bunga-bunganya!", 0.85);
    startGame();
  });

  $('play-again-btn').addEventListener('click', () => {
    localStorage.setItem('ep1level', '0');
    startGame();
  });
});
