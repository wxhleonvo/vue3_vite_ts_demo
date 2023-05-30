<template>
    <el-drawer :title="modalName" v-model="addVisible" @close="modalClose" :size="proxy.$getElDrawerWidth.value">
      <el-form
        :model="formContent"
        label-width="140px"
        :rules="rules"
        ref="addFormRef"
      >
        <el-form-item label="选择类型：" prop="menuType">
          <el-radio-group v-model="formContent.TYPE">
            <el-radio
              v-for="(value, key) in menuTypeDic"
              :label="key"
              :key="key"
              >{{ value }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="menuTypeDic[formContent.TYPE] + '名称：'" prop="NAME">
            <el-input v-model="formContent.NAME"></el-input>
        </el-form-item>

        <el-form-item label="访问路径：" v-if="formContent.TYPE === '1'" prop="URL">
          <el-input v-model="formContent.URL"></el-input>
        </el-form-item>

        <el-form-item label="模板组件路径：" v-if="formContent.TYPE === '1'" prop="COMPONENT">
          <el-input v-model="formContent.COMPONENT"></el-input>
        </el-form-item>

        <el-form-item label="父级菜单：">
          <el-tree-select
            v-model="formContent.PARENT_CODE"
            :data="menuList"
            check-strictly
            placeholder="请选择"
            :props="{
              children: 'Children',
              label: 'NAME',
              value: 'CODE',
            }"
            :render-after-expand="false"
          />
          <!-- <el-input v-model="formContent.PARENT_CODE"></el-input> -->
        </el-form-item>

        <el-form-item label="权限标识：" v-if="formContent.TYPE === '2'" prop="PERMISSION">
          <el-input v-model="formContent.PERMISSION"></el-input>
        </el-form-item>    
        
        <el-form-item label="图标：" v-if="formContent.TYPE !== '2'" prop="ICON">
            <ElIconPicker v-model="formContent.ICON"></ElIconPicker>
        </el-form-item>
        
        <el-form-item label="排序：" prop="SORT_ID">
          <el-input v-model="formContent.SORT_ID"></el-input>
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

  import { createMenu, updateMenu } from 'src/api/sysMenu'
  import { ElNotification } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  //import iconNames from 'src/assets/icons';
  import ElIconPicker from 'src/components/el-icon-picker.vue';//图标选择器
  import {
    menuTypeDic,
    menuHideDic
  } from 'src/dictionary/menu';

  //赋值el-drawer的宽度
/*  import useElDwawerWidth from 'src/utils/elDraserWidth';
  const { getElDrawerWidth } = useElDwawerWidth();
*/
  //全局方法使用：建议用这种方式来解构出proxy
  import useCurrentInstance from "src/utils/useCurrentInstance";
  const { proxy } = useCurrentInstance();
  //console.log(proxy);
  
  defineProps(['menuList']);
  // 添加菜单
  const addVisible = ref(false)
  const formContent = reactive<any>({
    CODE:-1,
    TYPE: menuTypeDic.default, // 菜单类型
    NAME: '',
    URL: '',
    COMPONENT: '',
    ICON: '',
    SORT_ID: 0,
    IS_SHOW: menuHideDic.default,
    PARENT_CODE: '',
    PERMISSION: '',
    IS_SYSTEM:1
  })
  const menuId = ref()
  
  const checkMenuIcon = (icon: string) => {
    formContent.icon = icon
  }
  
  const modalName = ref()
  
  const addFormRef = ref<FormInstance>();
  // 验证规则
  const rules = reactive<FormRules>({
    NAME: [
      {
        required: true,
        message: '请输入名称',
        trigger: ['blur', 'change'],
      },
    ],
    URL: [
      {
        required: true,
        message: '请输入访问路径',
        trigger: ['blur', 'change'],
      },
    ],
    COMPONENT: [
      {
        required: true,
        message: '请输入模板组件地址',
        trigger: ['blur', 'change'],
      },
    ],
    PARENT_CODE: [
      {
        required: true,
        message: '请选择父级菜单',
        trigger: ['blur', 'change'],
      },
    ],
    PERMISSION: [
      {
        required: true,
        message: '请输入权限标识',
        trigger: ['blur', 'change'],
      },
    ],
    ICON: [
      {
        required: true,
        message: '请选择图标',
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
    SORT_ID: [
      {
        required: true,
        message: '请输入序号(整数)',
        trigger: ['blur', 'change'],
      },
    ],
  })
  
  //显示增加、修改、删除 弹窗
  const showPop = async (row: any) => {
    addVisible.value = true
    await nextTick();
    row && (formContent.TYPE = row.TYPE);
    await nextTick()
    if (row) {
      Object.keys(formContent).forEach((key) => {
        formContent[key] = row[key];
        //formContent[key] = row[key] || formContent[key];
        //console.log(key,row[key],formContent[key]);
      });
      //console.log('row',row);
      if (row.CODE) {
        
        menuId.value = row.CODE
        modalName.value = '编辑菜单';
        formContent.TYPE = formContent.TYPE.toString();//数字转换字符类型
        formContent.IS_SHOW = formContent.IS_SHOW.toString();//数字转换字符类型
        if(row.PARENT_CODE===0)
            formContent.PARENT_CODE='';
      } else {
        modalName.value = '添加菜单'
        menuId.value = ''
        if(formContent.TYPE)
          formContent.TYPE = formContent.TYPE.toString();//数字转换字符类型
      }
    } else {
      modalName.value = '添加菜单';
      menuId.value = '';    
      formContent.TYPE='0'; 
      formContent.PARENT_CODE=''; 
    }
    //console.log('formContent',formContent);
  }
  
  const emit = defineEmits(['reloadList']);
  
  const isLoading = ref(false)
  const submitForm = (formEl: FormInstance | undefined) => {
    formEl?.validate().then(() => {
      let _api: Function;
      
      //未选择父节点时，则赋值父节点为0
      if(formContent.PARENT_CODE==='')
        formContent.PARENT_CODE=0;

      formContent.IS_SHOW = formContent.IS_SHOW === '1'?1:0;
        

      let sendDate: any = {
        ...formContent,
      };
      
      //修改
      if (menuId.value) {
        _api = updateMenu;
        sendDate._id = menuId.value;
      } else {
        _api = createMenu;//新增
      }

      isLoading.value = true
      _api(sendDate).then(() => {
        isLoading.value = false
  
        ElNotification.success({
          title: '成功',
          message: modalName.value + '成功',
        })
        addVisible.value = false
        emit('reloadList')
        // getMenuListHandle()
      })
    })
  }
  
  const modalClose = () => {
    addFormRef.value?.resetFields()
  }
  
  defineExpose({
    showPop,
  })
  </script>
  <style lang="scss" scoped>
  .icon-list {
    display: flex;
    flex-wrap: wrap;
    height: 300px;
    overflow: auto;
    list-style: none;
    li {
      width: 50px;
      height: 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 5px;
      cursor: pointer;
      &:hover {
        background-color: #f5f5f5;
      }
      &.activeIcon {
        background-color: #e6f7ff;
      }
      .icon-name {
        font-size: 12px;
        margin-top: 5px;
        @include globalScss.text-overflow(1);
      }
    }
  }
  </style>
  