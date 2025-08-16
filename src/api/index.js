import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
});

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

api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

export default api;