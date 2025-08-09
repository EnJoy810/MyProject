// 简化的API配置
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

// 简单的请求拦截器
api.interceptors.request.use(config => {
  // 从localStorage获取token
  const authData = localStorage.getItem('auth-store');
  if (authData) {
    try {
      const { state } = JSON.parse(authData);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (e) {
      console.warn('解析token失败');
    }
  }
  return config;
});

// 简单的响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

export default api;