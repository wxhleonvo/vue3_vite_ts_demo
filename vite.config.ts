import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { resolve } from "path"

//引入插件
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
//引入依赖
import autoprefixer from "autoprefixer"
import postcsspxtorem from "postcss-pxtorem"
//引入依赖
import path from "path"
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"
 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    //使用插件
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    //启用svg插件
    createSvgIconsPlugin({
      // 指定图标文件夹，绝对路径（NODE代码）
      iconDirs: [path.resolve(process.cwd(), "src/svgs")],
    })
  ],
  //进行配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
    // 类型： string[] 导入时想要省略的扩展名列表。
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.mjs']
  },
  //配置适配方案
  css: {
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
    },
  },
  server: {
    //host: '0.0.0.0', //ip地址
    port: 8088, //设置服务启动端口号
    //open: true, //启动后是否自动打开浏览器    
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
  }
})
