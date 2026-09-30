'use client';

// Блок проекта. Он не выезжает снизу, а «расшифровывается»:
// по блоку проходит полоса-сканер, за ней он проявляется, а название
// в это время складывается из случайных глифов в настоящее.

import { useEffect, useRef, useState } from 'react';
import { asset } from '../../lib/text';

const GLYPHS = 'АБВГДЖЗИЛМНПРСТУФЦЧШЭЮЯ#$%&@/\\|<>*+=0123456789';
const pick = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export default function ProjectCard({ project: p }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(p.name);

  // ── расшифровка названия ───────────────────────────────
  function decode(text) {
    // пробелы оставляем на месте, иначе слово «дышит» по ширине
    const chars = [...text];
    let frame = 0;
    const perChar = 3;                       // кадров на букву до фиксации
    const total = chars.length * perChar + 8;

    const timer = setInterval(() => {
      frame++;
      const done = Math.floor(frame / perChar);
      setName(chars.map((c, i) => (i < done || c === ' ' ? c : pick())).join(''));
      if (frame >= total) {
        clearInterval(timer);
        setName(text);
      }
    }, 28);
    return timer;
  }

  // ── проявление по мере прокрутки ───────────────────────
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOpen(true);
      return;
    }

    let delay, timer;
    const io = new IntersectionObserver(entries => {
      if (!entries.some(e => e.isIntersecting)) return;
      io.disconnect();                       // проявляем один раз
      setOpen(true);
      // ждём, пока сканер дойдёт до середины, и только тогда собираем имя
      delay = setTimeout(() => { timer = decode(p.name); }, 180);
    }, { rootMargin: '0px 0px -12% 0px' });

    io.observe(ref.current);
    return () => {
      io.disconnect();
      clearTimeout(delay);
      clearInterval(timer);
    };
  }, [p.name]);

  return (
    <article ref={ref} className={'p-item' + (open ? ' is-open' : '')}>
      <div className="p-scan" aria-hidden="true" />
      <header className="p-top">
        <span className="p-id">{p.id}</span>
        <span className={`p-status is-${p.status.tone}`}>{p.status.label}</span>
      </header>
      <div className="p-headline">
        {/* логотип показываем рядом с названием, если он задан */}
        {p.logo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="p-logo" src={asset(p.logo)} alt="" width={64} height={64} loading="lazy" decoding="async" />
        )}
        <h2 className="p-name" aria-label={p.name}>{name}</h2>
      </div>
      <div className="p-tags">
        {p.tags.map(t => <span key={t} className="p-tag">{t}</span>)}
      </div>
      <dl className="p-facts">
        {p.facts.map(([k, v]) => (
          <div key={k} className="p-fact"><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      <div className="p-body">
        {p.lines.map((t, i) => <p key={i}>{t}</p>)}
        {p.note && <p className="p-note">{p.note}</p>}
      </div>
      {p.links.length > 0 && (
        <div className="p-links">
          {p.links.map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener">{l.label}</a>
          ))}
        </div>
      )}
    </article>
  );
}
