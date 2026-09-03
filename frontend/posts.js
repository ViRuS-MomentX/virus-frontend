// 1. ВАШИ ПОСТЫ (БАЗА ДАННЫХ)
export const posts = [
  {
    title: "Проверка фото",
    date: "2026-06-30",
    time: "14:31",
    text: "Это мой попугайчик, а так же тест на фото в интерактиве",
    image: "images/шерри.jpg",
    category: "personal"
  },
  {
    title: "Новая вкладка",
    date: "2026-06-29",
    time: "20:25",
    text: "Добавлена вкладка интерактив",
    image: "",
    category: "personal"
  },
  {
    title: "Оао",
    date: "2026-06-29",
    time: "20:28",
    text: "ОНО РАБОТАЕТ!",
    image: "",
    category: "personal"
  },
  {
    title: "Чистка",
    date: "2026-07-02",
    time: "22:22",
    text: "Сделал масштабную «уборку» в репозитории, теперь не стыдно оставлять ссылку на гитхаб",
    image: "images/гитхаб.png",
    category: "personal"
  },
  {
    title: "День Независимости",
    date: "2026-07-04",
    time: "18:16",
    text: "Happy independence day",
    image: "images/сша.jpg",
    category: "personal"
  },
  {
    title: "Squad World",
    date: "2026-07-04",
    time: "20:49",
    text: "Добавлен новый проект - Squad World",
    image: "images/squadworld.png",
    category: "game"
  },
  {
    title: "Новая иконка сайта",
    date: "2026-07-06",
    time: "00:10",
    text: "Добавлена новая иконка для сайта, я иконки хуже не видел, но за то она теперь есть",
    image: "images/иконка.jpg",
    category: "personal"
  },
  {
    title: "Эксперимент не был провальным",
    date: "2026-07-22",
    time: "16:50",
    text: "Ну имба же",
    image: "images/voice.jpg",
    category: "ai"
  },
  {
    title: " ",
    date: "2026-07-22",
    time: "18:30",
    text: "На кристаликсе больше не играем",
    image: "images/троян.jpg",
    category: "game"
  },
  {
    title: "Планы на будущее",
    date: "2026-07-31",
    time: "23:14",
    text: "Когда нибудь я доделаю этот сайт (завтра)",
    image: "images/фонтан.jpg",
    category: "personal"
  },
  {
    title: "Обнова",
    date: "2026-08-01",
    time: "22:55",
    text: "Обновил дизайн сайта, добавил кнопку «Перемешать», ещё что-то и на этом всё",
    image: "images/дагестан.jpg"
  },
  {
    title: "Обновление галереи",
    date: "2026-08-08",
    time: "19:00",
    text: "Добавлен задний фон для галереи",
    image: "images/gallery-bg.webp"
  },
  {
    title: "Обновление проектов",
    date: "2026-08-08",
    time: "19:00",
    text: "Добавлен задний фон для проектов",
    image: "images/projects-bg.webp"
  },
  {
    title: "Обновление интерактива",
    date: "2026-08-08",
    time: "22:00",
    text: "Добавлен задний фон для интерактива",
    image: "images/interactive-bg.webp"
  },
  {
    title: "Временное неудобство",
    date: "2026-08-14",
    time: "15:18",
    text: "Разработка сайта временно остановлена, мне заблокировали все аккаунты в клауде",
    image: "images/клауд.jpg"
  },
  {
    title: "Обновление галереи",
    date: "2026-08-16",
    time: "19:12",
    text: "Переписал некоторые комментарии и добавил много новых фото. Техническая разработка сайта продолжится 23 августа",
    image: "images/письмо.jpg"
  },
  {
    title: "Прощай, статичный html",
    date: "2026-08-18",
    time: "16:30",
    text: "Мне тут посоветовали использовать сборщик фронтенда Vite и фреймворк Next.js. Скоро сайт станет современным, а не просто какой то страницей на html написанной дипсиком",
    image: "images/зорахпривет.png"
  },
    {
    title: "Разработка началась",
    date: "2026-08-26",
    time: "22:30",
    text: "Разработка сайта продолжается, дипсик согласился её продолжить",
    image: "images/стрип.jpg"
  },
    {
    title: "Сложнейший выбор сделает лишь сильнейший",
    date: "2026-09-03",
    time: "22:22",
    text: "Недавно приобрёл пк, надо выбрать что делать с ос, оставить виндовс или стать угашенным и перейти на убунту (картинку делал чат джпт, да простит меня дипсик)",
    image: "images/да.jpg"
  },
  
];

// 2. ЛОГИКА ОТОБРАЖЕНИЯ И ПОИСКА
const searchInput = document.getElementById("searchInput");
const feed = document.getElementById("postsFeed");
const count = document.getElementById("postsCount");

function formatDate(date, time){
  const d = new Date(date + "T" + time);
  return d.toLocaleDateString("ru-RU",{day:"2-digit",month:"long",year:"numeric"}) + " · " + time;
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
    feed.innerHTML = `<div style="text-align:center;opacity:.6;margin-top:30px">Ничего не найдено</div>`;
    return;
  }

  feed.innerHTML = list.map(p => `
    <div class="post-card">
      ${p.tag ? `<div class="post-tag">${highlight(p.tag, rawQuery)}</div>` : ""}
      <h3 class="post-title">${highlight(p.title, rawQuery)}</h3>
      ${p.image ? `<div class="post-image-wrap"><img class="post-image" src="${p.image}" loading="lazy" decoding="async" alt="${escapeHtml(p.title)}"><div class="post-zoom-hint"><i class="fa-solid fa-magnifying-glass-plus"></i></div></div>` : ""}
      <div class="post-body">${highlight(p.text || "", rawQuery)}</div>
      <div class="post-meta">
        <span class="post-date-time"><i class="fa-regular fa-clock"></i>${formatDate(p.date,p.time)}</span>
      </div>
    </div>
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
