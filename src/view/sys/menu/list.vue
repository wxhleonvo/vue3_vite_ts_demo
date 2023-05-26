<template>
    <div class="container">
      <el-button
        type="success"
        @click="showMenuPop()"
        v-permission="'sys:menu:add'"
        >添加菜单</el-button
      >
      <!-- 菜单列表 -->
      <el-table
        :data="menuList"
        :border="true"
        row-key="CODE"
        v-loading="isLoading"
        style="margin-top: 20px;"
        max-height="500"
        highlight-current-row
        header-cell-class-name="header"
        :tree-props="{ children: 'Children' }"
      >
        <el-table-column label="菜单名称" align="left" width="240">
          <template #default="{ row }">
            <span class="flex">
              <el-icon color="#0497e6" v-if="row.TYPE===0"><Folder /></el-icon>
              <el-icon color="#67c23a" v-else-if="row.TYPE===1"><Document /></el-icon>
              <el-icon color="#dd1d1d" v-else-if="row.TYPE===2"><SwitchButton /></el-icon>
              <el-icon v-else><CircleCloseFilled /></el-icon>
              {{ row.NAME}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="SORT_ID" label="排序"  width="80" align="center"></el-table-column>
        <el-table-column prop="ICON" label="图标" width="60" align="center">
          <template #default="{ row }">
            <el-icon size="15">
              <component :is="row.ICON"/>
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="URL" width="100" label="访问URL" align="left"></el-table-column>
        <el-table-column prop="COMPONENT"  width="150" label="模板组件路径" align="left" ></el-table-column>        
       
        <el-table-column label="启/禁用" width="80" align="center">
          <template #default="{ row }">
            <span class="flex">
              <el-icon color="#67c23a" v-if="row.IS_SHOW===1"><Select /></el-icon>
              <el-icon color="#ff0332" v-else><CloseBold /></el-icon>
            </span>
          </template>
        </el-table-column>        
        <el-table-column prop="PERMISSION" label="权限标识" align="center"></el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button
              type="primary"
              link
              v-show="row.TYPE !== 2"
              @click="
                showMenuPop({
                  PARENT_CODE: row.CODE,
                  TYPE: row.TYPE+1,
                })
              "
              >添加</el-button
            >
            <el-button
              link
              type="primary"
              v-permission="'sys:menu:edit'"
              @click="showMenuPop(row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="确定删除吗?"
              @confirm="deleteMenuHandle(row)"
            >
              <template #reference>
                <el-button link type="primary" v-permission="'sys:menu:delete'"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增菜单弹窗 -->
      <menu-pop
        ref="menuPopRef"
        @reloadList="getMenuListHandle"
        :menuList="menuList"
      ></menu-pop>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  import { ElNotification } from 'element-plus';
  import { getAllmenuList, deleteMenu } from "src/api/sysMenu";
  import { onMounted } from 'vue';
  //import { arrToTree } from 'src/utils/util'
  import menuPop from './edit.vue'
  import {
    menuTypeDic,
    menuHideDic,
    menuCacheDic,
    menuAffixDic,
    menuAlwaysShowDic
  } from 'src/dictionary/menu'
  
  const menuList = ref()
  const isLoading = ref(false)
  // 获取菜单列表
  const getMenuListHandle = () => {
    isLoading.value = true
    getAllmenuList().then((res) => {
      isLoading.value = false
      //console.log(res);
      //menuList.value = arrToTree({ list: res.Data })
      //menuList.value = arrToTree({ list: res.Data })
      menuList.value = res.Data
      //console.log('menuList.value',menuList.value);
    })
  }
  
  onMounted(() => {
    getMenuListHandle();
  })
  
  // 设置对话框状态，若为true则弹出，false则关闭
  const menuPopRef = ref();
  const showMenuPop = (row?: Object | undefined) => {
    menuPopRef.value.showPop(row)
  }
  
  // 删除菜单
  const deleteMenuHandle1 = (id: string) => {
    deleteMenu({ CODE: id }).then(() => {
      ElNotification.success({
        title: '成功',
        message: '删除菜单成功',
      })
      getMenuListHandle()
    })
  };

  const deleteMenuHandle = (row:any) => {
    
    if(row.Children.length>0){
        ElMessage({
          message: '当前节点存在子节点,请先删除子节点',
          type: "error",
        });
      }
    else{
      deleteMenu({ CODE: row.CODE }).then(() => {
        ElMessage({
          message: '删除菜单成功',
          type: "success",
        });
        getMenuListHandle()
      })
    }
  }
  </script>
  <style lang="scss" scoped>
 
    /* 设置表头背景色 */
  :deep(.header) {
    background-color: #eef5f557 !important;
  }


  :deep(.el-table) {
   /*解决索引不居中的问题 */
  .cell {
    display:flex;
    align-items:center;
    padding: 5px 0px;
  }

  .el-table__placeholder {
    display: none;
  }

  .is-center {
    .cell {
      font-size: 12px;
      justify-content: center;
    }
  }

  .is-left {
    .cell {
      padding-left: 10px;
      font-size: 12px;
    }
  }

  .split {
    margin-right: 7px;
  }

  .split1 {
    margin-left: 30px;
    margin-right: 7px;
  }

  /*
   替换默认展开收起图片 
   prettier-ignore 
  .el-table__expand-icon {
    width: 16PX;
    height: 16PX;
    background: url("~@assets/imgs/tree/8.png") no-repeat;
    background-size: 100% 100%;

    .el-icon {
      display: none;
    }
  }
  .el-table__expand-icon--expanded {
    transform: none;
    background: url("~@assets/imgs/tree/9.png") no-repeat;
    background-size: 100% 100%;
  }
  */
}

  </style>
  