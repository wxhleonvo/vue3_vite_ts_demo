<template>
    <el-drawer :title="modalName" v-model="addVisible" @close="modalClose" :size="proxy.$getElDrawerWidth.value">
      <el-form
        :model="formContent"
        label-width="100px"
        :rules="rules"
        ref="addFormRef"
      >
        <el-form-item label="角色名称：" prop="NAME">
          <el-input
            v-model="formContent.NAME"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色权限：" prop="gender">
          <el-tree
            ref="menuTreeRef"
            :data="props.menuData"
            :props="defaultProps"
            show-checkbox
            node-key="CODE"
          />
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
  import { createRole, updateRole, getMenuListByRole } from 'src/api/sysRole'
  import { ElNotification } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  
  //全局方法使用：建议用这种方式来解构出proxy
  import useCurrentInstance from "src/utils/useCurrentInstance";
  const { proxy } = useCurrentInstance();

  // 菜单数据
  const props = defineProps(['menuData'])
  const defaultProps = {
    children: 'Children',
    label: 'NAME',
  }
  
  // 添加角色
  const addVisible = ref(false)
  const formContent = reactive<{ [key: string]: string }>({    
    NAME: '',
  })
  const menuId = ref()
  
  const modalName = ref('')
  
  const addFormRef = ref<FormInstance>()
  const rules = reactive<FormRules>({
    NAME: [
      {
        required: true,
        message: '请输入角色名称',
        trigger: ['blur', 'change'],
      },
    ],
  })
  
  // 展示弹窗
  const menuTreeRef = ref<any>()
  const showModal = async (row: any) => {
    addVisible.value = true;
    await nextTick();
    if (row) {
      Object.keys(formContent).forEach((key) => {
        formContent[key] = row[key] || formContent[key]
      });
      
      //this.$refs.elTree.setCheckedKeys([]);

      //清空树形菜单的所有选中的节点
      menuTreeRef.value.setCheckedKeys([]);
      //获得当前角色对应的菜单信息
      await getMenuListByRole({ CODE:row.CODE }).then((res) => {
        const arr = res.Data; 
        arr.map((item: any) => {
            //获取该id对应的tree节点
            let node = menuTreeRef.value.getNode(item.MENU_CODE);
            menuTreeRef.value.setChecked(node, true);
        })
      });
      //console.log('menuTreeRef',menuTreeRef.value);    
      menuId.value = row.CODE
      modalName.value = '编辑角色'
    } else {
      //清空树形菜单的所有选中的节点
      menuTreeRef.value.setCheckedKeys([]);
      modalName.value = '添加角色'
      menuId.value = ''
    }
  }
  
  const emit = defineEmits(['reloadList'])
  
  const isLoading = ref(false)
  const submitForm = (formEl: FormInstance | undefined) => {
    formEl?.validate().then(() => {
      // 获取选中的菜单key
      const checkedKeys = menuTreeRef.value.getCheckedKeys()
      const halfCheckedKeys = menuTreeRef.value.getHalfCheckedKeys()
      const allKeys = [...checkedKeys, ...halfCheckedKeys]
        
      let _api: Function
      let sendDate: any = {
        ...formContent,
        //role_permission: allKeys.join(','),
        Menu_Code_List:allKeys
      }

      //console.log('sendDate',sendDate);

      // 修改
      if (menuId.value) {
        _api = updateRole
        sendDate.CODE = menuId.value
      } else { // 新增
        _api = createRole
      }

      isLoading.value = true;
      _api(sendDate).then(() => {
        isLoading.value = false;
  
        ElNotification.success({
          title: '成功',
          message: modalName.value + '成功',
        });
        addVisible.value = false;
        emit('reloadList');
        // getMenuListHandle()
      });
    })
  }
  
  const modalClose = () => {
    addFormRef.value?.resetFields()
  }
  
  defineExpose({
    showModal,
  })
  </script>

  