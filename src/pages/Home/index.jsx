import React from 'react';
import useTitle from '@/hooks/useTitle';
import BottomNavigation from '@/components/BottomNavigation';
import SearchHeader from './components/SearchHeader';
import CategoryNav from './components/CategoryNav';
import ProductList from './components/ProductList';
import styles from './style.module.css';

const Home = () => {
  useTitle('首页');

  return (
    <div className={styles.container}>
      {/* Search Header */}
      <SearchHeader />

      {/* Category Navigation */}
      <CategoryNav />

      {/* Content Area */}
      <div className={styles.content}>
        {/* Product Waterfall */}
        <ProductList />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Home;