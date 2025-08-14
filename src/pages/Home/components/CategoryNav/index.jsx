import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneO, SettingO, StarO, UserO, ServiceO, HomeO } from '@react-vant/icons';
import styles from './style.module.css';

const CategoryNav = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: '数码', Icon: PhoneO },
    { id: 2, name: '家电', Icon: SettingO },
    { id: 3, name: '美妆', Icon: StarO },
    { id: 4, name: '服饰', Icon: UserO },
    { id: 5, name: '运动', Icon: ServiceO },
    { id: 6, name: '家居', Icon: HomeO },
    { id: 7, name: '图书', Icon: StarO },
    { id: 8, name: '食品', Icon: StarO }
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/category?type=${categoryId}`);
  };

  return (
    <div className={styles.categoryNav}>
      <div className={styles.categoryList}>
        {categories.map(category => (
          <div 
            key={category.id}
            className={styles.categoryItem}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className={styles.categoryIcon} aria-label="category">
              <category.Icon size="18px" color="#8a8a8a" />
            </div>
            <span className={styles.categoryText}>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;