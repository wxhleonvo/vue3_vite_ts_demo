import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

//引入路由
import router from './router'
//引入createPinia方法从pinia
import { createPinia } from "pinia"

//拿到pinia实例
const pinia = createPinia()

//屏幕自适应
import "amfe-flexible/index.js";
// 引入Svg组件
import "virtual:svg-icons-register";
import SvgIcon from "./components/SvgIcon.vue";

//调用路由 , 使用pinia
createApp(App).use(router).use(pinia).component("SvgIcon",SvgIcon).mount('#app')
//createApp(App).mount('#app')