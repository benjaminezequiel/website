import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'glsl',
      transform(code, id) {
        if (/\.(glsl|vert|frag)$/.test(id)) {
          const stringified = JSON.stringify(code)
            .replace(/\u2028/g, '\\u2028')
            .replace(/\u2029/g, '\\u2029')

          return {
            code: `export default ${stringified};`,
            map: null,
          }
        }
      },
    },
  ],
  assetsInclude: ['**/*.md', '**/*.glsl'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
