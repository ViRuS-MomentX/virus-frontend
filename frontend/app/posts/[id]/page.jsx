import Topbar from '../../../components/Topbar';
import Footer from '../../../components/Footer';
import SinglePost from '../../../components/posts/SinglePost';
import { postParams, postMetadata } from '../../../lib/post-meta';

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
    <div className="page posts-page">
      <Topbar current="posts" />
      <SinglePost id={id} />
      <Footer>передаю привет Маратко</Footer>
    </div>
  );
}
