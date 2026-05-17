import { speak, spawnConfetti } from './utils';

const LEVELS = [
  { count: 3 },
  { count: 5 },
  { count: 7 },
  { count: 10 },
] as const;

const WORDS = [
  'satu','dua','tiga','empat','lima',
  'enam','tujuh','delapan','sembilan','sepuluh',
] as const;

let levelIndex = 0;
let tapCount = 0;
let wateredIds = new Set<number>();
let transitioning = false;
let goHome: () => void;

function $<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function showBubble(text: string): void {
  const bubble = $('ep1-bubble');
  bubble.textContent = text;
  bubble.classList.remove('hidden');
  bubble.getBoundingClientRect();
  bubble.classList.add('show');
  clearTimeout((bubble as HTMLElement & { _t?: ReturnType<typeof setTimeout> })._t);
  (bubble as HTMLElement & { _t?: ReturnType<typeof setTimeout> })._t = setTimeout(() => {
    bubble.classList.remove('show');
    setTimeout(() => bubble.classList.add('hidden'), 300);
  }, 3500);
}

function buildFlower(id: number): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'flower-wrapper';
  wrapper.dataset.flowerId = String(id);

  const badge = document.createElement('div');
  badge.className = 'flower-badge';
  wrapper.appendChild(badge);

  const head = document.createElement('div');
  head.className = 'flower-head';
  for (let i = 0; i < 6; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
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

  let touching = false;
  wrapper.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  wrapper.addEventListener('touchend', (e) => { e.preventDefault(); handleTap(id); });
  wrapper.addEventListener('click', () => { if (touching) { touching = false; return; } handleTap(id); });

  return wrapper;
}

function buildLevel(idx: number): void {
  tapCount = 0;
  wateredIds = new Set();

  const area = $('flower-area');
  area.innerHTML = '';
  for (let i = 1; i <= LEVELS[idx].count; i++) area.appendChild(buildFlower(i));

  $('ep1-level-num').textContent = String(idx + 1);

  const dots = $('ep1-progress-dots');
  dots.innerHTML = '';
  LEVELS.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = ['progress-dot', i < idx ? 'completed' : i === idx ? 'current' : ''].filter(Boolean).join(' ');
    dots.appendChild(dot);
  });

  const prompt = 'Sentuh setiap bunga untuk menyiramnya!';
  showBubble(prompt);
  setTimeout(() => speak(prompt, 0.85), 500);
}

function handleTap(id: number): void {
  if (transitioning || wateredIds.has(id)) return;

  tapCount++;
  wateredIds.add(id);

  const wrapper = document.querySelector(`[data-flower-id="${id}"]`) as HTMLElement;
  if (!wrapper) return;

  const drop = document.createElement('div');
  drop.className = 'water-drop';
  drop.textContent = '💧';
  wrapper.appendChild(drop);
  setTimeout(() => drop.remove(), 800);

  setTimeout(() => wrapper.classList.add('watered'), 300);

  const badge = wrapper.querySelector('.flower-badge') as HTMLElement;
  badge.textContent = String(tapCount);
  setTimeout(() => badge.classList.add('visible'), 350);

  speak(WORDS[tapCount - 1]);

  if (wateredIds.size === LEVELS[levelIndex].count) {
    transitioning = true;
    setTimeout(() => completeLevel(), 900);
  }
}

function completeLevel(): void {
  const count = LEVELS[levelIndex].count;
  document.querySelectorAll<HTMLElement>('.flower-wrapper').forEach((el, i) => {
    setTimeout(() => el.classList.add('bloomed'), i * 60);
  });

  const word = WORDS[count - 1];
  const msg = `${word.charAt(0).toUpperCase()}${word.slice(1)} bunga! Bagus sekali!`;
  setTimeout(() => { showBubble(msg); speak(msg, 0.8); }, 300);

  spawnConfetti('ep1-celebration');

  setTimeout(() => {
    $('ep1-celebration').innerHTML = '';
    if (levelIndex < LEVELS.length - 1) {
      levelIndex++;
      localStorage.setItem('ep1level', String(levelIndex));
      transitioning = false;
      buildLevel(levelIndex);
    } else {
      $('ep1-game-screen').classList.add('hidden');
      $('ep1-end-screen').classList.remove('hidden');
      speak("Luar biasa! Kamu sudah menyiram semua bunga Ruby! Tamannya sangat indah!", 0.8);
    }
  }, 2500);
}

export function startEp1Game(): void {
  $('ep1-start-screen').classList.add('hidden');
  $('ep1-end-screen').classList.add('hidden');
  $('ep1-game-screen').classList.remove('hidden');
  $('ep1-bubble').classList.add('hidden');
  $('ep1-bubble').classList.remove('show');

  levelIndex = parseInt(localStorage.getItem('ep1level') ?? '0');
  if (levelIndex >= LEVELS.length) levelIndex = 0;
  transitioning = false;
  buildLevel(levelIndex);
}

export function showEp1(): void {
  $('ep1-wrapper').classList.remove('hidden');
  $('ep1-start-screen').classList.remove('hidden');
  $('ep1-game-screen').classList.add('hidden');
  $('ep1-end-screen').classList.add('hidden');
}

export function initEp1(onGoHome: () => void): void {
  goHome = onGoHome;

  $('ep1-start-btn').addEventListener('click', () => {
    speak("Ayo hitung bunga!", 0.85);
    startEp1Game();
  });

  $('ep1-play-again-btn').addEventListener('click', () => {
    localStorage.setItem('ep1level', '0');
    startEp1Game();
  });

  document.querySelectorAll<HTMLElement>('.ep1-home-btn').forEach(btn =>
    btn.addEventListener('click', () => { window.speechSynthesis?.cancel(); goHome(); })
  );
}
