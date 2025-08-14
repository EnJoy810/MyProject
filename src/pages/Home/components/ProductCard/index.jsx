import React from 'react';
import { StarO, LikeO } from '@react-vant/icons';
import styles from './style.module.css';

const ProductCard = ({ product, index }) => {
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
    <div className={styles.productCard} onClick={handleCardClick}>
      <div className={styles.productImageContainer}>
        <div
          className={styles.productImage}
          style={{ backgroundColor: bgColor }}
        >
          <span className={styles.imageText} aria-label="image">IMG</span>
        </div>
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <div className={styles.priceSection}>
          <span className={styles.currentPrice}>¥{Number(product.price).toLocaleString('zh-CN')}</span>
        </div>
        <div className={styles.ratingSection}>
          <span className={styles.stars}>
            {[...Array(5)].map((_, i) => (
              <StarO key={i} size="12px" color="#ffb400" />
            ))}
          </span>
          <span className={styles.rating}>{product.rating}</span>
        </div>
      </div>

      <div className={styles.salesSection}>
        <span className={styles.sales}>已售{product.sales}+</span>
        <div className={styles.actions}>
          <button
            className={styles.favoriteBtn}
            onClick={handleFavoriteClick}
          >
            <LikeO size="16px" color="#8a8a8a" />
          </button>

        </div>
      </div>

      {product.tags && product.tags.length > 0 && (
        <div className={styles.tagsSection}>
          {product.tags.map((tag, i) => (
            <span key={i} className={styles.tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCard;