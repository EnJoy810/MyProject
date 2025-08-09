import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Button, 
  Field, 
  Form, 
  Toast, 
  Divider,
  NoticeBar 
} from 'react-vant';
import { Arrow,ArrowLeft,BullhornO,Contact } from '@react-vant/icons';
import useTitle from '@/hooks/useTitle';
import useAuthStore from '@/store/useAuthStore';
import styles from './style.module.css';

const Login = () => {
  useTitle('登录');
  
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const clearError = useAuthStore(state => state.clearError);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // 如果已经登录，重定向到目标页面或首页
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // 清除错误信息
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // 处理表单提交
  const handleSubmit = async () => {
    if (!formData.username.trim()) {
      Toast.info('请输入用户名');
      return;
    }
    
    if (!formData.password.trim()) {
      Toast.info('请输入密码');
      return;
    }

    const result = await login({
      username: formData.username,
      password: formData.password,
    });
    
    if (result.success) {
      Toast.success('登录成功');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      Toast.fail(result.error || '登录失败');
    }
  };

  // 快速登录
  const handleQuickLogin = async (username, password) => {
    setFormData({ username, password });
    
    const result = await login({ username, password });
    if (result.success) {
      Toast.success('登录成功');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } else {
      Toast.fail(result.error || '登录失败');
    }
  };

  // 演示账号列表
  const demoAccounts = [
    { username: 'admin', password: '123456', role: '管理员', desc: '拥有所有权限' },
    { username: 'user', password: '123456', role: '普通用户', desc: '基础用户权限' },
  ];

  // 返回首页
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.loginContainer}>
      {/* 头部 */}
      <div className={styles.header}>
        <ArrowLeft 
          size="20px" 
          color="#333" 
          onClick={handleBack}
          className={styles.backButton}
        />
        <h1 className={styles.title}>登录</h1>
      </div>

      {/* 登录表单 */}
      <div className={styles.formContainer}>
        <Form>
          <Field
            value={formData.username}
            onChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
            placeholder="请输入用户名"
            leftIcon={<Arrow  />}
            className={styles.field}
            clearable
          />
          
          <Field
            value={formData.password}
            onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
            type="password"
            placeholder="请输入密码"
            leftIcon={<Arrow  />}
            className={styles.field}
            clearable
          />
        </Form>

        {/* 错误信息 */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* 登录按钮 */}
        <Button
          type="primary"
          size="large"
          block
          loading={isLoading}
          onClick={handleSubmit}
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? '登录中...' : '登录'}
        </Button>

        {/* 演示账号 */}
        <Divider className={styles.divider}>演示账号</Divider>
        
        <div className={styles.quickLogin}>
          <Button
            type="default"
            size="small"
            block
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            className={styles.toggleButton}
            icon={<Contact  />}
          >
            {showDemoAccounts ? '隐藏' : '显示'}演示账号
          </Button>
          
          {showDemoAccounts && (
            <div className={styles.demoAccounts}>
              {demoAccounts.map((account, index) => (
                <div key={index} className={styles.demoAccount}>
                  <div className={styles.accountInfo}>
                    <div className={styles.accountRole}>{account.role}</div>
                    <div className={styles.accountDesc}>{account.desc}</div>
                    <div className={styles.accountCredentials}>
                      {account.username} / {account.password}
                    </div>
                  </div>
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => handleQuickLogin(account.username, account.password)}
                    disabled={isLoading}
                    className={styles.quickLoginBtn}
                  >
                    登录
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 提示信息 */}
        <NoticeBar
          leftIcon={<BullhornO  />}
          text="非登录用户只能访问首页，其他页面需要登录后访问"
          className={styles.notice}
        />
        
        <div className={styles.tips}>
          <p>• 这是一个演示项目，数据仅供测试使用</p>
        </div>
      </div>
    </div>
  );
};

export default Login;