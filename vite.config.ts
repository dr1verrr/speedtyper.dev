import react from '@vitejs/plugin-react'
import * as path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  root: './',
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
  },
  css: {
    postcss: './postcss.config.js'
  },
  define: {
    'process.env': process.env
  },
  publicDir: 'public',
  build: {
    chunkSizeWarningLimit: 1600
  }
})
