'use client';

// Отдельная страница записи — на неё ведёт «поделиться».
// Сама запись та же, что в ленте, плюс дорога обратно в ленту к ней же.

import { useCallback, useState } from 'react';
import Link from 'next/link';
import Lightbox from '../Lightbox';
import Message from './Message';
import { findPost, feedPath } from '../../lib/posts';
import { useShare } from '../../lib/feed-hooks';
import { dayLabel } from './Feed';

export default function SinglePost({ id }) {
  const post = findPost(id);
  const [shareState, share] = useShare();
  const [lb, setLb] = useState({ open: false, index: 0 });
  const close = useCallback(() => setLb(l => ({ ...l, open: false })), []);
  const setIndex = useCallback(index => setLb(l => ({ ...l, index })), []);

  return (
    <main className="wrapper channel single-post">
      <div className="single-nav">
        <Link href={feedPath(post.id)}>← к записи в ленте</Link>
        <Link href="/posts">вся лента</Link>
      </div>
      <div className="ch-feed">
        <div className="ch-day"><span>{dayLabel(post.date, null)}</span></div>
        <Message
          post={post}
          shared={shareState.id === post.id ? shareState.result : null}
          onShare={share}
          onOpen={(p, index) => setLb({ open: true, index })}
          linkToFeed
        />
      </div>
      <Lightbox open={lb.open} items={post.images} index={lb.index} onIndex={setIndex} caption={post.title} onClose={close} />
    </main>
  );
}
