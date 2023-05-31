import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs'
import { setLocalStorage, getLocalStorage } from './localstorage'
import { URL, TIMEOUT } from "src/config";
import { ElMessage, FormInstance } from 'element-plus';
import {showLoading,hideLoading } from 'src/utils/loading'

import Vrouter from "src/router";

// import { ElMessage } from 'element-plus';
//创建实例
const instance = axios.create({
    //baseURL: import.meta.env.VITE_APP_API_URL || "/api",
    baseURL: "/api", 
    timeout: TIMEOUT,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

// http request 请求拦截器
instance.interceptors.request.use(    
    (config) => {
        //ElMessage.info('请求URL='+config.baseURL);
        //ElMessage.info('请求URL import='+import.meta.env.VITE_APP_API_URL);
        //显示加载中提示
        showLoading();        
        config.headers!.AcceptLanguage = getLocalStorage("locale");
        
        const token = getLocalStorage("token") || false;        
        if (!token===false) {
            config.headers!.Authorization = 'Bearer '+getLocalStorage("token");
            //config.headers!['Authorization'] = 'Bearer ' + getLocalStorage("token");
        }        
        return config
    },
    err => {
        ElMessage.warning('请求错误'+err);
        return Promise.reject(err)
    }
)

// http response 响应拦截器
instance.interceptors.response.use(
    response => {     
        return handleData(response.data)
    },
    error => {
        //ElMessage.warning('响应错误'+JSON.stringify(error));
        //console.log('error',error);
        //隐藏加载中提示
        setTimeout(() => {
            hideLoading()
        }, 200);            
        ResponseProcessing(error);
        /*
        const errData = error.response.data
        if (errData.status === 500) {
            setLocalStorage('myToken');
            window.location.href = SOURCE_URL;
        }
        let err = errData.message;
        if (err != '' && err != null && err != undefined) {
            ElMessage({
                type: 'error',
                message: errData.message
            })
            return Promise.reject(errData)
        } else {
            ElMessage({
                type: 'error',
                message: 'HTTP：服务器遇到错误，请求失败。'
            })
        }
        */
    }
)
 
// API封装
const get = async (url: string) => {
    /**
     ......
     可以在这里自定义封装处理方法
     ......
     */
    //console.log('get url',url)
    try {
        return await instance
            .get(url)
    } catch (error) {
        return handleError(error)
    }
}
const post = async (url: string, data?: any, config?: AxiosRequestConfig<any> | undefined) => {
    /**
    ......
    可以在这里自定义封装处理方法
    ......
    */
    try {
        return await instance
            .post(url, data, config);
    } catch (error) {        
        return handleError(error);
    }
}
const deleteFn = async (url: string, config?: AxiosRequestConfig<any> | undefined) => {
    /**
    ......
    可以在这里自定义封装处理方法
    ......
    */
    try {
        return await instance
            .delete(url, config)
    } catch (error) {
        return handleError(error)
    }
}
const postJSON = async (url: string, data?: any, config?: AxiosRequestConfig<any> | undefined) => {
    /**
    ......
    可以在这里自定义封装处理方法
    ......
    */
    data = qs.stringify(data);
    try {
        return await instance
            .post(url, data, config)
    } catch (error) {
        return handleError(error)
    }
}
const patchFn = async (url: string, data?: any, config?: AxiosRequestConfig<any> | undefined) => {
    /**
    ......
    可以在这里自定义封装处理方法
    ......
    */
    try {
        return await instance
            .patch(url, data, config)
    } catch (error) {
        return handleError(error)
    }
}
// 对请求返回的错误进行自处理
function handleError(error: any) {
    return error
}
// 对响应的数据进行自处理
function handleData(data: any) {
    // 请求响应Code不为200时，弹出相关提示信息
    //console.log('data',data)
    //ElMessage.error("handleData>响应结果="+data);
    //隐藏加载中提示
    setTimeout(() => {
        hideLoading()
    }, 200);   
    
    if(data.Code!==200){        
        ElMessage.error("请求失败：Code="+data.Code+",Msg="+data.Msg);
    }
    
    return data;
}

/**
 * 响应处理
 * @param error 
 * @returns 
 */
const ResponseProcessing = (error: { code:any; message:any; response: { status: any; data: any; }; }) => {
    // console.log('error',error);
  let code = error.code;
  let msg = "【"+error.message+"】";
  if (error.response) {    
    switch (error.response.status) {
      case 400:
        ElMessage.warning("提交失败！"+msg);
        break;
      case 401:
        ElMessage.warning("资源没有访问权限！"+msg);        
        try {     
            const router = Vrouter;
            //console.log('router',router);
            //router.push('/login');
            //router.replace('/login');
            //退出，重新跳转登录页面
            localStorage.clear();
            router.go(0);
        } catch (error) {
            console.log(error);
        }
        break;
      case 404:
        ElMessage.warning("接口不存在，请检查接口地址是否正确！"+msg);
        break;
      case 500:
        ElMessage.warning("内部服务器错误，请联系系统管理员！"+msg);
        break;
      case 503:
        ElMessage.warning("code="+code+";msg="+msg);
        break;
      case 504:
        ElMessage.warning("code="+code+";msg="+msg);
        break;
      default:
        return Promise.reject(error.response.data); // 返回接口返回的错误信息
    }
  } else {
    ElMessage.error("请求异常："+msg);
  }
};


export default {
    get: get,
    post: post,
    postJSON: postJSON,
    delete: deleteFn,
    patch: patchFn
}