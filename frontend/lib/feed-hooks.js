// Общие для обеих лент кусочки поведения. Импортируются только из
// клиентских компонентов.

import { useCallback, useEffect, useRef, useState } from 'react';
import { anchorId, postPath } from './posts';

// ── «Новое с прошлого визита» ──
//
// В localStorage лежит время самой свежей записи, которую человек уже видел.
// Визит — это вкладка браузера: в начале визита старое значение переезжает
// в sessionStorage и держится до конца визита (при перезагрузках и переходах
// между страницами отметки не пропадают), а в localStorage сразу пишется
// новое. На следующем визите сравнение идёт уже с ним.
//
// Возвращает время, с которого запись считается новой, или null:
// первый визит, хранилище недоступно или страница ещё не ожила.

const SEEN_KEY = 'posts_last_seen';
const SINCE_KEY = 'posts_since';

export function useNewSince(newest) {
  const [since, setSince] = useState(null);

  useEffect(() => {
    try {
      let value = sessionStorage.getItem(SINCE_KEY);
      if (value === null) {
        value = localStorage.getItem(SEEN_KEY) || '';
        sessionStorage.setItem(SINCE_KEY, value);
      }
      const seen = localStorage.getItem(SEEN_KEY) || '';
      if (newest > seen) localStorage.setItem(SEEN_KEY, newest);
      setSince(value || null);
    } catch (e) {
      setSince(null);
    }
  }, [newest]);

  return since;
}

export const isNewPost = (post, since) => Boolean(since) && post.stamp > since;

// ── Поделиться ──
//
// На телефоне открываем системное «поделиться» (там сразу телеграм), на
// компьютере копируем ссылку. Ссылка ведёт на отдельную страницу поста —
// у неё своё превью с картинкой и заголовком, когда ссылку кидают в чат.

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // старые браузеры и страницы без https
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) {}
    area.remove();
    return ok;
  }
}

export function useShare(base = '') {
  // id поста, по которому только что поделились, и чем всё кончилось
  const [state, setState] = useState({ id: null, result: null });
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const share = useCallback(async post => {
    const url = location.origin + postPath(post.id, base);
    let result = 'failed';

    const touch = matchMedia('(pointer: coarse)').matches;
    if (touch && navigator.share) {
      try {
        await navigator.share({ title: post.title || 'Вирус', url });
        return;                      // системное окно само всё показало
      } catch (e) {
        if (e && e.name === 'AbortError') return;
      }
    }

    if (await copy(url)) result = 'copied';
    setState({ id: post.id, result });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState({ id: null, result: null }), 2200);
  }, [base]);

  return [state, share];
}

// ── Переход к посту по якорю ──
//
// /posts#post-2026-11-06-1840: прокручиваем к записи и подсвечиваем её.
// Пока догружаются картинки выше, запись может уехать вниз, поэтому
// пару секунд держим её на месте — если человек сам не начал листать.

export function useHashTarget(deps = []) {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    let stop = () => {};

    function go() {
      stop();
      const hash = decodeURIComponent(location.hash.slice(1));
      if (!hash.startsWith('post-')) return;
      const el = document.getElementById(hash);
      if (!el) return;
      setTarget(hash.slice(5));

      const pin = () => el.scrollIntoView({ block: 'start' });
      pin();

      const ro = new ResizeObserver(pin);
      ro.observe(document.body);
      const release = () => stop();
      const events = ['wheel', 'touchstart', 'keydown', 'mousedown'];
      events.forEach(e => addEventListener(e, release, { passive: true, once: true }));
      const t = setTimeout(release, 2500);

      stop = () => {
        ro.disconnect();
        clearTimeout(t);
        events.forEach(e => removeEventListener(e, release));
        stop = () => {};
      };
    }

    go();
    addEventListener('hashchange', go);
    return () => {
      stop();
      removeEventListener('hashchange', go);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [target, setTarget];
}

// прыгнуть к записи на той же странице: адрес меняем без новой записи
// в истории и без перезагрузки
export function jumpTo(id, setTarget) {
  const el = document.getElementById(anchorId(id));
  if (!el) return;
  history.replaceState(null, '', '#' + anchorId(id));
  el.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  setTarget?.(id);
}
