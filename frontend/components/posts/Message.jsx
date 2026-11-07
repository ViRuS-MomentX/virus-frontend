// Одна запись ленты v1 — пузырь сообщения, как в канале.

import Album from './Album';
import PostText from './PostText';
import { Highlight } from '../../lib/text';
import { TAGS, anchorId, feedPath } from '../../lib/posts';

export default function Message({ post, query = '', isNew, isTarget, shared, onShare, onOpen, linkToFeed }) {
  const p = post;
  const cls = ['ch-msg', isNew && 'is-new', isTarget && 'is-target'].filter(Boolean).join(' ');

  return (
    <article className={cls} id={anchorId(p.id)}>
      {isNew && <span className="ch-new">новое</span>}
      {p.title && <h2 className="ch-title"><Highlight text={p.title} query={query} /></h2>}
      <Album images={p.images} alt={p.title || 'Фото к записи'} onOpen={i => onOpen(p, i)} />
      {p.text && <div className="ch-text"><PostText text={p.text} query={query} /></div>}
      <footer className="ch-meta">
        {p.category && <span className="ch-tag">#{TAGS[p.category] || p.category}</span>}
        <button type="button" className="ch-act" onClick={() => onShare(p)}>
          {shared === 'copied' ? 'ссылка скопирована' : shared === 'failed' ? 'не вышло' : 'поделиться'}
        </button>
        {/* время — постоянная ссылка на запись, как в телеграме */}
        <a className="ch-time" href={linkToFeed ? feedPath(p.id) : '#' + anchorId(p.id)} title="Ссылка на запись">
          {p.time}
        </a>
      </footer>
    </article>
  );
}
