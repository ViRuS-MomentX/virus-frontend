'use client';

// Лайтбокс, общий для галереи и ленты.
// По умолчанию снимок вписан в экран; клик увеличивает его к той точке,
// по которой кликнули, повторный клик возвращает.

import { useEffect, useRef, useState } from 'react';

// Во сколько раз минимум увеличивать. Нужно для мелких снимков:
// у них натуральный размер меньше вписанного, и без этого порога
// клик просто ничего не менял бы.
const MIN_SCALE = 1.9;

// open — показан ли лайтбокс; src — снимок (пустой — показываем заглушку).
export default function Lightbox({ open, src, caption, onClose }) {
  const boxRef = useRef(null);
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
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

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
    >
      <span className="close-btn" onClick={e => { e.stopPropagation(); onClose(); }}>&times;</span>
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
        {caption && <div className="lightbox-comment">{caption}</div>}
      </div>
    </div>
  );
}
