import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input, Loading, Toast } from 'react-vant';
import { ArrowLeft, Close } from '@react-vant/icons';
import useTitle from '@/hooks/useTitle';
import SearchProductCard from './components/SearchProductCard';
import styles from './style.module.css';

// 防抖函数
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const Search = () => {
  useTitle('商品搜索');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 热门搜索词
  const hotSearches = [
    'iPhone 15', 'MacBook Pro', 'AirPods', '华为手机', 
    '小米电视', '戴森吹风机', '任天堂游戏机', '索尼耳机'
  ];

  // 基础商品数据（用于搜索结果模拟）
  const baseProducts = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max',
      categoryIcon: '📱',
      price: 9999,
      originalPrice: 10999,
      rating: 4.8,
      sales: 1000,
      tags: ['热销', '新品'],
      keywords: ['iphone', '苹果', '手机', '15', 'pro', 'max']
    },
    {
      id: 2,
      title: 'MacBook Pro M3',
      categoryIcon: '💻',
      price: 12999,
      originalPrice: 13999,
      rating: 4.9,
      sales: 500,
      tags: ['官方直营'],
      keywords: ['macbook', '苹果', '笔记本', 'pro', 'm3', '电脑']
    },
    {
      id: 3,
      title: 'AirPods Pro 2',
      categoryIcon: '🎧',
      price: 1899,
      originalPrice: 2199,
      rating: 4.7,
      sales: 2000,
      tags: ['无线充电', '降噪'],
      keywords: ['airpods', '苹果', '耳机', 'pro', '无线', '降噪']
    }
  ];

  // 搜索函数
  const performSearch = useCallback((searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    // 模拟API搜索延迟
    setTimeout(() => {
      const results = [];
      const lowerQuery = searchQuery.toLowerCase();

      // 搜索逻辑：匹配标题和关键词
      baseProducts.forEach((product, index) => {
        const titleMatch = product.title.toLowerCase().includes(lowerQuery);
        const keywordMatch = product.keywords.some(keyword => 
          keyword.toLowerCase().includes(lowerQuery)
        );

        if (titleMatch || keywordMatch) {
          // 生成多个匹配结果（模拟更多商品）
          for (let i = 0; i < 5; i++) {
            results.push({
              ...product,
              id: `${product.id}-search-${i + 1}`,
              uniqueKey: `search-${product.id}-${i + 1}-${Date.now()}`
            });
          }
        }
      });

      setSearchResults(results);
      setLoading(false);

      // 保存搜索历史
      if (searchQuery.trim()) {
        setSearchHistory(prev => {
          const newHistory = [searchQuery, ...prev.filter(item => item !== searchQuery)];
          return newHistory.slice(0, 8); // 最多保存8条历史
        });
      }
    }, 800);
  }, []);

  // 防抖搜索
  const debouncedSearch = useMemo(() => 
    debounce(performSearch, 500), [performSearch]
  );

  // 监听查询变化
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // 初始搜索（如果有URL参数）
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  // 处理搜索输入
  const handleInputChange = (value) => {
    setQuery(value);
    setShowSuggestions(!!value.trim());
  };

  // 处理搜索提交
  const handleSearch = () => {
    if (query.trim()) {
      performSearch(query);
      setShowSuggestions(false);
    }
  };

  // 清空搜索
  const handleClear = () => {
    setQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setShowSuggestions(false);
  };

  // 点击热门搜索或历史记录
  const handleQuickSearch = (searchTerm) => {
    setQuery(searchTerm);
    performSearch(searchTerm);
    setShowSuggestions(false);
  };

  // 返回上一页
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      {/* 搜索头部 */}
      <div className={styles.searchHeader}>
        <div className={styles.backButton} onClick={handleBack}>
          <ArrowLeft size="20px" color="#333" />
        </div>
        <div className={styles.searchInputWrapper}>
          <Input
            value={query}
            onChange={handleInputChange}
            onConfirm={handleSearch}
            placeholder="搜索你想要的商品"
            clearable
            onClear={handleClear}
            className={styles.searchInput}
            autoFocus
          />
        </div>
        <div className={styles.searchButton} onClick={handleSearch}>
          搜索
        </div>
      </div>

      {/* 搜索建议/历史/热门 */}
      {!hasSearched && (
        <div className={styles.searchSuggestions}>
          {/* 搜索历史 */}
          {searchHistory.length > 0 && !showSuggestions && (
            <div className={styles.historySection}>
              <div className={styles.sectionHeader}>
                <span>搜索历史</span>
                <Close 
                  size="16px" 
                  color="#999" 
                  onClick={() => setSearchHistory([])}
                />
              </div>
              <div className={styles.tagList}>
                {searchHistory.map((item, index) => (
                  <div 
                    key={index}
                    className={styles.historyTag}
                    onClick={() => handleQuickSearch(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 热门搜索 */}
          {!showSuggestions && (
            <div className={styles.hotSection}>
              <div className={styles.sectionHeader}>
                <span>热门搜索</span>
              </div>
              <div className={styles.tagList}>
                {hotSearches.map((item, index) => (
                  <div 
                    key={index}
                    className={`${styles.hotTag} ${index < 3 ? styles.hotTagHighlight : ''}`}
                    onClick={() => handleQuickSearch(item)}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 搜索结果 */}
      {hasSearched && (
        <div className={styles.searchResults}>
          {loading && (
            <div className={styles.loadingContainer}>
              <Loading size="24px" />
              <span className={styles.loadingText}>正在搜索...</span>
            </div>
          )}

          {!loading && searchResults.length > 0 && (
            <>
              <div className={styles.resultHeader}>
                找到 {searchResults.length} 个相关商品
              </div>
              <div className={styles.productGrid}>
                {searchResults.map((product, index) => (
                  <SearchProductCard
                    key={product.uniqueKey}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}

          {!loading && searchResults.length === 0 && (
            <div className={styles.emptyResults}>
              <div className={styles.emptyIcon}>🔍</div>
              <div className={styles.emptyTitle}>没有找到相关商品</div>
              <div className={styles.emptySubtitle}>
                换个关键词试试看，或者浏览热门商品
              </div>
              <div className={styles.backToHotButton} onClick={() => setHasSearched(false)}>
                浏览热门搜索
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;