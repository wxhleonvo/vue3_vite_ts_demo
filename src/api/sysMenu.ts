import request from "src/utils/request";
 
//获得所有菜单资源
export const getAllmenuList = () => {
    return request.post("/Menu/GetList");
}

// 新建菜单
export function createMenu(data: any): any {
    return request.post("/Menu/Add",data);
}
  
// 修改菜单
export function updateMenu(data: any): any {
    return request.post("/Menu/Edit",data);
}
  
// 删除菜单
export function deleteMenu(data: any): any {
    return request.post("/Menu/Del",data);
}
