# 团队提交规范模板

## 1. 文档目的

本文档提供一套可直接用于团队协作的 Git 提交规范模板，基于 Conventional Commits 约定。

目标是：

- 统一提交信息格式
- 提高提交历史可读性
- 降低多人协作时的沟通成本
- 为后续自动化生成日志、发布说明、版本管理提供基础

---

## 2. 基本格式

推荐统一使用以下格式：

```text
<type>[optional scope]: <description>
```

示例：

```text
feat: add user login page
fix(api): handle mysql connection timeout
docs: update deployment guide
chore: upgrade development dependencies
ci: add pre-push build check
```

格式说明：

- `type`：提交类型，表示本次变更的性质
- `scope`：可选，表示影响范围或模块
- `description`：简洁描述本次变更，使用英文小写开头的祈使句更常见

---

## 3. 提交类型与使用边界

以下是团队中最常用的一组提交类型及其边界定义。

### 3.1 `feat`

#### 定义

用于提交“新功能”或“对用户可感知的新能力”。

#### 适用场景

- 新增页面
- 新增接口
- 新增业务能力
- 新增交互流程
- 新增可配置功能

#### 示例

```text
feat: add offwork time submission page
feat(api): add daily trend statistics endpoint
feat(auth): support email login
```

#### 不适用场景

- 修复现有功能 bug
- 仅调整文档
- 仅调整构建或开发工具

---

### 3.2 `fix`

#### 定义

用于提交“缺陷修复”。

#### 适用场景

- 修复运行时报错
- 修复逻辑错误
- 修复边界条件处理错误
- 修复接口返回异常
- 修复布局异常或交互故障

#### 示例

```text
fix: prevent submitting future offwork time
fix(api): handle mysql date string parsing
fix(ui): correct mobile layout overflow
```

#### 不适用场景

- 为现有功能新增新能力
- 单纯重构但不改变结果
- 文档修改

---

### 3.3 `docs`

#### 定义

用于仅修改文档内容，不涉及业务代码行为变化。

#### 适用场景

- 新增说明文档
- 修改 README
- 补充部署指南
- 增加开发规范文档
- 更新注释型文档（前提是不改实际逻辑）

#### 示例

```text
docs: add git tooling guide
docs: update mysql setup instructions
docs: add commit convention template
```

#### 不适用场景

- 文档更新同时伴随代码逻辑修改
- 改动配置导致行为变化

如果文档和代码一起改，通常应以“代码变更的主类型”为准，而不是 `docs`。

---

### 3.4 `chore`

#### 定义

用于日常维护类变更。这类变更通常不直接新增功能，也不属于缺陷修复。

#### 适用场景

- 调整开发工具配置
- 更新依赖（不涉及明显功能修复）
- 清理无用文件
- 调整脚手架
- 优化本地开发环境配置

#### 示例

```text
chore: add code quality tooling
chore: upgrade project dependencies
chore: clean up unused assets
```

#### 不适用场景

- 实际修复了某个 bug（应使用 `fix`）
- 引入了新能力（应使用 `feat`）
- 仅修改文档（应使用 `docs`）

---

### 3.5 `ci`

#### 定义

用于持续集成和持续交付相关变更。

#### 适用场景

- 新增或修改 GitHub Actions / GitLab CI
- 调整流水线步骤
- 增加推送前校验
- 修改自动部署流程
- 新增构建门禁

#### 示例

```text
ci: add pre-push quality gate
ci: add github actions build workflow
ci: update release pipeline
```

#### 不适用场景

- 仅本地开发工具配置，不涉及 CI/CD 流程（通常用 `chore`）
- 纯业务代码变更

---

### 3.6 `refactor`

#### 定义

用于重构代码结构，但不引入新功能，也不修复外部可感知的缺陷。

#### 适用场景

- 拆分模块
- 提取公共函数
- 优化代码结构
- 提升可维护性

#### 示例

```text
refactor: split mysql access into dedicated store methods
refactor(api): simplify route handler structure
```

#### 不适用场景

- 重构同时修复了线上 bug（优先用 `fix`）
- 重构同时新增功能（优先用 `feat`）

---

### 3.7 `test`

#### 定义

用于测试代码相关变更。

#### 适用场景

- 新增单元测试
- 修改测试用例
- 增加集成测试
- 调整测试工具配置（若主要目的是测试）

#### 示例

```text
test: add coverage for offwork stats calculation
test(api): add route validation tests
```

---

### 3.8 `build`

#### 定义

用于构建系统、打包行为、依赖产物相关变更。

#### 适用场景

- 修改打包配置
- 调整 Vite/Webpack/Rollup 构建逻辑
- 修改 Docker 构建过程
- 调整产物输出方式

#### 示例

```text
build: optimize vite chunk splitting
build: update docker image build process
```

#### 与 `ci` 的区别

- `build`：关注“项目如何被构建”
- `ci`：关注“流水线如何执行检查、构建、部署”

---

## 4. `scope` 的使用建议

`scope` 不是必须项，但在中大型项目中建议使用。

### 建议使用 `scope` 的场景

- 项目模块较多
- 前后端分层明显
- 多人并行开发，需要更快定位影响范围

### 常见 `scope` 示例

```text
feat(api): add trend endpoint
fix(ui): correct chart tooltip overflow
chore(tooling): add biome config
docs(deploy): update nginx setup guide
```

### 建议的 `scope` 取值来源

- 业务模块名
- 技术层级（如 `api`、`ui`、`auth`、`db`）
- 文档域（如 `deploy`、`readme`、`tooling`）

不建议：

- 使用含义不清的缩写
- 使用过于随意的 scope
- 同一项目中同时使用多套命名风格

---

## 5. 描述行（description）编写建议

描述行应满足以下要求：

- 简短
- 明确
- 聚焦单一变更
- 避免冗长背景说明

### 推荐写法

```text
feat: add user login page
fix: handle missing root element
docs: add deployment checklist
```

### 不推荐写法

```text
feat: added a lot of things
fix: fix bug
chore: update
docs: some docs changes
```

### 建议规则

- 尽量控制在一行内
- 避免使用模糊词，如 `update`、`change`、`modify`
- 优先写“做了什么”，而不是“为什么做”

---

## 6. 提交拆分原则

好的提交信息依赖于“合理的提交粒度”。

建议遵循以下原则：

### 6.1 一个提交只做一件事

推荐：

- 一个提交只包含一个明确目标

例如：

```text
feat: add mysql storage support
docs: add mysql setup guide
```

而不是把功能、文档、配置全部混在一个提交里。

### 6.2 优先按“变更性质”拆分

若同一轮开发中包含多类变更，优先拆成多个提交：

- 功能代码
- 文档更新
- 工具配置
- 测试补充

### 6.3 如果多个文件共同完成一个目标，可以放在同一提交中

例如：

- 新增接口
- 修改前端调用
- 增加类型定义

只要它们共同服务于同一个功能目标，可以使用一个 `feat` 提交。

---

## 7. 推荐的团队最小规范

对于大多数团队，建议先采用以下最小规范：

### 必须项

- 所有提交必须符合 Conventional Commits
- 至少启用以下类型：
  - `feat`
  - `fix`
  - `docs`
  - `chore`
  - `ci`

### 推荐项

- 模块较多时启用 `scope`
- 提交前启用 `pre-commit`
- 提交信息启用 `commit-msg`
- 推送前启用 `pre-push`

### 示例

```text
feat(api): add user statistics endpoint
fix(ui): handle empty chart state
docs: add git tooling guide
chore(tooling): add biome and husky
ci: add pre-push build check
```

---

## 8. 常见误用与修正建议

### 情况 1：把所有小改动都写成 `chore`

问题：

- 提交历史失去信息价值

修正：

- 新功能用 `feat`
- 修复 bug 用 `fix`
- 只有真正的维护类工作才用 `chore`

### 情况 2：文档和功能代码混在一个 `docs` 提交里

问题：

- 提交类型与实际变更不符

修正：

- 若代码行为有变化，应使用代码变更对应的类型
- 文档可拆成独立提交，或并入主提交但保持主类型正确

### 情况 3：描述过于模糊

问题：

- 后续无法通过日志快速理解变更内容

修正：

- 使用明确动作 + 明确对象的方式描述

例如：

```text
fix: handle mysql access denied error
```

优于：

```text
fix: fix issue
```

---

## 9. 推荐模板

团队可以直接采用以下模板作为默认标准：

```text
feat(<scope>): <description>   # 新功能
fix(<scope>): <description>    # 缺陷修复
docs(<scope>): <description>   # 文档更新
chore(<scope>): <description>  # 日常维护
ci(<scope>): <description>     # CI/CD 相关
refactor(<scope>): <description> # 重构
test(<scope>): <description>   # 测试相关
build(<scope>): <description>  # 构建相关
```

如果暂时不使用 `scope`，则统一采用：

```text
feat: <description>
fix: <description>
docs: <description>
chore: <description>
ci: <description>
```

---

## 10. 总结

一套可执行、可维护的提交规范应具备以下特征：

- 类型边界清晰
- 描述简洁明确
- 提交粒度合理
- 团队成员容易理解和执行

建议先从最小规范开始，保证所有成员都能稳定遵守，再逐步增加更细的约束。
