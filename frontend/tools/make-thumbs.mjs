// Генерация превью для галереи.
//
//   npm run thumbs          — сделать недостающие и обновить устаревшие
//   npm run thumbs -- --force   — перегенерировать все заново
//
// Что делает: на каждый снимок из gallery-data.js кладёт в
// public/images/thumbs/ превью шириной 480px в webp. В сетке галереи
// миниатюра показывается примерно на 214px, так что 480 хватает даже
// на экранах с двойной плотностью, а оригинал грузится только когда
// открывают лайтбокс.

import { readdir, stat, mkdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { galleryData } from '../gallery-data.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.join(HERE, '..', 'public', 'images');
const THUMBS = path.join(IMAGES, 'thumbs');

const WIDTH = 480;
const QUALITY = 76;

const force = process.argv.includes('--force');

const thumbName = file => path.basename(file).replace(/\.[^.]+$/, '') + '.webp';

// нужно ли пересобирать: нет превью, оно устарело или запрошен --force
async function outdated(src, dst) {
  if (force || !existsSync(dst)) return true;
  const [a, b] = await Promise.all([stat(src), stat(dst)]);
  return a.mtimeMs > b.mtimeMs;
}

await mkdir(THUMBS, { recursive: true });

let made = 0, skipped = 0, bytes = 0;
const missing = [];
const expected = new Set();

for (const item of galleryData) {
  const file = item.name.replace(/^images\//, '');
  const src = path.join(IMAGES, file);
  const dst = path.join(THUMBS, thumbName(file));
  expected.add(path.basename(dst));

  if (!existsSync(src)) {
    missing.push(item.name);
    continue;
  }

  if (!(await outdated(src, dst))) {
    skipped++;
    bytes += (await stat(dst)).size;
    continue;
  }

  await sharp(src)
    .resize({ width: WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(dst);

  made++;
  bytes += (await stat(dst)).size;
}

// превью, у которых больше нет исходника, только занимают место
let removed = 0;
for (const f of await readdir(THUMBS)) {
  if (f.endsWith('.webp') && !expected.has(f)) {
    await unlink(path.join(THUMBS, f));
    removed++;
  }
}

console.log(`превью: создано ${made}, актуальных ${skipped}` +
  (removed ? `, удалено лишних ${removed}` : ''));
console.log(`всего ${galleryData.length} снимков, превью занимают ${(bytes / 1048576).toFixed(2)} МБ`);

if (missing.length) {
  console.warn(`\nнет исходника (${missing.length}), превью не сделано:`);
  for (const m of missing) console.warn('  ' + m);
  process.exitCode = 1;
}
