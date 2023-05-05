export interface IMenuItem {
    _id: string;//暂无意义
    rid: number;//*当前菜单id
    pid: number;//*上级菜单id，【注：pid = 0 表示当前菜单为第一层级的菜单】
    path: string;//菜单路径, 叶子节点该值有效
    name: string;//*菜单名称【注不可重复】
    icon: string;//菜单图标
    title: string//*菜单标题，显示在左边的菜单文字内容
}

export interface INavItem {
    title: string;
    path: string;
}

export interface ITreeMenuItem {
    _id: string;
    children?: ITreeMenuItem[];
    name: string | undefined;
    path: string;
    pid: number;//【注：pid = 0 表示当前菜单为第一层级的菜单】
    icon: string;
    rid: number;
    title: string;
    link?: string;
}

export interface IUserRouterItem {
    name?: string | undefined;
    path: string;
    redirect?: string;
    meta?: { icon: string };
    children?: IUserRouterItem[];
    component?: any;
}