import Topbar from '../../components/Topbar';
import Footer from '../../components/Footer';
import Gallery from '../../components/gallery/Gallery';

export const metadata = {
  title: 'Галерея — Вирус',
  description: '117 скриншотов из Minecraft, Roblox, Phasmophobia и Marvel Rivals — каждый с подписью.',
};

export default function GalleryPage() {
  return (
    <div className="page gallery-page">
      {/* шрифт только для трёх букв на кнопке IRL */}
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&text=IRL&display=swap" rel="stylesheet" precedence="default" />
      <Topbar current="gallery" />
      <Gallery />
      <Footer />
    </div>
  );
}
