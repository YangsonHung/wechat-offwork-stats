# 团队分支命名规范模板

## 1. 文档目的

本文档提供一套适用于团队协作的 Git 分支命名规范模板，目标是：

- 提高分支用途的可识别性
- 降低多人协作时的沟通成本
- 让任务类型、影响范围和工单信息更容易被追踪

---

## 2. 推荐命名格式

推荐使用以下统一格式：

```text
<type>/<scope>-<short-description>
```

如果需要关联工单，也可以使用：

```text
<type>/<ticket>-<short-description>
```

示例：

```text
feat/api-offwork-trend
fix/ui-mobile-layout
docs/git-tooling-guide
chore/tooling-upgrade
ci/github-actions-build
feat/PROJ-102-add-user-login
```

---

## 3. 分支类型定义

### 3.1 `feat/`

用于新功能开发分支。

适用场景：

- 新增页面
- 新增接口
- 新增业务流程
- 新增可配置能力

示例：

```text
feat/api-offwork-trend
feat/auth-email-login
```

---

### 3.2 `fix/`

用于缺陷修复分支。

适用场景：

- 修复线上或测试环境 bug
- 修复边界条件问题
- 修复布局异常
- 修复接口错误

示例：

```text
fix/api-mysql-timezone
fix/ui-chart-overflow
```

---

### 3.3 `docs/`

用于文档类修改分支。

适用场景：

- 新增说明文档
- 修改 README
- 更新部署文档
- 补充团队规范文档

示例：

```text
docs/commit-convention
docs/deploy-checklist
```

---

### 3.4 `chore/`

用于日常维护、工具配置、依赖调整等非功能性变更。

适用场景：

- 升级依赖
- 调整开发工具配置
- 清理无用文件
- 优化本地开发流程

示例：

```text
chore/biome-config
chore/pnpm-upgrade
```

---

### 3.5 `ci/`

用于 CI/CD 相关变更。

适用场景：

- 新增或修改流水线
- 调整构建门禁
- 修改部署脚本
- 调整 Git hooks 以外的自动化流程

示例：

```text
ci/github-actions-build
ci/release-pipeline
```

---

### 3.6 可选扩展类型

如果团队规模较大或流程更细，也可以补充：

```text
refactor/<scope>-<short-description>
test/<scope>-<short-description>
build/<scope>-<short-description>
hotfix/<scope>-<short-description>
```

---

## 4. 命名字段建议

### 4.1 `scope`

建议使用能够快速表达影响范围的标识，例如：

- `api`
- `ui`
- `auth`
- `db`
- `deploy`
- `tooling`

### 4.2 `short-description`

建议使用简短、清晰的英文短语：

- 使用连字符 `-`
- 不要过长
- 不要包含空格
- 避免含义模糊的词

推荐：

```text
fix/api-date-parsing
feat/user-profile-page
```

不推荐：

```text
fix/some-bug
feat/update-stuff
```

---

## 5. 工单号命名建议

如果团队使用 Jira、TAPD、禅道、Linear 等工具，建议将工单号纳入分支名。

格式示例：

```text
feat/PROJ-102-add-user-login
fix/BUG-231-handle-null-response
docs/DOC-18-update-readme
```

这样可以带来以下收益：

- 分支与任务直接关联
- PR 和发布记录更易追踪
- 回溯历史时更容易定位背景

---

## 6. 命名实践建议

### 6.1 保持统一，不要混用多种风格

建议团队统一采用一种格式，例如：

```text
<type>/<scope>-<short-description>
```

不要同时混用以下风格：

```text
feature/add-login
feat_add_login
fix-login-page
```

### 6.2 分支名应体现“用途”，而不是“个人习惯”

推荐：

```text
feat/api-offwork-trend
```

不推荐：

```text
yangsonhung-test
temp-branch
new-branch
```

### 6.3 短期临时分支也建议使用规范命名

即使是短期分支，也建议保持一致规范，避免仓库中出现大量无法识别用途的分支。

### 6.4 `main` / `master` / `develop` 等主干分支应单独约定

团队通常会单独约定以下主干分支用途：

- `main` / `master`：生产稳定分支
- `develop`：开发集成分支（如采用 Git Flow）
- `release/*`：发布准备分支（可选）

业务开发分支不建议直接使用这些命名模式。

---

## 7. 推荐模板

可以直接采用如下模板：

```text
feat/<scope>-<short-description>
fix/<scope>-<short-description>
docs/<scope>-<short-description>
chore/<scope>-<short-description>
ci/<scope>-<short-description>
```

如果需要工单号，则采用：

```text
feat/<ticket>-<short-description>
fix/<ticket>-<short-description>
docs/<ticket>-<short-description>
```

---

## 8. 总结

一套好的分支命名规范应满足以下要求：

- 一眼能看出分支用途
- 命名简洁
- 风格统一
- 可与工单系统关联

建议从最小可执行规范开始，在团队稳定执行后再扩展更细的命名规则。
