import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Toast } from 'react-vant';
import { ArrowLeft, DeleteO } from '@react-vant/icons';
import useTitle from '@/hooks/useTitle';
import useCart from '@/hooks/useCart';
import CartItem from './components/CartItem';
import EmptyCart from './components/EmptyCart';
import BottomNavigation from '@/components/BottomNavigation';
import styles from './style.module.css';

const Cart = () => {
  useTitle('购物车');
  const navigate = useNavigate();
  const { cartItems, cartStats, clearCart, updateQuantity, removeFromCart } = useCart();

  // 返回上一页
  const handleBack = () => {
    navigate(-1);
  };

  // 清空购物车
  const handleClearCart = () => {
    clearCart();
    Toast.success('已清空');
  };

  // 去结算
  const handleCheckout = () => {
    Toast.info('暂不支持结算');
  };

  return (
    <div className={styles.container}>
      {/* 头部 */}
      <div className={styles.header}>
        <div className={styles.backButton} onClick={handleBack}>
          <ArrowLeft size="20px" color="#333" />
        </div>
        <h1 className={styles.title}>购物车</h1>
        {cartItems.length > 0 && (
          <div className={styles.clearButton} onClick={handleClearCart}>
            <DeleteO size="18px" color="#999" />
          </div>
        )}
      </div>

      {/* 购物车内容 */}
      <div className={styles.content}>
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* 商品列表 */}
            <div className={styles.cartList}>
              {cartItems.map((item) => (
                <CartItem 
                  key={item.id} 
                  product={item} 
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* 底部结算区 */}
            <div className={styles.checkoutSection}>
              <div className={styles.totalInfo}>
                <div className={styles.totalItems}>
                  共 {cartStats.totalItems} 件商品
                </div>
                <div className={styles.totalPrice}>
                  合计：<span className={styles.price}>¥{cartStats.totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <Button
                type="primary"
                size="large"
                className={styles.checkoutButton}
                onClick={handleCheckout}
              >
                结算
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 底部导航 */}
      <BottomNavigation />
    </div>
  );
};

export default Cart;