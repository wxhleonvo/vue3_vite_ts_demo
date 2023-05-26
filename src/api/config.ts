import request from "src/utils/request";
 
export const getConfig = () => {
    return request.post("/Config/Get");
}