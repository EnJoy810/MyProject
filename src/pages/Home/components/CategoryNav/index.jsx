import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';

const CategoryNav = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 1, name: '数码', icon: '📱' },
    { id: 2, name: '家电', icon: '🔌' },
    { id: 3, name: '美妆', icon: '💄' },
    { id: 4, name: '服饰', icon: '👕' },
    { id: 5, name: '运动', icon: '🏃' },
    { id: 6, name: '家居', icon: '🏠' },
    { id: 7, name: '图书', icon: '📚' },
    { id: 8, name: '食品', icon: '🍎' }
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
            <div className={styles.categoryIcon}>
              {category.icon}
            </div>
            <span className={styles.categoryText}>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;