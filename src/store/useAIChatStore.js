import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAIChatStore = create(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      history: [],
      showHistory: false,
      currentSessionId: null,
      typingIndicator: false,
      lastActiveTime: null,
      userPreferences: {
        quickReplies: true,
        soundEnabled: false,
        autoScroll: true,
      },

      // 添加消息
      addMessage: (message) => {
        const timestamp = new Date().toISOString();
        const messageWithMeta = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp,
          sessionId: get().currentSessionId
        };

        set((state) => ({
          messages: [...state.messages, messageWithMeta],
          isLoading: false,
          lastActiveTime: timestamp
        }));
      },

      // 批量添加消息（用于恢复历史记录）
      addMessages: (newMessages) => {
        set((state) => ({
          messages: [...state.messages, ...newMessages]
        }));
      },

      // 设置加载状态
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // 设置打字指示器
      setTypingIndicator: (typing) => {
        set({ typingIndicator: typing });
      },

      // 开始新的会话
      startNewSession: () => {
        const sessionId = `session_${Date.now()}`;
        const currentDate = new Date().toLocaleDateString('zh-CN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        const welcomeMessage = {
          id: `welcome_${sessionId}`,
          role: 'assistant',
          content: `您好！我是您的AI购物助手"小购"，专注提供2024年最新的购物资讯。

🔥 **今日服务（${currentDate}）**：
• 2024年最新商品推荐
• 实时价格对比分析  
• 最新购物趋势解读
• 新品发布信息更新

💡 **提示**：询问时加上"2024年最新"可获得最准确的产品信息！

请问有什么可以帮助您的吗？`,
          timestamp: new Date().toISOString(),
          sessionId
        };

        set({
          currentSessionId: sessionId,
          messages: [welcomeMessage],
          lastActiveTime: new Date().toISOString()
        });
      },

      // 保存对话历史
      saveHistory: (conversation) => {
        const historyItem = {
          id: conversation.sessionId || `history_${Date.now()}`,
          title: conversation.title || get().generateSessionTitle(conversation.messages),
          messages: conversation.messages,
          createdAt: conversation.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        set((state) => {
          const existingIndex = state.history.findIndex(h => h.id === historyItem.id);
          let newHistory;
          
          if (existingIndex >= 0) {
            // 更新现有记录
            newHistory = [...state.history];
            newHistory[existingIndex] = historyItem;
          } else {
            // 添加新记录，保留最近20条
            newHistory = [...state.history, historyItem].slice(-20);
          }
          
          return { history: newHistory };
        });
      },

      // 生成会话标题
      generateSessionTitle: (messages) => {
        const userMessages = messages.filter(m => m.role === 'user');
        if (userMessages.length === 0) return '新的对话';
        
        const firstUserMessage = userMessages[0].content;
        // 截取前20个字符作为标题
        return firstUserMessage.length > 20 
          ? firstUserMessage.substring(0, 20) + '...' 
          : firstUserMessage;
      },

      // 加载历史对话
      loadHistorySession: (historyId) => {
        const historyItem = get().history.find(h => h.id === historyId);
        if (historyItem) {
          set({
            currentSessionId: historyItem.id,
            messages: historyItem.messages,
            showHistory: false
          });
        }
      },

      // 删除历史记录
      deleteHistory: (historyId) => {
        set((state) => ({
          history: state.history.filter(h => h.id !== historyId)
        }));
      },

      // 切换历史记录显示
      toggleHistory: () => {
        set((state) => ({
          showHistory: !state.showHistory
        }));
      },

      // 清空当前对话
      clearMessages: () => {
        set({ 
          messages: [],
          currentSessionId: null 
        });
      },

      // 清空所有历史记录
      clearAllHistory: () => {
        set({ 
          history: [],
          showHistory: false 
        });
      },

      // 更新用户偏好设置
      updatePreferences: (preferences) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ...preferences
          }
        }));
      },

      // 获取消息统计
      getMessageStats: () => {
        const state = get();
        return {
          totalMessages: state.messages.length,
          userMessages: state.messages.filter(m => m.role === 'user').length,
          assistantMessages: state.messages.filter(m => m.role === 'assistant').length,
          totalSessions: state.history.length,
          lastActiveTime: state.lastActiveTime
        };
      }
    }),
    {
      name: 'ai-chat-storage', // 存储键名
      partialize: (state) => ({
        history: state.history,
        userPreferences: state.userPreferences,
        lastActiveTime: state.lastActiveTime
      }), // 只持久化部分状态
    }
  )
);

export default useAIChatStore;