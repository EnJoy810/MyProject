import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, UserO } from '@react-vant/icons';
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
        <SearchIcon size="16px" color="#999" className={styles.searchIcon} />
        <span className={styles.placeholder}>搜索你想要的商品</span>
      </div>
      <div className={styles.userAvatar} onClick={handleUserClick}>
        <UserO size="16px" color="#666" />
      </div>
    </div>
  );
};

export default SearchHeader;