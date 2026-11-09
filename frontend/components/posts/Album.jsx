// Фото записи. Одно — как раньше, во всю ширину. Несколько — плиткой,
// как альбом в телеграме: 2 рядом, 3 — одно сверху и два под ним,
// 4 и больше — квадрат 2×2, на последней плитке «+N».

const SHOWN = 4;

export default function Album({ images, alt, onOpen, className = 'j-media' }) {
  if (!images.length) return null;

  if (images.length === 1) {
    return (
      <div className={`${className} post-image-wrap`} onClick={() => onOpen(0)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="post-image" src={images[0]} loading="lazy" decoding="async" alt={alt} />
      </div>
    );
  }

  const shown = images.slice(0, SHOWN);
  const rest = images.length - shown.length;

  return (
    <div className={`${className} album is-n${shown.length}`}>
      {shown.map((src, i) => (
        <button
          type="button"
          key={src + i}
          className="album-cell"
          onClick={() => onOpen(i)}
          aria-label={`Открыть фото ${i + 1} из ${images.length}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} loading="lazy" decoding="async" alt="" />
          {rest > 0 && i === shown.length - 1 && <span className="album-more">+{rest}</span>}
        </button>
      ))}
    </div>
  );
}
