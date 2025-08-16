import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loading } from 'react-vant';
import CardSkeleton from '@/components/Skeletons/Card.jsx';
import ProductCard from '../ProductCard';
import styles from './style.module.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  // 基础的3个商品模板
  const baseProducts = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max',
      categoryIcon: '📱',
      price: 9999,
      rating: 4.8,
      sales: 1000,
      tags: ['热销', '新品']
    },
    {
      id: 2,
      title: 'MacBook Pro M3',
      categoryIcon: '💻',
      price: 12999,
      rating: 4.9,
      sales: 500,
      tags: ['官方直营']
    },
    {
      id: 3,
      title: 'AirPods Pro 2',
      categoryIcon: '🎧',
      price: 1899,
      rating: 4.7,
      sales: 2000,
      tags: ['无线充电', '降噪']
    }
  ];

  // 生成商品数据（严格循环使用前3个商品，静态数据）
  const generateProducts = (startIndex, count) => {
    const newProducts = [];
    for (let i = 0; i < count; i++) {
      // 严格按照 0, 1, 2, 0, 1, 2... 的顺序循环
      const templateIndex = (startIndex + i) % 3;
      const baseProduct = baseProducts[templateIndex];
      
      newProducts.push({
        ...baseProduct,
        id: `${baseProduct.id}-${startIndex + i + 1}`, // 唯一ID
      });
    }
    return newProducts;
  };

  // 加载更多商品
  const fetchMore = useCallback(() => {
    if (loading) return;

    setLoading(true);

    // 模拟API延迟
    setTimeout(() => {
      const currentLength = products.length;
      const newProducts = generateProducts(currentLength, 6); // 每次加载6个商品
      setProducts(prev => [...prev, ...newProducts]);

      setLoading(false);
    }, 800);
  }, [loading, products.length]);

  // 设置Intersection Observer监听底部loader
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchMore();
      }
    });
    
    if (loader.current) {
      observer.observe(loader.current);
    }
    
    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [fetchMore]);

  // 初始加载数据
  useEffect(() => {
    fetchMore();
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* 初始骨架屏 */}
      {products.length === 0 && loading && (
        <>
          <div className={styles.column}>
            {[...Array(3)].map((_, i) => (
              <CardSkeleton key={`sk-left-${i}`} />
            ))}
          </div>
          <div className={styles.column}>
            {[...Array(3)].map((_, i) => (
              <CardSkeleton key={`sk-right-${i}`} />
            ))}
          </div>
        </>
      )}
      {/* 左列 - 偶数索引商品 */}
      {!(products.length === 0 && loading) && (
        <div className={styles.column}>
          {products.filter((_, i) => i % 2 === 0).map((product, index) => (
            <ProductCard key={`left-${product.id}-${index}`} product={product} index={0} />
          ))}
        </div>
      )}
      
      {/* 右列 - 奇数索引商品 */}
      {!(products.length === 0 && loading) && (
        <div className={styles.column}>
          {products.filter((_, i) => i % 2 !== 0).map((product, index) => (
            <ProductCard key={`right-${product.id}-${index}`} product={product} index={1} />
          ))}
        </div>
      )}
      
      {/* 底部加载器（无限滚动哨兵） */}
      <div ref={loader} className={styles.loader}>
        {loading && <Loading size="20px" />}
      </div>
      
    </div>
  );
};

export default ProductList;