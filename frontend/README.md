# ISPInfo.io Frontend (v2.0.0)

一个现代化的 IP 地址信息查询工具，提供详细的网络信息展示和多种语言支持。

## ✨ 主要特性

- 🌐 **IP 地址查询**：快速查询任何 IP 地址的详细信息
- 🌍 **多语言支持**：自动检测用户语言偏好，支持中英文等多种语言
- 🎨 **美观的界面**：现代化的 UI 设计，支持深色/浅色主题
- 📱 **响应式布局**：在手机、平板和桌面设备上都能完美显示
- ⚡ **快速响应**：优化过的 API 请求，提供流畅的用户体验
- 📋 **一键复制**：方便地复制 IP 信息到剪贴板

## 🚀 快速开始

### 环境要求

- Node.js 16.x 或更高版本
- npm 或 yarn 包管理器

### 安装

1. 克隆仓库
   ```bash
   git clone https://github.com/your-username/ispinfo-frontend.git
   cd ispinfo-frontend
   ```

2. 安装依赖
   ```bash
   npm install
   # 或
   yarn install
   ```

3. 创建环境变量文件
   ```bash
   cp .env.example .env
   ```

## 🛠 开发

### 开发模式

启动开发服务器：

```bash
npm run dev
# 或
yarn dev
```

开发服务器将在 [http://localhost:5173](http://localhost:5173) 可用

### 构建生产版本

构建生产环境代码：

```bash
# 构建生产版本
npm run build

# 本地预览生产版本
npm run preview
```

## 🚀 部署

### 部署到 Cloudflare Pages

1. 安装 Wrangler CLI（如果尚未安装）：
   ```bash
   npm install -g wrangler
   ```

2. 登录 Cloudflare 账户：
   ```bash
   npx wrangler login
   ```

3. 构建并部署：
   ```bash
   npm run build
   npx wrangler pages deploy ./dist --project-name=ispinfo
   ```

### 环境变量

在部署前，请确保设置了以下环境变量：

```env
# 生产环境 API 地址
VITE_API_BASE_URL=https://api.ispinfo.io

# 开发环境可以使用
# VITE_API_BASE_URL=http://localhost:8787
```

## 🗂 项目结构

```
src/
  ├── components/     # 可复用的 React 组件
  │   ├── common/    # 通用组件
  │   └── layout/    # 布局组件
  ├── contexts/      # React 上下文
  ├── locales/       # 多语言文件
  ├── styles/        # 全局样式
  └── utils/         # 工具函数
```

## 🌐 多语言支持

应用支持多种语言。要添加新语言：

1. 在 `src/locales/` 目录下添加新的语言文件（如 `fr.json`）
2. 在 `src/App.jsx` 中更新支持的语言列表

## 🤝 贡献指南

欢迎贡献代码！提交拉取请求前请阅读我们的[贡献指南](CONTRIBUTING.md)。

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 📝 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 获取详细的版本更新记录。

## 🙏 致谢

- 感谢所有贡献者的辛勤工作
- 特别感谢 [Vite](https://vitejs.dev/) 和 [React](https://reactjs.org/) 团队
- 图标由 [React Icons](https://react-icons.github.io/react-icons/) 提供
