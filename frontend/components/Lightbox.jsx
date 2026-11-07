'use client';

// Лайтбокс, общий для ленты (и архивной галереи).
// По умолчанию снимок вписан в экран; клик увеличивает его к той точке,
// по которой кликнули, повторный клик возвращает.

import { useEffect, useRef, useState } from 'react';

// Во сколько раз минимум увеличивать. Нужно для мелких снимков:
// у них натуральный размер меньше вписанного, и без этого порога
// клик просто ничего не менял бы.
const MIN_SCALE = 1.9;

// open — показан ли лайтбокс; src — снимок (пустой — показываем заглушку).
// Для альбома вместо src передаются items (все снимки), index и onIndex:
// тогда появляются стрелки, счётчик, листание клавишами ← → и свайпом.
export default function Lightbox({ open, src: single, caption, onClose, items, index = 0, onIndex }) {
  const many = Array.isArray(items) && items.length > 1;
  const src = Array.isArray(items) ? items[index] : single;
  const boxRef = useRef(null);
  const swipe = useRef(null);
  const imgRef = useRef(null);
  const [zoomWidth, setZoomWidth] = useState(null);
  const focus = useRef(null);

  // при открытии и закрытии сбрасываем масштаб, чтобы следующее
  // фото всегда начиналось вписанным в экран
  useEffect(() => {
    setZoomWidth(null);
    boxRef.current?.scrollTo(0, 0);
  }, [open, src]);

  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === 'Escape') onClose();
      if (!many) return;
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, many, index, items, onIndex]);

  const step = d => onIndex((index + d + items.length) % items.length);

  // свайп листает, только пока снимок не увеличен — увеличенный надо двигать
  function onTouchStart(e) {
    if (!many || zoomWidth != null) return;
    const t = e.touches[0];
    swipe.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e) {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x, dy = t.clientY - start.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
  }

  // после перераскладки подводим прокрутку так, чтобы та же точка
  // оказалась в центре окна
  useEffect(() => {
    if (zoomWidth == null || !focus.current) return;
    const box = boxRef.current, img = imgRef.current;
    const { relX, relY } = focus.current;
    const grown = img.getBoundingClientRect();
    const view = box.getBoundingClientRect();
    box.scrollLeft += (grown.left + relX * grown.width) - (view.left + view.width / 2);
    box.scrollTop += (grown.top + relY * grown.height) - (view.top + view.height / 2);
    focus.current = null;
  }, [zoomWidth]);

  function onImageClick(event) {
    // без этого клик дойдёт до фона и закроет лайтбокс
    event.stopPropagation();

    if (zoomWidth != null) {
      setZoomWidth(null);
      boxRef.current.scrollTo(0, 0);
      return;
    }

    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    if (!rect.width) return;

    // доля снимка, по которой кликнули, — её и надо удержать перед глазами
    focus.current = {
      relX: (event.clientX - rect.left) / rect.width,
      relY: (event.clientY - rect.top) / rect.height,
    };
    setZoomWidth(Math.round(Math.max(img.naturalWidth || 0, rect.width * MIN_SCALE)));
  }

  const className = [open && 'active', zoomWidth != null && 'is-zoomed'].filter(Boolean).join(' ');

  return (
    <div
      id="lightbox"
      ref={boxRef}
      className={className || undefined}
      onClick={e => { if (e.target === boxRef.current) onClose(); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <span className="close-btn" onClick={e => { e.stopPropagation(); onClose(); }}>&times;</span>
      {many && open && zoomWidth == null && (
        <>
          <button type="button" className="lb-nav is-prev" aria-label="Предыдущее фото" onClick={e => { e.stopPropagation(); step(-1); }}>‹</button>
          <button type="button" className="lb-nav is-next" aria-label="Следующее фото" onClick={e => { e.stopPropagation(); step(1); }}>›</button>
        </>
      )}
      <div className="lightbox-content">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            id="lightboxImg"
            src={src}
            alt="Увеличенное фото"
            style={zoomWidth != null ? { width: zoomWidth + 'px' } : undefined}
            onClick={onImageClick}
          />
        ) : (
          open && <div className="placeholder-text">Фото отсутствует</div>
        )}
        {(caption || many) && (
          <div className="lightbox-comment">
            {many && <span className="lb-count">{index + 1} / {items.length}</span>}
            {caption}
          </div>
        )}
      </div>
    </div>
  );
}
