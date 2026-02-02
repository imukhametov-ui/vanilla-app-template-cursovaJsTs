import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import FullReload from 'vite-plugin-full-reload';

export default defineConfig({
  root: 'src',
  base: '/vanilla-app-template-cursovaJsTs/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: './src/index.html',
        favorites: './src/favorites.html',
      },
    },
  },
  plugins: [
    injectHTML(),
    FullReload(['./src/**/**.html']),
  ],
});