class DifyAPI {
    constructor() {
        // 配置信息
        this.config = {
            // 注意：这里必须是 /workflows/run，不能是 /chat-messages
            BASE_URL: 'https://api.dify.ai/v1/workflows/run', 
            // 替换你的实际 API Key
            API_KEY: 'app-txNTMhp70aJVHPjlzGpdONLr', 
            TIMEOUT: 60000, // 60秒超时，因为画图比较慢
            RETRY_TIMES: 1,
            // 建议使用 blocking，一次性等待图文生成完毕，处理更简单
            RESPONSE_MODE: 'blocking', 
            generateUserId: 'user_' + Math.random().toString(36).substr(2, 9)
        };
        
        this.baseURL = this.config.BASE_URL;
        this.apiKey = this.config.API_KEY;
    }

    /**
     * 核心方法：预测前世
     */
    async predictPastLife(catData) {
        try {
            Utils.showLoading(true);
            Utils.updateLoadingText('正在连接时空档案...');
            
            let result;
            let retryCount = 0;
            
            while (retryCount <= this.config.RETRY_TIMES) {
                try {
                    // 尝试调用 API
                    result = await this.callDifyWorkflow(catData);
                    break; // 成功则跳出循环
                } catch (error) {
                    retryCount++;
                    console.error(`API调用失败 (尝试 ${retryCount}/${this.config.RETRY_TIMES + 1}):`, error);
                    
                    if (retryCount > this.config.RETRY_TIMES) {
                        console.warn('重试次数耗尽，切换到模拟数据模式');
                        return await this.useMockData(catData);
                    }
                    
                    Utils.updateLoadingText(`信号中断，正在重新连接 (${retryCount})...`);
                    await this.simulateDelay(1500);
                }
            }
            
            // 保存结果并返回
            Utils.saveToStorage('pastLifeResult', result);
            Utils.showLoading(false);
            return result;

        } catch (error) {
            Utils.showLoading(false);
            console.error('预测流程致命错误:', error);
            alert('预测失败，请检查网络或稍后重试');
            throw error;
        }
    }

    /**
     * 调用 Dify Workflow API
     */
    async callDifyWorkflow(catData) {
        Utils.updateLoadingText('AI正在分析猫咪特征并绘制画像...');
        
        // 1. 构造 Payload (对应 Dify 工作流“开始”节点的输入变量)
        // 确保这里的 key 和你 Dify 里设置的变量名完全一致
        const payload = {
            inputs: {
                cat_name: catData.catName,
                cat_gender: catData.gender || '未知',
                cat_breed: catData.breed || '未知品种',
                cat_personality: catData.personality ? catData.personality.join(',') : '',
                cat_habits: catData.habits ? catData.habits.join(',') : '',
                style: catData.style || '写实',
                // 如果你有图片描述功能，这里传描述；如果没有，传空字符串防止报错
                cat_image_description: Utils.getFromStorage('imageAnalysis') || '一只可爱的猫'
            },
            response_mode: this.config.RESPONSE_MODE,
            user: this.config.generateUserId
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.TIMEOUT);

        try {
            console.log('🚀 发起请求:', payload);
            
            // 2. 发送 POST 请求
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`HTTP Error ${response.status}: ${errText}`);
            }

            const jsonResponse = await response.json();
            console.log('✅ API 原始响应:', jsonResponse);

            // 3. 解析 Workflow 结果
            return this.parseWorkflowResponse(jsonResponse, catData);

        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('请求超时，AI画图可能需要更多时间');
            }
            throw error;
        }
    }

    /**
     * 解析 Workflow 返回的数据结构
     */
    parseWorkflowResponse(response, catData) {
        // Dify Workflow 的输出通常在 data.outputs 中
        const outputs = response.data?.outputs || {};

        // 1. 提取文本字段 (对应你在“结束”节点配置的变量名)
        const title = outputs.title || '神秘前世';
        const name = outputs.name || '无名氏';
        const story = outputs.story || '时空档案模糊...';
        const echo = outputs.echo || ''; // 今生回响

        // 2. 提取图片 (关键步骤)
        // Flux 节点输出的 generated_image 是一个数组对象
        let imageUrl = null;
        const imgData = outputs.generated_image;

        if (Array.isArray(imgData) && imgData.length > 0) {
            // 优先取 remote_url (SiliconFlow通常返回这个)
            imageUrl = imgData[0].remote_url || imgData[0].url;
        } else if (imgData && typeof imgData === 'object') {
            imageUrl = imgData.remote_url || imgData.url;
        }

        console.log('Portrait image URL:', imageUrl);

        // 3. 构造前端统一需要的数据结构
        return {
            success: true,
            past_life: {
                name: name,               // 前世姓名
                era: title,               // 身份/朝代 (作为标题显示)
                period: '历史长河',        // 可以是固定值，或者你也让AI生成
                occupation: title,        // 使用标题作为职业/身份
                location: '古代中国',      // 简化处理
                
                // 故事内容
                life_story: story,
                
                // 今生回响 (对应 modern_connection)
                modern_connection: echo,
                
                // 肖像图
                portrait_image: imageUrl, // 这里直接放 URL
                
                // 其他前端可能用到的占位符，防止 undefined 报错
                catName: catData.catName,
                personality: { traits: [], cat_connection: '' },
                appearance: { description: '', cat_connection: '' }
            }
        };
    }

    /**
     * 模拟数据 (兜底方案)
     * 当 API 挂了或者欠费时使用
     */
    async useMockData(catData) {
        Utils.updateLoadingText('启动备用时空通道...');
        await this.simulateDelay(2000);
        
        const mockList = [
            { title: "宋朝御猫", name: "圆圆", story: "它是宋徽宗最宠爱的御猫，整日在御花园扑蝴蝶。", echo: "今生爱玩，是因为前世没抓够蝴蝶。" },
            { title: "唐朝酒馆掌柜", name: "橘大郎", story: "长安城西市的一位酒馆掌柜，最爱躺在柜台上听客官讲故事。", echo: "今生贪吃，是因为前世尝遍了长安美食。" },
            { title: "明代锦衣卫", name: "黑炭", story: "夜行千里的锦衣卫密探，身手矫健，行踪诡秘。", echo: "今生高冷，是保持了前世的职业素养。" }
        ];
        
        const randomData = mockList[Math.floor(Math.random() * mockList.length)];
        
        return {
            success: true,
            past_life: {
                name: randomData.name,
                era: randomData.title,
                occupation: randomData.title,
                life_story: randomData.story,
                modern_connection: randomData.echo,
                portrait_image: "assets/images/mock_cat.jpg", // 确保你本地有一张兜底图
                catName: catData.catName
            }
        };
    }

    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 导出实例
const difyAPI = new DifyAPI();