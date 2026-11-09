// Вкладка «проекты».

import Topbar from '../Topbar';
import Footer from '../Footer';
import ProjectCard from './ProjectCard';
import { projects } from '../../data/projects-data';
import { plural } from '../../lib/text';

export default function Projects() {
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
