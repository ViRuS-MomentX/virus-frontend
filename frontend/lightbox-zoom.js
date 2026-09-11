// Увеличение фото внутри лайтбокса.
// По умолчанию снимок вписан в экран; клик увеличивает его к той точке,
// по которой кликнули, повторный клик возвращает. Модуль общий для
// галереи и ленты — обе страницы используют один и тот же #lightbox.

const box = document.getElementById('lightbox');
const img = document.getElementById('lightboxImg');

// Во сколько раз минимум увеличивать. Нужно для мелких снимков:
// у них натуральный размер меньше вписанного, и без этого порога
// клик просто ничего не менял бы.
const MIN_SCALE = 1.9;

function zoomIn(event) {
  const rect = img.getBoundingClientRect();
  if (!rect.width) return;

  // доля снимка, по которой кликнули, — её и надо удержать перед глазами
  const relX = (event.clientX - rect.left) / rect.width;
  const relY = (event.clientY - rect.top) / rect.height;

  const target = Math.max(img.naturalWidth || 0, rect.width * MIN_SCALE);
  img.style.width = Math.round(target) + 'px';
  box.classList.add('is-zoomed');

  // после перераскладки подводим прокрутку так, чтобы та же точка
  // оказалась в центре окна
  requestAnimationFrame(() => {
    const grown = img.getBoundingClientRect();
    const view = box.getBoundingClientRect();
    box.scrollLeft += (grown.left + relX * grown.width) - (view.left + view.width / 2);
    box.scrollTop += (grown.top + relY * grown.height) - (view.top + view.height / 2);
  });
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
    else zoomIn(event);
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
