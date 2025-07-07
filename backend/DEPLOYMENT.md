# 部署指南

## 初始设置

1. 在 Cloudflare 仪表板中创建 API 令牌：
   - 登录 Cloudflare 账户
   - 进入 "My Profile" > "API Tokens"
   - 创建具有以下权限的令牌：
     - `Account.Workers:edit`
     - `Account.Workers:read`
     - `Account.WorkersScripts:write`

2. 在 GitHub 仓库中设置密钥：
   - 进入仓库的 "Settings" > "Secrets and variables" > "Actions"
   - 添加 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`

## 部署流程

### 自动部署（推荐）

1. 将代码推送到 `main` 分支：
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
2. GitHub Actions 会自动触发部署流程
3. 在 GitHub 仓库的 "Actions" 标签页查看部署状态

### 手动部署

1. 安装 Wrangler CLI：
   ```bash
   npm install -g wrangler@latest
   ```

2. 登录 Cloudflare：
   ```bash
   wrangler login
   ```

3. 部署到生产环境：
   ```bash
   wrangler deploy --env production
   ```

## 回滚流程

### 使用 GitHub Actions 回滚

1. 在 GitHub 仓库中，进入 "Actions" 标签页
2. 选择 "Rollback Cloudflare Worker" 工作流
3. 点击 "Run workflow" 按钮
4. 输入要回滚到的版本 ID（可以从 Cloudflare 仪表板或部署历史中获取）
5. 点击 "Run workflow" 执行回滚

### 使用命令行回滚

1. 列出部署历史：
   ```bash
   wrangler deployments list
   ```

2. 回滚到特定版本：
   ```bash
   wrangler rollback <version-id> --env production
   ```

## 环境变量管理

- 开发环境：在 `wrangler.toml` 的 `[vars]` 部分设置
- 生产环境：使用 Wrangler 设置：
  ```bash
  wrangler secret put SECRET_NAME --env production
  ```

## 监控和日志

- 在 Cloudflare 仪表板的 "Workers & Pages" 部分查看部署状态和日志
- 设置错误监控和告警

## 最佳实践

- 始终在推送代码前在本地测试
- 使用 Pull Request 进行代码审查
- 考虑使用功能标志进行逐步发布
- 定期备份重要数据
