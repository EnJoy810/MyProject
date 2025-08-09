import React from 'react';
import styles from './style.module.css';

const SearchProductCard = ({ product, index }) => {
  const colors = ['#4A90E2', '#7ED321', '#F5A623']; // Blue, Green, Orange
  const bgColor = colors[index % colors.length];

  const handleCardClick = () => {
    console.log('Clicked product:', product.title);
    // navigate(`/product/${product.id}`); // Future: navigate to product detail page
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    console.log('Favorited:', product.title);
  };



  return (
    <div className={styles.searchProductCard} onClick={handleCardClick}>
      {/* 左侧商品图片 */}
      <div className={styles.productImageContainer}>
        <div
          className={styles.productImage}
          style={{ backgroundColor: bgColor }}
        >
          <span className={styles.imageText}>IMG</span>
        </div>
      </div>

      {/* 右侧商品信息 */}
      <div className={styles.productInfo}>
        <div className={styles.productHeader}>
          <h3 className={styles.productTitle}>{product.title}</h3>
          <div className={styles.categoryIcon}>{product.categoryIcon}</div>
        </div>

        <div className={styles.priceSection}>
          <span className={styles.currentPrice}>¥{product.price}</span>
          {product.originalPrice && (
            <span className={styles.originalPrice}>¥{product.originalPrice}</span>
          )}
        </div>

        <div className={styles.metaInfo}>
          <div className={styles.ratingSection}>
            <span className={styles.stars}>⭐⭐⭐⭐⭐</span>
            <span className={styles.rating}>{product.rating}</span>
          </div>
          <span className={styles.sales}>已售{product.sales}+</span>
        </div>

        {product.tags && product.tags.length > 0 && (
          <div className={styles.tagsSection}>
            {product.tags.map((tag, i) => (
              <span key={i} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* 右侧操作按钮 */}
      <div className={styles.actionButtons}>
        <button
          className={styles.favoriteBtn}
          onClick={handleFavoriteClick}
          title="收藏"
        >
          💗
        </button>

      </div>
    </div>
  );
};

export default SearchProductCard;