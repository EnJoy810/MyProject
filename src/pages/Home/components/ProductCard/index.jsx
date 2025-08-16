import React from 'react';
import { StarO, LikeO, CartO } from '@react-vant/icons';
import { Toast } from 'react-vant';
import useCart from '@/hooks/useCart';
import styles from './style.module.css';

const ProductCard = ({ product, index }) => {
  const colors = ['#4A90E2', '#7ED321', '#F5A623']; // Blue, Green, Orange
  const bgColor = colors[index % colors.length];
  
  // 使用购物车 Hook
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const handleCardClick = () => {
    console.log('Clicked product:', product.title);
    // navigate(`/product/${product.id}`); // Future: navigate to product detail page
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    console.log('Favorited:', product.title);
  };

  // 添加到购物车
  const handleAddToCart = (e) => {
    e.stopPropagation(); // 防止触发卡片点击
    addToCart(product, 1);
    Toast.success('已添加');
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
          
          {/* 购物车按钮 */}
          <button
            className={`${styles.cartBtn} ${isInCart(product.id) ? styles.inCart : ''}`}
            onClick={handleAddToCart}
            title={isInCart(product.id) ? `已有${getItemQuantity(product.id)}件` : '加购物车'}
          >
            <CartO 
              size="16px" 
              color={isInCart(product.id) ? "#ff6b35" : "#8a8a8a"} 
            />
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