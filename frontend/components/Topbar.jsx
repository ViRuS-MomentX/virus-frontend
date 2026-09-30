import Link from 'next/link';

const NAV = [
  { href: '/', key: 'main', label: 'главная' },
  { href: '/gallery', key: 'gallery', label: 'галерея' },
  { href: '/projects', key: 'projects', label: 'проекты' },
  { href: '/posts', key: 'posts', label: 'интерактив' },
];

export default function Topbar({ current }) {
  return (
    <div className="topbar">
      <div className="wrapper">
        <div className="brand">virus<span>/</span>{current}</div>
        <nav className="topbar-nav">
          {NAV.map(item => (
            <Link key={item.key} href={item.href} className={item.key === current ? 'on' : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
