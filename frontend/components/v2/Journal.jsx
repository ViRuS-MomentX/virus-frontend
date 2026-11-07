'use client';

// Вторая версия ленты — «журнал».
// Слева липкая панель: поиск, вид (лента / плитка), фильтры, архив по
// месяцам с подсветкой текущего, случайная запись и горячие клавиши.
// Справа записи на линии времени или плиткой.

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Lightbox from '../Lightbox';
import Entry from './Entry';
import { sortedPosts, newestStamp, TAGS } from '../../lib/posts';
import { useNewSince, isNewPost, useShare, useHashTarget, jumpTo } from '../../lib/feed-hooks';
import { Highlight, plural } from '../../lib/text';

const BASE = '/v2';
const VIEW_KEY = 'posts_view';

const MONTHS = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const monthKey = p => p.date.slice(0, 7);
const monthName = (key, short) => {
  const [y, m] = key.split('-');
  return (short ? MONTHS_SHORT : MONTHS)[+m - 1] + ' ' + (short ? y.slice(2) : y);
};

const norm = str => (str || '').toLowerCase().trim();

// номер записи по порядку появления: первая — №1
const TOTAL = sortedPosts.length;
const NUM = Object.fromEntries(sortedPosts.map((p, i) => [p.id, TOTAL - i]));

const USED_TAGS = [...new Set(sortedPosts.map(p => p.category).filter(Boolean))];
const PHOTO_COUNT = sortedPosts.reduce((n, p) => n + p.images.length, 0);

const typing = el => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

export default function Journal() {
  const [rawQuery, setRawQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('list');
  const [month, setMonth] = useState(null);
  const [lightbox, setLightbox] = useState({ open: false, items: [], index: 0, caption: '' });
  const [pending, setPending] = useState(null);
  const searchRef = useRef(null);

  const since = useNewSince(newestStamp);
  const [shareState, share] = useShare(BASE);
  const [target, setTarget] = useHashTarget();

  // вид запоминаем; если пришли по ссылке на запись — всегда лента
  useEffect(() => {
    if (location.hash.startsWith('#post-')) return;
    try {
      const saved = localStorage.getItem(VIEW_KEY);
      if (saved === 'grid') setView('grid');
    } catch (e) {}
  }, []);

  const changeView = useCallback(v => {
    setView(v);
    try { localStorage.setItem(VIEW_KEY, v); } catch (e) {}
  }, []);

  const query = norm(rawQuery);
  const trimmed = rawQuery.trim();

  const freshCount = since ? sortedPosts.filter(p => isNewPost(p, since)).length : 0;

  const list = useMemo(() => sortedPosts.filter(p => {
    if (query && !norm(p.title).includes(query) && !norm(p.text).includes(query)) return false;
    if (filter === 'new') return isNewPost(p, since);
    if (filter === 'photo') return p.images.length > 0;
    if (filter === 'album') return p.images.length > 1;
    if (filter.startsWith('tag:')) return p.category === filter.slice(4);
    return true;
  }), [query, filter, since]);

  // месяцы с числом записей — для архива слева
  const months = useMemo(() => {
    const out = [];
    for (const p of list) {
      const k = monthKey(p);
      if (out.length && out[out.length - 1].key === k) out[out.length - 1].n++;
      else out.push({ key: k, n: 1 });
    }
    return out;
  }, [list]);

  // фильтр «новые» сам пропадает, если новых нет
  useEffect(() => {
    if (filter === 'new' && !freshCount) setFilter('all');
  }, [filter, freshCount]);

  // подсветка месяца, который сейчас на экране
  useEffect(() => {
    if (view !== 'list') return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = 120;
      let current = null;
      for (const el of document.querySelectorAll('.j-month')) {
        if (el.getBoundingClientRect().top <= line) current = el.dataset.month;
        else break;
      }
      setMonth(current ?? months[0]?.key ?? null);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    return () => { removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [view, months]);

  // переход к записи после переключения из плитки в ленту
  useEffect(() => {
    if (!pending || view !== 'list') return;
    jumpTo(pending, setTarget);
    setPending(null);
  }, [pending, view, setTarget]);

  const goTo = useCallback(id => {
    if (view === 'list') jumpTo(id, setTarget);
    else { changeView('list'); setPending(id); }
  }, [view, changeView, setTarget]);

  const random = useCallback(() => {
    if (!list.length) return;
    goTo(list[Math.floor(Math.random() * list.length)].id);
  }, [list, goTo]);

  const goMonth = key => {
    const el = document.getElementById('m-' + key);
    if (view !== 'list') { changeView('list'); requestAnimationFrame(() => document.getElementById('m-' + key)?.scrollIntoView()); return; }
    el?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  // клавиши: j / k — следующая и предыдущая запись, / — поиск, r — случайная
  useEffect(() => {
    function onKey(e) {
      if (lightbox.open || e.metaKey || e.ctrlKey || e.altKey) return;
      if (typing(document.activeElement)) {
        if (e.key === 'Escape') document.activeElement.blur();
        return;
      }
      if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); return; }
      if (e.key === 'r' || e.key === 'к') { random(); return; }
      if (view !== 'list') return;
      const down = e.key === 'j' || e.key === 'о';
      const up = e.key === 'k' || e.key === 'л';
      if (!down && !up) return;
      const line = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4.6;
      const entries = [...document.querySelectorAll('.j-entry')];
      const next = down
        ? entries.find(el => el.getBoundingClientRect().top > line + 4)
        : entries.reverse().find(el => el.getBoundingClientRect().top < line - 4);
      if (next) jumpTo(next.id.slice(5), setTarget);
    }
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [lightbox.open, view, random, setTarget]);

  const close = useCallback(() => setLightbox(l => ({ ...l, open: false })), []);
  const setIndex = useCallback(index => setLightbox(l => ({ ...l, index })), []);
  const open = useCallback((post, index) => {
    setLightbox({ open: true, items: post.images, index, caption: post.title });
  }, []);

  const FILTERS = [
    { key: 'all', label: 'все' },
    ...(freshCount ? [{ key: 'new', label: `новые · ${freshCount}` }] : []),
    { key: 'photo', label: 'с фото' },
    ...(sortedPosts.some(p => p.images.length > 1) ? [{ key: 'album', label: 'альбомы' }] : []),
    ...USED_TAGS.map(t => ({ key: 'tag:' + t, label: '#' + (TAGS[t] || t) })),
  ];

  let lastMonth = null;
  let seenDone = !freshCount || filter === 'new';

  return (
    <>
      <header className="j-hero">
        <div className="wrapper j-hero-in">
          <div className="j-hero-title">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="j-ava" src="/images/филя.webp" alt="" width={64} height={64} decoding="async" />
            <div>
              <div className="j-prompt">virus@feed:~$ tail -f заметки</div>
              <h1>Интерактив</h1>
              <p>Новости страницы, мысли и чэнджлоги — по порядку, с самого первого поста.</p>
            </div>
          </div>
          <dl className="j-stats">
            <div><dt>записей</dt><dd>{TOTAL}</dd></div>
            <div><dt>фото</dt><dd>{PHOTO_COUNT}</dd></div>
            <div className={freshCount ? 'is-hot' : undefined}><dt>новых</dt><dd>{freshCount}</dd></div>
          </dl>
        </div>
      </header>

      <div className="wrapper j-layout">
        <aside className="j-side">
          <div className="j-block">
            <label className="j-label" htmlFor="j-search">поиск</label>
            <input
              id="j-search"
              ref={searchRef}
              className="j-search"
              type="search"
              placeholder="слово из записи"
              autoComplete="off"
              value={rawQuery}
              onChange={e => setRawQuery(e.target.value)}
            />
          </div>

          <div className="j-block">
            <span className="j-label">вид</span>
            <div className="j-seg" role="group" aria-label="Вид ленты">
              <button type="button" className={view === 'list' ? 'on' : undefined} onClick={() => changeView('list')}>☰ лента</button>
              <button type="button" className={view === 'grid' ? 'on' : undefined} onClick={() => changeView('grid')}>▦ плитка</button>
            </div>
          </div>

          <div className="j-block">
            <span className="j-label">показать</span>
            <div className="j-chips">
              {FILTERS.map(f => (
                <button
                  type="button"
                  key={f.key}
                  className={'j-chip' + (filter === f.key ? ' on' : '') + (f.key === 'new' ? ' is-new' : '')}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {months.length > 0 && (
            <nav className="j-block j-archive" aria-label="Архив по месяцам">
              <span className="j-label">архив</span>
              <ul>
                {months.map(m => (
                  <li key={m.key}>
                    <button type="button" className={month === m.key && view === 'list' ? 'on' : undefined} onClick={() => goMonth(m.key)}>
                      <span className="j-m-full">{monthName(m.key)}</span>
                      <span className="j-m-short">{monthName(m.key, true)}</span>
                      <span className="j-m-n">{m.n}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className="j-block j-tools">
            <button type="button" className="j-random" onClick={random}>⚄ случайная запись</button>
            <p className="j-keys">
              <kbd>j</kbd> <kbd>k</kbd> листать · <kbd>/</kbd> поиск · <kbd>r</kbd> случайная
            </p>
            <Link className="j-old" href="/posts">← старый вид</Link>
          </div>
        </aside>

        <main className="j-main">
          <div className="j-status" aria-live="polite">
            {query || filter !== 'all'
              ? <>найдено {list.length} {plural(list.length, 'запись', 'записи', 'записей')}{' '}
                  <button type="button" className="j-reset" onClick={() => { setRawQuery(''); setFilter('all'); }}>сбросить</button></>
              : <>{TOTAL} {plural(TOTAL, 'запись', 'записи', 'записей')}, новые сверху</>}
          </div>

          {list.length === 0 && (
            <div className="j-empty">Пусто. Попробуй другое слово или сбрось фильтр.</div>
          )}

          {view === 'list' ? (
            <div className="j-list">
              {list.map(p => {
                const m = monthKey(p);
                const newMonth = m !== lastMonth;
                lastMonth = m;
                const isNew = isNewPost(p, since);
                let seen = null;
                if (!seenDone && !isNew) {
                  seenDone = true;
                  seen = <div className="j-seen"><span>↑ новое с прошлого визита · дальше ты уже читал</span></div>;
                }
                return (
                  <Fragment key={p.id}>
                    {seen}
                    {newMonth && (
                      <h2 className="j-month" id={'m-' + m} data-month={m}>
                        <span>{monthName(m)}</span>
                      </h2>
                    )}
                    <Entry
                      post={p}
                      num={NUM[p.id]}
                      base={BASE}
                      query={trimmed}
                      isNew={isNew}
                      isTarget={target === p.id}
                      shared={shareState.id === p.id ? shareState.result : null}
                      onShare={share}
                      onOpen={open}
                    />
                  </Fragment>
                );
              })}
            </div>
          ) : (
            <div className="j-grid">
              {list.map(p => (
                <button type="button" key={p.id} className={'j-tile' + (isNewPost(p, since) ? ' is-new' : '')} onClick={() => goTo(p.id)}>
                  {p.images[0]
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={p.images[0]} alt="" loading="lazy" decoding="async" />
                    : <span className="j-tile-text">{p.text}</span>}
                  {p.images.length > 1 && <span className="j-tile-count">▦ {p.images.length}</span>}
                  {isNewPost(p, since) && <span className="j-badge">новое</span>}
                  <span className="j-tile-cap">
                    <span className="j-tile-title"><Highlight text={p.title || 'без названия'} query={trimmed} /></span>
                    <span className="j-tile-date">№{NUM[p.id]} · {p.date.split('-').reverse().join('.')}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>

      <Lightbox
        open={lightbox.open}
        items={lightbox.items}
        index={lightbox.index}
        onIndex={setIndex}
        caption={lightbox.caption}
        onClose={close}
      />
    </>
  );
}
