<!--
  <template>
  <router-view />
</template>
-->
<!--https://blog.csdn.net/weixin_57677300/article/details/128385003?spm=1001.2101.3001.6650.4&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-4-128385003-blog-118226206.235%5Ev36%5Epc_relevant_default_base3&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-4-128385003-blog-118226206.235%5Ev36%5Epc_relevant_default_base3&utm_relevant_index=5-->
<template>
  <router-view v-slot="{ Component }">
   <transition name="fade" mode="out-in" appear>
      <keep-alive>
         <component :is="Component" />
      </keep-alive>
   </transition>
</router-view>
</template>
 <style scoped>
 /* 路由切换动画 */
/* fade-transform */
.fade-leave-active,
.fade-enter-active {
  transition: all 0.5s;
}
 
/* 可能为enter失效，拆分为 enter-from和enter-to */
.fade-enter-from {  
  opacity: 0;
  transform: translateY(-30px);
}
.fade-enter-to { 
  opacity: 1;
  transform: translateY(0px);
}
 
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
 </style>