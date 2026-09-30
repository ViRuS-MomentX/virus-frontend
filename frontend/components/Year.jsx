'use client';

import { useEffect, useState } from 'react';

// Страницы собираются заранее, поэтому год берём ещё и в браузере —
// иначе в январе в подвале висел бы год последней сборки.
export default function Year() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <span>{year}</span>;
}
