# 🐱 喵星人前世探秘器

一个基于AI的趣味应用，通过分析用户上传的猫咪照片和基本信息，利用大模型推理生成该猫咪对应的人类前世形象、故事背景和性格设定。

## ✨ 功能特色

- 📷 **智能图片上传**: 支持拖拽上传，自动压缩和预览
- 📝 **详细信息收集**: 猫咪基本信息、性格特征、生活习惯
- 🤖 **AI前世预测**: 基于Dify大模型生成前世人物形象和故事
- 🎨 **精美结果展示**: 响应式设计，优雅的结果展示页面
- 📤 **社交分享**: 支持分享预测结果到社交平台
- 💾 **图片保存**: 生成精美的结果图片供下载

## 🚀 快速开始

### 本地运行

1. 克隆项目
```bash
git clone https://github.com/yourusername/miao-past-life-predictor.git
cd miao-past-life-predictor
```

2. 启动本地服务器
```bash
# 使用Python
python -m http.server 8000

# 或使用Node.js
npx serve .
```

3. 打开浏览器访问 `http://localhost:8000`

### Vercel部署

1. 连接GitHub仓库到Vercel
2. 配置环境变量（可选）:
   - `DIFY_API_KEY`: Dify API密钥
   - `DIFY_WORKFLOW_ID`: Dify工作流ID
3. 部署完成

## 🛠 技术栈

- **前端**: 原生HTML5 + CSS3 + JavaScript
- **AI服务**: Dify大模型API（当前使用Mock数据）
- **部署**: Vercel静态托管
- **样式**: 自定义CSS + 渐变色设计
- **交互**: 原生JavaScript + LocalStorage

## 📁 项目结构

```
miao-past-life-predictor/
├── index.html              # 主页面（信息收集）
├── result.html             # 结果展示页面
├── assets/
│   ├── css/
│   │   ├── main.css        # 主样式文件
│   │   └── result.css      # 结果页样式
│   └── js/
│       ├── main.js         # 主逻辑
│       ├── upload.js       # 图片上传处理
│       ├── dify-api.js     # API调用（含Mock）
│       ├── result.js       # 结果页逻辑
│       └── utils.js        # 工具函数
├── config/
│   └── api-config.js       # API配置
├── package.json
├── vercel.json
└── README.md
```

## 🎯 使用说明

1. **上传猫咪照片**: 点击或拖拽上传猫咪照片
2. **填写基本信息**: 完成猫咪姓名、性别、年龄、品种等必填信息
3. **选择特征**: 选择猫咪的性格特征和生活习惯（可选）
4. **开始预测**: 点击"探索我的前世"按钮
5. **查看结果**: 等待AI分析完成，查看前世人物信息
6. **分享保存**: 可以分享结果或保存为图片

## 🔧 配置说明

### Dify API集成

当前版本使用Mock数据模拟API响应。要集成真实的Dify API：

1. 在 `assets/js/dify-api.js` 中配置API密钥
2. 替换 `generateMockResult` 方法为真实API调用
3. 配置环境变量

### 自定义配置

在 `config/api-config.js` 中可以修改：
- API端点和密钥
- 文件上传限制
- UI动画配置
- 加载提示文案

## 🎨 设计特色

- **渐变色主题**: 紫蓝色渐变背景，温暖橙色按钮
- **圆润设计**: 大量使用圆角和柔和的阴影
- **响应式布局**: 完美适配手机、平板、桌面端
- **动画效果**: 平滑的过渡动画和加载效果
- **可爱元素**: 猫咪主题的emoji和图标

## 📱 浏览器支持

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🔗 相关链接

- [演示地址](https://miao-past-life.vercel.app)
- [Dify官网](https://dify.ai)
- [项目文档](./猫咪前世预测应用-产品规格文档.md)

---

**Made with ❤️ by Zeon.Xue**
