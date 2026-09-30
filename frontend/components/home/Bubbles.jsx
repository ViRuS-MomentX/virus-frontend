'use client';

// Пузыри: быстро растут, лопаются и всплывают в новом месте.

import { useEffect, useRef } from 'react';

const W = 1216, H = 480, COUNT = 20;
const rnd = (a, b) => a + Math.random() * (b - a);

// Только координаты и радиус. Длительность здесь не трогаем:
// смена animation-duration на лету пересчитывает положение внутри
// цикла, и при отрицательной задержке пузырь всплывал уже видимым —
// это и давало мигание.
function place(c) {
  c.setAttribute('cx', rnd(26, W - 26).toFixed(0));
  c.setAttribute('cy', rnd(26, H - 26).toFixed(0));
  c.setAttribute('r', rnd(5, 18).toFixed(0));
}

export default function Bubbles() {
  const layer = useRef(null);

  // Пузыри живут вне React: каждый переставляется на своей итерации
  // анимации, и гонять это через состояние нет никакого смысла.
  useEffect(() => {
    const svg = layer.current;
    if (!svg || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    for (let i = 0; i < COUNT; i++) {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('class', 'bubble');
      place(c);
      // свой ритм задаётся один раз при создании и дальше не меняется
      c.style.setProperty('--dur', rnd(2.1, 4.3).toFixed(2) + 's');
      c.style.animationDelay = '-' + rnd(0, 4).toFixed(2) + 's';
      c.addEventListener('animationiteration', () => place(c));
      svg.appendChild(c);
    }

    return () => svg.replaceChildren();
  }, []);

  return (
    <svg ref={layer} className="hero-bubbles" viewBox="0 0 1216 480" preserveAspectRatio="xMidYMid slice" />
  );
}
