import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/api';
import { generateToken, isTokenValid } from '@/utils/jwt';

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
          const response = await api.post('/auth/login', credentials);
          const { user, token } = response.data;
          
          set({
            isAuthenticated: true,
            user,
            token,
            isLoading: false,
            error: null
          });
          
          return { success: true };
        } catch (error) {
          const message = error.response?.data?.message || '登录失败';
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