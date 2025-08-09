import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';

const SearchHeader = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search'); // Assuming a search page exists
  };

  const handleUserClick = () => {
    navigate('/profile');
  };

  return (
    <div className={styles.searchHeader}>
      <div className={styles.searchBox} onClick={handleSearchClick}>
        <span className={styles.searchIcon}>🔍</span>
        <span className={styles.placeholder}>搜索你想要的商品</span>
      </div>
      <div className={styles.userAvatar} onClick={handleUserClick}>
        <span className={styles.avatarText}>用</span>
      </div>
    </div>
  );
};

export default SearchHeader;