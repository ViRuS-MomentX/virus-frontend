// Посты в одном виде для всех страниц: лента, страница поста,
// главная и /posts.json.
//
// В data/posts-data.js у записи может быть:
//   image:  "images/posts/budgie-sherry.jpg"      — одно фото
//   images: ["images/posts/a.jpg", "images/posts/b.jpg", …]   — альбом
//
// Фото постов лежат в public/images/posts/ и называются по содержанию,
// латиницей через дефис: claude-session-limit-reached.jpg, а не 123.jpg.
//   id:     "свой-адрес"                          — необязательно
//
// Если id не задан, он собирается из даты и времени: 2026-11-06-1840.
// У записей с одинаковыми датой и временем добавляется -2, -3 — по порядку
// в файле, поэтому новые записи лучше дописывать в конец, а не в середину.

import { posts as raw } from '../data/posts-data';
import { asset } from './text';

function build() {
  const taken = {};
  return raw.map((p, order) => {
    const base = p.id || `${p.date}-${(p.time || '').replace(':', '')}`;
    taken[base] = (taken[base] || 0) + 1;
    const id = taken[base] > 1 ? `${base}-${taken[base]}` : base;

    const src = Array.isArray(p.images) && p.images.length ? p.images : [p.image];
    const images = src.filter(Boolean).map(asset);

    return {
      ...p,
      id,
      title: (p.title || '').trim(),
      text: p.text || '',
      images,
      stamp: `${p.date}T${p.time}`,
      order,
    };
  });
}

export const allPosts = build();

// новые сверху; при одинаковом времени — как записаны в файле
export const sortedPosts = [...allPosts].sort(
  (a, b) => b.stamp.localeCompare(a.stamp) || a.order - b.order
);

export const newestStamp = sortedPosts[0]?.stamp ?? '';

export const findPost = id => allPosts.find(p => p.id === id);

export const TAGS = { personal: 'личное', game: 'игра', ai: 'нейронки' };

// адрес отдельной страницы поста и якорь поста внутри ленты
export const postPath = id => `/posts/${id}`;
export const anchorId = id => `post-${id}`;
export const feedPath = id => `/posts#${anchorId(id)}`;

export const ruDate = d => d.split('-').reverse().join('.');

// для превью ссылки в телеграме: первые слова текста без адресов
export function summary(post, max = 160) {
  const t = post.text.replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
}
