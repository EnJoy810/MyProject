import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/api';

// 用户认证状态管理
const useAuthStore = create(
  persist(
    (set, get) => ({
      // 基础状态
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // 登录
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const result = await api.post('/auth/login', credentials);
          // 兼容 mock 返回结构：{ code, data: { user, token }, message }
          const isOk = result && (result.code === 200) && result.data && result.data.token && result.data.user;
          if (!isOk) {
            const message = result?.message || '登录失败';
            throw new Error(message);
          }

          const { user, token } = result.data;
          
          set({
            isAuthenticated: true,
            user,
            token,
            isLoading: false,
            error: null
          });
          
          return { success: true };
        } catch (error) {
          const message = error.message || error.response?.data?.message || '登录失败';
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            isLoading: false,
            error: message
          });
          
          return { success: false, error: message };
        }
      },

      // 退出登录
      logout: async () => {
        try {
          // 后端为幂等接口，即使失败也不影响前端清理
          await api.post('/auth/logout');
        } catch (error) {
          console.warn('退出登录请求失败:', error);
        }
        
        localStorage.removeItem('auth-store');
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
          error: null
        });
      },

      // 获取当前用户（基于后端校验 token）
      fetchCurrentUser: async () => {
        const { token } = get();
        if (!token) return { success: false };
        try {
          const res = await api.get('/user');
          // 兼容结构：{ code, data, message }
          if (res && res.code === 200 && res.data) {
            set({ user: res.data, isAuthenticated: true, error: null });
            return { success: true };
          }
          // 非 200 认为失败
          throw new Error(res?.message || '验证失败');
        } catch (err) {
          // token 失效，清理登录态
          localStorage.removeItem('auth-store');
          set({ isAuthenticated: false, user: null, token: null });
          return { success: false };
        }
      },

      // 更新用户信息
      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
          return { success: true };
        }
        return { success: false, error: '用户未登录' };
      },

      // 清除错误
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      })
    }
  )
);

export default useAuthStore;