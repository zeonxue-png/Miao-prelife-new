document.addEventListener('DOMContentLoaded', () => {
    loadResult();
});

function loadResult() {
    const result = Utils.getFromStorage('pastLifeResult');
    const catData = Utils.getFromStorage('catData');
    
    if (!result || !result.past_life) {
        alert('时空信号中断，请重新开启轮回...');
        window.location.href = 'index.html';
        return;
    }
    
    displayResult(result.past_life, catData);
}

function displayResult(pastLife, catData) {
    // 1. 基础信息渲染
    document.getElementById('pastName').textContent = pastLife.name || '无名隐士';
    document.getElementById('era').textContent = pastLife.era || '上古神话时代';
    document.getElementById('occupation').textContent = pastLife.occupation || '神秘旅人';
    document.getElementById('location').textContent = pastLife.location || '时空夹缝';

    // 2. 故事渲染 (支持 HTML)
    document.getElementById('storyContent').innerHTML = pastLife.life_story || '历史的尘埃遮蔽了这段记忆...';

    // 3. 今生回响
    const connectionText = pastLife.modern_connection || pastLife.connection_to_cat || '';
    const echoEl = document.getElementById('connectionText');
    if (connectionText) {
        echoEl.textContent = `"${connectionText}"`;
    } else {
        echoEl.textContent = "缘分早已注定。";
    }

    // 4. 标签云渲染 (性格/特征)
    const traitsGrid = document.getElementById('traitsGrid');
    traitsGrid.innerHTML = '';
    
    // 优先使用 traits 数组，如果没有则解析 keywords
    let tags = [];
    if (pastLife.personality && pastLife.personality.traits) {
        tags = pastLife.personality.traits;
    } else if (pastLife.tags) {
        tags = pastLife.tags;
    }

    tags.forEach(trait => {
        const tag = document.createElement('div');
        tag.className = 'trait-tag';
        tag.textContent = trait;
        traitsGrid.appendChild(tag);
    });

    // 5. 渲染肖像 (核心)
    generatePortrait(pastLife);
}

function generatePortrait(pastLife) {
    const portraitDiv = document.getElementById('portraitImage');

    // 获取图片 URL (Dify Workflow 返回的可能是 portrait_image 或者 image_url)
    const imageUrl = pastLife.portrait_image || pastLife.image_url;

    if (imageUrl) {
        // 使用 innerHTML 直接替换 loading 占位符
        portraitDiv.innerHTML = `
            <img src="${imageUrl}" 
                 alt="${pastLife.name}的前世肖像" 
                 class="portrait-image"
                 crossorigin="anonymous" 
                 onload="this.style.opacity=1"
                 onerror="this.parentElement.innerHTML='<div class=\\'portrait-error\\'>影像显影失败</div>'">
        `;
    } else {
        portraitDiv.innerHTML = `<div class="portrait-error">灵力不足，无法显影</div>`;
    }
}

function goBack() {
    // 清除数据，返回首页
    Utils.clearStorage('pastLifeResult');
    // 可选：是否清除 catData 取决于你想不想让用户保留表单
    // Utils.clearStorage('catData'); 
    window.location.href = 'index.html';
}

function saveImage() {
    // 这是一个简易版的“保存为图片”逻辑
    // 实际生产环境建议使用 html2canvas 库来截图整个 .tarot-card 区域
    
    alert('长按图片或截屏保存这份珍贵的记忆吧！✨');
    
    // 如果引入了 html2canvas，可以用下面的代码：
    /*
    const card = document.getElementById('shareCard');
    html2canvas(card).then(canvas => {
        Utils.downloadImage(canvas, '喵星前世卡.png');
    });
    */
}