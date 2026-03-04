# wechat-offwork-stats

微信群程序员下班时间统计 Web 应用。当前版本是一个可本地运行、可部署到阿里云服务器的 MVP，提供半匿名打卡、下班时间统计和基础趋势展示能力。

## 项目概述

这个项目用于统计微信群成员的“下班时间”分布，目标是以尽量低摩擦的方式收集数据，并以可视化方式展示群体节奏，而不是做个人排名。

当前实现包含：

- React + Vite 前端
- Fastify 后端 API
- MySQL 8 持久化存储
- 本地开发、Git hooks 和基础提交规范
- 面向阿里云的 Nginx + PM2 部署模板

## 核心功能

- 半匿名打卡：浏览器生成 `clientId` 和匿名代号
- 同一用户同一统计日支持多次提交
- 自动计算首次下班时间和最终下班时间
- 自动计算平均加班时长（基于默认标准下班时间）
- 凌晨 5 点前的数据自动归入前一个统计日
- 展示今日统计、时间分布、7 天 / 30 天趋势

## 技术栈

### 前端

- `React`
- `Vite`
- `TypeScript`
- `Recharts`

### 后端

- `Fastify`
- `Node.js`
- `TypeScript`

### 数据层

- `MySQL 8`
- `mysql2`

### 工程化

- `pnpm`
- `Biome`
- `Husky`
- `lint-staged`
- `commitlint`

## 环境要求

启动项目前，请确认本机具备以下环境：

- `Node.js >= 20`
- `pnpm >= 10`
- `MySQL 8`

建议在 macOS 上通过 Homebrew 安装 MySQL 8.4，并确保数据库服务已启动。

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制示例配置：

```bash
cp .env.example .env
```

然后根据本机数据库配置修改 `.env`。

示例：

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=offwork_app
DB_PASSWORD=StrongAppPass@2026
DB_NAME=offwork_stats
```

说明：

- 本地调试可暂时使用 `root`
- 部署环境建议使用独立应用账号
- `.env` 已被忽略，不会进入 Git

### 3. 初始化数据库

先创建数据库：

```sql
CREATE DATABASE offwork_stats CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```

然后创建应用账号（推荐）：

```sql
CREATE USER 'offwork_app'@'localhost' IDENTIFIED BY 'StrongAppPass@2026';
GRANT ALL PRIVILEGES ON offwork_stats.* TO 'offwork_app'@'localhost';
FLUSH PRIVILEGES;
```

如果服务器上的 Node 通过 `127.0.0.1` 连接数据库，也可以执行：

```sql
CREATE USER 'offwork_app'@'127.0.0.1' IDENTIFIED BY 'StrongAppPass@2026';
GRANT ALL PRIVILEGES ON offwork_stats.* TO 'offwork_app'@'127.0.0.1';
FLUSH PRIVILEGES;
```

也可以直接使用现成脚本：

```bash
mysql -uroot -p offwork_stats < ./server/create-app-user.sql
```

说明：

- 应用启动时会自动检查并创建 `checkout_entries` 表
- 建表语句见 `./server/schema.sql`

### 4. 启动开发环境

同时启动前后端：

```bash
pnpm dev
```

或者分别启动：

```bash
pnpm run dev:client
pnpm run dev:server
```

默认地址：

- 前端：`http://localhost:5173`
- 后端：`http://localhost:8787`
- 健康检查：`http://localhost:8787/api/health`

## 常用命令

### 开发命令

```bash
pnpm dev
pnpm run dev:client
pnpm run dev:server
```

### 代码质量

```bash
pnpm lint
pnpm format
```

### 构建与运行

```bash
pnpm build
pnpm start
```

说明：

- `pnpm start` 实际运行后端生产构建产物
- 前端生产产物输出在 `dist/`
- 后端生产产物输出在 `dist-server/`

## 项目结构

```text
.
├── src/                    # 前端页面、组件与样式
├── server/                 # 后端 API、数据库访问与 SQL 模板
├── shared/                 # 前后端共享类型与统计逻辑
├── docs/                   # 团队协作文档与规范模板
├── deploy/                 # 部署相关配置模板
├── ecosystem.config.cjs    # PM2 配置
├── biome.json              # Biome 配置
├── commitlint.config.cjs   # Commitlint 配置
└── README.md
```

目录说明：

- `src/`：前端页面、图表组件、请求逻辑
- `server/`：Fastify 路由、MySQL 存储、初始化脚本
- `shared/`：时间处理、统计计算、共享类型定义
- `docs/`：团队规范文档，如提交规范、分支命名、PR 模板
- `deploy/`：Nginx 等部署模板

## 数据与统计规则

当前统计规则的核心约束如下：

- 合法下班时间范围：`17:00` 到次日 `02:00`
- 统计日切换时间：凌晨 `05:00`
- 同一用户同一统计日允许重复提交
- 统计时分别计算：
  - 首次下班时间
  - 最终下班时间
  - 平均加班时长

说明：

- 当前默认加班计算基于固定的标准下班时间
- 规则更适合观察群体节奏，而非做个人考核

## 开发规范

项目已配置本地 Git hooks 和代码质量门禁。

### 提交前会执行

- `pre-commit`：运行 `lint-staged`
- `commit-msg`：运行 `commitlint`
- `pre-push`：运行 `pnpm lint` 和 `pnpm build`

### 提交信息

提交信息基于 Conventional Commits，常用类型包括：

- `feat`
- `fix`
- `docs`
- `chore`
- `ci`

## 项目文档

- Git 提交质量工具链说明：`./docs/GIT_TOOLING_GUIDE.md`
- 团队提交规范模板：`./docs/COMMIT_CONVENTION_TEMPLATE.md`
- 团队分支命名规范模板：`./docs/BRANCH_NAMING_TEMPLATE.md`
- Pull Request 描述模板：`./docs/PULL_REQUEST_TEMPLATE_GUIDE.md`

## 阿里云部署

推荐部署结构：

- `Nginx`：托管前端静态资源并反向代理 `/api`
- `PM2`：守护后端服务
- `MySQL 8`：本机部署或使用阿里云 RDS

### 生产部署步骤

```bash
pnpm install
pnpm build
pm2 start ecosystem.config.cjs --env production
pm2 save
```

相关配置文件：

- Nginx 配置模板：`./deploy/nginx.wechat-offwork-stats.conf`
- PM2 配置：`./ecosystem.config.cjs`
- MySQL 应用账号脚本：`./server/create-app-user.sql`

## 当前限制

当前版本仍有以下限制：

- 暂未接入微信登录
- 暂无后台管理界面
- 暂无权限体系
- 统计规则仍以 MVP 验证为主，尚未做复杂的群组与角色模型
- 前端图表库打包体积较大，生产构建会出现 chunk size warning

## 后续建议

如果继续演进，建议优先考虑以下方向：

1. 引入独立应用数据库账号，彻底移除本地开发中的 `root` 依赖
2. 将部分统计逻辑下推到 SQL 聚合，减少 Node 层内存计算
3. 增加后台配置能力（如统计规则、标准下班时间、群组管理）
4. 增加 CI 工作流，自动执行 `lint` 和 `build`
