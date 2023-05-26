//动态路由 路由白名单， 设定未登录可访问的路由地址 
import {
    createRouter,
    createWebHistory,
    RouteRecordRaw,
  } from "vue-router";
  import routes from "./routers";
  import { generateRouter } from "../utils/index";
  import Routers from "./generator-routers";
  import { useLocalStorage } from "../hooks/useLocalStorage";
  import { useUserStore } from '../store/userStore'
  
  
 
  
  const router = createRouter({
    history: createWebHistory("/"),
    routes,
  });
  
  const { getLocalStorage } = useLocalStorage();
  
  //登录页面路由 name
  enum ELOGINSTATE {
    ISLOGIN = 'Login'
  }
  //定义访问白名单，存在名单的url可直接访问，无需验证权限
  const whiteList = ['/login', '/hello'];
  const checkIsExistWhiteUrl = (s:string) => { 
    //console.log('url=',s); 
    //if (whiteList.indexOf(to.path) !== -1) {
    if (whiteList.includes(s)) {
      //console.log('exist white');
      return true;
    }
    //else
    //  console.log('not exist white');
    return false;
  };

  //验证请求url，确定是否需要返回登录页面
  router.beforeEach(async (to, from, next) => {
    const store = useUserStore();
    const token = getLocalStorage("token") || false;
    const userRouters = store.userRouters;
    const uid = getLocalStorage("uid");
    

    const isExistWhiteUrl = checkIsExistWhiteUrl(to.path);

    //console.log('isExistWhiteUrl', isExistWhiteUrl); // 
    //console.log('!token>',!token);
    //console.log('to.name>',to.name);

    if(isExistWhiteUrl){ //存在白名单
      if (token && to.name === ELOGINSTATE.ISLOGIN) {
        //console.log('存在白名单,且已登录，访问登陆页面时，则直接指向管理后台首页');
        next({ path: "/" });
      }
      else{
        //console.log('存在白名单,访问非登陆页面时，打开当前输入的页面');
        next();
      }
    }
    else{//不存在白名单中
      //console.log('token',token);
      //console.log('不存在白名单,!token=',!token);
      if (!token) { // 当前无token时，清空路由，重定向至登录页面
        //console.log('不存在白名单,未登录,定向登录页面');
        store.userRouters = [];
        // 未登录 去的不是登录页面
        next({ name: ELOGINSTATE.ISLOGIN });
      }
      else { // 
        // 已登录但是没有用户菜单
        //console.log('不存在白名单,已登录,打开当前输入的页面');
        if (userRouters.length === 0) {
          await store.setUserRouters(uid);
          let newRoutes = generateRouter(store.userRouters);
          const layout = routes.find((item: RouteRecordRaw) => item.name == "Layout")!;
          layout.children = [...Routers, ...newRoutes];
          router.addRoute(layout);
          router.replace(to.path);
        }
        store.setNavList(to.fullPath);
        next();
      }
    }


  
  /*
    if (!token && to.name === ELOGINSTATE.ISLOGIN) {
      store.userRouters = [];
      // 未登录 去的是登录页面
      next();
    } else if (!token && to.name !== ELOGINSTATE.ISLOGIN) {
      // 未登录 去的不是登录页面
      next({ name: ELOGINSTATE.ISLOGIN });
    } else if (token && to.name === ELOGINSTATE.ISLOGIN) {
      // 已登录 去的是登录页面
      if (!uid) {
        next();
      } else {
        next({ path: "/" });
      }
    } else if (token && uid && to.name !== ELOGINSTATE.ISLOGIN) {
      // 已登录但是没有用户菜单
      if (userRouters.length === 0) {
        await store.setUserRouters(uid);
        let newRoutes = generateRouter(store.userRouters);
        const layout = routes.find((item: RouteRecordRaw) => item.name == "Layout")!;
        layout.children = [...Routers, ...newRoutes];
        router.addRoute(layout);
        router.replace(to.path);
      }
      store.setNavList(to.fullPath);
      next();
    } else if (!uid) {
      next({ name: ELOGINSTATE.ISLOGIN });
    }
    */
  });
  
  export default router;
