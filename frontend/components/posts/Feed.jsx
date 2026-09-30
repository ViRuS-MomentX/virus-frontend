'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Lightbox from '../Lightbox';
import { posts } from '../../data/posts-data';
import { Highlight, asset, plural } from '../../lib/text';

const TAGS = { personal: 'личное', game: 'игра', ai: 'нейронки' };

// день для разделителя: сегодня и вчера подписываем словами.
// today нет, пока страница не ожила в браузере, — тогда пишем просто дату,
// иначе в собранной заранее странице «сегодня» навсегда застряло бы в дне сборки
function dayLabel(date, today) {
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

// Ссылки в тексте записи. Берём только http и https — гадать по точкам
// в обычном тексте себе дороже. Хвостовая пунктуация в адрес не входит:
// после «зайди на https://site.ru.» точка остаётся точкой.
const LINK_RE = /https?:\/\/[^\s<]+[^\s<.,!?;:)\]}"']/g;

// в самой ссылке «https://» только мешает читать
const linkLabel = url => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

// Текст собираем кусками: подсветку поиска пускаем по видимому тексту,
// а в href она попасть не может — иначе <mark> разорвал бы адрес.
function WithLinks({ text, query }) {
  const out = [];
  let last = 0;

  for (const m of text.matchAll(LINK_RE)) {
    out.push(<Highlight key={out.length} text={text.slice(last, m.index)} query={query} />);
    out.push(
      <a key={out.length} className="ch-link" href={m[0]} target="_blank" rel="noopener noreferrer">
        <Highlight text={linkLabel(m[0])} query={query} />
      </a>
    );
    last = m.index + m[0].length;
  }

  out.push(<Highlight key={out.length} text={text.slice(last)} query={query} />);
  return out;
}

const sorted = [...posts].sort(
  (a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time)
);

export default function Feed() {
  const [rawQuery, setRawQuery] = useState('');
  const [today, setToday] = useState(null);
  const [lightbox, setLightbox] = useState({ open: false, src: null });

  useEffect(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    setToday(t);
  }, []);

  const query = norm(rawQuery);
  const trimmed = rawQuery.trim();

  const list = useMemo(() => (
    query
      ? sorted.filter(p => norm(p.title).includes(query) || norm(p.text).includes(query))
      : sorted
  ), [query]);

  const close = useCallback(() => setLightbox(l => ({ ...l, open: false })), []);

  let lastDay = null;

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

          {list.map((p, i) => {
            // разделитель дня, как в мессенджере
            const newDay = p.date !== lastDay;
            lastDay = p.date;
            const title = (p.title || '').trim();

            return (
              <Fragment key={p.date + p.time + i}>
                {newDay && <div className="ch-day"><span>{dayLabel(p.date, today)}</span></div>}
                <article className="ch-msg">
                  {title && <h2 className="ch-title"><Highlight text={title} query={trimmed} /></h2>}
                  {p.image && (
                    <div className="ch-photo post-image-wrap" onClick={() => setLightbox({ open: true, src: asset(p.image) })}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="post-image" src={asset(p.image)} loading="lazy" decoding="async" alt={title || 'Фото к записи'} />
                    </div>
                  )}
                  {p.text && <div className="ch-text"><WithLinks text={p.text} query={trimmed} /></div>}
                  <footer className="ch-meta">
                    {p.category && <span className="ch-tag">#{TAGS[p.category] || p.category}</span>}
                    <time className="ch-time">{p.time}</time>
                  </footer>
                </article>
              </Fragment>
            );
          })}
        </div>
      </main>

      <Lightbox open={lightbox.open} src={lightbox.src} onClose={close} />
    </>
  );
}
