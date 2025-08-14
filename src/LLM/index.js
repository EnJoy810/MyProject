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
    // 简洁系统提示（收敛为面向实习项目的最小实现）
    const systemPrompt = {
        role: 'system',
        content: '你是电商购物助手，请用简短分点说明，先给结论再给理由；如有价格/时间信息，请标注为最近期。'
    };

    const hasSystemPrompt = messages.some(msg => msg.role === 'system');
    const enhancedMessages = hasSystemPrompt ? messages : [systemPrompt, ...messages];

    // 极简参数
    const chatOptions = {
        temperature: 0.5,
        ...options
    };

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
    const specialPrompt = {
        role: 'system',
        content: `你是商品推荐助手。针对类别：${category}，预算：${budget}，给出3条简短推荐，先结论后理由。`
    };
    const enhancedMessages = [specialPrompt, ...messages];
    return await shoppingAssistantChat(enhancedMessages, { temperature: 0.4 });
}

// 价格比较专用对话 - 强调实时价格
export const priceComparisonChat = async (messages, productName = '') => {
    const specialPrompt = {
        role: 'system',
        content: `你是价格比较助手。比较「${productName}」的价格，直接给出最优选择和两条理由，最后给出购买建议。`
    };
    const enhancedMessages = [specialPrompt, ...messages];
    return await shoppingAssistantChat(enhancedMessages, { temperature: 0.3 });
}

// 已移除头像生成对接，保持 LLM 文件更简洁