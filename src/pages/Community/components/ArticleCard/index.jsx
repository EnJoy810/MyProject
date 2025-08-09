import React, { useState } from 'react';
import { StarO } from '@react-vant/icons';
import styles from './style.module.css';

const ArticleCard = ({ article, onLike, onComment, onShare }) => {
  const [isLiked, setIsLiked] = useState(false);

  // 处理点赞
  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(article.id);
  };

  // 处理评论
  const handleComment = () => {
    onComment(article.id);
  };

  // 处理分享
  const handleShare = () => {
    onShare(article.id);
  };

  // 处理更多操作
  const handleMore = () => {
    console.log('更多操作:', article.id);
  };

  // 处理用户头像点击
  const handleUserClick = () => {
    console.log('查看用户:', article.user.id);
  };

  // 处理标签点击
  const handleTagClick = (tag) => {
    console.log('查看标签:', tag);
  };

  // 处理图片点击
  const handleImageClick = (imageIndex) => {
    console.log('查看图片:', imageIndex);
  };

  return (
    <div className={styles.articleCard}>
      {/* 用户信息头部 */}
      <div className={styles.userHeader}>
        <div className={styles.userInfo} onClick={handleUserClick}>
          <div className={styles.avatar}>
            {article.user.avatar}
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>
              {article.user.name}
              {article.user.verified && (
                <span className={styles.verifiedBadge}>✓</span>
              )}
            </div>
            <div className={styles.postMeta}>
              <span className={styles.timestamp}>{article.timestamp}</span>
              {article.location && (
                <>
                  <span className={styles.separator}>·</span>
                  <span className={styles.location}>📍 {article.location}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles.moreButton} onClick={handleMore}>
          <StarO size="18px" color="#999" />
        </div>
      </div>

      {/* 文章内容 */}
      <div className={styles.content}>
        <p className={styles.contentText}>{article.content}</p>
        
        {/* 标签 */}
        {article.tags && article.tags.length > 0 && (
          <div className={styles.tagsSection}>
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className={styles.tag}
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 图片网格 */}
        {article.images && article.images.length > 0 && (
          <div className={`${styles.imageGrid} ${styles[`imageGrid${article.images.length}`]}`}>
            {article.images.map((image, index) => (
              <div
                key={index}
                className={styles.imageItem}
                onClick={() => handleImageClick(index)}
              >
                <div 
                  className={styles.imagePlaceholder}
                  style={{ 
                    background: `linear-gradient(135deg, 
                      ${['#4A90E2', '#7ED321', '#F5A623', '#E94B3C'][index % 4]} 0%, 
                      ${['#357ABD', '#6BAF1A', '#D4941E', '#C73E1D'][index % 4]} 100%)`
                  }}
                >
                  <span className={styles.imageText}>IMG</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 互动按钮 */}
      <div className={styles.interactions}>
        <div className={styles.interactionButton} onClick={handleLike}>
          <StarO 
            size="20px" 
            color={isLiked ? "#ff6b35" : "#666"}
          />
          <span className={`${styles.interactionText} ${isLiked ? styles.liked : ''}`}>
            {article.likes}
          </span>
        </div>

        <div className={styles.interactionButton} onClick={handleComment}>
          <StarO size="20px" color="#666" />
          <span className={styles.interactionText}>{article.comments}</span>
        </div>

        <div className={styles.interactionButton} onClick={handleShare}>
          <StarO size="20px" color="#666" />
          <span className={styles.interactionText}>{article.shares}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;