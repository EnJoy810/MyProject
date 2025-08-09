import React, { useState, useEffect, useCallback } from 'react';
import { Loading, Tabs } from 'react-vant';
import { StarO } from '@react-vant/icons';
import useTitle from '@/hooks/useTitle';
import BottomNavigation from '@/components/BottomNavigation';
import ArticleCard from './components/ArticleCard';
import styles from './style.module.css';

const Community = () => {
  useTitle('社区');

  const [activeTab, setActiveTab] = useState('recommend');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // 模拟用户文章数据
  const mockArticles = [
    {
      id: 1,
      user: {
        id: 101,
        name: '科技达人小王',
        avatar: '👨‍💻',
        verified: true
      },
      content: '刚入手了iPhone 15 Pro Max，拍照效果真的太惊艳了！尤其是夜景模式，比我之前的安卓旗舰强太多。分享几张样片给大家看看 📸✨',
      images: ['#1', '#2', '#3'],
      timestamp: '2小时前',
      likes: 128,
      comments: 23,
      shares: 15,
      tags: ['iPhone15', '摄影', '数码评测'],
      location: '北京·三里屯'
    },
    {
      id: 2,
      user: {
        id: 102,
        name: '美妆博主Lisa',
        avatar: '💄',
        verified: true
      },
      content: '今天试了一下这款新出的口红，颜色超级显白！质地也很滋润，不会拔干。姐妹们可以冲了！',
      images: ['#1', '#2'],
      timestamp: '4小时前',
      likes: 89,
      comments: 34,
      shares: 12,
      tags: ['美妆', '口红', '种草'],
      location: '上海·静安区'
    },
    {
      id: 3,
      user: {
        id: 103,
        name: '健身教练Mike',
        avatar: '💪',
        verified: false
      },
      content: '分享一下我的健身餐，高蛋白低卡路里，味道也不错。坚持运动配合合理饮食，身材管理其实没那么难！',
      images: ['#1'],
      timestamp: '6小时前',
      likes: 156,
      comments: 18,
      shares: 8,
      tags: ['健身', '减脂餐', '生活方式'],
      location: '深圳·南山区'
    },
    {
      id: 4,
      user: {
        id: 104,
        name: '旅行摄影师Joy',
        avatar: '📷',
        verified: true
      },
      content: '西藏的星空真的太美了！这次用新买的相机拍到了银河，虽然海拔高有点累，但是看到这样的景色一切都值得了 🌌',
      images: ['#1', '#2', '#3', '#4'],
      timestamp: '8小时前',
      likes: 245,
      comments: 67,
      shares: 34,
      tags: ['旅行', '摄影', '西藏', '星空'],
      location: '西藏·拉萨'
    },
    {
      id: 5,
      user: {
        id: 105,
        name: '料理爱好者小陈',
        avatar: '👨‍🍳',
        verified: false
      },
      content: '周末在家做了红烧肉，用了奶奶传下来的秘方，肥而不腻，入口即化。配上白米饭简直绝了！分享一下制作过程~',
      images: ['#1', '#2'],
      timestamp: '12小时前',
      likes: 93,
      comments: 28,
      shares: 19,
      tags: ['美食', '家常菜', '红烧肉'],
      location: '杭州·西湖区'
    }
  ];



  // 标签页配置
  const tabs = [
    { key: 'recommend', title: '推荐' },
    { key: 'following', title: '关注' },
    { key: 'nearby', title: '附近' },
    { key: 'hot', title: '热门' }
  ];

  // 加载文章数据
  const loadArticles = useCallback(() => {
    setLoading(true);
    
    // 模拟API加载延迟
    setTimeout(() => {
      // 根据不同标签返回不同数据（这里简化处理，都返回相同数据）
      setArticles(mockArticles);
      setLoading(false);
    }, 800);
  }, [activeTab]);

  // 初始加载
  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // 处理标签切换
  const handleTabChange = (key) => {
    setActiveTab(key);
    setPage(1);
  };

  // 处理文章点赞
  const handleLike = (articleId) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, likes: article.likes + 1 }
          : article
      )
    );
  };

  // 处理文章评论
  const handleComment = (articleId) => {
    console.log('评论文章:', articleId);
    // 这里可以跳转到文章详情页或打开评论弹窗
  };

  // 处理文章分享
  const handleShare = (articleId) => {
    console.log('分享文章:', articleId);
    // 这里可以调用分享API
  };

  // 处理发布按钮
  const handlePublish = () => {
    console.log('发布新内容');
    // 这里可以跳转到发布页面
  };

  return (
    <div className={styles.container}>
      {/* 标签页导航 */}
      <div className={styles.tabsSection}>
        <Tabs 
          active={activeTab} 
          onChange={handleTabChange}
          className={styles.tabs}
        >
          {tabs.map(tab => (
            <Tabs.TabPane key={tab.key} title={tab.title} />
          ))}
        </Tabs>
      </div>

      {/* 文章列表 */}
      <div className={styles.articlesSection}>
        {loading && articles.length === 0 && (
          <div className={styles.loadingContainer}>
            <Loading size="24px" />
            <span className={styles.loadingText}>正在加载...</span>
          </div>
        )}

        {articles.map(article => (
          <ArticleCard
            key={article.id}
            article={article}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
        ))}

        {articles.length === 0 && !loading && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <div className={styles.emptyText}>暂无内容</div>
            <div className={styles.emptySubtext}>成为第一个分享的人吧</div>
          </div>
        )}
      </div>

      {/* 发布按钮 */}
      <div className={styles.publishButton} onClick={handlePublish}>
        <StarO size="24px" color="white" />
      </div>

      {/* 底部导航 */}
      <BottomNavigation />
    </div>
  );
};

export default Community;