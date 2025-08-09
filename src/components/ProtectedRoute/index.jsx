import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loading } from 'react-vant';
import useAuthStore from '@/store/useAuthStore';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const location = useLocation();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const isLoading = useAuthStore(state => state.isLoading);

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
        background: '#f5f5f5'
      }}>
        <Loading size="24px" color="#667eea" />
        <span style={{ color: '#666', fontSize: '14px' }}>
          验证登录状态...
        </span>
      </div>
    );
  }

  // 如果未认证，重定向到登录页
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // 如果需要特定角色权限
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px',
        background: '#f5f5f5'
      }}>
        <div style={{ 
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#333', marginBottom: '8px' }}>权限不足</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>
            您没有访问此页面的权限
          </p>
        </div>
      </div>
    );
  }

  // 如果已认证且有权限，渲染子组件
  return children;
};

export default ProtectedRoute;