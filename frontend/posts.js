import { posts } from "./posts-data.js";

// 1. ВАШИ ПОСТЫ (БАЗА ДАННЫХ)

// 2. ЛОГИКА ОТОБРАЖЕНИЯ И ПОИСКА
const searchInput = document.getElementById("searchInput");
const feed = document.getElementById("postsFeed");
const count = document.getElementById("postsCount");

function formatDate(date, time){
  const d = new Date(date + "T" + time);
  const day = d.toLocaleDateString("ru-RU",{day:"2-digit",month:"2-digit",year:"numeric"});
  return `${day}<br>${time}`;
}

function norm(str){
  return (str || "").toLowerCase().trim();
}

function escapeHtml(str){
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

  count.textContent = `Постов: ${list.length}`;

  if(list.length === 0){
    feed.innerHTML = `<div class="post-empty">Ничего не найдено</div>`;
    return;
  }

  feed.innerHTML = list.map(p => `
    <article class="post-card">
      <div class="post-meta">
        <span class="post-date-time">${formatDate(p.date,p.time)}</span>
      </div>
      <div>
        ${p.tag ? `<div class="post-tag">${highlight(p.tag, rawQuery)}</div>` : ""}
        <h3 class="post-title">${highlight(p.title, rawQuery)}</h3>
        ${p.image ? `<div class="post-image-wrap"><img class="post-image" src="${p.image}" loading="lazy" decoding="async" alt="${escapeHtml(p.title)}"></div>` : ""}
        <div class="post-body">${highlight(p.text || "", rawQuery)}</div>
      </div>
    </article>
  `).join("");
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
