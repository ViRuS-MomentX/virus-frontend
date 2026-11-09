import Topbar from '../../../components/Topbar';
import Footer from '../../../components/Footer';
import SingleEntry from '../../../components/posts/SingleEntry';
import { postParams, postMetadata } from '../../../lib/post-meta';
import '../posts.css';

// все страницы постов собираются заранее; неизвестный адрес — 404
export const dynamicParams = false;
export const generateStaticParams = postParams;

export async function generateMetadata({ params }) {
  const { id } = await params;
  return postMetadata(id);
}

export default async function PostPage({ params }) {
  const { id } = await params;
  return (
    <div className="page journal-page">
      <Topbar current="posts" />
      <SingleEntry id={id} />
      <Footer>передаю привет Маратко</Footer>
    </div>
  );
}
