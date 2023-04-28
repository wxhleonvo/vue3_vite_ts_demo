import request from "src/utils/request";
 
export const testApi = () => {
    //return request.get("/api/Config/Get")
    return request.post("/Config/Get")
}

//获得当前用户的路由菜单信息
export const GetMyRoutes = () => {
    return request.post('/api/User/GetUserMenuList');
  };
