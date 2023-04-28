import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const { resolve } = require("path");

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  resolve: {
    alias: {
      "src": resolve(__dirname, "src"),
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8088, //启动端口
    proxy: { // 配置反向代理: 开发环境请求 和 生产环境请求
      "/dev-api": { // “dev-api” 以及前置字符串会被替换为真正域名
        target: "http://localhost:9017/", // 请求域名，反向代理地址
        secure: false, // 请求是否为https
        changeOrigin: true, // 是否跨域
        rewrite: (path) => path.replace(/^\/dev-api/, "/api")
      },
      "/prod-api": { // prod-api” 以及前置字符串会被替换为真正域名
        target: "http://localhost:9017/", // 请求域名，反向代理地址
        secure: false, // 请求是否为https
        changeOrigin: true, // 是否跨域
        rewrite: (path) => path.replace(/^\/prod-api/, "/api")
      }
    }
    // 设置 https 代理
    // proxy: {
    //   '/api': {
    //     target: 'your https address',
    //     changeOrigin: true,
    //     rewrite: (path: string) => path.replace(/^\/api/, '')
    //   }
    // }
  },
  build: {
    //minify: 'terser',
    outDir: "dist",
    rollupOptions: {
      output: {
        assetFileNames: "[ext]/[name].[hash].[ext]",
        chunkFileNames: "js/[name].[hash].js",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
    terserOptions: {
      compress: {
        keep_infinity: true,
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});

