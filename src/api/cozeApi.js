// 引入axios用于API请求
import axios from 'axios';

// 从环境变量获取配置
const COZE_API_URL = import.meta.env.VITE_COZE_API_URL || 'https://api.coze.cn/open_api/v2/chat';
const WORKFLOW_ID = import.meta.env.VITE_COZE_WORKFLOW_ID || '7533136698567098411';
const TOKEN = import.meta.env.VITE_COZE_TOKEN || 'pat_OYe2wuR7J58qNzzXk6d43GJdvgX0sR6gKCz6woY5DYJMH0TuOw9Am4RfbjdUiTkO';

/**
 * 调用Coze工作流API
 * @param {Object} parameters - 调用参数
 * @param {string} parameters.user_id - 用户唯一标识
 * @param {string} parameters.user_prompt - 用户提示词
 * @param {boolean} [parameters.stream=false] - 是否流式响应
 * @param {boolean} [parameters.auto_save_history=true] - 是否自动保存历史
 * @param {string} [parameters.conversation_id] - 对话ID
 * @returns {Promise<Object>} 格式化的响应数据
 */
export const callCozeWorkflow = async (parameters) => {
  // 确保Token已配置
  if (!TOKEN) {
    throw new Error('Coze API Token未配置，请检查环境变量');
  }

  try {
    const response = await axios.post(COZE_API_URL, {
      bot_id: WORKFLOW_ID,
      user_id: parameters.user_id || '123456789',
      query: parameters.user_prompt || '生成头像',
      stream: parameters.stream || false,
      auto_save_history: parameters.auto_save_history !== undefined ? parameters.auto_save_history : true,
      conversation_id: parameters.conversation_id
    }, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    // 格式化响应数据
    return {
      success: true,
      data: response.data,
      conversationId: response.data.conversation_id
    };
  } catch (error) {
    console.error('调用Coze API失败:', error);
    return {
      success: false,
      error: `API调用失败: ${error.response?.status || '未知状态'} - ${error.response?.data?.msg || error.message}`,
      details: error
    };
  }
};

/**
 * 使用Coze生成AI头像
 * @param {Object} options - 头像生成选项
 * @param {string} options.description - 头像描述
 * @param {string} [options.user_id='123456789'] - 用户ID
 * @returns {Promise<Object>} 生成结果
 */
export const generateAvatarWithCoze = async (options) => {
  try {
    // 构建更详细的提示词
    const prompt = `根据以下详细描述生成高质量头像：

${options.description || '一个人的头像'}

要求：
1. 图像清晰，细节丰富，分辨率至少为512x512
2. 风格明确，符合现代审美
3. 色彩搭配协调
4. 表情自然
5. 请生成3个不同风格的头像供选择（如卡通、写实、油画等）
6. 直接返回图片链接，不要添加其他文字说明`;

    // 调用Coze工作流
    const response = await callCozeWorkflow({
      user_id: options.user_id || '123456789',
      user_prompt: prompt
    });

    if (!response.success) {
      return {
        success: false,
        error: response.error,
        details: response.details
      };
    }

    // 提取图片URL
    const images = extractImagesFromCozeResponse(response.data);

    return {
      success: true,
      images: images,
      conversationId: response.conversationId
    };
  } catch (error) {
    console.error('生成头像失败:', error);
    return {
      success: false,
      error: error.message || '生成头像时发生错误',
      details: error
    };
  }
};

/**
 * 继续Coze对话（重新生成头像）
 * @param {string} conversationId - 对话ID
 * @param {string} prompt - 新的提示词
 * @param {string} [user_id='123456789'] - 用户ID
 * @returns {Promise<Object>} 生成结果
 */
export const continueCozeConversation = async (conversationId, prompt, user_id = '123456789') => {
  try {
    if (!conversationId) {
      return {
        success: false,
        error: '缺少对话ID'
      };
    }

    // 调用Coze工作流继续对话
    const response = await callCozeWorkflow({
      user_id: user_id,
      user_prompt: prompt,
      conversation_id: conversationId
    });

    if (!response.success) {
      return {
        success: false,
        error: response.error
      };
    }

    // 提取图片URL
    const images = extractImagesFromCozeResponse(response.data);

    return {
      success: true,
      images: images,
      conversationId: response.conversationId
    };
  } catch (error) {
    console.error('继续对话失败:', error);
    return {
      success: false,
      error: error.message || '继续对话时发生错误'
    };
  }
};

/**
 * 保存头像图片（模拟）
 * @param {string} imageUrl - 图片URL
 * @param {string} userId - 用户ID
 * @returns {Promise<string>} 保存后的图片URL
 */
export const saveAvatarImage = async (imageUrl, userId) => {
  try {
    // 模拟保存到服务器的过程
    console.log(`保存头像到服务器: ${imageUrl} 为用户: ${userId}`);
    
    // 实际项目中，这里应该调用后端API保存图片
    // 为了演示，我们直接返回原始URL
    return imageUrl;
  } catch (error) {
    console.error('保存头像失败:', error);
    throw new Error('保存头像时发生错误');
  }
};

/**
 * 从文本中提取URL
 * @param {string} text - 包含URL的文本
 * @returns {string[]} URL数组
 */
const extractUrlsFromText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex) || [];
  // 过滤掉不是图片的URL
  return urls.filter(url => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  });
};

/**
 * 从Coze响应中提取图片URL
 * @param {Object} response - Coze API响应数据
 * @returns {string[]} 图片URL数组
 */
export const extractImagesFromCozeResponse = (response) => {
  const imageUrls = [];

  // 检查响应格式
  if (!response || (!response.messages && !response.message)) {
    console.warn('Coze响应格式无效');
    // 返回默认图片
    return ['https://picsum.photos/200/200?random=1'];
  }

  // 处理messages数组
  if (Array.isArray(response.messages)) {
    response.messages.forEach(message => {
      // 检查文本内容中的图片URL
      if (message.content && typeof message.content === 'string') {
        const urls = extractUrlsFromText(message.content);
        imageUrls.push(...urls);
      }

      // 检查文件ID（如果有）
      if (message.file_ids && Array.isArray(message.file_ids)) {
        message.file_ids.forEach(fileId => {
          // 构建图片URL
          imageUrls.push(`https://api.coze.cn/open_api/v1/files/${fileId}/content`);
        });
      }
    });
  }
  // 处理单个message对象
  else if (response.message && typeof response.message === 'object') {
    // 检查文本内容中的图片URL
    if (response.message.content && typeof response.message.content === 'string') {
      const urls = extractUrlsFromText(response.message.content);
      imageUrls.push(...urls);
    }

    // 检查文件ID（如果有）
    if (response.message.file_ids && Array.isArray(response.message.file_ids)) {
      response.message.file_ids.forEach(fileId => {
        // 构建图片URL
        imageUrls.push(`https://api.coze.cn/open_api/v1/files/${fileId}/content`);
      });
    }
  }

  // 如果没有提取到图片URL，返回默认图片
  if (imageUrls.length === 0) {
    console.warn('未从Coze响应中提取到图片URL');
    return ['https://picsum.photos/200/200?random=2'];
  }

  return imageUrls;
};