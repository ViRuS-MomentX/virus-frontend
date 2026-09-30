import Admin from '../../components/admin/Admin';
import './admin.css';

export const metadata = {
  title: 'Админ панель',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <Admin />;
}
