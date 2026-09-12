// Страница проектов. Блоки не выезжают снизу, а «расшифровываются»:
// по блоку проходит полоса-сканер, за ней он проявляется, а название
// в это время складывается из случайных глифов в настоящее.

import { projects } from './projects-data.js';

const list = document.getElementById('projects');

if (list) {
  const esc = t => String(t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── разметка ───────────────────────────────────────────

  list.innerHTML = projects.map(p => {
    const facts = p.facts
      .map(([k, v]) => `<div class="p-fact"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
      .join('');

    const body = p.lines.map(t => `<p>${esc(t)}</p>`).join('');
    const note = p.note ? `<p class="p-note">${esc(p.note)}</p>` : '';
    const links = p.links.length
      ? `<div class="p-links">` + p.links.map(l =>
          `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('') + `</div>`
      : '';

    const tags = p.tags.map(t => `<span class="p-tag">${esc(t)}</span>`).join('');

    return `
      <article class="p-item" data-name="${esc(p.name)}">
        <div class="p-scan" aria-hidden="true"></div>
        <header class="p-top">
          <span class="p-id">${esc(p.id)}</span>
          <span class="p-status is-${esc(p.status.tone)}">${esc(p.status.label)}</span>
        </header>
        <h2 class="p-name">${esc(p.name)}</h2>
        <div class="p-tags">${tags}</div>
        <dl class="p-facts">${facts}</dl>
        <div class="p-body">${body}${note}</div>
        ${links}
      </article>`;
  }).join('');

  // ── расшифровка названия ───────────────────────────────

  const GLYPHS = 'АБВГДЖЗИЛМНПРСТУФЦЧШЭЮЯ#$%&@/\\|<>*+=0123456789';
  const pick = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

  function decode(el, text) {
    // пробелы оставляем на месте, иначе слово «дышит» по ширине
    const chars = [...text];
    let frame = 0;
    const perChar = 3;                       // кадров на букву до фиксации
    const total = chars.length * perChar + 8;

    const timer = setInterval(() => {
      frame++;
      const done = Math.floor(frame / perChar);
      el.textContent = chars
        .map((c, i) => (i < done || c === ' ' ? c : pick()))
        .join('');
      if (frame >= total) {
        clearInterval(timer);
        el.textContent = text;
      }
    }, 28);
  }

  // ── проявление по мере прокрутки ───────────────────────

  const items = [...list.querySelectorAll('.p-item')];

  if (calm) {
    items.forEach(el => el.classList.add('is-open'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        obs.unobserve(el);                   // проявляем один раз
        el.classList.add('is-open');
        const name = el.querySelector('.p-name');
        // ждём, пока сканер дойдёт до середины, и только тогда собираем имя
        setTimeout(() => decode(name, el.dataset.name), 180);
      });
    }, { rootMargin: '0px 0px -12% 0px' });

    items.forEach(el => io.observe(el));
  }
}
