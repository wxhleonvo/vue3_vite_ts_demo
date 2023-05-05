//动态路由 菜单 权限 加载  当前用户 菜单
import { defineStore } from 'pinia'
import { useLocalStorage } from 'src/hooks/useLocalStorage';
import { getUserMenu } from '../apis/user';
import { IMenuItem, INavItem, ITreeMenuItem } from '../interface/menu';
import { flatter, getTreeMenus } from '../utils/index'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            test: document.querySelector('html')!.className,
            dark: false,
            menuList: [] as IMenuItem[],
            userRouters: [] as ITreeMenuItem[], // 当前返回的所有菜单及层级信息，用children表示下级
            navList: [{ title: "首页", path: "/index/home" }] as INavItem[],
            collapse: false,
        }
    },
    actions: {
        async getMenuList() {
            const { getLocalStorage } = useLocalStorage();
            this.menuList = await getUserMenu(getLocalStorage('uid')) as IMenuItem[];
            //console.log('getMenuList》getusermenu', this.menuList)
        },
        // 获取用户树形结构菜单
        async setUserRouters(uid: string) {            
            const menuList = await getUserMenu(uid) as IMenuItem[];
            this.menuList = menuList;
            //console.log('setUserRouters》getusermenu', this.menuList)
            this.userRouters = getTreeMenus(menuList);
        },

        //关闭nav导航
        closeNav(index: number) {
            this.navList.splice(index, 1);
        },

        //新增nav导航
        setNavList(path: string) {
            //console.log('setNavList path', path);
            let menuList: any[] = [];//定义所有的叶子节点数组信息
            const navItem = {} as INavItem;
            //console.log('this.menuList',this.menuList);
            //console.log('this.userRouters',this.userRouters);
            /*
            this.userRouters.forEach((item: ITreeMenuItem) => {
                menuList.push(item.children);
            });
            */
            this.menuList.forEach((item: ITreeMenuItem) => {
                if(!item.children){
                    menuList.push(item);//将叶子节点添加至数组中，后面点击菜单，与当前数组对比，确定是否打开标签页面
                }
            });

            menuList = flatter(menuList);
            //console.log('menuList',menuList);
            menuList.forEach((item: ITreeMenuItem) => {
                //console.log('===',item,path);
                if (item && item.path == path) {
                    //console.log('===',item,item.path,path);
                    navItem.title = item.title;
                    navItem.path = item.path;
                }
            });
            const isBeing = this.navList.some((item: INavItem) => item.path == navItem.path);
            //console.log('isBeing',navItem)
            if (!isBeing && navItem && navItem.path) {
                this.navList.push(navItem)
            }
        },

        //关闭当前标签和首页标签之外的所有标签
        cloneOtherNav(currrentPath: string) {
            this.navList = [{ title: "首页", path: "/index/home" }];
            this.setNavList(currrentPath);
        },

        // 黑夜模式切换
        darkSwitch() {
            const html = document.querySelector('html')!;
            if (this.dark) {
                html.className = 'dark';

            } else {
                html.className = '';
            }
        }

    }
})

