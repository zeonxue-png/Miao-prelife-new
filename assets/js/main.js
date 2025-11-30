document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('catForm');
    const predictBtn = document.getElementById('predictBtn');
    
    // 1. 初始化表单提交
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleFormSubmit();
    });

    // 2. 表单提交处理
    async function handleFormSubmit() {
        const formData = Utils.getFormData('catForm');
        
        // 简单校验
        if (!formData.catName || !formData.gender || !formData.style) {
            alert('请完整填写契约内容（姓名、性别、风格为必填项）');
            return;
        }

        // 检查图片
        if (!imageUploader.getUploadedFile()) {
            alert('请上传灵宠法相（猫咪照片）');
            return;
        }

        try {
            // UI 状态切换
            predictBtn.disabled = true;
            predictBtn.textContent = '🔮 正在沟通时空...';
            
            // 显示全屏 Loading
            const loadingOverlay = document.getElementById('loadingOverlay');
            loadingOverlay.style.display = 'flex';
            startLoadingAnimation(); // 开启文案轮播

            // 保存表单数据
            Utils.saveToStorage('catData', formData);
            
            // 调用 API (确保你的 dify-api.js 已经更新为我之前发的 Workflow 版)
            const result = await difyAPI.predictPastLife(formData);
            
            if (result.success) {
                // 延迟一点跳转，让用户看一眼 100% 的进度
                setTimeout(() => {
                    window.location.href = 'result.html';
                }, 500);
            } else {
                throw new Error('预测未返回成功状态');
            }

        } catch (error) {
            console.error('预测错误:', error);
            alert('时空乱流干扰，请重试');
            loadingOverlay.style.display = 'none';
        } finally {
            predictBtn.disabled = false;
            predictBtn.textContent = '🔮 开启轮回之门';
            stopLoadingAnimation();
        }
    }

    // 3. 动态交互：单选/多选框样式联动
    // 这段逻辑配合 CSS 的 .checked 类实现金色高亮
    const allInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    
    allInputs.forEach(input => {
        input.addEventListener('change', function() {
            // 如果是单选，先清除同组其他的高亮
            if(this.type === 'radio') {
                const name = this.name;
                document.querySelectorAll(`input[name="${name}"]`).forEach(el => {
                    el.parentElement.classList.remove('checked');
                });
            }
            
            // 切换当前的高亮状态
            if(this.checked) {
                this.parentElement.classList.add('checked');
            } else {
                this.parentElement.classList.remove('checked');
            }
        });
    });

    // 4. Loading 文案轮播逻辑
    let loadingInterval;
    const loadingTexts = [
        "正在穿越第 1024 号平行宇宙...",
        "检测到高贵的皇室血统...",
        "正在翻阅《猫咪编年史》...",
        "星盘定位中：唐朝...宋朝...",
        "正在为它绘制前世画像..."
    ];

    function startLoadingAnimation() {
        const textEl = document.getElementById('loadingText');
        let index = 0;
        textEl.textContent = loadingTexts[0];
        
        loadingInterval = setInterval(() => {
            index = (index + 1) % loadingTexts.length;
            textEl.textContent = loadingTexts[index];
        }, 2000); // 每2秒换一句话
    }

    function stopLoadingAnimation() {
        if (loadingInterval) clearInterval(loadingInterval);
    }

    // 清除旧数据，保证每次进来都是新的
    Utils.clearStorage('pastLifeResult');
});