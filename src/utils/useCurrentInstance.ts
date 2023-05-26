/*
全局方法注册：
vue3项目中，如果不用ts这样使用是没问题的
const { proxy } = getCurrentInstance()

在ts中使用会报错：报错：...类型“ComponentInternalInstance | null”
我们在项目中一般会用到很多getCurrentInstance()方法，直接封装一下
创建useCurrentInstance.ts文件：
*/
import { ComponentInternalInstance, getCurrentInstance } from 'vue'
export default function useCurrentInstance() {
    const { appContext } = getCurrentInstance() as ComponentInternalInstance
    const proxy = appContext.config.globalProperties
    return {
        proxy
    }
}


