<template>
    <div class="container">
      <!-- 筛选 -->
      <div class="search-wrap">
        <el-form
          :inline="true"
          :model="listQuery"
          class="demo-form-inline"
          ref="searchForm"
        >
          <el-form-item label="NAME" prop="NAME">
            <template #label>
              <span style="margin-right: 5px">姓名</span>
              <el-tooltip
                effect="dark"
                content="请输入用户姓名"
                placement="right"
              >
                <el-icon style="display: block; height: 100%"><InfoFilled /></el-icon>
              </el-tooltip>
            </template>
            <el-input v-model="listQuery.NAME" />
          </el-form-item>
          <el-form-item label="账号" prop="LOGIN_NAME">
            <el-input v-model="listQuery.LOGIN_NAME" />
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="resetSearch">重置</el-button>
            <el-button type="primary" @click="searchHandle">查询</el-button>
            <el-button type="success" @click="showModal()" v-permission="'sys:staff:add'">添加用户</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 员工列表 -->
      <el-table
        :data="datalist"
        :border="true"
        row-key="CODE"
        v-loading="isLoading"
        style="margin-top: 20px"
      >
        <el-table-column prop="NAME" label="姓名"></el-table-column>
        <el-table-column prop="LOGIN_NAME" label="登录账号"></el-table-column>
        <el-table-column prop="MOBILE" label="手机号码"></el-table-column>
        <el-table-column label="启/禁用" width="80" align="center">
          <template #default="{ row }">
            <span class="flex">
              <el-icon color="#67c23a" v-if="row.IS_SHOW"><Select /></el-icon>
              <el-icon color="#ff0332" v-else><CloseBold /></el-icon>
            </span>
          </template>
        </el-table-column> 
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button
              link
              type="primary"
              @click="showModal(row)"
              v-permission="'sys:staff:edit'"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定删除吗?"
              @confirm="deleteHandle(row.CODE)"
              v-if="row.LOGIN_NAME !== globalProperties.superAdmin"
            >
              <template #reference>
                <el-button link type="primary">删除</el-button
                >
              </template>
            </el-popconfirm>
            <el-button
              link
              type="danger"
              @click="showResetPwdModal(row)"
              v-permission="'sys:staff:edit'"
              >重置密码</el-button
            >

            <el-button
              link
              type="danger"
              @click="changeStatusHandle(row._id, '2')"
              v-if="row.LOGIN_NAME !== globalProperties.superAdmin"
              v-show="row.status === '2'"
              v-permission="'sys:staff:forbidden'"
              >禁用</el-button
            >
            <el-button
              link
              type="success"
              @click="changeStatusHandle(row._id, '1')"
              v-show="row.status === '2'"
              v-permission="'sys:staff:unban'"
              >启用</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px; display: flex; justify-content: flex-end"
        :page-size="listQuery.PageSize"
        background
        hide-on-single-page
        layout="prev, pager, next"
        :total="dataTotal"
        @current-change="handleCurrentChange"
      />
      <!-- 新增员工弹窗 -->
      <user-modal
        ref="staffPopRef"
        @reloadList="getDataListHandle"
        :roleList="roleList"
      ></user-modal>
      <!-- 重置密码弹窗 -->
      <reset-password-modal
        ref="resetPasswordPopRef"
        @reloadList="getDataListHandle"
      ></reset-password-modal>

    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted, computed } from 'vue'
  import { getRoleList } from 'src/api/sysRole'
  import { getUserList, updateUser, deleteUser } from 'src/api/sysUser'
  import userModal from './edit.vue';
  import resetPasswordModal from './resetPassword.vue';
  //import { genderDic } from '@/dictionary/user'
  //import { staffStatusDic } from '@/dictionary/staff'
  import useGetGlobalProperties from 'src/utils/global'
  const globalProperties = useGetGlobalProperties()
  
  onMounted(() => {
    getRoleListHandle();
    getDataListHandle();
  })
  
  // 获取角色列表
  const roleList = ref()
  const getRoleListHandle = async () => {
    const res = await getRoleList({ CurrentPage: 1, PageSize: 100, IS_SHOW:1 });
    roleList.value = res.Data;
    
  }
  
  // 列表回显角色名称 
  const getRoleName = computed<Function>(() => {
    return (roleId: string) => {
      const obj =
        roleList.value && roleList.value.find((item: any) => item._id === roleId)
      return obj?.role_name
    }
  })
  
  // 获取员工列表
  const datalist = ref([])
  const dataTotal = ref(0)
  const isLoading = ref(false)
  const listQuery = reactive({
    NAME: '',
    LOGIN_NAME: '',
    CurrentPage: 1,
    PageSize: 10
  })
  // 筛选
  const searchHandle = () => {
    //listQuery.PageSize = 1
    getDataListHandle()
  }
  // 重置
  const searchForm = ref()
  const resetSearch = () => {
    searchForm.value.resetFields()
    searchHandle()
  }
  const getDataListHandle = () => {
    if (isLoading.value) return
    isLoading.value = true
    //getUserList(listQuery).then((res: { data: any }) => {
    getUserList(listQuery).then((res) => {
      isLoading.value = false
      datalist.value = res.Data
      dataTotal.value = res.TotalCount
    })
  }
  
  // 分页
  const handleCurrentChange = (val: number) => {
    listQuery.PageSize = val
    getDataListHandle()
  }
  
  // 展示新增、编辑弹窗
  const staffPopRef = ref()
  const showModal = (row?: Object) => {
    staffPopRef.value.showModal(row)
  }
  
  // 启用/禁用员工
  const changeStatusHandle = (id: string, status: string) => {
    if (isLoading.value) return
    isLoading.value = true
    /*
    updateStaffStatus({ _id: id, status }).then(() => {
      ElNotification.success({
        title: '成功',
        message: '修改员工状态成功',
      })
      isLoading.value = false
      getDataListHandle()
    })
    */
  };

  // 删除
  const deleteHandle = (_id: string) => {
    deleteUser({ CODE:_id }).then(() => {
      ElNotification.success({
        title: '成功',
        message: '删除成功',
      })
      getDataListHandle()
    })
  }

  //resetPasswordPopRef
  const resetPasswordPopRef = ref()
  const showResetPwdModal = (row?: Object) => {
    resetPasswordPopRef.value.showModal(row)
  }

  </script>
  <style scoped>
  .icon {
    color: aqua;
    font-size: 30px;
  }
  </style>
  