import request from 'src/utils/request'

//获得所有菜单资源
export const getRoleList = (data: any) => {
    return request.post("/SysRole/GetList",data);
}

// 添加角色
export function createRole(data: any): any {
    return request.post("/SysRole/Add",data);
}

// 更新角色信息
export function updateRole(data: any): any {
    return request.post("/SysRole/Edit",data);
}

// 删除角色
export function deleteRole(data: any): any {
    return request.post("/SysRole/Del",data);
}

//根据角色code获得所有菜单资源
export const getMenuListByRole = (data: any) => {
    return request.post("/SysRole/GetRoleMenuList",data);
}