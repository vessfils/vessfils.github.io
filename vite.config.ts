import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// User site (vessfils.github.io) is served from the domain root, so base is '/'.
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  build: { target: 'es2022', cssMinify: true, sourcemap: false },
})
