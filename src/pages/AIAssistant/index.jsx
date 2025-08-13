import { 
  useState, 
  useRef,
  useEffect,
  useCallback
} from 'react';
import { 
  Button, 
  Input, 
  Loading, 
  Toast,
  ActionSheet,
  Dialog,
  SwipeCell
} from 'react-vant';
import { 
  ArrowUp
} from '@react-vant/icons';
import useTitle from '@/hooks/useTitle';
import BottomNavigation from '@/components/BottomNavigation';
import useAIChatStore from '@/store/useAIChatStore';
import { shoppingAssistantChat, productRecommendationChat, priceComparisonChat } from '@/LLM';
import styles from './style.module.css';

const AIAssistant = () => {
  useTitle('AI购物助手');
  
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [inputHint, setInputHint] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 使用Zustand store
  const {
    messages,
    history,
    showHistory,
    currentSessionId,
    typingIndicator,
    userPreferences,
    addMessage,
    setLoading,
    setTypingIndicator,
    startNewSession,
    saveHistory,
    toggleHistory,
    loadHistorySession,
    deleteHistory,
    clearMessages,
    clearAllHistory,
    getMessageStats
  } = useAIChatStore();

  // 强调时效性的快速操作选项
  const quickActions = [
    { emoji: '🔥', text: '2024热门商品', prompt: '推荐2024年最新热门商品，预算3000元以内' },
    { emoji: '📱', text: '最新手机推荐', prompt: '推荐2024年最新手机，预算2000-4000元' },
    { emoji: '💰', text: '实时价格对比', prompt: 'iPhone 15最新价格对比' },
    { emoji: '⚡', text: '新品分析', prompt: '2024年有哪些值得关注的新品？' },
    { emoji: '📊', text: '产品对比分析', prompt: '对比分析不同品牌的产品优缺点' },
    { emoji: '🎯', text: '今日最优推荐', prompt: '推荐当前性价比最高的数码产品，预算1000-3000元' }
  ];

  // 更多操作选项
  const actionSheetActions = [
    { name: '新建对话', action: () => handleNewSession() },
    { name: '历史记录', action: () => toggleHistory() },
    { name: '清空当前对话', action: () => handleClearMessages() },
    { name: '导出对话', action: () => handleExportChat() },
    { name: '设置', action: () => handleSettings() }
  ];

  // 初始化会话
  useEffect(() => {
    if (messages.length === 0 && !currentSessionId) {
      startNewSession();
    }
  }, [messages.length, currentSessionId, startNewSession]);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    if (userPreferences.autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [userPreferences.autoScroll]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 智能意图识别
  const detectUserIntent = (messageContent) => {
    const content = messageContent.toLowerCase();
    
    // 商品推荐意图
    if (content.includes('推荐') || content.includes('买什么') || content.includes('选择') || content.includes('哪个好')) {
      // 提取商品类别
      const categories = ['手机', '电脑', '笔记本', '耳机', '音响', '相机', '平板', '手表', '家电', '数码'];
      const category = categories.find(cat => content.includes(cat)) || '';
      
      // 提取预算信息
      const budgetMatch = content.match(/(\d+).*?元|(\d+).*?块|预算.*?(\d+)/);
      const budget = budgetMatch ? `${budgetMatch[1] || budgetMatch[2] || budgetMatch[3]}元` : '';
      
      return { type: 'recommendation', category, budget };
    }
    
    // 价格比较意图
    if (content.includes('价格') || content.includes('多少钱') || content.includes('对比') || content.includes('便宜')) {
      // 提取商品名称
      const productMatch = content.match(/(.+?)(?:价格|多少钱|对比|便宜)/);
      const productName = productMatch ? productMatch[1].trim() : '';
      
      return { type: 'price', productName };
    }
    
    // 默认通用对话
    return { type: 'general' };
  };

  // 智能重试机制 - 根据意图选择合适的API
  const handleSendWithRetry = async (messageContent, retryAttempt = 0) => {
    try {
      const intent = detectUserIntent(messageContent);
      const messageHistory = messages.concat([{ role: 'user', content: messageContent }]);
      
      let response;
      
      // 根据意图选择合适的API
      switch (intent.type) {
        case 'recommendation':
          response = await productRecommendationChat(messageHistory, intent.category, intent.budget);
          break;
        case 'price':
          response = await priceComparisonChat(messageHistory, intent.productName);
          break;
        default:
          response = await shoppingAssistantChat(messageHistory);
          break;
      }
      
      if (response.code === 0) {
        addMessage(response.data);
        setRetryCount(0);
        return true;
      } else {
        throw new Error(response.msg || 'API调用失败');
      }
    } catch (err) {
      console.error('发送失败:', err);
      
      if (retryAttempt < 2) {
        // 自动重试最多2次
        Toast.info(`发送失败，正在重试... (${retryAttempt + 1}/2)`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryAttempt + 1))); // 递增延迟
        return await handleSendWithRetry(messageContent, retryAttempt + 1);
      } else {
        // 重试失败后的处理
        const errorMsg = err.message.includes('API') ? err.message : '网络连接错误，请检查网络后重试';
        Toast.fail(errorMsg);
        setRetryCount(retryAttempt + 1);
        return false;
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) {
      Toast.info('请输入消息内容');
      inputRef.current?.focus();
      return;
    }

    const messageContent = input.trim();
    setIsSending(true);
    setLoading(true);
    
    // 添加用户消息
    addMessage({ role: 'user', content: messageContent });
    setInput('');
    
    // 显示打字指示器
    setTypingIndicator(true);
    
    try {
      const success = await handleSendWithRetry(messageContent);
      
      if (success && currentSessionId && messages.length > 0) {
        // 自动保存会话历史
        saveHistory({
          sessionId: currentSessionId,
          messages: [...messages, { role: 'user', content: messageContent }]
        });
      }
    } finally {
      setIsSending(false);
      setLoading(false);
      setTypingIndicator(false);
      inputRef.current?.focus();
    }
  };

  // 强调时效性的智能输入提示
  const getInputHint = (inputText) => {
    if (!inputText) return '';
    
    const text = inputText.toLowerCase();
    
    if (text.includes('推荐') && !text.includes('2024') && !text.includes('最新')) {
      return '💡 提示：加上"2024年最新"获得最新产品推荐，如"推荐2024年最新手机，预算3000元"';
    }
    
    if (text.includes('价格') && !text.includes('最新') && !text.includes('实时')) {
      return '💡 提示：加上"最新价格"获得实时价格信息，如"iPhone 15最新价格对比"';
    }
    
    if (text.includes('买') && !text.includes('2024')) {
      return '💡 提示：询问2024年最新购买建议，如"2024年买什么手机好"';
    }
    
    if (text.includes('推荐') && !text.includes('预算')) {
      return '💡 提示：加上预算和年份获得精准推荐，如"推荐2024年手机，预算3000元"';
    }
    
    return '';
  };

  // 处理输入变化
  const handleInputChange = (value) => {
    setInput(value);
    setInputHint(getInputHint(value));
  };

  const handleQuickAction = (action) => {
    setInput(action.prompt);
    setInputHint('');
    // 自动聚焦输入框
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 新建会话
  const handleNewSession = () => {
    if (currentSessionId && messages.length > 1) {
      // 保存当前会话
      saveHistory({
        sessionId: currentSessionId,
        messages: messages
      });
    }
    startNewSession();
    setInput('');
    Toast.success('已创建新对话');
  };

  // 清空当前对话
  const handleClearMessages = () => {
    Dialog.confirm({
      title: '确认清空',
      message: '确定要清空当前对话吗？此操作不可撤销。',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(() => {
      clearMessages();
      startNewSession();
      Toast.success('已清空对话');
    }).catch(() => {
      // 用户取消
    });
  };

  // 导出对话
  const handleExportChat = () => {
    if (messages.length === 0) {
      Toast.info('当前没有对话内容');
      return;
    }

    const chatContent = messages.map(msg => 
      `${msg.role === 'user' ? '用户' : 'AI助手'}：${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI对话记录_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    Toast.success('对话已导出');
  };

  // 设置
  const handleSettings = () => {
    Toast.info('设置功能开发中...');
  };

  return (
    <div className={styles.container}>
      {/* 顶部工具栏 */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <span className={styles.sessionInfo}>
            {currentSessionId ? `会话 ${messages.length - 1}条消息` : '新对话'}
          </span>
        </div>
        <div className={styles.toolbarRight}>
          <Button 
            size="small" 
            type="default"
            onClick={() => setShowActionSheet(true)}
            className={styles.toolbarButton}
          >
            ⚙️ 更多
          </Button>
        </div>
      </div>

      {/* 历史记录侧边栏 */}
      {showHistory && (
        <div className={styles.historyPanel}>
          <div className={styles.historyHeader}>
            <span>历史记录</span>
            <Button size="small" onClick={toggleHistory}>✕</Button>
          </div>
          <div className={styles.historyList}>
            {history.length === 0 ? (
              <div className={styles.emptyHistory}>暂无历史记录</div>
            ) : (
              history.map((item) => (
                <SwipeCell
                  key={item.id}
                  rightAction={
                    <Button 
                      square 
                      type="danger" 
                      text="删除"
                      onClick={() => deleteHistory(item.id)}
                    />
                  }
                >
                  <div 
                    className={styles.historyItem}
                    onClick={() => loadHistorySession(item.id)}
                  >
                    <div className={styles.historyTitle}>{item.title}</div>
                    <div className={styles.historyTime}>
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </SwipeCell>
              ))
            )}
          </div>
        </div>
      )}

      {/* 聊天区域 */}
      <div className={styles.chatArea}>
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={
              msg.role === 'user' ? 
              styles.messageRight : 
              styles.messageLeft
            }
          >
            <div className={styles.messageAvatar}>
              {msg.role === 'assistant' ? '🤖' : '👤'}
            </div>
            <div className={styles.messageContent}>
              <div className={styles.messageText}>{msg.content}</div>
              {msg.timestamp && (
                <div className={styles.messageTime}>
                  {new Date(msg.timestamp).toLocaleTimeString('zh-CN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* 打字指示器 */}
        {typingIndicator && (
          <div className={styles.messageLeft}>
            <div className={styles.messageAvatar}>🤖</div>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
                <span className={styles.typingText}>小购正在输入中...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 快速操作按钮 */}
      {messages.length <= 1 && !isSending && (
        <div className={styles.quickActionsArea}>
          <div className={styles.quickActionsTitle}>🔥 2024年最新服务</div>
          <div className={styles.timelinessNotice}>
            ⏰ 专注提供最新产品信息，价格实时更新
          </div>
          <div className={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className={styles.quickActionButton}
                onClick={() => handleQuickAction(action)}
              >
                <span className={styles.actionEmoji}>{action.emoji}</span>
                <span className={styles.actionText}>{action.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 输入区域 */}
      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="请输入您的问题，如：推荐2024年最新手机，预算3000元"
            className={styles.input}
            disabled={isSending}
            onKeyDown={handleKeyPress}
            type="textarea"
            autosize={{ minRows: 1, maxRows: 4 }}
          />
          <Button 
            type="primary" 
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            loading={isSending}
            className={styles.sendButton}
          >
            <ArrowUp  />
          </Button>
        </div>
        
        {/* 智能输入提示 */}
        {inputHint && (
          <div className={styles.inputHint}>
            {inputHint}
          </div>
        )}
        
        {/* 网络问题提示 */}
        {retryCount > 0 && (
          <div className={styles.networkHint}>
            💡 网络不稳定？试试重新发送或检查网络连接
          </div>
        )}
      </div>
      
      {/* 全局加载指示器 */}
      {isSending && (
        <div className={styles.loadingIndicator}>
          <Loading size="20px" /> 
          <span>小购正在为您分析中...</span>
        </div>
      )}

      {/* ActionSheet */}
      <ActionSheet
        visible={showActionSheet}
        actions={actionSheetActions}
        onCancel={() => setShowActionSheet(false)}
        onSelect={(action) => {
          action.action();
          setShowActionSheet(false);
        }}
        cancelText="取消"
      />
      
      <BottomNavigation />
    </div>
  );
};

export default AIAssistant;