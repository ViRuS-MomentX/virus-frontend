// Увеличение фото внутри лайтбокса.
// По умолчанию снимок вписан в экран; клик по нему увеличивает,
// повторный клик возвращает. Модуль общий для галереи и ленты —
// обе страницы используют один и тот же #lightbox.

const box = document.getElementById('lightbox');
const img = document.getElementById('lightboxImg');

// Во сколько раз минимум увеличивать. Нужно для мелких снимков:
// у них натуральный размер меньше вписанного, и без этого порога
// клик просто ничего не менял бы.
const MIN_SCALE = 1.9;

function zoomIn() {
  const fitted = img.getBoundingClientRect().width;
  if (!fitted) return;
  const target = Math.max(img.naturalWidth || 0, fitted * MIN_SCALE);
  img.style.width = Math.round(target) + 'px';
  box.classList.add('is-zoomed');
}

function zoomOut() {
  img.style.width = '';
  box.classList.remove('is-zoomed');
  box.scrollTo(0, 0);
}

if (box && img) {
  img.addEventListener('click', event => {
    // без этого клик дойдёт до фона и закроет лайтбокс
    event.stopPropagation();
    if (box.classList.contains('is-zoomed')) zoomOut();
    else zoomIn();
  });

  // При открытии и закрытии сбрасываем масштаб, чтобы следующее
  // фото всегда начиналось вписанным в экран.
  let wasActive = box.classList.contains('active');
  new MutationObserver(() => {
    const isActive = box.classList.contains('active');
    if (isActive !== wasActive) {
      wasActive = isActive;
      zoomOut();
    }
  }).observe(box, { attributes: true, attributeFilter: ['class'] });
}
