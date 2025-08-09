import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WapHomeO, FriendsO, ChatO, UserO } from '@react-vant/icons';
import styles from './style.module.css';

const NavItem = ({ icon: IconComponent, text, isActive, onClick }) => (
  <div className={`${styles.navItem} ${isActive ? styles.active : ''}`} onClick={onClick}>
    <IconComponent 
      size="20px" 
      color={isActive ? '#ff6b35' : '#666666'} 
    />
    <span className={styles.navText}>{text}</span>
  </div>
);

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { icon: WapHomeO, text: '首页', path: '/', key: 'home' },
    { icon: FriendsO, text: '社区', path: '/community', key: 'community' },
    { icon: ChatO, text: 'AI助手', path: '/ai-assistant', key: 'ai-assistant' },
    { icon: UserO, text: '我的', path: '/profile', key: 'profile' }
  ];

  const handleTabChange = (path) => {
    navigate(path);
  };

  return (
    <div className={styles.bottomNavigation}>
      {navigationItems.map(item => (
        <NavItem
          key={item.key}
          icon={item.icon}
          text={item.text}
          isActive={location.pathname === item.path}
          onClick={() => handleTabChange(item.path)}
        />
      ))}
    </div>
  );
};

export default BottomNavigation;