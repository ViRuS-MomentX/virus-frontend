// Запись на своей странице: слева «рельс» с датой и временем,
// справа карточка с фото, текстом и кнопкой «поделиться».

import Link from 'next/link';
import Album from '../posts/Album';
import PostText from '../posts/PostText';
import { Highlight } from '../../lib/text';
import { TAGS, anchorId, postPath, feedPath } from '../../lib/posts';

const short = d => d.slice(8, 10) + '.' + d.slice(5, 7);

export default function Entry({ post, num, query = '', isNew, isTarget, shared, onShare, onOpen, single }) {
  const p = post;
  const cls = ['j-entry', isNew && 'is-new', isTarget && 'is-target'].filter(Boolean).join(' ');

  return (
    <article className={cls} id={anchorId(p.id)}>
      <div className="j-rail">
        <a className="j-date" href={single ? feedPath(p.id) : '#' + anchorId(p.id)} title="Ссылка на запись">
          {short(p.date)}
        </a>
        <span className="j-time">{p.time}</span>
        <span className="j-node" aria-hidden="true" />
      </div>

      <div className="j-card">
        <header className="j-head">
          <span className="j-num">№{num}</span>
          {p.category && <span className="j-tag">#{TAGS[p.category] || p.category}</span>}
          {p.images.length > 1 && <span className="j-tag">альбом · {p.images.length}</span>}
          {isNew && <span className="j-badge">новое</span>}
        </header>

        {p.title && <h2 className="j-title"><Highlight text={p.title} query={query} /></h2>}

        <Album className="j-media" images={p.images} alt={p.title || 'Фото к записи'} onOpen={i => onOpen(p, i)} />

        {p.text && <div className="j-text"><PostText text={p.text} query={query} linkClass="j-link" /></div>}

        <footer className="j-actions">
          <button type="button" className="j-btn" onClick={() => onShare(p)}>
            {shared === 'copied' ? '✓ скопировано' : shared === 'failed' ? 'не вышло' : '↗ поделиться'}
          </button>
          {!single && <Link className="j-btn" href={postPath(p.id)}>открыть</Link>}
        </footer>
      </div>
    </article>
  );
}
