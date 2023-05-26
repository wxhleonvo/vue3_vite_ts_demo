<template>
    <div class="login-content">
      <ElCard class="box-card">
        <h2 class="title">后台管理系统</h2>
        <ElForm
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          class="demo-ruleForm"
        >
          <ElFormItem prop="username">
            <ElInput
              size="large"
              v-model="ruleForm.LOGIN_NAME"
              placeholder="用户名：admin"
              autocomplete="off"
              prefix-icon="UserFilled"
              @mousedown="handleCapsStatusOut($event)"
            />
          </ElFormItem>
          <ElFormItem prop="password">
            <el-tooltip :visible="capsVisible" effect="light" content="大写锁定已打开" placement="bottom">
              <ElInput
                size="large"
                v-model="ruleForm.PASSWORD"              
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
            <ElButton style="width: 100%; height: 40px; font-size: 15px; margin-top: 10px"
              type="primary" :loading="buttonStatus.isLoging" @click="submitForm(ruleFormRef)">登录</ElButton>
          </ElFormItem>
        </ElForm>
      </ElCard>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, reactive, ref } from "vue";
  import { useRouter } from "vue-router";
  import { FormInstance } from 'element-plus'
  import { rules } from "./baseData";
  import { useLocalStorage } from "src/hooks/useLocalStorage";
  import useLoging from "src/hooks/useLoging";
  import { login } from "src/api/login";

  export default defineComponent({
    name: "Login",
    components: {},
    setup() {
      const ruleFormRef = ref();
      const router = useRouter();
      const ruleForm = reactive({
        LOGIN_NAME: "superadmin",
        PASSWORD: "afcc59d7787fc831e52a591b158151a0",
      });

      
    const flagType = ref("password");//密码框类型
    const flag = ref(true);//密码明文切换属性
    const capsVisible = ref(false);//大小写状态,默认不提示

    const buttonStatus = reactive({isLoging: false}); // 登录加载标记
    
    const { setLocalStorage,getLocalStorage } = useLocalStorage();
    const { isLoging, setLoging } = useLoging();

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
                //console.log('res',res)
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
                throw new Error(err);                
            })                        
        } else {
            return false
        }
        })
    };
    
    //切换小眼睛事件
    const changeView = () => {
      flag.value = !flag.value;
      flagType.value = flag.value ? "password" : "text";
    };
    //监听键盘大小写状态
    const handleCapsStatus = (event:any)=> {
      // 检测caps lock状态      
      if (event.getModifierState('CapsLock')) {
        capsVisible.value = true;
      } else {
        capsVisible.value = false;
      }
    }
    //关闭监听
    const handleCapsStatusOut = (event:any)=> {
      // 关闭大小写提示信息 
      capsVisible.value = false;      
    }
    /*
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

      return {
        flag,
        flagType,
        changeView,//切换隐藏、显示密码
        capsVisible,
        handleCapsStatus,
        handleCapsStatusOut,
        rules,
        ruleFormRef,
        ruleForm,
        buttonStatus,
        submitForm,
      };
    },
  });
  </script>
  
  <style lang="scss" scoped>
  .title {
    text-align: center;
  }
  .box-card {
    width: 420px;
    height: 250px;
    padding: 0px 15px 40px 15px;
    position: absolute;
    opacity: 0.85;
    top: 25%;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
  .login-content {
    width: 100%;
    height: 100vh;
    background-image: url("../../assets/images/bg.jpg") !important;
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: 100% 100%;
  }
  
  </style>
  