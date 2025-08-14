import React from 'react';
import { StarO, LikeO, PhoneO, ServiceO } from '@react-vant/icons';
import styles from './style.module.css';

const SearchProductCard = ({ product, index }) => {
  const colors = ['#4A90E2', '#7ED321', '#F5A623']; // Blue, Green, Orange
  const bgColor = colors[index % colors.length];

  const renderCategoryIcon = (icon) => {
    switch (icon) {
      case '📱':
        return <PhoneO size="18px" color="#8a8a8a" />;
      case '💻':
        return <ServiceO size="18px" color="#8a8a8a" />;
      case '🎧':
        return <ServiceO size="18px" color="#8a8a8a" />;
      default:
        return <ServiceO size="18px" color="#8a8a8a" />;
    }
  };

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
          <span className={styles.imageText} aria-label="image">IMG</span>
        </div>
      </div>

      {/* 右侧商品信息 */}
      <div className={styles.productInfo}>
        <div className={styles.productHeader}>
          <h3 className={styles.productTitle}>{product.title}</h3>
          <div className={styles.categoryIcon} aria-label="category">
            {renderCategoryIcon(product.categoryIcon)}
          </div>
        </div>

        <div className={styles.priceSection}>
          <span className={styles.currentPrice}>¥{Number(product.price).toLocaleString('zh-CN')}</span>
        </div>

        <div className={styles.metaInfo}>
          <div className={styles.ratingSection}>
            <span className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <StarO key={i} size="12px" color="#ffb400" />
              ))}
            </span>
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
          <LikeO size="16px" color="#8a8a8a" />
        </button>

      </div>
    </div>
  );
};

export default SearchProductCard;