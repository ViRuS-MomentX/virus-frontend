// Лента постов отдельным файлом: /posts.json.
//
// На ленту подписан дискорд-бот — он читает этот файл и объявляет новые
// записи в канале. Отдаём те же данные, что рисует сайт, так что разойтись
// они не могут. Поля исходных записей не трогаем, только добавляем:
//   id     — адрес поста, страница /posts/<id>
//   images — все фото записи (у альбома их несколько)
//   image  — у альбома тут первое фото, чтобы бот, знающий только image, не терял картинку

import { posts } from '../../data/posts-data';
import { allPosts } from '../../lib/posts';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(posts.map((p, i) => {
    const images = Array.isArray(p.images) && p.images.length ? p.images : (p.image ? [p.image] : []);
    return { ...p, id: allPosts[i].id, image: p.image || images[0] || '', images };
  }));
}
