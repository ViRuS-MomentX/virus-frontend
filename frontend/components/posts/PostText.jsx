import { Highlight } from '../../lib/text';

// Ссылки в тексте записи. Берём только http и https — гадать по точкам
// в обычном тексте себе дороже. Хвостовая пунктуация в адрес не входит:
// после «зайди на https://site.ru.» точка остаётся точкой.
const LINK_RE = /https?:\/\/[^\s<]+[^\s<.,!?;:)\]}"']/g;

// в самой ссылке «https://» только мешает читать
const linkLabel = url => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

// Текст собираем кусками: подсветку поиска пускаем по видимому тексту,
// а в href она попасть не может — иначе <mark> разорвал бы адрес.
export default function PostText({ text, query, linkClass = 'ch-link' }) {
  const out = [];
  let last = 0;

  for (const m of text.matchAll(LINK_RE)) {
    out.push(<Highlight key={out.length} text={text.slice(last, m.index)} query={query} />);
    out.push(
      <a key={out.length} className={linkClass} href={m[0]} target="_blank" rel="noopener noreferrer">
        <Highlight text={linkLabel(m[0])} query={query} />
      </a>
    );
    last = m.index + m[0].length;
  }

  out.push(<Highlight key={out.length} text={text.slice(last)} query={query} />);
  return out;
}
