import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        gallery: resolve(__dirname, 'gallery.html'),
        projects: resolve(__dirname, 'projects.html'),
        posts: resolve(__dirname, 'posts.html'),
        postsBlock: resolve(__dirname, 'posts-block.html'),
      }
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})