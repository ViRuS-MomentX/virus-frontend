import Topbar from '../../components/Topbar';
import Footer from '../../components/Footer';
import Journal from '../../components/posts/Journal';
import './posts.css';

export const metadata = {
  title: 'Посты — Вирус',
  description: 'Лента заметок: новости страницы, мысли и чэнджлоги.',
};

export default function PostsPage() {
  return (
    <div className="page journal-page">
      <Topbar current="posts" />
      <Journal />
      <Footer>передаю привет Маратко</Footer>
    </div>
  );
}
