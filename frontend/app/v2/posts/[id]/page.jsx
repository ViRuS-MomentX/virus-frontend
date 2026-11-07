import Topbar from '../../../../components/Topbar';
import Footer from '../../../../components/Footer';
import SingleEntry from '../../../../components/v2/SingleEntry';
import { postParams, postMetadata } from '../../../../lib/post-meta';

export const dynamicParams = false;
export const generateStaticParams = postParams;

export async function generateMetadata({ params }) {
  const { id } = await params;
  return postMetadata(id, { noindex: true });
}

export default async function PostV2({ params }) {
  const { id } = await params;
  return (
    <div className="page journal-page">
      <Topbar current="posts" base="/v2" />
      <SingleEntry id={id} />
      <Footer>передаю привет Маратко</Footer>
    </div>
  );
}
