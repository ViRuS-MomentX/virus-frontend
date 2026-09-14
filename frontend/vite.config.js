import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { posts } from './posts-data.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// Лента постов отдельным файлом рядом со страницами.
//
// Сами посты живут в posts-data.js, но этот модуль уходит в бандл под случайным
// именем — снаружи его не прочитать. Выкладываем те же данные как posts.json,
// чтобы на ленту можно было подписаться: её читает дискорд-бот и объявляет
// новые записи в канале. Файл собирается из того же модуля, так что разойтись
// с сайтом он не может.
function postsJson() {
  return {
    name: 'posts-json',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'posts.json',
        source: JSON.stringify(posts, null, 2)
      })
    }
  }
}

export default defineConfig({
  plugins: [postsJson()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        projects: resolve(__dirname, 'projects.html'),
        posts: resolve(__dirname, 'posts.html'),
        admin: resolve(__dirname, 'admin.html'),
      }
    }
  },
  server: {
    proxy: {
      '/api': 'https://virus-backend-nine.vercel.app'
    }
  }
})
