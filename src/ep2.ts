import { speak, spawnConfetti } from './utils';

const EP2_LEVELS = [
  { pool: [1, 2, 3],                        gap: 3 },
  { pool: [1, 2, 3, 4, 5],                  gap: 2 },
  { pool: [0, 1, 2, 3, 4, 5, 6, 7],         gap: 1 },
  { pool: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],  gap: 1 },
] as const;

const ROUNDS_PER_LEVEL = 5;
const NUMBER_WORDS = ['nol','satu','dua','tiga','empat','lima','enam','tujuh','delapan','sembilan'];
const FRUIT = '🍎';

let ep2Level = 0;
let ep2Round = 0;
let ep2Target = 0;
let ep2Misses = 0;
let ep2Active = false;
let goHome: () => void;

function $<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function ep2Bubble(text: string): void {
  const b = $('ep2-bubble');
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

function generateOptions(target: number, levelIdx: number): number[] {
  const ALL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const gap = EP2_LEVELS[levelIdx].gap;

  let candidates = ALL.filter(n => n !== target && Math.abs(n - target) >= gap);
  if (candidates.length < 2) candidates = ALL.filter(n => n !== target);

  const shuffled = [...candidates].sort(() => Math.random() - 0.5);
  return [target, shuffled[0], shuffled[1]].sort(() => Math.random() - 0.5);
}

function buildBasketCard(count: number): HTMLElement {
  const card = document.createElement('div');
  card.className = 'basket-card';
  card.dataset.count = String(count);

  const fruitsEl = document.createElement('div');
  fruitsEl.className = 'basket-fruits';

  if (count === 0) {
    const empty = document.createElement('div');
    empty.className = 'basket-empty-label';
    empty.textContent = 'kosong';
    fruitsEl.appendChild(empty);
  } else {
    for (let i = 0; i < count; i++) {
      const f = document.createElement('span');
      f.className = 'fruit-item';
      f.textContent = FRUIT;
      fruitsEl.appendChild(f);
    }
  }

  const basketEl = document.createElement('div');
  basketEl.className = 'basket-emoji';
  basketEl.textContent = '🧺';

  card.appendChild(fruitsEl);
  card.appendChild(basketEl);

  let touching = false;
  card.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  card.addEventListener('touchend', (e) => { e.preventDefault(); handleBasketTap(card, count); });
  card.addEventListener('click', () => { if (touching) { touching = false; return; } handleBasketTap(card, count); });

  return card;
}

function handleBasketTap(card: HTMLElement, count: number): void {
  if (!ep2Active) return;

  if (count === ep2Target) {
    ep2Active = false;
    card.classList.add('basket-correct');
    document.querySelectorAll<HTMLElement>('.basket-hint').forEach(c => c.classList.remove('basket-hint'));

    const word = NUMBER_WORDS[ep2Target];
    let msg: string;
    if (ep2Target === 0) {
      msg = 'Nol! Keranjangnya kosong!';
    } else {
      const countList = Array.from({ length: ep2Target }, (_, i) => NUMBER_WORDS[i + 1]).join(', ');
      msg = `${word.charAt(0).toUpperCase()}${word.slice(1)}! ${countList}!`;
    }

    setTimeout(() => { speak(msg, 0.8); ep2Bubble(msg); }, 150);
    setTimeout(() => { card.classList.remove('basket-correct'); nextRound(); }, 1800);
  } else {
    ep2Misses++;
    card.classList.add('basket-wrong');
    setTimeout(() => card.classList.remove('basket-wrong'), 600);

    if (ep2Misses >= 2) {
      document.querySelectorAll<HTMLElement>('.basket-card').forEach(c => {
        if (Number(c.dataset.count) === ep2Target) c.classList.add('basket-hint');
      });
    }
  }
}

function nextRound(): void {
  ep2Round++;
  if (ep2Round >= ROUNDS_PER_LEVEL) {
    ep2Round = 0;
    completeEp2Level();
  } else {
    startRound();
  }
}

function completeEp2Level(): void {
  spawnConfetti('ep2-confetti');
  const isLast = ep2Level >= EP2_LEVELS.length - 1;
  const msg = isLast ? 'Luar biasa! Kamu hafal semua angka!' : 'Bagus sekali! Level berikutnya!';
  speak(msg, 0.8);
  ep2Bubble(msg);

  setTimeout(() => {
    $('ep2-confetti').innerHTML = '';
    if (!isLast) {
      ep2Level++;
      localStorage.setItem('ep2level', String(ep2Level));
      buildLevelUI();
      startRound();
    } else {
      $('ep2-game').classList.add('hidden');
      $('ep2-end').classList.remove('hidden');
      speak("Luar biasa! Kamu bisa membaca semua angka! Kamu sangat pintar!", 0.8);
    }
  }, 2500);
}

function buildLevelUI(): void {
  $('ep2-level-num').textContent = String(ep2Level + 1);
  const dots = $('ep2-dots');
  dots.innerHTML = '';
  EP2_LEVELS.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = ['progress-dot', i < ep2Level ? 'completed' : i === ep2Level ? 'current' : ''].filter(Boolean).join(' ');
    dots.appendChild(dot);
  });
}

function startRound(): void {
  ep2Active = true;
  ep2Misses = 0;

  const pool = EP2_LEVELS[ep2Level].pool as readonly number[];
  ep2Target = pool[Math.floor(Math.random() * pool.length)];

  const options = generateOptions(ep2Target, ep2Level);

  const digitEl = $('ep2-digit');
  digitEl.textContent = String(ep2Target);
  digitEl.classList.remove('digit-pop');
  void digitEl.offsetWidth;
  digitEl.classList.add('digit-pop');

  $('ep2-round-num').textContent = String(ep2Round + 1);

  const area = $('ep2-baskets');
  area.innerHTML = '';
  options.forEach(count => area.appendChild(buildBasketCard(count)));

  const word = NUMBER_WORDS[ep2Target];
  const spoken = `${word.charAt(0).toUpperCase()}${word.slice(1)}!`;
  setTimeout(() => { speak(spoken, 0.85); ep2Bubble(spoken); }, 400);
}

export function startEp2(): void {
  ep2Level = parseInt(localStorage.getItem('ep2level') ?? '0');
  if (ep2Level >= EP2_LEVELS.length) ep2Level = 0;
  ep2Round = 0;

  $('ep2-game').classList.remove('hidden');
  $('ep2-end').classList.add('hidden');
  $('ep2-confetti').innerHTML = '';

  buildLevelUI();
  startRound();
}

export function showEp2(): void {
  $('ep2-wrapper').classList.remove('hidden');
}

export function initEp2(onGoHome: () => void): void {
  goHome = onGoHome;

  $('ep2-home-btn').addEventListener('click', () => { window.speechSynthesis?.cancel(); goHome(); });
  $('ep2-replay-btn').addEventListener('click', () => { localStorage.setItem('ep2level', '0'); startEp2(); });
  $('ep2-home-end-btn').addEventListener('click', () => { window.speechSynthesis?.cancel(); goHome(); });
}
