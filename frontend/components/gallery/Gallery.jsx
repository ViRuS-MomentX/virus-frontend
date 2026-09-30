'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import Lightbox from '../Lightbox';
import { galleryData } from '../../data/gallery-data';
import { Highlight, asset } from '../../lib/text';

const gameLabels = {
  minecraft: 'Minecraft',
  roblox: 'Roblox',
  phasmo: 'Phasmophobia',
  rivals: 'Marvel Rivals',
  dbd: 'Dead by Daylight',
  irl: 'IRL',
};

const FILTERS = [
  { game: '', label: 'Все игры', icon: '/images/all.webp' },
  { game: 'minecraft', label: 'Minecraft', icon: '/images/minecraft.webp' },
  { game: 'roblox', label: 'Roblox', icon: '/images/roblox.webp' },
  { game: 'phasmo', label: 'Phasmophobia', icon: '/images/phasmo.ico' },
  { game: 'rivals', label: 'Marvel Rivals', icon: '/images/marvel.webp' },
  { game: 'dbd', label: 'Dead by Daylight', icon: '/images/dbd.jpg' },
  { game: 'irl', label: 'Из реальной жизни', icon: null },
];

// в сетку идёт превью 480px, оригинал открывается только в лайтбоксе
const thumbOf = name =>
  '/images/thumbs/' + name.replace(/^images\//, '').replace(/\.[^.]+$/, '') + '.webp';

function Stats() {
  const counts = {};
  galleryData.forEach(item => { counts[item.game] = (counts[item.game] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top = sorted.length ? gameLabels[sorted[0][0]] : '-';

  return (
    <div className="gallery-stats">
      <div className="stat-chip">
        <span className="stat-num">{galleryData.length}</span>
        <span className="stat-label">фото</span>
      </div>
      <div className="stat-chip">
        <span className="stat-num">{Object.keys(counts).length}</span>
        <span className="stat-label">категорий</span>
      </div>
      <div className="stat-chip">
        <span className="stat-num">{top}</span>
        <span className="stat-label">чаще всего</span>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [items, setItems] = useState(galleryData);
  const [activeGame, setActiveGame] = useState('');
  const [rawQuery, setRawQuery] = useState('');
  const [shuffling, setShuffling] = useState(false);
  // номер перемешивания: меняется — сетка собирается заново и карточки
  // снова появляются лесенкой
  const [round, setRound] = useState(0);
  const [opened, setOpened] = useState(null);
  const shuffleBusy = useRef(false);

  const query = rawQuery.toLowerCase().trim();
  const visible = useMemo(() => items.filter(item => {
    if (activeGame && item.game !== activeGame) return false;
    if (query && !item.comment.toLowerCase().includes(query)) return false;
    return true;
  }), [items, activeGame, query]);

  function toggleGame(game) {
    setActiveGame(prev => (prev === game ? '' : game));
  }

  function shuffle() {
    if (shuffleBusy.current) return;
    shuffleBusy.current = true;

    // сначала карточки разлетаются, и только потом меняется порядок,
    // иначе перестановка происходит мгновенно и её не видно
    setShuffling(true);

    setTimeout(() => {
      setItems(prev => [...prev].sort(() => Math.random() - 0.5));
      setRound(r => r + 1);
      setShuffling(false);
      shuffleBusy.current = false;
    }, 260);
  }

  const close = useCallback(() => setOpened(null), []);

  return (
    <>
      <div className="page-head">
        <div className="wrapper page-head-top">
          <div className="page-title">
            <h1>Галерея</h1>
            <p>Скриншоты с серверов и из жизни. Приглядись к каждому — в подписи обычно есть послание.</p>
          </div>
          <div className="head-count">Показано: {visible.length} / {galleryData.length}</div>
        </div>

        <div className="wrapper">
          <div className="controls">

            <div className="row">
              <div className="row-key">игра</div>
              <div className="row-val">
                <div className="game-filters">
                  {FILTERS.map(f => (
                    <button
                      key={f.game || 'all'}
                      className={'game-filter' + (f.icon ? '' : ' is-irl') + (activeGame === f.game ? ' active' : '')}
                      data-label={f.label}
                      aria-label={f.label}
                      onClick={() => toggleGame(f.game)}
                    >
                      {f.icon
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={f.icon} alt="" width={22} height={22} loading="eager" />
                        : <span aria-hidden="true">IRL</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="row-key">поиск</div>
              <div className="row-val">
                <div className="search-row">
                  <input
                    type="text"
                    id="searchInput"
                    placeholder="искать по подписи"
                    autoComplete="off"
                    value={rawQuery}
                    onChange={e => setRawQuery(e.target.value)}
                  />
                  <button className="shuffle-button" onClick={shuffle} disabled={shuffling}>перемешать</button>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="row-key">сводка</div>
              <div className="row-val">
                <Stats />
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="wrapper">
        <div
          key={`${round}|${activeGame}|${query}`}
          className={'gallery-grid' + (shuffling ? ' is-shuffling' : '')}
        >
          {visible.map((item, index) => (
            <div
              key={item.name}
              className="gallery-item"
              // без этого фото нельзя открыть с клавиатуры: div сам по себе не фокусируется
              tabIndex={0}
              role="button"
              aria-label={'Открыть фото: ' + item.comment}
              // индекс нужен для ступенчатого появления после перемешивания;
              // выше 28 задержка не растёт — дальше карточки всё равно за экраном
              style={{ '--i': Math.min(index, 28) }}
              onClick={() => setOpened(item)}
              onKeyDown={e => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                e.preventDefault();          // иначе пробел прокрутит страницу
                setOpened(item);
              }}
            >
              <div className="gallery-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbOf(item.name)}
                  width={480}
                  height={360}
                  loading="lazy"
                  decoding="async"
                  alt={gameLabels[item.game] + ': ' + item.comment}
                />
              </div>
              <div className="desc">
                <span className="card-tag">{gameLabels[item.game]}</span>
                <span><Highlight text={item.comment} query={rawQuery.trim()} /></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        open={!!opened}
        src={opened ? asset(opened.name) : null}
        caption={opened?.comment}
        onClose={close}
      />
    </>
  );
}
