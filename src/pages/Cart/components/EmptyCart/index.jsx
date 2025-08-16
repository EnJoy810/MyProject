import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-vant';
import styles from './style.module.css';

const EmptyCart = () => {
  const navigate = useNavigate();

  const handleGoShopping = () => {
    navigate('/');
  };

  return (
    <div className={styles.emptyCart}>
      <div className={styles.emptyIcon}>🛒</div>
      <div className={styles.emptyTitle}>购物车空空如也</div>
      <div className={styles.emptySubtitle}>
        再逛逛，总有心动好物
      </div>
      <Button
        type="primary"
        size="large"
        className={styles.goShoppingButton}
        onClick={handleGoShopping}
      >
        随便看看
      </Button>
    </div>
  );
};

export default EmptyCart;