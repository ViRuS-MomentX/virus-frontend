// Метаданные отдельной страницы поста: по ним телеграм и дискорд
// рисуют превью ссылки — заголовок, начало текста и первое фото.

import { allPosts, findPost, ruDate, summary } from './posts';

export const postParams = () => allPosts.map(p => ({ id: p.id }));

export function postMetadata(id, { noindex = false } = {}) {
  const p = findPost(id);
  if (!p) return {};
  const title = (p.title || `Запись от ${ruDate(p.date)}`) + ' — Вирус';
  const description = summary(p) || `Запись в ленте Вируса от ${ruDate(p.date)}`;
  const images = p.images.length ? [{ url: encodeURI(p.images[0]) }] : undefined;
  return {
    title,
    description,
    openGraph: { title, description, type: 'article', images, siteName: 'Вирус' },
    twitter: { card: images ? 'summary_large_image' : 'summary', title, description },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
