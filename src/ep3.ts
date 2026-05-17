import { speak, spawnConfetti } from './utils';

type Shape = 'circle' | 'square' | 'triangle' | 'rectangle';

interface LevelConfig {
  shapes: Shape[];
  mixedSize: boolean;
  mixedColor: boolean;
}

const EP3_LEVELS: LevelConfig[] = [
  { shapes: ['circle', 'square'],                          mixedSize: false, mixedColor: false },
  { shapes: ['circle', 'square', 'triangle'],              mixedSize: true,  mixedColor: false },
  { shapes: ['circle', 'square', 'triangle', 'rectangle'], mixedSize: true,  mixedColor: true  },
];

const SHAPE_NAMES: Record<Shape, string> = {
  circle:    'Lingkaran',
  square:    'Persegi',
  triangle:  'Segitiga',
  rectangle: 'Persegi Panjang',
};

const COLORS = ['#e74c3c', '#3498db', '#9b59b6', '#e67e22', '#e91e8c'];

let ep3Level = 0;
let ep3Active = false;
let ep3LeavesQueue: Shape[] = [];
let ep3LeafIndex = 0;
let goHome3: () => void;

function $<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function ep3Bubble(text: string): void {
  const b = $('ep3-bubble');
  b.textContent = text;
  b.classList.remove('hidden');
  b.getBoundingClientRect();
  b.classList.add('show');
  clearTimeout((b as HTMLElement & { _t?: ReturnType<typeof setTimeout> })._t);
  (b as HTMLElement & { _t?: ReturnType<typeof setTimeout> })._t = setTimeout(() => {
    b.classList.remove('show');
    setTimeout(() => b.classList.add('hidden'), 300);
  }, 3500);
}

function createShapeSVG(shape: Shape, color: string, size: number): string {
  switch (shape) {
    case 'circle':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="${color}" stroke="rgba(0,0,0,0.18)" stroke-width="4"/></svg>`;
    case 'square':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="8" fill="${color}" stroke="rgba(0,0,0,0.18)" stroke-width="4"/></svg>`;
    case 'triangle':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><polygon points="50,8 92,92 8,92" fill="${color}" stroke="rgba(0,0,0,0.18)" stroke-width="4"/></svg>`;
    case 'rectangle':
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><rect x="6" y="22" width="88" height="56" rx="8" fill="${color}" stroke="rgba(0,0,0,0.18)" stroke-width="4"/></svg>`;
  }
}

function createBasketOutline(shape: Shape): string {
  switch (shape) {
    case 'circle':
      return `<svg width="52" height="52" viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="rgba(255,255,255,0.25)" stroke="#2e7d32" stroke-width="8" stroke-dasharray="12 6"/></svg>`;
    case 'square':
      return `<svg width="52" height="52" viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="8" fill="rgba(255,255,255,0.25)" stroke="#2e7d32" stroke-width="8" stroke-dasharray="12 6"/></svg>`;
    case 'triangle':
      return `<svg width="52" height="52" viewBox="0 0 100 100"><polygon points="50,8 92,92 8,92" fill="rgba(255,255,255,0.25)" stroke="#2e7d32" stroke-width="8" stroke-dasharray="12 6"/></svg>`;
    case 'rectangle':
      return `<svg width="52" height="52" viewBox="0 0 100 100"><rect x="6" y="22" width="88" height="56" rx="8" fill="rgba(255,255,255,0.25)" stroke="#2e7d32" stroke-width="8" stroke-dasharray="12 6"/></svg>`;
  }
}

function buildLeaf(shape: Shape, color: string, size: number): HTMLElement {
  const leaf = document.createElement('div');
  leaf.className = 'ep3-leaf';
  leaf.dataset.shape = shape;
  leaf.innerHTML = createShapeSVG(shape, color, size);
  return leaf;
}

function buildBaskets(shapes: Shape[]): void {
  const area = $('ep3-baskets');
  area.innerHTML = '';
  shapes.forEach(shape => {
    const basket = document.createElement('div');
    basket.className = 'ep3-basket';
    basket.dataset.shape = shape;

    const outline = document.createElement('div');
    outline.className = 'ep3-basket-outline';
    outline.innerHTML = createBasketOutline(shape);

    const label = document.createElement('div');
    label.className = 'ep3-basket-label';
    label.textContent = SHAPE_NAMES[shape];

    const emoji = document.createElement('div');
    emoji.className = 'ep3-basket-emoji';
    emoji.textContent = '🧺';

    basket.appendChild(outline);
    basket.appendChild(label);
    basket.appendChild(emoji);
    area.appendChild(basket);
  });
}

function generateLeavesQueue(level: LevelConfig): Shape[] {
  const repeats = Math.max(2, Math.ceil(8 / level.shapes.length));
  const queue: Shape[] = [];
  for (let r = 0; r < repeats; r++) queue.push(...level.shapes);
  return queue.sort(() => Math.random() - 0.5);
}

function isOverBasket(leaf: HTMLElement, basket: HTMLElement): boolean {
  const lr = leaf.getBoundingClientRect();
  const br = basket.getBoundingClientRect();
  const padX = br.width * 0.3;
  const padY = br.height * 0.3;
  const cx = lr.left + lr.width / 2;
  const cy = lr.top + lr.height / 2;
  return cx >= br.left - padX && cx <= br.right + padX && cy >= br.top - padY && cy <= br.bottom + padY;
}

function floatBack(leaf: HTMLElement): void {
  leaf.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
  leaf.style.transform = 'translate(0,0) scale(1)';
  setTimeout(() => { leaf.style.transition = ''; leaf.style.transform = ''; }, 520);
}

function setupLeafDrag(leaf: HTMLElement): void {
  let startX = 0, startY = 0, dragging = false;

  leaf.addEventListener('pointerdown', (e: PointerEvent) => {
    if (!ep3Active) return;
    e.preventDefault();
    leaf.setPointerCapture(e.pointerId);
    startX = e.clientX;
    startY = e.clientY;
    dragging = true;
    leaf.classList.add('ep3-leaf-dragging');
    leaf.style.transition = 'none';
  });

  leaf.addEventListener('pointermove', (e: PointerEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    leaf.style.transform = `translate(${dx}px,${dy}px) scale(1.12)`;
    document.querySelectorAll<HTMLElement>('.ep3-basket').forEach(b => {
      b.classList.toggle('ep3-basket-over', isOverBasket(leaf, b));
    });
  });

  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    leaf.classList.remove('ep3-leaf-dragging');
    document.querySelectorAll<HTMLElement>('.ep3-basket').forEach(b => b.classList.remove('ep3-basket-over'));

    const leafShape = leaf.dataset.shape as Shape;
    let matched = false;

    document.querySelectorAll<HTMLElement>('.ep3-basket').forEach(basket => {
      if (matched) return;
      if (!isOverBasket(leaf, basket)) return;
      matched = true;

      if ((basket.dataset.shape as Shape) === leafShape) {
        ep3Active = false;
        basket.classList.add('ep3-basket-correct');
        leaf.style.transition = 'opacity 0.35s, transform 0.35s';
        leaf.style.transform = 'scale(0.5)';
        leaf.style.opacity = '0';

        const msg = `${SHAPE_NAMES[leafShape]}! Bagus sekali!`;
        setTimeout(() => { speak(msg, 0.8); ep3Bubble(msg); }, 100);
        setTimeout(() => {
          basket.classList.remove('ep3-basket-correct');
          ep3LeafIndex++;
          showNextLeaf();
        }, 1700);
      } else {
        floatBack(leaf);
      }
    });

    if (!matched) floatBack(leaf);
  };

  leaf.addEventListener('pointerup', onUp);
  leaf.addEventListener('pointercancel', () => {
    dragging = false;
    leaf.classList.remove('ep3-leaf-dragging');
    floatBack(leaf);
  });
}

function showNextLeaf(): void {
  if (ep3LeafIndex >= ep3LeavesQueue.length) { completeLevelEp3(); return; }

  const level = EP3_LEVELS[ep3Level];
  const shape = ep3LeavesQueue[ep3LeafIndex];
  const color = level.mixedColor ? COLORS[Math.floor(Math.random() * COLORS.length)] : '#4CAF50';
  const size = level.mixedSize ? [56, 72, 88][Math.floor(Math.random() * 3)] : 72;

  const area = $('ep3-leaf-area');
  area.innerHTML = '';
  const leaf = buildLeaf(shape, color, size);
  area.appendChild(leaf);

  setTimeout(() => {
    speak(`Ini ${SHAPE_NAMES[shape]}!`, 0.85);
    ep3Bubble(`Ini ${SHAPE_NAMES[shape]}!`);
  }, 300);

  setupLeafDrag(leaf);
  ep3Active = true;
}

function completeLevelEp3(): void {
  ep3Active = false;
  spawnConfetti('ep3-confetti');
  const isLast = ep3Level >= EP3_LEVELS.length - 1;
  const msg = isLast ? 'Luar biasa! Kamu tahu semua bentuk!' : 'Bagus sekali! Level berikutnya!';
  speak(msg, 0.8);
  ep3Bubble(msg);

  setTimeout(() => {
    $('ep3-confetti').innerHTML = '';
    if (!isLast) {
      ep3Level++;
      localStorage.setItem('ep3level', String(ep3Level));
      startEp3Game();
    } else {
      $('ep3-game').classList.add('hidden');
      $('ep3-end').classList.remove('hidden');
      speak('Luar biasa! Kamu bisa mengenal semua bentuk! Kamu sangat pintar!', 0.8);
    }
  }, 2500);
}

function buildLevelUI3(): void {
  $('ep3-level-num').textContent = String(ep3Level + 1);
  const dots = $('ep3-dots');
  dots.innerHTML = '';
  EP3_LEVELS.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = ['progress-dot', i < ep3Level ? 'completed' : i === ep3Level ? 'current' : ''].filter(Boolean).join(' ');
    dots.appendChild(dot);
  });
}

function narrateBaskets(): void {
  const shapes = EP3_LEVELS[ep3Level].shapes;
  let i = 0;
  const next = () => {
    if (i >= shapes.length) return;
    speak(SHAPE_NAMES[shapes[i]], 0.8);
    ep3Bubble(SHAPE_NAMES[shapes[i]]);
    i++;
    setTimeout(next, 1600);
  };
  next();
}

function startEp3Game(): void {
  const level = EP3_LEVELS[ep3Level];
  ep3LeavesQueue = generateLeavesQueue(level);
  ep3LeafIndex = 0;

  buildLevelUI3();
  buildBaskets(level.shapes);
  $('ep3-show-me').onclick = narrateBaskets;

  setTimeout(() => showNextLeaf(), 600);
}

export function startEp3(): void {
  ep3Level = parseInt(localStorage.getItem('ep3level') ?? '0');
  if (ep3Level >= EP3_LEVELS.length) ep3Level = 0;

  $('ep3-game').classList.remove('hidden');
  $('ep3-end').classList.add('hidden');
  $('ep3-confetti').innerHTML = '';
  $('ep3-leaf-area').innerHTML = '';

  startEp3Game();
}

export function showEp3(): void {
  $('ep3-wrapper').classList.remove('hidden');
}

export function initEp3(onGoHome: () => void): void {
  goHome3 = onGoHome;
  $('ep3-home-btn').addEventListener('click', () => { window.speechSynthesis?.cancel(); goHome3(); });
  $('ep3-replay-btn').addEventListener('click', () => { localStorage.setItem('ep3level', '0'); startEp3(); });
  $('ep3-home-end-btn').addEventListener('click', () => { window.speechSynthesis?.cancel(); goHome3(); });
}
