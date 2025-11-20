import { defineConfig } from 'vite';
import { copy } from 'vite-plugin-copy';

export default defineConfig({
  plugins: [
    copy({
      patterns: [
        {
          from: 'netlify/functions/*.js',
          to: '../netlify/functions/[name][ext]'
        }
      ]
    })
  ]
});
