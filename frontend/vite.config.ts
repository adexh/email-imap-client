import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'shared-types': path.resolve(__dirname, '../packages/shared-types/dist')
    }
    // alias: [
    //   { find: "@", replacement: path.resolve(__dirname, "src") },
    // ],
   
  },
})
