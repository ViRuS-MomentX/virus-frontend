'use client';

import { useCallback, useEffect, useState } from 'react';

const BACKEND_URL = 'https://virus-backend-nine.vercel.app/api/analytics/visits';
const STORAGE_KEY = 'analytics_admin_key';

function formatTime(iso) {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

const show = v => (v === null || v === undefined ? '—' : v);

function countryFlag(code) {
  if (!code || code.length !== 2) return '';
  const base = 127397;
  const upper = code.toUpperCase();
  return String.fromCodePoint(base + upper.charCodeAt(0), base + upper.charCodeAt(1));
}

// Считаем, сколько визитов пришло с каждого источника и на каком языке.
function tally(visits, key, fallback) {
  const counts = {};
  visits.forEach(v => {
    const val = v[key] || fallback;
    counts[val] = (counts[val] || 0) + 1;
  });
  return Object.keys(counts)
    .map(k => ({ label: k, n: counts[k] }))
    .sort((a, b) => b.n - a.n);
}

function Card({ title, rows }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <ul>
        {rows.length
          ? rows.map(r => <li key={r.label}><span>{r.label}</span><b>{r.n}</b></li>)
          : <li><span>—</span></li>}
      </ul>
    </div>
  );
}

const COLUMNS = [
  ['Время', v => formatTime(v.visited_at)],
  ['IP', v => show(v.ip)],
  ['Страна', v => `${countryFlag(v.country)} ${show(v.country)}`],
  ['Регион', v => show(v.region)],
  ['Город', v => show(v.city)],
  ['Источник', v => show(v.source)],
  ['Язык', v => show(v.lang)],
  ['Устройство', v => show(v.device)],
  ['ОС', v => show(v.os)],
  ['Браузер', v => show(v.browser)],
  ['Страница', v => show(v.page)],
];

export default function Admin() {
  // null — ещё не знаем, есть ли сохранённый ключ (он живёт только в браузере)
  const [authed, setAuthed] = useState(null);
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [visits, setVisits] = useState([]);

  const loadVisits = useCallback(() => {
    const key = sessionStorage.getItem(STORAGE_KEY);
    if (!key) return;
    setStatus('Загрузка...');
    fetch(BACKEND_URL, { headers: { 'x-admin-key': key } })
      .then(res => {
        if (res.status === 401) {
          sessionStorage.removeItem(STORAGE_KEY);
          setAuthed(false);
          setError('Неверный ключ доступа');
          throw new Error('unauthorized');
        }
        if (!res.ok) throw new Error('Ошибка сервера: ' + res.status);
        return res.json();
      })
      .then(data => {
        setVisits(data);
        setStatus('Всего записей: ' + data.length);
      })
      .catch(err => {
        if (err.message !== 'unauthorized') setStatus('Ошибка: ' + err.message);
      });
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    setAuthed(!!saved);
    if (saved) loadVisits();
  }, [loadVisits]);

  function login() {
    const key = keyInput.trim();
    if (!key) return;
    sessionStorage.setItem(STORAGE_KEY, key);
    setError('');
    setAuthed(true);
    loadVisits();
  }

  if (authed === null) return <div className="admin-page" />;

  if (!authed) {
    return (
      <div className="admin-page">
        <div id="login-box">
          <h1>🔒 Аналитика посещений</h1>
          <input
            type="password"
            placeholder="Введите ключ доступа"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') login(); }}
          />
          <button onClick={login}>Войти</button>
          <div id="error-msg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div id="toolbar">
        <h1>Аналитика virus</h1>
        <button id="refresh-btn" onClick={loadVisits}>Обновить</button>
      </div>
      <div id="status">{status}</div>
      {visits.length > 0 && (
        <div id="summary">
          <Card title="Источники" rows={tally(visits, 'source', 'Прямой')} />
          <Card title="Языки" rows={tally(visits, 'lang', '—')} />
          <Card title="Устройства" rows={tally(visits, 'device', '—')} />
        </div>
      )}
      <table>
        <thead>
          <tr>{COLUMNS.map(([name]) => <th key={name}>{name}</th>)}</tr>
        </thead>
        <tbody>
          {visits.map((v, i) => (
            <tr key={i}>{COLUMNS.map(([name, get]) => <td key={name}>{get(v)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
