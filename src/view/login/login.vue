<template>
    <div class="login-wrap">

      <!-- 背景 -->
      <div class="back-wrap">
        <div class="bg-item left one"></div>
        <div class="bg-item right two"></div>
        <div class="bg-item left three"></div>
        <div class="bg-item right four"></div>
      </div>

      <div class="loogin-container">
            <div class="login-title">{{configInfo.Title}}</div>
            <ElForm
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            class="form-wrap"
            >
            <ElFormItem prop="LOGIN_NAME">
                <ElInput
                size="large"
                v-model="ruleForm.LOGIN_NAME"
                placeholder="用户名：admin"
                autocomplete="off"
                prefix-icon="UserFilled"
                @mousedown="handleCapsStatusOut($event)"
                />
            </ElFormItem>
            <ElFormItem prop="PASSWORD_MW">
                <el-tooltip :visible="capsVisible" effect="light" content="大写锁定已打开" placement="bottom">
                <ElInput
                    size="large"
                    v-model="ruleForm.PASSWORD_MW"              
                    :type="flagType"
                    autocomplete="off"
                    placeholder="密码：123456"
                    prefix-icon="Key"
                    @mousedown="handleCapsStatus($event)"
                    @keydown="handleCapsStatus($event)"
                >
                    <template #suffix>
                    <span @click="changeView">
                    <el-icon class="el-input__icon" v-if="flag == true"><Hide /></el-icon>
                    <el-icon class="el-input__icon" v-else-if="flag == false"><View /></el-icon>
                    </span>
                    </template>
                </ElInput>
                </el-tooltip>
            </ElFormItem>
            <ElFormItem>
                <Vcode :show="isShow" @success="success" @close="close" @fail='fail'></Vcode>
                <ElButton style="width: 100%; height: 40px; font-size: 15px; margin-top: 10px"
                type="primary" :loading="buttonStatus.isLoging" @click="submit()">登录</ElButton>
            </ElFormItem>
            </ElForm>
            <div class="bottom-title">
              {{configInfo.CopyRight}}
            </div>
      </div>

      
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, reactive, ref,onMounted  } from "vue";
  import { useRouter } from "vue-router";
  //import { FormInstance } from 'element-plus'
  import { rules } from "./baseData";
  import { useLocalStorage } from "src/hooks/useLocalStorage";
  import useLoging from "src/hooks/useLoging";
  import { getConfig } from "src/api/config";
  import { login } from "src/api/login";
  import Vcode from "vue3-puzzle-vcode"; // vue3 滑块拼图验证登录(vue3-puzzle-vcode), https://blog.csdn.net/liubt817/article/details/129026338?spm=1001.2101.3001.6650.17&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-17-129026338-blog-129654450.235%5Ev35%5Epc_relevant_increate_t0_download_v2&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-17-129026338-blog-129654450.235%5Ev35%5Epc_relevant_increate_t0_download_v2&utm_relevant_index=18
  import { Md5 } from 'ts-md5';
  import axios from 'axios';
  export default defineComponent({
    name: "Login",
    components: {Vcode},
    setup() {
      const ruleFormRef = ref();
      const router = useRouter();
      const ruleForm = reactive({
        LOGIN_NAME: "superadmin", //superadmin
        PASSWORD_MW:"ABcd12#$",//密码明文 ABcd12#$
        PASSWORD: "",//md5加密后密文  ABcd12#$  加密后 afcc59d7787fc831e52a591b158151a0        
      });
      //配置信息
      const configInfo=reactive({
        Title:'',
        CopyRight:''
      });
      
    const flagType = ref("password");//密码框类型
    const flag = ref(true);//密码明文切换属性
    const capsVisible = ref(false);//大小写状态,默认不提示

    const buttonStatus = reactive({isLoging: false}); // 登录加载标记
    
    const { setLocalStorage,getLocalStorage } = useLocalStorage();
    const { isLoging, setLoging } = useLoging();
    
    
    
    //初始化获得基本信息
    const initConfig = async () => {       
     await getConfig()
        .then(res => {          
          //console.log('res',res);
          if(res.Code===200){                    
            configInfo.Title = res.Data.Title;
            configInfo.CopyRight=res.Data.CopyRight;
          }
        })
        .catch(err => {
            ElMessage({
                          message: err,
                          type: "error",
            });
          throw new Error(err);                
        })       
    };
    onMounted(initConfig);

    const submitForm = () => {      
      //setLocalStorage("token", 'token123abc');
      //setLocalStorage("uid", '1');
      //const token = getLocalStorage("token");
      //console.log('token',token);
      const md5:any = new Md5();
      md5.appendAsciiStr(ruleForm.PASSWORD_MW);
      ruleForm.PASSWORD = md5.end();
      //console.log('加密密码：',ruleForm);

      //md5.appendAsciiStr("123456");      
      //console.log('123456',md5.end());   
          buttonStatus.isLoging = true;
            login(ruleForm)
            .then(res => {
                //console.log(res);     
                if(res.Code===200){
                    setLocalStorage("token", res.Data.AccessToken.TokenContent);                    
                    //setLocalStorage("uid", 111);
                    //router.replace("/");
                    //router.push("/index/home");                    
                    ElMessage({
                        message: "登录成功",
                        type: "success",
                    });
                    router.push({path:"/"});
                }
                else{
                  ElMessage({
                        message: "登录失败:"+res.Msg,
                        type: "error",
                    });
                }
                buttonStatus.isLoging = false;
            })
            .catch(err => {
                buttonStatus.isLoging = false;
                ElMessage({
                        message: err,
                        type: "error",
                    });
                throw new Error(err);                
            })  
        
    };
    //切换小眼睛事件
    const changeView = () => {
      flag.value = !flag.value;
      flagType.value = flag.value ? "password" : "text";
    };
    //监听键盘大小写状态
    const handleCapsStatus = (event:any)=> {
      //console.log('event',event);
      // 检测caps lock状态      
      if(event.getModifierState){
        if (event.getModifierState('CapsLock')) {
          capsVisible.value = true;
        } else {
          capsVisible.value = false;
        }
      }
    };
    //关闭监听
    const handleCapsStatusOut = (event:any)=> {
      // 关闭大小写提示信息 
      capsVisible.value = false;      
    };
    /*
    const submitForm = (formEl: FormInstance | undefined) => {      
      //setLocalStorage("token", 'token123abc');
      //setLocalStorage("uid", '1');
      //const token = getLocalStorage("token");
      //console.log('token',token);

      if (!formEl) return
        formEl.validate((valid) => {
        if (valid) {
            buttonStatus.isLoging = true;
            login(ruleForm)
            .then(res => {
                console.log(res);
                //ruleForm.Msg = res;
                ruleForm.Msg = JSON.stringify(res);
       
//ruleForm.Msg = JSON.stringify(res);
                if(res.Code===200){
                    setLocalStorage("token", res.Data.AccessToken.TokenContent);                    
                    setLocalStorage("uid", 111);
                    //router.replace("/");
                    router.push("/")                    
                    ElMessage({
                        message: "登录成功",
                        type: "success",
                    });
                }
                buttonStatus.isLoging = false;
            })
            .catch(err => {
                buttonStatus.isLoging = false;
                ruleForm.Msg = err;
                throw new Error(err);                
            })                        
        } else {
            return false
        }
        })
    };

    const submitForm = async () => {
      ruleFormRef.value.validate(async (valid: boolean) => {
        valid &&
          setLoging<IUserLoginReq, IUserLoginRes>(userLoginApi, ruleForm).then(
            (res) => {
              setLocalStorage("token", res.token);
              setLocalStorage("uid", res.uid);
              router.replace("/");
            }
          );
      });
    };
    */

    //图片滑块验证码
    const isShow = ref(false);
    //点击登录，显示滑块验证图片
    const submit = () => {
      if (!ruleFormRef) return;
      ruleFormRef.value.validate((valid: boolean) => {
        //console.log('valid',valid);
        if(valid){
          isShow.value = true;
          //buttonStatus.isLoging = true;          
        }
      });      
    };
    // 用户通过了验证
    const success = (msg:string) => {
      isShow.value = false;
      //console.log('验证通过' + msg);
      submitForm();//提交验证账号密码      
    };
    // 用户点击遮罩层，应该关闭模态框
    const close = () => {
      isShow.value = false;
    };
    // 用户验证失败
    const fail = () => {
      console.log('验证失败');
    };

      return {
        configInfo,
        flag,
        flagType,
        changeView,//切换隐藏、显示密码
        capsVisible,
        handleCapsStatus,
        handleCapsStatusOut,
        isShow,//验证码
        success,
        close,
        fail,
        rules,
        ruleFormRef,
        ruleForm,
        buttonStatus,
        submit //submitForm,
      };
    },
  });
  </script>
  
  <style lang="scss" scoped>

.login-root {
    overflow-x: hidden;
    width: 100%;
    min-height: 100vh;
    background: radial-gradient(circle at 10% 10%, rgba(245, 164, 227, 0.4) 10%, transparent 10.2%) fixed, radial-gradient(circle at 10% 10%, rgb(255, 255, 255) 10%, transparent 10.2%), radial-gradient(circle at 90% 85%, rgba(94, 226, 255, 0.4) 20%, transparent 20.2%), radial-gradient(circle at 90% 85%, white 20%, transparent 20.2%), linear-gradient(200deg, rgb(94, 226, 255) 0%, rgb(245, 164, 227) 60%);
    transition: background 0.5s ease 0s;
}

  .login-wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: hidden;
  background-color: var(--el-color-primary-light-5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.theme-btn {
  position: absolute;
  right: 100px;
  top: 50px;
  z-index: 9;
}
// 背景
.back-wrap {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1;
  background: var(--el-color-primary-light-9);
  .bg-item {
    position: absolute;
    &.left {
      bottom: 0;
      left: 0;
      filter: drop-shadow(5px 0 20px rgba(0, 0, 0, 0.1));
    }
    &.right {
      bottom: 0;
      right: 0;
      filter: drop-shadow(-5px 0 20px rgba(0, 0, 0, 0.2));
    }
    &.one {
      border-bottom: 50vh solid var(--el-color-primary-light-3);
      border-right: 60vw solid transparent;
      z-index: 6;
    }
    &.two {
      border-bottom: 70vh solid var(--el-color-primary-light-5);
      border-left: 80vw solid transparent;
      z-index: 5;
    }
    &.three {
      border-bottom: 90vh solid var(--el-color-primary-light-7);
      border-right: 90vw solid transparent;
      z-index: 4;
    }
    &.four {
      border-bottom: 110vh solid var(--el-color-primary-light-8);
      border-left: 110vw solid transparent;
      z-index: 3;
    }
  }
}
.loogin-container {
  padding: 20px;
  position: relative;
  z-index: 2;
}
.login-title {
  color: var(--color-primary);
  font-size: 36px;
  text-align: center;
  font-weight: normal;
}
.bottom-title {
  color:gray;
  font-size: 12px;
  text-align: center;
  font-weight: normal;
}
.form-wrap {
  width: 40vw;
  margin: 0 auto;
  margin-top: 5vh;
  color: var(--color-text-2);
  :deep(.el-input__wrapper) {
    border-radius: 5px;
    border: 1px solid var(--el-color-primary-light-3);
    outline: none;
    box-shadow: none;
    &.is-focus,
    &:hover {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
    }
  }
  :deep(.el-input__prefix) {
    color: var(--color-text-2);
  }
  :deep(.el-input__inner) {
    // color: var(--color-text-2);
    // outline: none;
    height: 40px;
    width: 10vw;
  }
}

.other-wrap {
  width: 400px;
  margin: 0 auto;
  margin-top: 10px;
  text-align: right;
}

.login-btn {
  width: 400px;
  height: 40px;
  // font-size: 16px;
  display: block;
  margin: 20px auto;
}

  </style>
  