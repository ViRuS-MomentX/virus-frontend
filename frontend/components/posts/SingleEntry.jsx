'use client';

// Отдельная страница записи: на неё ведут плитка и «поделиться».
//
// Как листать:
//   • большие стрелки по бокам экрана (на компьютере);
//   • клавиши ← и → , Esc — обратно к ленте;
//   • свайп влево / вправо (на телефоне);
//   • карточки соседних записей внизу (на телефоне — панель, прилипшая к низу).
// Клик по пустому фону вокруг записи возвращает в ленту — к этой же плитке.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Lightbox from '../Lightbox';
import Entry from './Entry';
import { findPost, feedPath, postPath, sortedPosts, ruDate } from '../../lib/posts';
import { useShare } from '../../lib/feed-hooks';

const TOTAL = sortedPosts.length;

// по чему клик НЕ считается кликом по фону
const SOLID = '.j-card, .j-rail, .j-pager, .j-arrow, .j-single-nav, .topbar, .ft, #lightbox, a, button, input';

function Neighbour({ post, dir }) {
  if (!post) return <span className="j-nb is-empty" />;
  const num = TOTAL - sortedPosts.indexOf(post);
  return (
    <Link className={`j-nb is-${dir}`} href={postPath(post.id)}>
      {post.images[0]
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={post.images[0]} alt="" loading="lazy" decoding="async" />
        : <span className="j-nb-blank">№{num}</span>}
      <span className="j-nb-text">
        <span className="j-nb-dir">{dir === 'prev' ? '← предыдущий' : 'следующий →'}</span>
        <span className="j-nb-title">{post.title || 'без названия'}</span>
        <span className="j-nb-meta">№{num} · {ruDate(post.date)}</span>
      </span>
    </Link>
  );
}

export default function SingleEntry({ id }) {
  const router = useRouter();
  const post = findPost(id);
  const i = sortedPosts.findIndex(p => p.id === id);
  // лента идёт от новых к старым: «предыдущий» — более старый, с номером меньше
  const prev = sortedPosts[i + 1];
  const next = sortedPosts[i - 1];

  const [shareState, share] = useShare();
  const [lb, setLb] = useState({ open: false, index: 0 });
  const close = useCallback(() => setLb(l => ({ ...l, open: false })), []);
  const setIndex = useCallback(index => setLb(l => ({ ...l, index })), []);

  // свежие значения для обработчиков, навешанных один раз
  const state = useRef({});
  state.current = { prev, next, lbOpen: lb.open, back: feedPath(post.id) };

  useEffect(() => {
    const go = p => p && router.push(postPath(p.id));

    function onKey(e) {
      const s = state.current;
      // клавишу уже забрал лайтбокс (в нём стрелки листают альбом, Esc закрывает фото)
      if (e.defaultPrevented || s.lbOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = document.activeElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowLeft') go(s.prev);
      else if (e.key === 'ArrowRight') go(s.next);
      else if (e.key === 'Escape') router.push(s.back);
    }

    function onClick(e) {
      if (e.button !== 0 || state.current.lbOpen) return;
      if (e.target.closest(SOLID)) return;
      if (getSelection()?.toString()) return;          // выделяли текст — не уводим
      router.push(state.current.back);
    }

    let touch = null;
    function onTouchStart(e) {
      if (state.current.lbOpen || e.touches.length !== 1) { touch = null; return; }
      const t = e.touches[0];
      touch = { x: t.clientX, y: t.clientY, at: Date.now() };
    }
    function onTouchEnd(e) {
      const start = touch;
      touch = null;
      if (!start || state.current.lbOpen) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x, dy = t.clientY - start.y;
      if (Date.now() - start.at > 800) return;
      if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
      go(dx > 0 ? state.current.prev : state.current.next);
    }

    addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    addEventListener('touchstart', onTouchStart, { passive: true });
    addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchend', onTouchEnd);
    };
  }, [router]);

  return (
    <main className="wrapper j-single">
      <div className="j-single-nav">
        <Link href={feedPath(post.id)}>← все посты</Link>
        <span className="j-hint">← → листать · клик по фону — к ленте</span>
      </div>

      <div className="j-list">
        <Entry
          post={post}
          num={TOTAL - i}
          shared={shareState.id === post.id ? shareState.result : null}
          onShare={share}
          onOpen={(p, index) => setLb({ open: true, index })}
          single
        />
      </div>

      <nav className="j-pager" aria-label="Соседние записи">
        <Neighbour post={prev} dir="prev" />
        <Neighbour post={next} dir="next" />
      </nav>

      {/* большие стрелки по краям экрана */}
      {prev && (
        <Link className="j-arrow is-prev" href={postPath(prev.id)} aria-label={`Предыдущий пост: ${prev.title || 'без названия'}`}>
          <span aria-hidden="true">‹</span>
        </Link>
      )}
      {next && (
        <Link className="j-arrow is-next" href={postPath(next.id)} aria-label={`Следующий пост: ${next.title || 'без названия'}`}>
          <span aria-hidden="true">›</span>
        </Link>
      )}

      <Lightbox open={lb.open} items={post.images} index={lb.index} onIndex={setIndex} caption={post.title} onClose={close} />
    </main>
  );
}
