import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', //ip地址
    port: 8088, //端口号
    open: true, //启动后是否自动打开浏览器
  }
})
