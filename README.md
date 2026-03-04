# wechat-offwork-stats

微信群程序员下班时间统计 MVP。

## 项目文档

- Git 提交质量工具链说明：`./GIT_TOOLING_GUIDE.md`
- 团队提交规范模板：`./COMMIT_CONVENTION_TEMPLATE.md`

## 功能

- 半匿名打卡（浏览器生成 `clientId` 和匿名代号）
- 支持同一用户同日多次提交
- 自动计算首次下班、最终下班、平均加班分钟
- 凌晨 5 点前自动归入前一个统计日
- 今日统计、时间分布、7 天 / 30 天趋势
- 使用 MySQL 8 持久化，便于本地开发和后续部署到阿里云

## 环境变量

先复制一份配置文件：

```bash
cp .env.example .env
```

然后按你的实际数据库账号修改 `.env`。本地调试可以先用 `root`，部署时建议改成应用账号。

## 本地运行

```bash
pnpm install
pnpm dev
```

默认地址：

- 前端：`http://localhost:5173`
- 后端：`http://localhost:8787`
- MySQL：默认连接 `127.0.0.1:3306/offwork_stats`

## 构建

```bash
pnpm build
```

## 当前限制

- 默认按本机 MySQL 运行，生产环境仍需单独做备份和权限配置
- 建议为应用单独创建数据库账号，不要长期使用 `root`
- 没有微信登录和后台管理
- 适合先验证统计规则和页面流程，后续可迁移到阿里云 MySQL 或托管数据库

## 建议的 MySQL 应用账号

```sql
CREATE USER 'offwork_app'@'localhost' IDENTIFIED BY 'StrongAppPass@2026';
GRANT ALL PRIVILEGES ON offwork_stats.* TO 'offwork_app'@'localhost';
FLUSH PRIVILEGES;
```

然后把 `.env` 改成对应账号即可。

如果要允许阿里云上本机 Node 连接数据库，也可以在服务器上使用：

```sql
CREATE USER 'offwork_app'@'127.0.0.1' IDENTIFIED BY 'StrongAppPass@2026';
GRANT ALL PRIVILEGES ON offwork_stats.* TO 'offwork_app'@'127.0.0.1';
FLUSH PRIVILEGES;
```

## 阿里云部署

推荐结构：

- `Nginx` 托管前端 `dist/`
- `PM2` 守护后端 `dist-server/server/index.js`
- `MySQL 8` 本机或 RDS

首次部署：

```bash
pnpm install
pnpm build
pm2 start ecosystem.config.cjs --env production
pm2 save
```

Nginx 配置模板见 [deploy/nginx.wechat-offwork-stats.conf](/Users/yangsonhung/Projects/personal/wechat-offwork-stats/deploy/nginx.wechat-offwork-stats.conf)。
PM2 配置见 [ecosystem.config.cjs](/Users/yangsonhung/Projects/personal/wechat-offwork-stats/ecosystem.config.cjs)。
MySQL 应用账号脚本见 [server/create-app-user.sql](/Users/yangsonhung/Projects/personal/wechat-offwork-stats/server/create-app-user.sql)。
