import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/virtual-cashier/', // Thay bằng tên repo thực tế của bạn trên GitHub
})
