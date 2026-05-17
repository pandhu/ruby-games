export function speak(text: string, rate = 0.9): void {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'id-ID';
  u.rate = rate;
  u.pitch = 1.15;
  window.speechSynthesis.speak(u);
}

export function spawnConfetti(containerId: string): void {
  const container = document.getElementById(containerId);
  if (!container) return;
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
