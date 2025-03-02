import { defineConfig } from 'vite'

export default defineConfig({
  base: '/Syllabi/',
  css: {  
    assetsInclude: ['**/*.json'],
    server: {
        port: 5173
    },
    preprocessorOptions: {
      scss: {
        additionalData: `
          $primary-color: #E41C38;
          $secondary-color: #f4f4f4;
          $text-color: #333;
        `
      }
    }
  }
})