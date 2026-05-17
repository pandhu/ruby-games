import './style.css';
import { initEp1, showEp1 } from './ep1';
import { initEp2, showEp2, startEp2 } from './ep2';
import { speak } from './utils';

function $<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

function showHome(): void {
  window.speechSynthesis?.cancel();
  $('home-screen').classList.remove('hidden');
  $('ep1-wrapper').classList.add('hidden');
  $('ep2-wrapper').classList.add('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  initEp1(showHome);
  initEp2(showHome);

  $('play-ep1').addEventListener('click', () => {
    speak("Ayo hitung bunga!", 0.85);
    $('home-screen').classList.add('hidden');
    showEp1();
  });

  $('play-ep2').addEventListener('click', () => {
    speak("Angka berapa ini?", 0.85);
    $('home-screen').classList.add('hidden');
    showEp2();
    startEp2();
  });
});
