import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Loading } from 'react-vant';
import ProtectedRoute from './components/ProtectedRoute';

// 懒加载页面组件
const Home = React.lazy(() => import('./pages/Home'));
const Community = React.lazy(() => import('./pages/Community'));
const AIAssistant = React.lazy(() => import('./pages/AIAssistant'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Search = React.lazy(() => import('./pages/Search'));
const Login = React.lazy(() => import('./pages/Login'));

// 加载中组件
const PageLoading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Loading size="24px" />
  </div>
);

function App() {
  return (
    <ConfigProvider
      themeVars={{
        primaryColor: '#ff6b35',
        buttonPrimaryBackground: '#ff6b35',
        buttonPrimaryBorderColor: '#ff6b35',
        cardRadius: '8px',
        borderColor: '#eeeeee',
        textColor: '#222222',
        textColor2: '#666666',
        fontSizeMd: '14px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
      }}
    >
      <div className="App">
        <BrowserRouter>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              {/* 首页 - 公开访问 */}
              <Route path="/" element={<Home />} />
              
              {/* 登录页 - 公开访问 */}
              <Route path="/login" element={<Login />} />
              
              {/* 需要登录的页面 */}
              <Route path="/search" element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              } />
              
              <Route path="/community" element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } />
              
              <Route path="/ai-assistant" element={
                <ProtectedRoute>
                  <AIAssistant />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* 默认重定向到首页 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </div>
    </ConfigProvider>
  )
}

export default App