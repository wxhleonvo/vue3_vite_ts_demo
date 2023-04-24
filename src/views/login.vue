<template>
    <div class="login-main">
      <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px" class="ruleForm">
        <el-form-item prop="user">
          <el-input :prefix-icon="User" v-model="ruleForm.user" clearable />
        </el-form-item>
        <el-form-item prop="pass">
          <el-input :prefix-icon="Lock" v-model="ruleForm.pass" type="password" />
        </el-form-item>
        <el-form-item prop="code">
          <el-input :prefix-icon="Lock" v-model="ruleForm.code" class="code-value" />
          <img :src="img" alt="" class="code-img">
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
   
  <script setup lang='ts'>
  // 方法引入
  import { reactive, ref, onMounted } from 'vue'
  import router from '@/router';
  import { setLocalStorage } from "@/utils/localstorage";
  import type { FormInstance } from 'element-plus'
  // 组件引入
  import { User, Lock } from '@element-plus/icons-vue'
  // 接口引入
  import { captchaImage, login } from "@/api/login";
 
  /*
  onMounted(() => {
    captchaImage().then(datas => {
      console.log(datas)
      img.value = 'data:image/gif;base64,' + datas.img
      uuid.value = datas.uuid
    })
  })
  */

  let img = ref<any>("")
  let uuid = ref<string>("")
  const ruleFormRef = ref<FormInstance>()
  const validateUser = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('用户名不能为空'))
    } else {
      callback()
    }
  }
  const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('密码不能为空'))
    } else {
      callback()
    }
  }
  const validateCode = (rule: any, value: any, callback: any) => {
    if (value === '') {
      callback(new Error('验证码不能为空'))
    } else {
      callback()
    }
  }
  const ruleForm = reactive({
    user: 'superadmin',
    pass: 'afcc59d7787fc831e52a591b158151a0',
    code: '4'
  })
  const postData=reactive({
    LOGIN_NAME: 'superadmin',
    PASSWORD: 'afcc59d7787fc831e52a591b158151a0'
  })
   
  const rules = reactive({
    pass: [{ validator: validatePass, trigger: 'blur' }],
    user: [{ validator: validateUser, trigger: 'blur' }],
    code: [{ validator: validateCode, trigger: 'blur' }],
  })
   
  const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        login(postData)
          .then(res => {
            console.log('res',res)
            if(res.Code===200)
              setLocalStorage("myToken", res.Data.AccessToken.TokenContent)
            //router.push("/")
          })
          .catch(err => {
            throw new Error(err);
          })
      } else {
        return false
      }
    })
  }
   
  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
  }
  </script>
   
  <style lang="scss" scoped>
  .login-main {
    display: flex;
    padding: 25px;
   
    .ruleForm {
      width: 500px;
   
      .code-value {
        width: 260px;
      }
   
      .code-img {
        margin-left: 10px;
        width: 75px;
        height: 30px;
      }
    }
  }
  </style>