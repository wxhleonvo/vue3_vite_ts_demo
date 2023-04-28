import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'

//引入路由
import router from './router'
//引入createPinia方法从pinia
import { createPinia } from "pinia"

//import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/css/index.css'
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
//import 'element-plus/theme-chalk/el-loading.css';
//import 'element-plus/theme-chalk/el-message-box.css';
//import 'element-plus/theme-chalk/el-message.css';

//拿到pinia实例
const pinia = createPinia()

//屏幕自适应
//import "amfe-flexible/index.js";
// 引入Svg组件
//import "virtual:svg-icons-register";
//import SvgIcon from "./components/SvgIcon.vue";

//调用路由 , 使用pinia
// 创建vue实例
const app = createApp(App)
//使用Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(router).use(pinia).mount('#app')


//createApp(App).mount('#app')