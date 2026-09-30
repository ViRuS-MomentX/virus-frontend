'use client';

// Сократова цитата: меняется сама раз в 30 секунд и по клику.

import { useCallback, useEffect, useRef, useState } from 'react';
import { quotes } from '../../data/quotes';

const EVERY = 30000;

export default function Quote() {
  // Первую цитату выбираем уже в браузере: страница собрана заранее,
  // и случайный выбор на сервере был бы у всех одинаковым.
  const [i, setI] = useState(null);
  const [swapping, setSwapping] = useState(false);
  const busy = useRef(false);
  const timer = useRef(null);
  const current = useRef(null);
  current.current = i;

  // следующая — любая, кроме той, что висит сейчас
  const pick = useCallback(() => {
    const now = current.current;
    if (quotes.length < 2) return now;
    let n;
    do { n = Math.floor(Math.random() * quotes.length); } while (n === now);
    return n;
  }, []);

  const swap = useCallback(() => {
    if (busy.current) return;            // пока идёт затухание, клики не копим
    const next = pick();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setI(next); return; }
    busy.current = true;
    setSwapping(true);
    setTimeout(() => {
      setI(next);
      setSwapping(false);
      busy.current = false;
    }, 320);
  }, [pick]);

  // после ручной смены отсчёт начинается заново
  const restart = useCallback(() => {
    clearInterval(timer.current);
    timer.current = setInterval(swap, EVERY);
  }, [swap]);

  useEffect(() => {
    if (!quotes.length) return;
    setI(Math.floor(Math.random() * quotes.length));
    restart();
    return () => clearInterval(timer.current);
  }, [restart]);

  const q = i == null ? null : quotes[i];

  return (
    <blockquote
      className={'quote' + (swapping ? ' is-swapping' : '')}
      id="quote"
      onClick={() => { swap(); restart(); }}
    >
      <p className="quote-text">{q?.text}</p>
      <cite className="quote-author">{q?.author}</cite>
    </blockquote>
  );
}
