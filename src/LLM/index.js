const KIM_CHAT_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

export const chat = async (
    messages, 
    api_url=KIM_CHAT_API_URL, 
    api_key=import.meta.env.VITE_KIMI_API_KEY,
    model='moonshot-v1-auto',
    options = {}
) => {
    try {
        // 检查API密钥
        if (!api_key || api_key === 'your_kimi_api_key_here') {
            return {
                code: -1,
                msg: '请先配置VITE_KIMI_API_KEY环境变量'
            }
        }

        const requestBody = {
            model,
            messages,
            stream: false,
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 2000,
            top_p: options.top_p || 0.9,
            ...options
        };

        const response = await fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${api_key}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                code: -1,
                msg: `API调用失败: ${errorData.error?.message || response.statusText}`
            };
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            return {
                code: -1,
                msg: 'API返回数据格式错误'
            };
        }

        return {
            code: 0,
            data: {
                role: 'assistant',
                content: data.choices[0].message.content.trim(),
                usage: data.usage || null
            }
        }
    } catch(err) {
        console.error('API调用错误:', err);
        return {
            code: -1,
            msg: '网络连接错误，请检查网络后重试'
        }
   } 
}

export const kimiChat = async (messages) => {
    const res = await chat(
        messages,
        KIM_CHAT_API_URL,
        import.meta.env.VITE_KIMI_API_KEY,
        'moonshot-v1-auto'
    )
    return res;
}

export const shoppingAssistantChat = async (messages, options = {}) => {
    // 强调时效性的系统提示词
    const currentDate = new Date().toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    });
    
    const systemPrompt = {
        role: 'system',
        content: `你是专业的AI购物助手"小购"。当前时间：${currentDate}

## 🚨 时效性要求（重要）：
1. **优先提供2024年最新信息**：商品型号、价格、参数必须是最新的
2. **标注信息时间**：对于价格和参数信息，标注"截至2024年"
3. **强调时效提醒**：提醒用户价格和库存实时变化，建议购买前确认
4. **关注最新趋势**：优先推荐2024年新品和当前热门商品
5. **避免过时信息**：不推荐已停产或过时的产品

## 回复格式要求：
1. **结构清晰**：使用标题、列表、分点说明
2. **内容精简**：每个要点控制在1-2句话
3. **重点突出**：用**粗体**标记关键信息
4. **逻辑清楚**：按重要性排序，先说结论再说理由

## 回复模板：
### 🎯 核心建议
[简洁明了的核心建议，1-2句话]

### 📋 具体推荐（2024年最新）
**推荐商品1：** [商品名称]
- **价格：** [价格区间]（截至2024年${new Date().getMonth() + 1}月）
- **优势：** [2-3个核心优势]
- **适合：** [适用人群/场景]

### 💡 购买建议  
- **最佳购买时机：** [具体建议]
- **注意事项：** [重要提醒]
- **省钱技巧：** [实用建议]

### ⏰ 时效提醒
**重要：** 价格和库存实时变化，建议购买前再次确认最新信息

### ❓ 需要了解
[主动询问用户的具体需求，便于提供更精准建议]

## 语言风格：
- 简洁专业，避免冗长描述
- 多用短句，便于阅读
- 重要信息用数字标记
- 适度使用emoji增加亲和力
- 不确定的信息会明确说明
- **必须强调信息的时效性**

请始终遵循此格式回复，确保内容清晰易读且信息最新。`
    };
    
    // 检查是否已有系统提示
    const hasSystemPrompt = messages.some(msg => msg.role === 'system');
    const enhancedMessages = hasSystemPrompt ? messages : [systemPrompt, ...messages];
    
    // 优化参数设置 - 降低创造性，提高准确性和一致性
    const chatOptions = {
        temperature: 0.3, // 降低随机性，确保输出更加一致和准确
        max_tokens: 2000, // 适中的token数，避免过长回复
        top_p: 0.8, // 更集中的输出
        ...options
    };
    
    // 调用聊天API
    const res = await chat(
        enhancedMessages,
        KIM_CHAT_API_URL,
        import.meta.env.VITE_KIMI_API_KEY,
        'moonshot-v1-auto',
        chatOptions
    );
    
    return res;
}

// 专门的商品推荐对话 - 强调最新信息
export const productRecommendationChat = async (messages, category = '', budget = '') => {
    const currentMonth = new Date().getMonth() + 1;
    const specialPrompt = {
        role: 'system',
        content: `你是商品推荐专家。当前时间：2024年${currentMonth}月。用户询问${category}商品推荐，预算${budget}。

🚨 **时效性要求**：
- 必须推荐2024年最新产品
- 价格信息标注"2024年${currentMonth}月"
- 优先推荐当前热销和新发布商品
- 避免推荐已停产或过时产品

请严格按此格式回复：

### 🏆 TOP推荐（2024年最新）
**[商品名]** - ¥[价格]（2024年${currentMonth}月）
⭐ [核心优势1] | [核心优势2] | [核心优势3]

### 💰 性价比之选（2024年热门）
**[商品名]** - ¥[价格]（2024年${currentMonth}月）
⭐ [核心优势1] | [核心优势2]

### 🎯 购买要点
1. **关注参数：** [重要参数]
2. **避坑提醒：** [注意事项]  
3. **购买渠道：** [推荐平台]

### ⏰ 重要提醒
价格和库存实时变化，购买前请确认最新信息！

回复要求：推荐2024年最新产品，每个商品介绍控制在30字内，重点突出时效性。`
    };

    const enhancedMessages = [specialPrompt, ...messages];
    return await chat(enhancedMessages, KIM_CHAT_API_URL, import.meta.env.VITE_KIMI_API_KEY, 'moonshot-v1-auto', {
        temperature: 0.2,
        max_tokens: 1500,
    });
}

// 价格比较专用对话 - 强调实时价格
export const priceComparisonChat = async (messages, productName = '') => {
    const currentDate = new Date().toLocaleDateString('zh-CN');
    const currentTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    const specialPrompt = {
        role: 'system',
        content: `你是价格比较专家。当前时间：${currentDate} ${currentTime}。用户询问"${productName}"的价格对比。

🚨 **时效性要求**：
- 价格信息必须是2024年最新的
- 标注价格查询时间
- 提醒价格实时变化
- 建议用户购买前再次确认

请严格按此格式回复：

### 💰 价格对比（${currentDate}）
| 平台 | 价格 | 优势 |
|------|------|------|
| **[平台1]** | ¥[价格] | [优势] |
| **[平台2]** | ¥[价格] | [优势] |

### 🎯 最优选择
**推荐平台：** [平台名] - ¥[价格]
**理由：** [简洁说明原因]

### 💡 省钱技巧
- [技巧1]
- [技巧2]

### ⏰ 价格提醒
**注意：** 以上价格为${currentDate}参考价格，实际价格可能因促销活动实时变化，请购买前确认最新价格！

要求：价格信息要具体准确，建议要实用，控制在150字内。`
    };

    const enhancedMessages = [specialPrompt, ...messages];
    return await chat(enhancedMessages, KIM_CHAT_API_URL, import.meta.env.VITE_KIMI_API_KEY, 'moonshot-v1-auto', {
        temperature: 0.1,
        max_tokens: 1000,
    });
}

export const generateAvatar = async (text) => {
    // 设计prompt 
    const prompt = `
    你是一位漫画设计师，需要为用户设计头像，主打日漫风格。
    用户的信息是${text}
    要求有个性，有设计感。
    `
}