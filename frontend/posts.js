import { posts } from "./posts-data.js";

// 1. ВАШИ ПОСТЫ (БАЗА ДАННЫХ)

// 2. ЛОГИКА ОТОБРАЖЕНИЯ И ПОИСКА
const searchInput = document.getElementById("searchInput");
const feed = document.getElementById("postsFeed");
const count = document.getElementById("postsCount");

// день для разделителя: сегодня и вчера подписываем словами
function dayLabel(date){
  const d = new Date(date + "T00:00");
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.round((today - d) / 86400000);
  if (diff === 0) return "сегодня";
  if (diff === 1) return "вчера";
  const opts = { day: "numeric", month: "long" };
  if (d.getFullYear() !== today.getFullYear()) opts.year = "numeric";
  return d.toLocaleDateString("ru-RU", opts);
}

function plural(n, one, few, many){
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return many;
  if (b > 1 && b < 5) return few;
  if (b === 1) return one;
  return many;
}

function norm(str){
  return (str || "").toLowerCase().trim();
}

function escapeHtml(str){
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// для значений атрибутов кавычки тоже нельзя оставлять как есть
function escapeAttr(str){
  return escapeHtml(str).replace(/"/g, "&quot;");
}

function escapeRegExp(str){
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text, query){
  const safe = escapeHtml(text);
  if(!query) return safe;
  const re = new RegExp(escapeRegExp(query), "gi");
  return safe.replace(re, (match) => `<mark>${match}</mark>`);
}

// Ссылки в тексте записи. Берём только http и https — гадать по точкам
// в обычном тексте себе дороже. Хвостовая пунктуация в адрес не входит:
// после «зайди на https://site.ru.» точка остаётся точкой.
const LINK_RE = /https?:\/\/[^\s<]+[^\s<.,!?;:)\]}"']/g;

// в самой ссылке «https://» только мешает читать
function linkLabel(url){
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// Текст собираем кусками: подсветку поиска пускаем по видимому тексту,
// а в href она попасть не может — иначе <mark> разорвал бы адрес.
function withLinks(text, query){
  let out = "";
  let last = 0;

  for (const m of text.matchAll(LINK_RE)) {
    out += highlight(text.slice(last, m.index), query);
    out += `<a class="ch-link" href="${escapeAttr(m[0])}" target="_blank" rel="noopener noreferrer">` +
      `${highlight(linkLabel(m[0]), query)}</a>`;
    last = m.index + m[0].length;
  }

  return out + highlight(text.slice(last), query);
}

function render(){
  if (!feed || !count) return;
  const rawQuery = searchInput ? searchInput.value.trim() : "";
  const query = norm(rawQuery);
  let list = [...posts];

  list.sort((a,b)=> new Date(b.date+"T"+b.time) - new Date(a.date+"T"+a.time));

  if(query){
    list = list.filter(p =>
      norm(p.title).includes(query) ||
      norm(p.text).includes(query)
    );
  }

  count.textContent = `${list.length} ${plural(list.length, "запись", "записи", "записей")}`;

  if(list.length === 0){
    feed.innerHTML = `<div class="ch-empty">По запросу ничего нет. Попробуй другое слово или очисти поиск.</div>`;
    return;
  }

  const TAGS = { personal: "личное", game: "игра", ai: "нейронки" };

  let html = "";
  let lastDay = null;

  for (const p of list) {
    // разделитель дня, как в мессенджере
    if (p.date !== lastDay) {
      lastDay = p.date;
      html += `<div class="ch-day"><span>${escapeHtml(dayLabel(p.date))}</span></div>`;
    }

    const tag = p.category
      ? `<span class="ch-tag">#${escapeHtml(TAGS[p.category] || p.category)}</span>` : "";
    const title = (p.title || "").trim();

    html += `
      <article class="ch-msg">
        ${title ? `<h2 class="ch-title">${highlight(title, rawQuery)}</h2>` : ""}
        ${p.image ? `<div class="ch-photo post-image-wrap"><img class="post-image" src="${escapeAttr(p.image)}" loading="lazy" decoding="async" alt="${escapeAttr(title || "Фото к записи")}"></div>` : ""}
        ${p.text ? `<div class="ch-text">${withLinks(p.text, rawQuery)}</div>` : ""}
        <footer class="ch-meta">${tag}<time class="ch-time">${escapeHtml(p.time)}</time></footer>
      </article>`;
  }

  feed.innerHTML = html;
}

if (searchInput) {
  searchInput.addEventListener("input", render);
}

// Запускаем отрисовку сразу из локального массива постов
render();

// === LIGHTBOX ДЛЯ ФОТО В ПОСТАХ ===
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxPlaceholder = document.getElementById('lightboxPlaceholder');
const closeBtn = document.querySelector('#lightbox .close-btn');

function openLightbox(src) {
  if (!lightbox || !lightboxImg || !lightboxPlaceholder) return;
  if (src) {
    lightboxImg.src = src;
    lightboxImg.style.display = 'block';
    lightboxPlaceholder.style.display = 'none';
  } else {
    lightboxImg.style.display = 'none';
    lightboxPlaceholder.style.display = 'block';
  }
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

if (feed) {
  feed.addEventListener('click', (e) => {
    const wrap = e.target.closest('.post-image-wrap');
    if (!wrap) return;
    const img = wrap.querySelector('.post-image');
    openLightbox(img ? img.src : null);
  });
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
}
if (closeBtn) {
  closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
