import request from 'src/utils/request';
//import $http from '@/utils/httpInterceptor';

export const captchaImage = () => {
  return request.get('/api/captchaImage');
};
export const login = (params?: any) => {
  console.log('params',params);
  return request.post('/Token/GetToken',params);
};

// 导入问题
export function leadProblem(obj?: any) {
    return request.post(
      '/api/Token/GetToken',
      obj,
    )
  }

