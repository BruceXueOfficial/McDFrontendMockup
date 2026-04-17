import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './',
  root: 'app',
  plugins: [react()],
  build: {
    outDir: '../',
    emptyOutDir: false,
    assetsDir: 'assets',
  },
})
