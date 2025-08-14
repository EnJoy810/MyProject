import { 
  useState, 
  useRef,
  useEffect,
  useCallback
} from 'react';
import { Button, Input, Loading, Toast, Dialog } from 'react-vant';
import { ArrowUp } from '@react-vant/icons';
import useTitle from '@/hooks/useTitle';
import BottomNavigation from '@/components/BottomNavigation';
import useAIChatStore from '@/store/useAIChatStore';
import { shoppingAssistantChat } from '@/LLM';
import styles from './style.module.css';

const AIAssistant = () => {
  useTitle('AI购物助手');
  
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [inputHint, setInputHint] = useState('');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 使用Zustand store
  const { messages, currentSessionId, typingIndicator, addMessage, setLoading, setTypingIndicator, startNewSession, saveHistory, clearMessages } = useAIChatStore();

  // 去除快捷操作与更多菜单

  // 初始化会话
  useEffect(() => {
    if (messages.length === 0 && !currentSessionId) {
      startNewSession();
    }
  }, [messages.length, currentSessionId, startNewSession]);

  // 滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 极简发送逻辑：去掉意图分流与复杂重试，仅一次请求
  const handleSendSimple = async (messageContent) => {
    const messageHistory = messages.concat([{ role: 'user', content: messageContent }]);
    const response = await shoppingAssistantChat(messageHistory);
    if (response.code === 0) {
      addMessage(response.data);
      return true;
    }
    Toast.fail(response.msg || '发送失败');
    return false;
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
      const success = await handleSendSimple(messageContent);
      
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

  // 已移除快速操作

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 简化：仅清空当前消息作为新对话
  const handleNewSession = () => {
    clearMessages();
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

  // 已移除导出功能

  // 已移除设置功能

  return (
    <div className={styles.container}>
      {/* 简化顶部，仅显示标题与新建按钮 */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>AI 购物助手</div>
        <div className={styles.toolbarRight}>
          <Button size="small" type="default" onClick={handleNewSession} className={styles.toolbarButton}>新建对话</Button>
        </div>
      </div>

      {/* 已移除历史记录侧边栏 */}

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
            <div className={styles.messageAvatar} aria-label="assistant">AI</div>
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

      {/* 已移除快速操作区域 */}
      
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
        
        {/* 已移除输入提示 */}
        
        {/* 网络问题提示（已简化，移除重试计数） */}
      </div>
      
      {/* 全局加载指示器 */}
      {isSending && (
        <div className={styles.loadingIndicator}>
          <Loading size="20px" /> 
          <span>小购正在为您分析中...</span>
        </div>
      )}

      {/* 已移除更多菜单 */}
      
      <BottomNavigation />
    </div>
  );
};

export default AIAssistant;