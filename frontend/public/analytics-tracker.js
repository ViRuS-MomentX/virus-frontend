(function () {
  var BACKEND_URL = 'https://virus-backend-nine.vercel.app/api/analytics/visit';

  fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: window.location.pathname }),
    keepalive: true,
  }).catch(function () {});
})();
