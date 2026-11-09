'use client';

// Вкладка «посты»: все записи плиткой, сверху поиск.
// Плитка ведёт на отдельную страницу записи. Новые с прошлого визита
// помечены, к записи можно прийти по ссылке /posts#post-<id>.

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { sortedPosts, newestStamp, anchorId, postPath } from '../../lib/posts';
import { useNewSince, isNewPost, useHashTarget } from '../../lib/feed-hooks';
import { Highlight, plural } from '../../lib/text';

const norm = str => (str || '').toLowerCase().trim();

// номер записи по порядку появления: первая — №1
const TOTAL = sortedPosts.length;
const NUM = Object.fromEntries(sortedPosts.map((p, i) => [p.id, TOTAL - i]));
const PHOTO_COUNT = sortedPosts.reduce((n, p) => n + p.images.length, 0);

export default function Journal() {
  const [rawQuery, setRawQuery] = useState('');
  const since = useNewSince(newestStamp);
  const [target] = useHashTarget();

  const query = norm(rawQuery);
  const trimmed = rawQuery.trim();

  const freshCount = since ? sortedPosts.filter(p => isNewPost(p, since)).length : 0;

  const list = useMemo(() => (
    query
      ? sortedPosts.filter(p => norm(p.title).includes(query) || norm(p.text).includes(query))
      : sortedPosts
  ), [query]);

  return (
    <>
      <header className="j-hero">
        <div className="wrapper j-hero-in">
          <div className="j-hero-title">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="j-ava" src="/images/филя.webp" alt="" width={64} height={64} decoding="async" />
            <div>
              <div className="j-prompt">virus@feed:~$ tail -f заметки</div>
              <h1>Посты</h1>
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

      <main className="wrapper j-main">
        <div className="j-toolbar">
          <input
            className="j-search"
            type="search"
            placeholder="поиск по записям"
            aria-label="Поиск по записям"
            autoComplete="off"
            value={rawQuery}
            onChange={e => setRawQuery(e.target.value)}
          />
          <span className="j-status" aria-live="polite">
            {query
              ? <>найдено {list.length} {plural(list.length, 'запись', 'записи', 'записей')}</>
              : <>новые сверху</>}
          </span>
        </div>

        {list.length === 0 && (
          <div className="j-empty">Ничего не нашлось. Попробуй другое слово.</div>
        )}

        <div className="j-grid">
          {list.map(p => {
            const isNew = isNewPost(p, since);
            const cls = ['j-tile', isNew && 'is-new', target === p.id && 'is-target'].filter(Boolean).join(' ');
            return (
              <Link key={p.id} id={anchorId(p.id)} className={cls} href={postPath(p.id)}>
                {p.images[0]
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.images[0]} alt="" loading="lazy" decoding="async" />
                  : <span className="j-tile-text"><Highlight text={p.text} query={trimmed} /></span>}
                {p.images.length > 1 && <span className="j-tile-count">▦ {p.images.length}</span>}
                {isNew && <span className="j-badge">новое</span>}
                <span className="j-tile-cap">
                  <span className="j-tile-title"><Highlight text={p.title || 'без названия'} query={trimmed} /></span>
                  <span className="j-tile-date">№{NUM[p.id]} · {p.date.split('-').reverse().join('.')}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
