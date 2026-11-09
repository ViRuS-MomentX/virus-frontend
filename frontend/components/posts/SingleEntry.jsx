'use client';

// Отдельная страница записи: на неё ведут плитка и «поделиться».

import { useCallback, useState } from 'react';
import Link from 'next/link';
import Lightbox from '../Lightbox';
import Entry from './Entry';
import { findPost, feedPath, postPath, sortedPosts } from '../../lib/posts';
import { useShare } from '../../lib/feed-hooks';

export default function SingleEntry({ id }) {
  const post = findPost(id);
  const i = sortedPosts.findIndex(p => p.id === id);
  const newer = sortedPosts[i - 1];
  const older = sortedPosts[i + 1];
  const [shareState, share] = useShare();
  const [lb, setLb] = useState({ open: false, index: 0 });
  const close = useCallback(() => setLb(l => ({ ...l, open: false })), []);
  const setIndex = useCallback(index => setLb(l => ({ ...l, index })), []);

  return (
    <main className="wrapper j-single">
      <div className="j-single-nav">
        <Link href={feedPath(post.id)}>← все посты</Link>
      </div>
      <div className="j-list">
        <Entry
          post={post}
          num={sortedPosts.length - i}
          shared={shareState.id === post.id ? shareState.result : null}
          onShare={share}
          onOpen={(p, index) => setLb({ open: true, index })}
          single
        />
      </div>
      <nav className="j-pager">
        {older ? <Link href={postPath(older.id)}>← {older.title || 'предыдущая'}</Link> : <span />}
        {newer ? <Link href={postPath(newer.id)}>{newer.title || 'следующая'} →</Link> : <span />}
      </nav>
      <Lightbox open={lb.open} items={post.images} index={lb.index} onIndex={setIndex} caption={post.title} onClose={close} />
    </main>
  );
}
