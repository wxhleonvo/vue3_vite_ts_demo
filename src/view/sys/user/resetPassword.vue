<template>
    <el-drawer :title="modalName" v-model="addVisible" @close="modalClose" :size="proxy.$getElDrawerWidth.value">
      <el-form
        :model="formContent"
        label-width="120px"
        :rules="rules"
        ref="addFormRef"
      >
      
      <el-form-item label="新密码：" prop="PASSWORD_MW">
                <el-tooltip :visible="capsVisible" effect="light" content="大写锁定已打开" placement="bottom">
                <ElInput
                    size="large"
                    v-model="formContent.PASSWORD_MW"              
                    :type="flagType"
                    autocomplete="off"
                    placeholder="输入新密码"
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
            </el-form-item>
  
      <el-form-item label="重复新密码：" prop="PASSWORD_MW2">
                <el-tooltip :visible="capsVisible" effect="light" content="大写锁定已打开" placement="bottom">
                <ElInput
                    size="large"
                    v-model="formContent.PASSWORD_MW2"              
                    :type="flagType"
                    autocomplete="off"
                    placeholder="再次输入新密码"
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
            </el-form-item>
  
      </el-form>
      <template #footer>
        <el-button @click="addVisible = false">取消</el-button>
        <el-button
          :loading="isLoading"
          type="primary"
          @click="submitForm(addFormRef)"
          >确定</el-button
        >
      </template>
    </el-drawer>
  </template>
  
  <script setup lang="ts">
  import { ref,reactive,nextTick  } from 'vue';
  import { updateUserPassword } from 'src/api/sysUser'
  
  import type { FormInstance, FormRules } from 'element-plus'
  import { Md5 } from 'ts-md5';
  

   //全局方法使用：建议用这种方式来解构出proxy
   import useCurrentInstance from "src/utils/useCurrentInstance";
  const { proxy } = useCurrentInstance();

    const flagType = ref("password");//密码框类型
    const flag = ref(true);//密码明文切换属性
    const capsVisible = ref(false);//大小写状态,默认不提示
   //切换小眼睛事件
   const changeView = () => {
      flag.value = !flag.value;
      flagType.value = flag.value ? "password" : "text";
    };
    //监听键盘大小写状态
    const handleCapsStatus = (event:any)=> {
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


  // 添加用户
  const addVisible = ref(false)
  const formContent = reactive<any>({
    CODE: '',
    PASSWORD:'',
    PASSWORD_MW:'',
    PASSWORD_MW2: ''
  })
  const menuId = ref()
  
  const modalName = ref()
  
  const addFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    PASSWORD_MW: [
      {
        required: true,
        message: '请输入新密码',
        trigger: ['blur', 'change'],
      },
    ],
    PASSWORD_MW2: [
      {
        required: true,
        message: '请重复输入新密码',
        trigger: ['blur', 'change'],
      },
    ]
  })
  
  const showModal = async (row: any) => {
    addVisible.value = true
    await nextTick()
    if (row) {
        menuId.value = row.CODE;
        modalName.value = '重置用户密码';      
    }
  }
  
  const emit = defineEmits(['reloadList'])
  
  
  const isLoading = ref(false);
  const submitForm = (formEl: FormInstance | undefined) => {
    formEl?.validate().then(() => {
      if(formContent.PASSWORD_MW!==formContent.PASSWORD_MW2){
        ElNotification.error({
            title: '警告',
            message: '两次密码不一致',
            });
        return;
      }

      let _api: Function;
      let sendDate: any = {
        ...formContent,
      }

        sendDate.CODE = menuId.value      
        _api = updateUserPassword;
        const md5:any = new Md5();
        md5.appendAsciiStr(sendDate.PASSWORD_MW);
        sendDate.PASSWORD = md5.end();
      
      isLoading.value = true;
    
      _api(sendDate).then((res:any) => {
        isLoading.value = false
        if(res.Code===200){
            ElNotification.success({
            title: '成功',
            message: modalName.value + '成功',
            });
            addVisible.value = false
            emit('reloadList')
            // getMenuListHandle()
        }
      })
    })
  }
  
  const modalClose = () => {
    addFormRef.value?.resetFields()
  }
  
  defineExpose({
    showModal,
    flag,
    flagType,
    changeView,//切换隐藏、显示密码
    capsVisible,
    handleCapsStatus,
    handleCapsStatusOut
  })
  </script>
  <style lang="scss" scoped></style>
  