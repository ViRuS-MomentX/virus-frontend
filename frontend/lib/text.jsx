// Мелкие помощники для текста, общие для всех страниц.

// Русская форма слова для числа: 1 проект, 2 проекта, 5 проектов.
export function plural(n, one, few, many) {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
}

// В данных пути к картинкам записаны как «images/…» — со времён, когда
// все страницы лежали в корне. Теперь у страниц свои адреса, поэтому
// приводим путь к абсолютному.
export function asset(src) {
  if (!src) return src;
  return /^(https?:)?\/\//.test(src) || src.startsWith('/') ? src : '/' + src;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Подсветка совпадений с поиском. Экранировать ничего не нужно —
// React сам не даст тексту стать разметкой.
export function Highlight({ text, query }) {
  if (!query) return text;
  const parts = String(text).split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
  return parts.map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}
