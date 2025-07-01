# 项目规划: ispinfo.io 克隆版

## 1. 项目目标

构建一个功能类似于 `ispinfo.io` 的网站，提供 IP 地址和 ASN 信息的查询服务。项目将利用 Cloudflare 的无服务器生态系统（Workers, D1, Pages）进行开发和部署，并使用开源的 GeoLite2 数据库作为核心数据源。

## 2. 技术选型

- **数据源:** MaxMind GeoLite2 (免费版)
- **数据库:** Cloudflare D1
- **后端 API:** Cloudflare Worker (TypeScript)
- **前端框架:** React (使用 Vite 构建) + TypeScript
- **UI 样式:** Bootstrap
- **部署:** Cloudflare Worker (前端和后端一体化部署)

## 3. 开发阶段 (按执行顺序)

### 阶段一：前端开发 (React + Vite) - **已完成**

1.  **初始化项目:** 使用 `Vite` 创建一个 React + TypeScript 项目。
2.  **搭建 UI 骨架:**
    -   创建导航栏、主标题。
    -   实现一个居中的搜索框组件，包含输入字段和“查询”按钮。
    -   创建一个用于显示结果的区域。
3.  **实现前端逻辑:**
    -   页面加载时，调用一个（尚不存在的）模拟 API 来显示访问者自己的信息。
    -   当用户在搜索框输入并点击查询后，将输入内容发送到模拟 API。
    -   管理加载（loading）和错误（error）状态。
4.  **UI 适配与优化:**
    -   根据设计规范，调整整体主题、色调、字体、布局和风格。
    -   实现顶部全局导航栏。
    -   实现核心英雄区域（IP 搜索框和用户 IP 信息展示）。
    -   实现社会认同/客户信任区。
    -   实现核心 IP 数据产品介绍。
    -   实现应用场景介绍。
    -   实现开发者资源区。
    -   实现客户评价区。
    -   实现最终行动号召区。
    -   实现页脚。
    -   调整页面宽度，内容收紧并居中显示，左右留白。

### 阶段二：数据管道 (GeoLite2 -> Cloudflare D1) - **待完成**

1.  **获取数据:** 下载 GeoLite2 City 和 ASN 的 CSV 文件。
2.  **设计 Schema:** 在 D1 中创建用于存储 IP 段、ASN 和地理位置信息的表。
3.  **编写导入脚本:** 创建一个本地脚本 (如 Node.js 或 Python)，将 CSV 数据处理并批量导入 D1 数据库。

### 阶段三：后端 API (Cloudflare Worker) - **已完成核心逻辑，待调试**

1.  **初始化 Worker:** 创建一个 Worker 项目并绑定 D1 数据库。
2.  **实现查询逻辑:**
    -   接收前端的 IP 查询请求。
    -   将 IP 地址转换为整数。
    -   在 D1 数据库中执行 SQL 查询以匹配 IP 范围。
    -   整合查询结果 (ASN, 地理位置等)。
    -   以统一的 JSON 格式返回数据。
3.  **前端与后端一体化部署配置:**
    -   配置 `backend/package.json`，使其在构建时包含前端构建步骤。
    -   配置 `backend/wrangler.jsonc`，移除 `site` 属性，并确保 `assets` 绑定正确指向 KV 命名空间。
    -   修改 `backend/src/index.ts`，使其能够通过 `getAssetFromKV` 提供前端静态文件，并处理 API 路由。

### 阶段四：调试与部署 - **当前重点**

1.  **本地调试 Worker**：使用 `wrangler dev` 在本地运行 Worker，并使用浏览器开发者工具和日志来诊断 `Worker threw exception` 错误。
2.  **解决 Worker 异常**：根据本地调试的结果，修复 Worker 代码中的运行时错误。
3.  **验证前端与后端集成**：确保前端能够正确调用后端 API 并显示数据。
4.  **部署到 Cloudflare**：成功解决本地问题后，再次部署 Worker 到 Cloudflare。
5.  **自动化:** 创建一个由 Cron Trigger 触发的定时 Worker，用于每月自动从 MaxMind 下载最新数据并更新 D1 数据库。

### 更新计划：

**阶段 1：修复 `getAssetFromKV` 在本地开发环境中的问题**

*   **目标：** 解决 `getAssetFromKV` 在本地 `wrangler dev` 环境下无法正确提供静态文件的问题，导致 500 错误。
*   **行动：**
    1.  **诊断 `getAssetFromKV` 问题**: 尽管 `__STATIC_CONTENT` 和 `__STATIC_CONTENT_MANIFEST` 已手动添加到 `Env` 类型，但 `getAssetFromKV` 仍然返回 500 错误。这可能意味着 `wrangler dev` 在本地运行时，这些绑定没有被正确模拟或填充。
    2.  **替代方案**: 鉴于 `getAssetFromKV` 在本地开发环境中的复杂性，我将修改 `backend/src/index.ts`，在本地开发模式下（通过检查 `env.ENVIRONMENT` 或其他环境变量），直接从文件系统读取 `public` 目录下的静态文件。在生产部署时，仍然使用 `getAssetFromKV`。
*   **验证：**
    1.  `wrangler dev` 能够成功启动，并且不再出现 500 错误。
    2.  `http://localhost:<port>/` 能够正确显示前端页面。
    3.  `http://localhost:<port>/<static_asset_path>` (例如 `/assets/index-DQnr0jHT.css`) 能够正确加载。

**阶段 2：测试 IP 查询路由**

*   **目标：** 确保 `/{ip}` 路由在修复静态文件服务后仍然正常工作。
*   **行动：** 使用 `curl` 测试 `http://localhost:<port>/8.8.8.8`。
*   **验证：** 能够正确返回 IP 查询结果（纯文本或 JSON）。

**阶段 3：前端集成（如果需要）**

*   **目标：** 修改前端应用，使其能够利用后端提供的 `/{ip}` API 进行 IP 查询和显示。
*   **行动：** 根据前端框架和代码结构，修改相关组件以调用后端 API 并处理返回数据。
*   **验证：** 在浏览器中测试前端应用，确保 IP 查询功能正常。
