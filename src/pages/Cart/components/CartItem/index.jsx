import React from 'react';
import { Toast } from 'react-vant';
import { DeleteO } from '@react-vant/icons';
import styles from './style.module.css';

const CartItem = ({ product, onUpdateQuantity, onRemove }) => {

  // 增加数量
  const handleIncrease = () => {
    onUpdateQuantity(product.id, product.quantity + 1);
  };

  // 减少数量
  const handleDecrease = () => {
    if (product.quantity > 1) {
      onUpdateQuantity(product.id, product.quantity - 1);
    } else {
      onRemove(product.id);
    }
  };

  // 删除商品
  const handleRemove = () => {
    onRemove(product.id);
    Toast.success('已删除');
  };

  return (
    <div className={styles.cartItem}>
      {/* 商品图片 */}
      <div className={styles.productImage}>
        <div className={styles.imagePlaceholder}>
          <span className={styles.imageText}>IMG</span>
        </div>
      </div>

      {/* 商品信息 */}
      <div className={styles.productInfo}>
        <h3 className={styles.productTitle}>{product.title}</h3>
        <div className={styles.priceSection}>
          <span className={styles.currentPrice}>¥{product.price}</span>
        </div>
      </div>

      {/* 操作区域 */}
      <div className={styles.actions}>
        {/* 删除按钮 */}
        <button className={styles.deleteButton} onClick={handleRemove}>
          <DeleteO size="16px" color="#999" />
        </button>

        {/* 数量控制 */}
        <div className={styles.quantityControl}>
          <button className={styles.quantityButton} onClick={handleDecrease}>
            −
          </button>
          
          <span className={styles.quantity}>{product.quantity}</span>
          
          <button className={styles.quantityButton} onClick={handleIncrease}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;