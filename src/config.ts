/** 环境变量 */
const ENV = import.meta.env;  // vite是以这种方式获取环境变量
 
/** 基础域名 */
//export const SOURCE_URL = ENV.VITE_SOURCE_URL;

//export const BASE_URL = ENV.VITE_BASE_API;
//export const VITE_SERVE_ADD = ENV.VITE_SERVE_ADD;

/** 基础服务地址 */
export const URL = ENV.VITE_APP_API_URL;
 
/** 超时时间 */
export const TIMEOUT = 10000;