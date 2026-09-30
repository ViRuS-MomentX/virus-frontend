import Link from 'next/link';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
import Quote from '../components/home/Quote';
import Bubbles from '../components/home/Bubbles';
import { posts } from '../data/posts-data';
import { galleryData } from '../data/gallery-data';
import { projects } from '../data/projects-data';
import { asset, plural } from '../lib/text';

const LABELS = { personal: 'личное', game: 'игра', ai: 'нейронки' };

const AIS = [
  'ChatGPT', 'Claude', 'Gemini', 'GitHub Copilot', 'Perplexity',
  'DALL·E', 'Midjourney', 'Mistral', 'GigaChat', 'ZorahM-GPT',
];

const SOCIALS = [
  {
    cls: 'is-tg', href: 'https://t.me/IAmVirus', label: 'Телеграм',
    d: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  },
  {
    cls: 'is-dc', href: 'https://discord.com/users/573196687481372675', label: 'Дискорд',
    d: 'M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z',
  },
  {
    cls: 'is-tt', href: 'https://tiktok.com/@i...am_virus', label: 'Тикток',
    d: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
  {
    cls: 'is-gh', href: 'https://github.com/virus-momentx/virus.github.io', label: 'Гитхаб',
    d: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
];

const ru = d => d.split('-').reverse().join('.');

export default function HomePage() {
  const latest = [...posts]
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
    .slice(0, 3);

  const n = projects.length;

  return (
    <>
      <Topbar current="main" />

      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <Bubbles />
        </div>
        <div className="wrapper">
          <div className="hero-grid">
            <div className="hero-avatar">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/филя.webp" alt="Кот Филя — аватар Вируса" width={168} height={168} loading="eager" decoding="async" />
            </div>
            <div>
              <h1 className="hero-name" aria-label="Вирус"><span aria-hidden="true">ᐯ丨尺ㄩ丂</span></h1>
              <p className="hero-sub">
                Живу как карты ляжут, играю в майн и пью милкшейк.
                А что мне ещё остаётся?
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="quote-band">
        <div className="wrapper quote-band-inner">
          <Quote />
        </div>
      </section>

      <main className="wrapper home-grid">

        {/* числа берём из тех же данных, что и сами страницы, чтобы не расходились */}
        <section className="summary" aria-label="Сводка по сайту">
          <h2 className="panel-title">сводка</h2>

          <Link className="summary-row" href="/gallery">
            <span className="summary-num">{galleryData.length}</span>
            <span className="summary-key">фото</span>
          </Link>

          <Link className="summary-row" href="/posts">
            <span className="summary-num">{posts.length}</span>
            <span className="summary-key">посты</span>
          </Link>

          <Link className="summary-row" href="/projects">
            <span className="summary-num">{n}</span>
            <span className="summary-key">{plural(n, 'проект', 'проекта', 'проектов')}</span>
          </Link>
        </section>

        <section className="about panel">
          <h2 className="panel-title">о сайте</h2>

          <p className="about-lead">
            Это страница Вируса — без цели, без плана, без полезной инфы.
          </p>

          <p>
            Это информативный уголок по сайту: В наличии библиотека сотни с лишним
            скриншотов, у каждого своя подпись; пара ботов и майн-сервер, который всё
            никак не доедет до релиза; и лента, куда падает остальное — новости
            страницы, мысли и чэнджлоги.
          </p>

          <p>
            Всё делал сам, ни одна нейросеть не помогала. Снизу список
            друзей которые принимали участие в разработке сайта.
          </p>

          <div className="about-list">
            <Link className="about-item" href="/gallery">
              <span className="about-item-name">Галерея</span>
              <span className="about-item-note">Каждое фото — каждое воспоминание</span>
            </Link>
            <Link className="about-item" href="/projects">
              <span className="about-item-name">Проекты</span>
              <span className="about-item-note">Бот от дипсика, бот от фанстат и участник нн сервера</span>
            </Link>
            <Link className="about-item" href="/posts">
              <span className="about-item-name">Интерактив</span>
              <span className="about-item-note">лента заметок: грязь, грязище, дипсик</span>
            </Link>
          </div>

          <p className="about-foot">
            Нужен бот, сервер или бездарь - 100 рублей, писать
            в <a href="https://t.me/IAmVirus" target="_blank" rel="noopener">телеграм</a>
            {' '}или <a href="https://discord.com/users/573196687481372675" target="_blank" rel="noopener">дискорд</a>.
          </p>
        </section>

        <aside className="home-side">

          <section className="panel">
            <h2 className="panel-title">мои соцсети</h2>
            <div className="social-tiles">
              {SOCIALS.map(s => (
                <a key={s.cls} className={`social-tile ${s.cls}`} href={s.href} target="_blank" rel="noopener" aria-label={s.label}>
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={s.d} /></svg>
                </a>
              ))}
            </div>
          </section>

          <section className="panel">
            <h2 className="panel-title">последние посты</h2>
            <div>
              {latest.map((p, i) => (
                <Link key={i} className="post-mini" href="/posts">
                  {p.image
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img className="post-mini-thumb" src={asset(p.image)} alt="" loading="lazy" decoding="async" />
                    : <span className="post-mini-thumb is-empty" />}
                  <span className="post-mini-text">
                    <span className="post-mini-title">{p.title.trim() || 'без названия'}</span>
                    <span className="post-mini-date">{ru(p.date)}</span>
                  </span>
                  <span className={`post-badge is-${p.category || 'note'}`}>{LABELS[p.category] || 'заметка'}</span>
                </Link>
              ))}
            </div>
            <Link className="panel-more" href="/posts">все посты</Link>
          </section>

        </aside>

      </main>

      <section className="marquee" aria-label="Нейросети, которые помогали со страницей">
        <div className="marquee-track">
          {AIS.map(name => <span key={name} className="marquee-item">{name}</span>)}
          {AIS.map(name => <span key={name + '-2'} className="marquee-item" aria-hidden="true">{name}</span>)}
        </div>
      </section>

      <Footer />
    </>
  );
}
