//加载 动态路由，根据 当前用户 权限 获得对应的菜单
import { RouteRecordRaw } from "vue-router";
import { IMenuItem, ITreeMenuItem, IUserRouterItem } from "../interface/menu";

const modules = import.meta.glob("../view/**/**.vue");

//const modules2 = import.meta.glob("src/view/frameDemo/t");

interface ICache {
  [key: number]: ITreeMenuItem
}
/**
 * @description 转换树形结构菜单
 * @param menuList 菜单列表
 * @author Wxh
 */
export const getTreeMenus = (menuList: IMenuItem[]): ITreeMenuItem[] => {
  const treeMenuList = [] as ITreeMenuItem[];
  const cache: ICache = {};
  menuList.forEach((treeItem) => {
    cache[treeItem.rid] = treeItem;
  });

  menuList.forEach((treeItem) => {
    const parent = cache[treeItem.pid];
    if (parent) {
      if (!parent.children) {
        parent.children = [] as IMenuItem[];
      }
      parent.children.push(treeItem);
    } else {
      treeMenuList.push(treeItem);
    }
  });
  return treeMenuList;
};


/**
 * @description 转化动态路由
 * @param userRouters -用户路由的树形列表
 * @author Wxh
 */
export const generateRouter = (userRouters: ITreeMenuItem[]) => {
  let newRouters: RouteRecordRaw[] = userRouters.map((router: ITreeMenuItem) => {
    //const isParent = router.pid === 0 && router.children; // 判断当前节点是否还有子节点
    const isParent = router.children; // 判断当前节点是否还有子节点
    //const fileName = router.path.match(/\/([^/]*)$/)![1];
    //console.log(router.rid,isParent);
    //console.log(router.rid,isParent);
    //console.log('router.path',router.path)
    //console.log('filename',fileName)
    const fileName = `../view${router.component}.vue` // vue文件路径, 叶子节点该属性才有效
    
    //console.log(router.rid,isParent,fileName);
    //const fileName = `../view${router.path}`
    //let d = `../view${router.path}/${fileName}.vue`

    //console.log('fileName',fileName)
    //console.log('name',router.name)
    let routes: RouteRecordRaw = {
      path: router.path||'', // URL为空的则复赋值为空字符，避免菜单加载报错
      //name: router.name,
      meta: {
        icon: router.icon,
      },
      redirect:'',
      children:[],
      //component: (resolve) => require(d),
      //component: eval(`()=>import("../view${router.path}/${fileName}.vue")`),
      component:
        modules[
          fileName
           //`../view${router.path}/${fileName}.vue`
           // `../view${router.path}.vue`
        ]
    };

    if (isParent) {
      routes.redirect = router.children![0].path;
      routes.component = () =>
        import(/* @vite-ignore */ `../components/ParentView/ParentView.vue`)
    }
    if (routes && router.children) {
      //console.log('router.children', router.children);
      routes.children = generateRouter(router.children);
    }
    return routes;
  });
  return newRouters;
};

/**
 * @description 数组扁平化
 * @param target --目标数组
 * @author Wxh
 */
export function flatter(target: any) {
  if (Array.isArray(target)) {
    let result: any = [];
    target.forEach((item) => {
      if (Array.isArray(item)) {
        result = result.concat(flatter(item));
      } else {
        result.push(item);
      }
    });
    return result;
  } else {
    return target
  }
};

/**
 * @description 深拷贝
 * @param target -目标值
 * @param map -缓存容器
 * @author Wxh
 */
export const deepClone = (target: any, map: any = new Map()) => {
  if (typeof target === 'object' && target !== null) {
    const cache = map.get(target);
    if (cache) {
      return cache;
    }
    const isArray = Array.isArray(target);
    let result: any = isArray ? [] : {};
    map.set(target, result);
    if (isArray) {
      target.forEach((item, index) => {
        result[index] = deepClone(item, map);
      })
    } else {
      Object.keys(target).forEach(key => {
        result[key] = deepClone(target[key], map);
      })
    }
    return result;
  } else {
    return target
  }
}



