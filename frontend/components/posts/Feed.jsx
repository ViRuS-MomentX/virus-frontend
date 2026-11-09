'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Lightbox from '../Lightbox';
import Message from './Message';
import { sortedPosts, newestStamp } from '../../lib/posts';
import { useNewSince, isNewPost, useShare, useHashTarget } from '../../lib/feed-hooks';
import { plural } from '../../lib/text';

// день для разделителя: сегодня и вчера подписываем словами.
// today нет, пока страница не ожила в браузере, — тогда пишем просто дату,
// иначе в собранной заранее странице «сегодня» навсегда застряло бы в дне сборки
export function dayLabel(date, today) {
  const d = new Date(date + 'T00:00');
  const opts = { day: 'numeric', month: 'long' };
  if (today) {
    const diff = Math.round((today - d) / 86400000);
    if (diff === 0) return 'сегодня';
    if (diff === 1) return 'вчера';
    if (d.getFullYear() !== today.getFullYear()) opts.year = 'numeric';
  }
  return d.toLocaleDateString('ru-RU', opts);
}

const norm = str => (str || '').toLowerCase().trim();

export default function Feed() {
  const [rawQuery, setRawQuery] = useState('');
  const [today, setToday] = useState(null);
  const [lightbox, setLightbox] = useState({ open: false, items: [], index: 0, caption: '' });

  const since = useNewSince(newestStamp);
  const [shareState, share] = useShare();
  const [target] = useHashTarget();

  useEffect(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    setToday(t);
  }, []);

  const query = norm(rawQuery);
  const trimmed = rawQuery.trim();

  const list = useMemo(() => (
    query
      ? sortedPosts.filter(p => norm(p.title).includes(query) || norm(p.text).includes(query))
      : sortedPosts
  ), [query]);

  const fresh = since ? sortedPosts.filter(p => isNewPost(p, since)).length : 0;

  const close = useCallback(() => setLightbox(l => ({ ...l, open: false })), []);
  const setIndex = useCallback(index => setLightbox(l => ({ ...l, index })), []);
  const open = useCallback((post, index) => {
    setLightbox({ open: true, items: post.images, index, caption: post.title });
  }, []);

  let lastDay = null;
  // черта «дальше уже видел» — после последней новой записи
  let markerDone = !fresh || Boolean(query);

  return (
    <>
      <div className="page-head">
        <div className="wrapper page-head-top">
          <div className="page-title channel-title">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="ch-ava" src="/images/филя.webp" alt="" width={56} height={56} decoding="async" />
            <div>
              <h1>Вирус</h1>
              <p>Лента заметок: новости страницы, мысли и чэнджлоги.</p>
            </div>
          </div>
          <div className="head-count">
            {list.length} {plural(list.length, 'запись', 'записи', 'записей')}
            {fresh > 0 && <span className="head-new"> · {fresh} {plural(fresh, 'новая', 'новые', 'новых')}</span>}
          </div>
        </div>

        <div className="wrapper">
          <div className="controls">
            <div className="row">
              <div className="row-key">поиск</div>
              <div className="row-val">
                <div className="search-row">
                  <input
                    id="searchInput"
                    type="search"
                    placeholder="искать по записям"
                    autoComplete="off"
                    aria-label="Поиск по записям"
                    value={rawQuery}
                    onChange={e => setRawQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="wrapper channel">
        <div className="ch-feed">
          {list.length === 0 && (
            <div className="ch-empty">По запросу ничего нет. Попробуй другое слово или очисти поиск.</div>
          )}

          {list.map(p => {
            // разделитель дня, как в мессенджере
            const newDay = p.date !== lastDay;
            lastDay = p.date;
            const isNew = isNewPost(p, since);

            let marker = null;
            if (!markerDone && !isNew) {
              markerDone = true;
              marker = <div className="ch-seen"><span>новое с прошлого визита ↑</span></div>;
            }

            return (
              <Fragment key={p.id}>
                {marker}
                {newDay && <div className="ch-day"><span>{dayLabel(p.date, today)}</span></div>}
                <Message
                  post={p}
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
      </main>

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
