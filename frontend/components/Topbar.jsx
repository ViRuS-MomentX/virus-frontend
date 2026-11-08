import Link from 'next/link';

const NAV = [
  { href: '/', key: 'main', label: 'главная' },
  { href: '/projects', key: 'projects', label: 'проекты' },
  { href: '/posts', key: 'posts', label: 'интерактив' },
];

// base — префикс версии сайта: '' для основной, '/v2' для второй.
// Во второй версии вкладки ведут внутрь /v2, чтобы по ней можно было ходить,
// не выпадая обратно в первую.
export default function Topbar({ current, base = '' }) {
  return (
    <div className="topbar">
      <div className="wrapper">
        <div className="brand">virus<span>/</span>{current}</div>
        <nav className="topbar-nav">
          {NAV.map(item => (
            <Link
              key={item.key}
              href={base + (item.href === '/' && base ? '' : item.href)}
              className={item.key === current ? 'on' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
