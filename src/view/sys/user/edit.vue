<template>
    <el-drawer :title="modalName" v-model="addVisible" @close="modalClose" :size="proxy.$getElDrawerWidth.value">
      <el-form
        :model="formContent"
        label-width="100px"
        :rules="rules"
        ref="addFormRef"
      >
      <el-form-item label="用户姓名：" prop="NAME">
          <el-input
            v-model="formContent.NAME"
            placeholder="请输入姓名"
          ></el-input>
      </el-form-item>  
      <el-form-item label="登录账号：" prop="LOGIN_NAME">
          <template #label>
            <span>登录账号：</span>
            <el-tooltip
              effect="dark"
              content="账号可用于登录，具有唯一性"
              placement="top"
            >
              <svg-icon
                name="tishi"
                style="display: block; height: 100%"
              ></svg-icon>
            </el-tooltip>
          </template>
          <el-input
            v-model="formContent.LOGIN_NAME"
            placeholder="请输入登录账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码：" prop="PASSWORD_MW" v-if="menuId===''" >
                <el-tooltip :visible="capsVisible" effect="light" content="大写锁定已打开" placement="bottom">
                <ElInput
                    size="large"
                    v-model="formContent.PASSWORD_MW"              
                    :type="flagType"
                    autocomplete="off"
                    placeholder="密码：123456"
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
  
        <el-form-item prop="MOBILE">
          <template #label>
            <span>手机号：</span>
            <el-tooltip
              effect="dark"
              content="手机号必须填写正确"
              placement="top"
            >
            <el-icon style="display: block; height: 100%"><InfoFilled /></el-icon>
            </el-tooltip>
          </template>
          <el-input
            v-model="formContent.MOBILE"
            placeholder="请输入用户手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="Role_Code_List">
          <el-select v-model="formContent.Role_Code_List" placeholder="请选择角色" multiple>
            <el-option              
              v-for="item in props.roleList"
              :key="item.CODE"
              :label="item.NAME"
              :value="item.CODE"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用：" prop="IS_SHOW">
          <el-radio-group v-model="formContent.IS_SHOW">
            <el-radio v-for="(value, key) in menuHideDic" :key="key" :label="key" >{{ value }}</el-radio>
          </el-radio-group>
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
  import { createUser, updateUser, getUserInfo } from 'src/api/sysUser'
  
  //import { ElNotification } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  //import { genderDic } from '@/dictionary/user'
  // import { QuestionFilled } from '@element-plus/icons-vue'
  import { Md5 } from 'ts-md5';
  
  import {
    menuTypeDic,
    menuHideDic
  } from 'src/dictionary/menu';


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
      if (event.getModifierState('CapsLock')) {
        capsVisible.value = true;
      } else {
        capsVisible.value = false;
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
    LOGIN_NAME: '',
    PASSWORD_MW:'',
    NAME: '',
    MOBILE: '',
    IS_SHOW: menuHideDic.default,
    Role_Code_List: []
  })
  const menuId = ref()
  
  const props = defineProps(['roleList'])
  const modalName = ref()
  
  const addFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    LOGIN_NAME: [
      {
        required: true,
        message: '请输入账号',
        trigger: ['blur', 'change'],
      },
    ],
    PASSWORD_MW: [
      {
        required: true,
        message: '请输入登录密码',
        trigger: ['blur', 'change'],
      },
    ],
    NAME: [
      {
        required: true,
        message: '请输入姓名',
        trigger: ['blur', 'change'],
      },
    ],
    MOBILE: [
      {
        required: true,
        message: '请输入手机号',
        trigger: ['blur', 'change'],
      },
    ],
    IS_SHOW: [
      {
        required: true,
        message: '请选择是否启用',
        trigger: ['blur', 'change'],
      },
    ],
    Role_Code_List: [
      {
        required: true,
        message: '请选择角色',
        trigger: ['blur', 'change'],
      },
    ],
  })
  
  const showModal = async (row: any) => {
    addVisible.value = true
    await nextTick()
    if (row) {
      Object.keys(formContent).forEach((key) => {
        formContent[key] = row[key] || formContent[key]
      })
      if (row.CODE) {
        menuId.value = row.CODE;
        modalName.value = '编辑用户';
        formContent.IS_SHOW = row.IS_SHOW?"1":"0";//数字转换字符类型
        //获得用户的角色信息
        await getUserInfo({ CODE:row.CODE }).then((res) => {
        formContent.Role_Code_List = res.Data.Role_Code_List;
      });

      } else {
        modalName.value = '添加用户'
        menuId.value = ''
      }
    } else {
      modalName.value = '添加用户'
      menuId.value = ''
    }
  }
  
  const emit = defineEmits(['reloadList'])
  
  
  const isLoading = ref(false);
  const submitForm = (formEl: FormInstance | undefined) => {
    formEl?.validate().then(() => {
      let _api: Function;
      formContent.IS_SHOW = formContent.IS_SHOW === '1'?1:0;
      let sendDate: any = {
        ...formContent,
      }
      if (menuId.value) {//修改
        _api = updateUser
        sendDate.CODE = menuId.value
      } else {//新增
        _api = createUser;
        const md5:any = new Md5();
        md5.appendAsciiStr(sendDate.PASSWORD_MW);
        sendDate.PASSWORD = md5.end();
      }
      isLoading.value = true;
    
      _api(sendDate).then((res:any) => {
        isLoading.value = false
        if(res.Code===200){
            ElNotification.success({
            title: '成功',
            message: modalName.value + '成功',
            })
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
  