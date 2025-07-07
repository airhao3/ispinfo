# ispinfo.io

This project provides IP address and ASN information lookup services. It leverages Cloudflare's serverless ecosystem (Workers, D1, Pages) for development and deployment.

## Project Structure

```
ispinfo.io/
├── frontend/          # 前端代码 (React + Vite + TypeScript)
├── backend/           # 后端代码 (Cloudflare Workers)
│   ├── src/           # 源代码
│   ├── wrangler.toml  # Cloudflare Workers 配置
│   └── package.json   # 后端依赖
├── .github/
│   └── workflows/     # GitHub Actions 工作流
│       ├── deploy-backend.yml    # 后端部署工作流
│       └── rollback-backend.yml  # 后端回滚工作流
└── README.md          # 项目说明
```

## Features

- IP 地址信息查询
- ASN 信息查询
- 响应式设计，支持移动端
- 自动化部署和回滚

## Development

## Setup and Local Development

### Prerequisites

*   Node.js (LTS recommended)
*   npm (Node Package Manager)
*   Cloudflare Wrangler CLI (`npm install -g wrangler`)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ispinfo.io
```

### 2. `ispinfo-backend-worker` Setup (Dispatcher/Aggregator)

Navigate to the `backend` directory:

```bash
cd backend
```

#### Install Dependencies

```bash
npm install
```

#### 环境变量配置

#### 本地开发环境

1. 在 `backend` 目录下创建 `.dev.vars` 文件，添加以下环境变量：
   ```
   IPREGISTRY_API_KEY=your_ipregistry_api_key
   NODE_ENV=development
   ```

2. 对于生产环境，需要将环境变量设置为 Cloudflare Workers 的 secret：
   ```bash
   cd backend
   npx wrangler secret put IPREGISTRY_API_KEY
   ```

#### GitHub Actions 环境变量

1. 在 GitHub 仓库中，进入 Settings > Secrets and variables > Actions
2. 添加以下 secrets：
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API 令牌
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 账户 ID
   - `IPREGISTRY_API_KEY`: IP 查询 API 密钥

#### Generate Worker Types

```bash
npm run cf-typegen
```

### 3. `ispinfo-gateway-worker` Setup (API Gateway)

Navigate to the `gateway/ispinfo-gateway-worker` directory:

```bash
cd gateway/ispinfo-gateway-worker
```

#### Install Dependencies

```bash
npm install
```

#### Generate Worker Types

```bash
npm run cf-typegen
```

### 4. `ispinfo-frontend-worker` Setup (Frontend Pages)

Navigate to the `frontend` directory:

```bash
cd ../frontend
```

#### Install Dependencies

```bash
npm install
```

#### Build Frontend for Gateway Integration

This command builds the frontend and copies the output to `gateway/ispinfo-gateway-worker/public`.

```bash
npm run build
```

### 5. Run Locally

Navigate back to the `gateway/ispinfo-gateway-worker` directory:

```bash
cd ../gateway/ispinfo-gateway-worker
```

Start the local development server:

```bash
npm run dev
```

Once the server is running, you can access the application in your browser at the URL provided by Wrangler (e.g., `http://localhost:8787`).

## API Endpoints

*   **`/ip`**: Returns the client's own IP address.
*   **`/{ip}`**: Returns detailed information (ASN, organization, city, country, etc.) for the specified IP address.

## 部署说明

### 前端部署

1. 进入前端目录：
   ```bash
   cd frontend
   ```

2. 构建前端代码：
   ```bash
   npm run build
   ```

3. 部署到 Cloudflare Pages：
   ```bash
   npx wrangler pages deploy ./dist --project-name=ispinfo-frontend
   ```

### 后端部署

1. 进入后端目录：
   ```bash
   cd backend
   ```

2. 部署到 Cloudflare Workers：
   ```bash
   npx wrangler deploy
   ```

### 使用 GitHub Actions 自动化部署

项目已经配置了 GitHub Actions 工作流，当代码推送到特定分支时会自动部署：

- 推送到 `main` 分支：自动部署到生产环境
- 推送到 `staging` 分支：自动部署到预发布环境

#### 手动触发部署

1. 在 GitHub 仓库中，进入 "Actions" 标签页
2. 选择 "Deploy Backend" 或 "Deploy Frontend" 工作流
3. 点击 "Run workflow" 按钮
4. 选择目标分支和环境
5. 点击 "Run workflow" 开始部署

#### 回滚部署

如果需要回滚到之前的版本：

1. 在 GitHub 仓库中，进入 "Actions" 标签页
2. 选择 "Rollback Backend" 或 "Rollback Frontend" 工作流
3. 点击 "Run workflow" 按钮
4. 选择要回滚到的部署版本
5. 点击 "Run workflow" 开始回滚

## Future Enhancements

*   Improved error handling and logging.
*   More comprehensive frontend features and UI/UX improvements.
