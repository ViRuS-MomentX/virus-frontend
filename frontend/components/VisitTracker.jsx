'use client';

// Счётчик посещений для своей аналитики на бэкенде.
// Раньше это был отдельный analytics-tracker.js на каждой странице; теперь
// переходы идут без перезагрузки, поэтому визит отправляем при смене адреса.

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const BACKEND_URL = 'https://virus-backend-nine.vercel.app/api/analytics/visit';

// Источник перехода. Явная метка в ссылке (?ref=tg, ?ref=dc) важнее
// реферера: из приложений Telegram и Discord реферер часто пустой.
// Переходы внутри самого сайта источником не считаем.
function resolveReferrer() {
  try {
    const params = new URLSearchParams(location.search);
    const tag = params.get('ref') || params.get('utm_source');
    if (tag) return tag.slice(0, 64);

    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host && host !== location.hostname) return host;
    }
  } catch (e) {}
  return '';
}

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // админку в статистику не пишем — её и раньше не считали
    if (pathname.startsWith('/admin')) return;

    fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        referrer: resolveReferrer(),
        lang: (navigator.language || '').slice(0, 16),
      }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);

  return null;
}
