import Topbar from '../../components/Topbar';
import Footer from '../../components/Footer';
import ProjectCard from '../../components/projects/ProjectCard';
import { projects } from '../../data/projects-data';
import { plural } from '../../lib/text';

export const metadata = {
  title: 'Проекты — Вирус',
  description: 'Discord-бот на заказ, Telegram-бот Virus Finder и Minecraft-сервер Squad World.',
};

export default function ProjectsPage() {
  const n = projects.length;

  return (
    <div className="page projects-page">
      <Topbar current="projects" />

      <div className="page-head">
        <div className="wrapper page-head-top">
          <div className="page-title">
            <h1>Проекты</h1>
            <p>Создам вам чудо за 100 рублей, писать в тг.</p>
          </div>
          {/* счётчик в шапке держим в согласии с данными */}
          <div className="head-count">{n} {plural(n, 'штука', 'штуки', 'штук')}</div>
        </div>
      </div>

      <main className="wrapper projects-wrap">
        <div className="p-list">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
        {/* блоки сразу есть в разметке, но без скрипта их некому проявить */}
        <noscript><style>{'.p-item{clip-path:none}'}</style></noscript>
      </main>

      <Footer />
    </div>
  );
}
