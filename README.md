# Shopping App - 我的页面

这是一个React购物应用，目前实现了"我的"页面功能。

## 技术栈

- React 19
- Vite 7
- React-Vant (移动端UI组件库)
- CSS Modules

## 功能特性

### 我的页面
- 用户信息展示（头像、昵称、等级）
- 统计数据（足迹、关注、收藏）
- 功能菜单（好价订阅、升级会员等）
- 头像操作（AI生成头像、上传头像）
- 个人信息编辑
- 退出登录功能

## 运行项目

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── hooks/
│   └── useTitle.js         # 页面标题Hook
├── pages/
│   └── Profile/           # 我的页面
│       ├── index.jsx      # 页面组件
│       └── profile.module.css  # 页面样式
├── App.jsx               # 主应用组件
├── main.jsx             # 应用入口
└── index.css           # 全局样式
```

## 特性说明

- 移动端优化：使用lib-flexible进行响应式适配
- 组件化开发：使用React-Vant组件库
- 模块化样式：CSS Modules避免样式冲突
- 用户体验：完整的交互反馈和确认对话框