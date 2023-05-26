import { ref } from "vue";

//判断当前是pc还是移动端
export function isMobile(){
    const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);    
    return flag;
};

//赋值默认 el-drawer 宽度, pc端展开50%宽度，移动端为90%宽度
const useElDwawerWidth = () => {
    const getElDrawerWidth = ref<string>('50%');
    if(isMobile()){
        getElDrawerWidth.value = "95%";
    };
    //console.log('getElDrawerWidth',getElDrawerWidth);
    
    //返回el-drawer宽度百分比
    return {
        getElDrawerWidth
    };
};

export default useElDwawerWidth;