// Лента постов отдельным файлом: /posts.json.
//
// На ленту подписан дискорд-бот — он читает этот файл и объявляет новые
// записи в канале. Отдаём те же данные, что рисует сайт, так что разойтись
// они не могут.

import { posts } from '../../data/posts-data';

export const dynamic = 'force-static';

export function GET() {
  return Response.json(posts);
}
