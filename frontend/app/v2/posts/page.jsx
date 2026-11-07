import Topbar from '../../../components/Topbar';
import Footer from '../../../components/Footer';
import Journal from '../../../components/v2/Journal';

export const metadata = {
  title: 'Интерактив — Вирус',
  description: 'Лента заметок: новости страницы, мысли и чэнджлоги.',
};

export default function PostsV2() {
  return (
    <div className="page journal-page">
      <Topbar current="posts" base="/v2" />
      <Journal />
      <Footer>передаю привет Маратко</Footer>
    </div>
  );
}
