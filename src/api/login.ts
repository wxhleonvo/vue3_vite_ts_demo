import request from 'src/utils/request';
//import $http from '@/utils/httpInterceptor';


export const login = (params?: any) => {
  //console.log('params',params);
  return request.post('/Token/GetToken',params);
};


