const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

// 核心聊天函数 
export const chat = async (messages, options = {}) => {
    const api_key = import.meta.env.VITE_KIMI_API_KEY;
    
    if (!api_key || api_key === 'your_kimi_api_key_here') {
        return {
            code: -1,
            msg: '请先配置VITE_KIMI_API_KEY环境变量'
        }
    }

    try {
        const requestBody = {
            model: options.model || 'moonshot-v1-auto',
            messages,
            stream: false,
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 2000,
            ...options
        };

        const response = await fetch(KIMI_API_URL, {
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
        
        return {
            code: 0,
            data: {
                role: 'assistant',
                content: data.choices[0].message.content.trim(),
                usage: data.usage || null
            }
        }
    } catch(err) {
        return {
            code: -1,
            msg: '网络连接错误，请检查网络后重试'
        }
    } 
}

export const shoppingChat = async (messages, options = {}) => {
    const systemPrompt = {
        role: 'system',
        content: '你是电商购物助手，请用简短分点说明，先给结论再给理由。'
    };

    const hasSystemPrompt = messages.some(msg => msg.role === 'system');
    const enhancedMessages = hasSystemPrompt ? messages : [systemPrompt, ...messages];

    return await chat(enhancedMessages, { temperature: 0.5, ...options });
}