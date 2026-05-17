import { speak, spawnConfetti } from './utils';

const EP4_LEVELS = [
  { sets: [[1, 5]], prompts: ['more'] },
  { sets: [[2, 4], [3, 6]], prompts: ['more', 'fewer'] },
  { sets: [[4, 5], [6, 7]], prompts: ['more', 'fewer'] },
  { sets: [[3, 3], [4, 4], [2, 5]], prompts: ['more', 'fewer', 'same'] },
] as const;

const ROUNDS_PER_LEVEL = 5;
const NUMBER_WORDS = [
  'nol','satu','dua','tiga','empat','lima',
  'enam','tujuh','delapan','sembilan','sepuluh',
];
const APPLE = '🍎';

const PROMPT_TEXTS: Record<string, string> = {
  more: 'Pohon mana yang apelnya lebih banyak?',
  fewer: 'Pohon mana yang apelnya lebih sedikit?',
  same: 'Pohon mana yang apelnya sama banyak?',
};

let levelIndex = 0;
let round = 0;
let correctTree = 0;
let currentPrompt = '';
let misses = 0;
let active = false;
let goHome: () => void;

function $<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function ep4Bubble(text: string): void {
  const b = $('ep4-bubble');
  b.textContent = text;
  b.classList.remove('hidden');
  b.getBoundingClientRect();
  b.classList.add('show');
  clearTimeout((b as HTMLElement & { _t?: ReturnType<typeof setTimeout> })._t);
  (b as HTMLElement & { _t?: ReturnType<typeof setTimeout> })._t = setTimeout(() => {
    b.classList.remove('show');
    setTimeout(() => b.classList.add('hidden'), 300);
  }, 4000);
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function countWords(n: number): string {
  if (n <= 0) return 'nol';
  if (n <= 10) return NUMBER_WORDS[n];
  return String(n);
}

function buildTree(id: number, count: number): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'ep4-tree';
  wrapper.dataset.treeId = String(id);

  const trunk = document.createElement('div');
  trunk.className = 'tree-trunk';

  const canopy = document.createElement('div');
  canopy.className = 'tree-canopy';

  const positions = shuffle([
    { x: 25, y: 15 }, { x: 60, y: 10 }, { x: 40, y: 35 },
    { x: 15, y: 50 }, { x: 70, y: 45 }, { x: 50, y: 60 },
    { x: 30, y: 70 }, { x: 75, y: 65 }, { x: 10, y: 30 },
    { x: 85, y: 25 }, { x: 45, y: 80 }, { x: 65, y: 75 },
  ]).slice(0, count);

  for (const pos of positions) {
    const apple = document.createElement('span');
    apple.className = 'apple';
    apple.textContent = APPLE;
    apple.style.left = `${pos.x}%`;
    apple.style.top = `${pos.y}%`;
    canopy.appendChild(apple);
  }

  wrapper.appendChild(canopy);
  wrapper.appendChild(trunk);

  let touching = false;
  wrapper.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  wrapper.addEventListener('touchend', (e) => { e.preventDefault(); handleTreeTap(id, count); });
  wrapper.addEventListener('click', () => { if (touching) { touching = false; return; } handleTreeTap(id, count); });

  return wrapper;
}

function handleTreeTap(id: number, count: number): void {
  if (!active) return;

  const isCorrect = id === correctTree;
  const treeEl = document.querySelector(`.ep4-tree[data-tree-id="${id}"]`) as HTMLElement;
  if (!treeEl) return;

  document.querySelectorAll<HTMLElement>('.ep4-tree.hint').forEach(t => t.classList.remove('hint'));

  if (isCorrect) {
    active = false;
    treeEl.classList.add('tree-correct');

    const counts: Record<number, number> = { 1: 0, 2: 0 };
    const area = $('ep4-trees-area');
    area.querySelectorAll<HTMLElement>('.ep4-tree').forEach(t => {
      const tid = parseInt(t.dataset.treeId!);
      counts[tid] = parseInt(t.dataset.count!);
    });

    const tapped = counts[id];
    const other = counts[id === 1 ? 2 : 1];

    if (currentPrompt === 'same') {
      const msg = `Sama banyak! ${countWords(count)} apel, ${countWords(count)} apel!`;
      setTimeout(() => { speak(msg, 0.8); ep4Bubble(msg); }, 200);
    } else if (currentPrompt === 'more') {
      const bigger = Math.max(tapped, other);
      const msg = `Ini ${countWords(tapped)} apel, ini ${countWords(other)} apel — ${countWords(bigger)} lebih banyak!`;
      setTimeout(() => { speak(msg, 0.8); ep4Bubble(msg); }, 200);
    } else {
      const smaller = Math.min(tapped, other);
      const msg = `Ini ${countWords(tapped)} apel, ini ${countWords(other)} apel — ${countWords(smaller)} lebih sedikit!`;
      setTimeout(() => { speak(msg, 0.8); ep4Bubble(msg); }, 200);
    }

    spawnConfetti('ep4-confetti');

    setTimeout(() => {
      $('ep4-confetti').innerHTML = '';
      treeEl.classList.remove('tree-correct');
      nextRound();
    }, 2800);
  } else {
    misses++;
    treeEl.classList.add('tree-wrong');
    setTimeout(() => treeEl.classList.remove('tree-wrong'), 600);

    if (misses >= 2) {
      const hintTree = document.querySelector(`.ep4-tree[data-tree-id="${correctTree}"]`) as HTMLElement;
      if (hintTree) hintTree.classList.add('hint');
    }
  }
}

function nextRound(): void {
  round++;
  if (round >= ROUNDS_PER_LEVEL) {
    round = 0;
    completeLevel();
  } else {
    startRound();
  }
}

function completeLevel(): void {
  const isLast = levelIndex >= EP4_LEVELS.length - 1;
  const msg = isLast ? 'Luar biasa! Kamu sudah menyelesaikan semua level!' : 'Bagus sekali! Level berikutnya!';
  speak(msg, 0.8);
  ep4Bubble(msg);

  setTimeout(() => {
    $('ep4-confetti').innerHTML = '';
    if (!isLast) {
      levelIndex++;
      localStorage.setItem('ep4level', String(levelIndex));
      buildLevelUI();
      startRound();
    } else {
      $('ep4-game-screen').classList.add('hidden');
      $('ep4-end-screen').classList.remove('hidden');
      speak("Luar biasa! Kamu bisa membandingkan jumlah apel! Kamu sangat pintar!", 0.8);
    }
  }, 2500);
}

function buildLevelUI(): void {
  $('ep4-level-num').textContent = String(levelIndex + 1);
  const dots = $('ep4-progress-dots');
  dots.innerHTML = '';
  EP4_LEVELS.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = ['progress-dot', i < levelIndex ? 'completed' : i === levelIndex ? 'current' : ''].filter(Boolean).join(' ');
    dots.appendChild(dot);
  });
}

function startRound(): void {
  active = true;
  misses = 0;

  const lvl = EP4_LEVELS[levelIndex];
  const prompts = [...lvl.prompts] as string[];
  currentPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  const setPair = lvl.sets[Math.floor(Math.random() * lvl.sets.length)];
  const a = setPair[0];
  const b = setPair[1];
  const isSwap = a === b ? false : Math.random() < 0.5;
  const left = isSwap ? b : a;
  const right = isSwap ? a : b;
  correctTree = isSwap ? 2 : 1;

  $('ep4-prompt-text').textContent = PROMPT_TEXTS[currentPrompt];
  $('ep4-round-num').textContent = String(round + 1);

  const area = $('ep4-trees-area');
  area.innerHTML = '';
  area.appendChild(buildTree(1, left));
  area.appendChild(buildTree(2, right));

  const spoken = PROMPT_TEXTS[currentPrompt];
  setTimeout(() => { speak(spoken, 0.85); ep4Bubble(spoken); }, 400);
}

export function startEp4(): void {
  levelIndex = parseInt(localStorage.getItem('ep4level') ?? '0');
  if (levelIndex >= EP4_LEVELS.length) levelIndex = 0;
  round = 0;

  $('ep4-start-screen').classList.add('hidden');
  $('ep4-end-screen').classList.add('hidden');
  $('ep4-game-screen').classList.remove('hidden');
  $('ep4-bubble').classList.add('hidden');
  $('ep4-bubble').classList.remove('show');
  $('ep4-confetti').innerHTML = '';

  buildLevelUI();
  startRound();
}

export function showEp4(): void {
  $('ep4-wrapper').classList.remove('hidden');
  $('ep4-start-screen').classList.remove('hidden');
  $('ep4-game-screen').classList.add('hidden');
  $('ep4-end-screen').classList.add('hidden');
}

export function initEp4(onGoHome: () => void): void {
  goHome = onGoHome;

  $('ep4-start-btn').addEventListener('click', () => {
    speak("Ayo bandingkan apelnya!", 0.85);
    startEp4();
  });

  $('ep4-play-again-btn').addEventListener('click', () => {
    localStorage.setItem('ep4level', '0');
    startEp4();
  });

  $('ep4-home-btn').addEventListener('click', () => { window.speechSynthesis?.cancel(); goHome(); });
  $('ep4-home-btn-sm').addEventListener('click', () => { window.speechSynthesis?.cancel(); goHome(); });
  $('ep4-home-end-btn').addEventListener('click', () => { window.speechSynthesis?.cancel(); goHome(); });
}
