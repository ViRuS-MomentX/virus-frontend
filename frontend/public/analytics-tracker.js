(function () {
  var BACKEND_URL = 'https://virus-backend-nine.vercel.app/api/analytics/visit';

  // Источник перехода. Явная метка в ссылке (?ref=tg, ?ref=dc) важнее
  // реферера: из приложений Telegram и Discord реферер часто пустой.
  // Переходы внутри самого сайта источником не считаем.
  function resolveReferrer() {
    try {
      var params = new URLSearchParams(location.search);
      var tag = params.get('ref') || params.get('utm_source');
      if (tag) return tag.slice(0, 64);

      if (document.referrer) {
        var host = new URL(document.referrer).hostname;
        if (host && host !== location.hostname) return host;
      }
    } catch (e) {}
    return '';
  }

  fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: location.pathname,
      referrer: resolveReferrer(),
      lang: (navigator.language || '').slice(0, 16),
    }),
    keepalive: true,
  }).catch(function () {});
})();
