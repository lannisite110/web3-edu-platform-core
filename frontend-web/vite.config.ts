import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

const web3home = fileURLToPath(new URL('../..', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@core': fileURLToPath(new URL('..', import.meta.url)),
      '@sandbox': `${web3home}/global-social-edu-sandbox`,
      '@hot-labs': `${web3home}/web3-hot-topic-labs`,
      '@trace': `${web3home}/supervision-trace-edu-suite`,
      '@gov': `${web3home}/enterprise-gov-edu-demo`,
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
      },
    },
  },
})
