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
          <el-form-item label="角色名称" prop="NAME">
            <el-input v-model="listQuery.NAME" />
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="resetSearch">重置</el-button>
            <el-button type="primary" @click="searchHandle">查询</el-button>
            <!-- 添加角色 -->
            <el-button type="success" @click="showModal()" v-permission="'sys:role:add'">添加角色</el-button>
          </el-form-item>
        </el-form>
      </div>
      
  
      <!-- 角色列表 -->
      <el-table
        :data="datalist"
        :border="true"
        row-key="_id"
        v-loading="isLoading"
        style="margin-top: 20px"
      >
        <el-table-column prop="NAME" label="角色名称"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              @click="showModal(row)"
              v-permission="'sys:role:edit'"
              v-if="row.NAME !== globalProperties.superAdminRole"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定删除吗?"
              @confirm="deleteHandle(row.CODE)"
              v-if="row.NAME !== globalProperties.superAdminRole"
            >
              <template #reference>
                <el-button link type="primary" v-permission="'sys:role:delete'"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
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
      <!-- 新增角色弹窗 -->
      <role-modal
        ref="roleModalRef"
        @reloadList="getDataListHandle"
        :menuData="menuData"></role-modal>
      
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import roleModal from './edit.vue'
  import { getRoleList, deleteRole } from 'src/api/sysRole'
  import { getAllmenuList } from 'src/api/sysMenu'
  //import { arrToTree } from 'src/utils/util'
  import useGetGlobalProperties from 'src/utils/global'
  const globalProperties = useGetGlobalProperties()
  
  onMounted(() => {
    getDataListHandle();
    getMenuListHandle();
  })
  
  // 获取菜单列表
  const menuData = ref<Array<any>>()
  const getMenuListHandle = () => {
    getAllmenuList().then((res) => {
      menuData.value = res.Data
      //menuData.value = arrToTree({ list: res.data })
    })
  }

  // 分页
  const handleCurrentChange = (val: number) => {
    listQuery.CurrentPage = val
    getDataListHandle()
  }

  // 展示新增、编辑弹窗
  const roleModalRef = ref()
  const showModal = (row?: Object) => {
    roleModalRef.value.showModal(row);
  }
  
  // 获取角色列表
  const datalist = ref([])
  const dataTotal = ref(0)
  const isLoading = ref(false)
  const listQuery = reactive({
    NAME: '',
    CurrentPage: 1,
    PageSize: 10,
  })
  // 筛选
  const searchHandle = () => {
    listQuery.CurrentPage = 1
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
    //getRoleList(listQuery).then((res: { data: any }) => {
    getRoleList(listQuery).then((res) => {
      isLoading.value = false;
      datalist.value = res.Data
      dataTotal.value = res.TotalCount
    })
  }
  
  // 删除
  const deleteHandle = (_id: string) => {
    deleteRole({ CODE:_id }).then((res:any) => {
      if(res.Code===200){
        ElNotification.success({
          title: '成功',
          message: '删除成功',
        });
        getDataListHandle();
      }
    })
  }
  </script>
  <style scoped></style>
  