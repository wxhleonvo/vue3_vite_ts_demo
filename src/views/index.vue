<template>
    <div class="main-box">
        <div>
            <h1>状态管理测试界面</h1>
            <h1>状态count：{{ count }}</h1>
            <h1>状态curCount：{{ calculateCount }}</h1>
            <button @click="initCount">归零</button>
            <button @click="changeCount">随机</button>
        </div>
        <div>
            <el-button @click="showMessage" size="small">显示弹窗</el-button>
        </div>
        <div>
            <h1>mock接口测试</h1>
            <el-button size="small" @click="mockTest">testApi</el-button>
        </div>
        <div>
            <h1>SVG 图标使用</h1>
            <svg-icon name="iconfont" width="64" height="64"></svg-icon>
            <svg-icon name="login-pwd" width="48" height="48" color="#ffff00"></svg-icon>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useHomeStore } from "@/store/modules/home";
import {testApi, GetMyRoutes} from "@/api/index"
//import { ElMessage } from "element-plus"
export default defineComponent({
    name: "Home",
    setup() {
        const homeStore = useHomeStore()
        let count = computed(() => homeStore.count)
        let calculateCount = computed({
            get(): number {
                return homeStore.curCount
            },
            set(val: number): void {
                homeStore.updatecount(val)
            }
        })
        const initCount = () => {
            calculateCount.value = 0
        }
        const changeCount = () => {
            const num = Math.random() * 100
            calculateCount.value = Math.floor(num)
        }
        const showMessage = () => {
            ElMessage({
                showClose: true,
                message: "登录注册成功ok",
                type: "success",
            });
        }
        const mockTest = () => {
            testApi().then((datas) => {
                console.log(datas)
            })
        };
        const ToGetMyRoutes = () => {
            GetMyRoutes()
            .then(res => {
                console.log('ToGetMyRoutes',res)
            })
            .catch(err => {
                throw new Error(err);
            })
        };
        return { count, calculateCount, initCount, changeCount, showMessage, mockTest, GetMyRoutes }
    }
})
</script>
<style lang="scss">
.main-box {
    width: 650px;
    background: rgb(170, 170, 161);
    padding: 25px;
    margin: 0 auto;
 
    h1 {
        color: red;
        font-weight: bold;
    }
}
</style>