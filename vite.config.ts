import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const { resolve } = require("path");
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

//引入依赖-自适应移动多端适配
import autoprefixer from "autoprefixer"
import postcsspxtorem from "postcss-pxtorem"



export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      /* 自动导入vue相关的Api
      imports: [
        'vue',
        'vue-router',
      ],
      dts: './auto-imports.d.ts',*/
      //resolvers: [ElementPlusResolver(), IconResolver({ prefix: 'Icon' })
      resolvers: [ElementPlusResolver()]
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
  //配置适配方案
  /*css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: [
            "Android 4.1",
            "iOS 7.1",
            "Chrome > 31",
            "ff > 31",
            "ie >= 8",
            "last 10 versions", // 所有主流浏览器最近10版本用
          ],
          grid: true
        }),
        postcsspxtorem({
          rootValue: 192, // 设计稿宽度的1/ 10 例如设计稿按照 1920设计 此处就为192
          propList: ["*", "!border"], // 除 border 外所有px 转 rem
          selectorBlackList: [".el-"], // 过滤掉.el-开头的class，不进行rem转换
        })
      ],
    }
  },*/
  css: {
        postcss: {
            plugins: [
              postcsspxtorem({
                    rootValue: 16,// 1rem = 16px 的大小
                    propList: ['*']
                }),
                autoprefixer({
                    grid: true
                })
            ]
        },
        preprocessorOptions: {
          scss: {
            additionalData: `
              @use "./src/assets/style/main.scss" as globalScss;@use "./src/assets/style/element/index.scss" as *;
            `,
          },
        },
  },
  server: {
    port: 8088, //启动端口
    proxy: { // 配置反向代理: 开发环境请求 和 生产环境请求
      "/api": { // “dev-api” 以及前置字符串会被替换为真正域名
        target: "http://localhost:9019/", // 请求域名，反向代理地址
        //target: "http://192.168.1.105:9019/", // 请求域名，反向代理地址
        secure: false, // 请求是否为https
        changeOrigin: true, // 是否跨域
        rewrite: (path) => path.replace(/^\/api/, "/api")
      }
      /*,
      "/prod-api": { // prod-api” 以及前置字符串会被替换为真正域名
        target: "http://localhost:9017/", // 请求域名，反向代理地址
        secure: false, // 请求是否为https
        changeOrigin: true, // 是否跨域
        rewrite: (path) => path.replace(/^\/prod-api/, "/")
      }*/
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

