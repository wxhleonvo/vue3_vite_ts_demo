import request from "src/utils/request";
 
//获得所有用户
export const getUserList = (data: any) => {
    return request.post("/SysUser/GetList",data);
}

// 新建用户
export function createUser(data: any): any {
    return request.post("/SysUser/Add",data);
}
  
// 修改用户
export function updateUser(data: any): any {
    return request.post("/SysUser/Edit",data);
}
  
// 删除用户
export function deleteUser(data: any): any {
    return request.post("/SysUser/Del",data);
}

//根据用户CODE获得指定用户信息
export const getUserInfo = (data: any) => {
    return request.post("/SysUser/Get",data);
}

// 修改用户密码
export function updateUserPassword(data: any): any {
    return request.post("/SysUser/EditPassword",data);
}

// 获得当前用户左边的功能菜单
export function getUserMenu(): any {
    return request.post("/SysUser/GetMyMenuList");
}
