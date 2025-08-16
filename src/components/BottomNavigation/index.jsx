import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WapHomeO, FriendsO, ChatO, UserO, CartO } from '@react-vant/icons';
import useCart from '@/hooks/useCart';
import styles from './style.module.css';

const NavItem = ({ icon: IconComponent, text, isActive, onClick, badge }) => (
  <div className={`${styles.navItem} ${isActive ? styles.active : ''}`} onClick={onClick}>
    <div className={styles.iconContainer}>
      <IconComponent 
        size="20px" 
        color={isActive ? '#ff6b35' : '#666666'} 
      />
      {badge && badge > 0 && (
        <span className={styles.badge}>{badge > 99 ? '99+' : badge}</span>
      )}
    </div>
    <span className={styles.navText}>{text}</span>
  </div>
);

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartStats } = useCart();

  const navigationItems = [
    { icon: WapHomeO, text: '首页', path: '/', key: 'home' },
    { icon: FriendsO, text: '社区', path: '/community', key: 'community' },
    { icon: CartO, text: '购物车', path: '/cart', key: 'cart' },
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
          badge={item.badge}
        />
      ))}
    </div>
  );
};

export default BottomNavigation;