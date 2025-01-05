import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import type { Plugin } from 'vite'

// GLSL plugin type
interface GLSLPlugin extends Plugin {
  name: 'glsl'
  transform(code: string, id: string): { code: string; map: null } | undefined
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vueDevTools(),
    vue(),
    {
      name: 'glsl',
      transform(code: string, id: string) {
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
    } as GLSLPlugin,
  ],
  assetsInclude: ['**/*.md', '**/*.glsl'],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
