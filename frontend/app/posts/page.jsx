import Topbar from '../../components/Topbar';
import Footer from '../../components/Footer';
import Feed from '../../components/posts/Feed';

export const metadata = {
  title: 'Интерактив — Вирус',
  description: 'Лента заметок: новости страницы, мысли и чэнджлоги.',
};

export default function PostsPage() {
  return (
    <div className="page posts-page">
      <Topbar current="posts" />
      <Feed />
      <Footer>передаю привет Маратко</Footer>
    </div>
  );
}
