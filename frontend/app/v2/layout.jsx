// Вторая версия сайта. Главная и проекты те же, что в первой,
// новая — только лента («интерактив»). Поисковикам её не показываем,
// пока она пробная, чтобы не было двух копий одних и тех же страниц.
import './v2.css';

export const metadata = {
  robots: { index: false, follow: false },
};

export default function V2Layout({ children }) {
  return children;
}
