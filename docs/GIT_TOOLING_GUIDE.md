# Git 提交质量工具链说明

## 1. 文档目的

本文档说明以下工具在工程中的职责、典型配置方式，以及它们在 Git 提交流程中的协作关系：

- `@biomejs/biome`
- `@commitlint/cli`
- `@commitlint/config-conventional`
- `husky`
- `lint-staged`

这组工具通常用于建立一套稳定、可自动执行的本地代码质量门禁，目标是：

- 统一代码风格
- 在提交前发现低级错误
- 约束提交信息格式
- 在推送前增加基础质量检查

---

## 2. 工具职责

### 2.1 `@biomejs/biome`

#### 定位

`Biome` 是一体化代码质量工具，通常用于承担以下职责：

- 代码格式化
- 静态检查
- 基础风格约束

在很多项目中，它用于替代部分或全部以下工具组合：

- `Prettier`
- `ESLint`（部分规则场景）

#### 典型用途

- 统一团队代码格式
- 在提交前自动修复可修复问题
- 在 CI 中执行基础静态检查

#### 常见命令

```bash
biome check .
biome check --write .
biome format .
biome format --write .
```

---

### 2.2 `@commitlint/cli`

#### 定位

`@commitlint/cli` 是提交信息校验器，用于检查 Git commit message 是否符合既定规范。

它只负责“执行校验”，不负责定义规则本身。

#### 典型用途

- 挂载在 `commit-msg` hook 中
- 在开发者执行 `git commit` 时校验提交信息
- 阻止不符合规范的提交进入仓库历史

#### 常见命令

```bash
commitlint --edit $1
echo "feat: add feature" | commitlint
```

---

### 2.3 `@commitlint/config-conventional`

#### 定位

这是 `commitlint` 的规则集，基于 Conventional Commits 规范。

它负责定义“什么样的提交信息是合法的”，但不直接执行校验。

#### 常见提交格式

```text
feat: add user profile page
fix(api): handle invalid token
docs: update setup guide
chore: upgrade dependencies
```

#### 常见配置

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

---

### 2.4 `husky`

#### 定位

`husky` 用于管理 Git hooks，使项目可以将本地提交流程中的自动化检查纳入版本控制。

它的核心作用是：在指定的 Git 生命周期节点自动执行脚本。

#### 常见 hook 类型

- `pre-commit`
- `commit-msg`
- `pre-push`

#### 典型用途

- 在 `pre-commit` 中触发 `lint-staged`
- 在 `commit-msg` 中触发 `commitlint`
- 在 `pre-push` 中触发 `lint`、`test`、`build`

#### 初始化命令

```bash
husky init
```

初始化后，项目中通常会出现如下文件：

```text
.husky/pre-commit
.husky/commit-msg
.husky/pre-push
```

---

### 2.5 `lint-staged`

#### 定位

`lint-staged` 用于仅处理当前暂存区中的文件。

它的核心价值是将提交前检查限定在“本次提交涉及的文件”，而不是对整个仓库做全量扫描。

#### 典型用途

- 对本次暂存的代码执行格式化
- 对本次暂存的文件执行基础 lint
- 在提交前自动修复可修复问题，并重新加入暂存区

#### 示例配置

```json
{
  "lint-staged": {
    "*.{js,ts,tsx,json}": ["biome check --write"]
  }
}
```

---

## 3. 工具之间的协作关系

这 5 个工具通常不是独立使用，而是组成一套“本地提交流程质量门禁”。

### 3.1 典型提交流程

当开发者执行以下命令时：

```bash
git add .
git commit -m "feat: add feature"
```

通常会经历如下流程：

1. Git 触发 `pre-commit`
2. `husky` 执行 `.husky/pre-commit`
3. `pre-commit` 中调用 `lint-staged`
4. `lint-staged` 仅处理当前暂存文件
5. `lint-staged` 调用 `Biome` 对这些文件进行检查或自动修复
6. 若校验失败，提交终止
7. 若 `pre-commit` 通过，Git 触发 `commit-msg`
8. `husky` 执行 `.husky/commit-msg`
9. `commit-msg` 中调用 `commitlint`
10. `commitlint` 使用 `@commitlint/config-conventional` 校验提交信息
11. 若提交信息不符合规范，提交终止

### 3.2 典型推送流程

当开发者执行以下命令时：

```bash
git push
```

通常可以增加如下校验：

1. Git 触发 `pre-push`
2. `husky` 执行 `.husky/pre-push`
3. 运行 `lint`
4. 运行 `test`（可选）
5. 运行 `build`
6. 若任一项失败，则阻止推送

---

## 4. 职责边界

为了避免配置混乱，建议明确每个工具的职责边界：

### `Biome`

负责代码内容层面的格式化与静态检查。

### `lint-staged`

负责限定检查范围，只处理本次提交涉及的暂存文件。

### `husky`

负责将检查流程接入 Git hooks。

### `commitlint`

负责检查提交信息内容是否符合约定格式。

### `config-conventional`

负责提供提交信息校验规则。

---

## 5. 通用配置示例

### 5.1 `package.json` 脚本

```json
{
  "scripts": {
    "lint": "biome check .",
    "format": "biome check --write .",
    "prepare": "husky"
  }
}
```

### 5.2 `lint-staged` 配置

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,json,css}": ["biome check --write"]
  }
}
```

### 5.3 `commitlint` 配置

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
};
```

### 5.4 `.husky/pre-commit`

```sh
pnpm exec lint-staged
```

### 5.5 `.husky/commit-msg`

```sh
pnpm exec commitlint --edit "$1"
```

### 5.6 `.husky/pre-push`

```sh
pnpm lint
pnpm build
```

如需更严格的门禁，也可以扩展为：

```sh
pnpm lint
pnpm test
pnpm build
```

---

## 6. 适用场景

这套工具链适用于以下类型的项目：

- 前端项目
- Node.js 项目
- TypeScript 项目
- 小型到中型团队协作项目
- 希望保持提交历史规范的个人项目

其主要收益包括：

- 提升代码风格一致性
- 在本地提前发现问题
- 降低低质量提交进入仓库的概率
- 提升提交历史的可读性与可维护性

---

## 7. 实践建议

### 7.1 先建立基础门禁，再逐步加强

建议优先建立以下最小可用流程：

- `pre-commit`：运行 `lint-staged`
- `commit-msg`：运行 `commitlint`
- `pre-push`：运行 `lint + build`

这是成本较低、收益较高的起步方式。

### 7.2 `pre-commit` 应保持快速

`pre-commit` 的目标是快速失败，而不是承担所有校验工作。

建议放入：

- 格式化
- 基础静态检查
- 可自动修复的规则

不建议放入：

- 全量构建
- 长时间运行的测试
- 大规模全仓扫描

### 7.3 将耗时检查放到 `pre-push` 或 CI

下列操作更适合放在 `pre-push` 或 CI：

- 完整测试
- 全量构建
- 覆盖率检查
- 集成测试

这样可以在不牺牲本地提交体验的前提下，保留必要的质量控制。

### 7.4 保持提交信息规范简单且稳定

建议优先使用常见的 Conventional Commits 类型：

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`
- `ci`

不建议在早期引入过多自定义提交类型，否则会增加理解和执行成本。

### 7.5 自动修复优先

凡是可以自动修复的问题，应尽可能使用工具自动处理。

这样可以：

- 降低人工整理代码格式的时间成本
- 减少无意义的代码风格争议
- 让开发者关注业务逻辑而非格式细节

### 7.6 避免将敏感文件纳入自动流程

以下文件通常不应纳入自动格式化或提交流程：

- `.env`
- 私钥
- 凭证文件
- 构建产物
- 大体积生成文件

这些文件应通过 `.gitignore` 和流程约束单独管理。

### 7.7 让失败信息足够直观

当 hook 失败时，开发者最需要明确知道：

- 哪一步失败
- 为什么失败
- 应该执行什么命令修复

因此，hook 脚本应保持简单、直接，避免写成难以维护的复杂壳逻辑。

### 7.8 单人项目同样值得配置

即使是单人项目，这套工具链也仍然有价值：

- 保持提交历史可读
- 防止代码风格逐步失控
- 为后续协作或开源留出更规范的基础

但应注意控制复杂度，避免为了工具增加不必要的开发负担。

### 7.9 工具应服务于开发效率

这套工具链的目标是提高工程质量，而不是制造额外阻力。

如果当前配置已经出现以下问题，应考虑简化规则：

- 提交耗时过长
- 频繁出现低价值阻塞
- 团队成员倾向于绕过流程

原则上，应优先保留高收益、低阻力的检查项。

---

## 8. 总结

这 5 个工具在工程中的典型分工如下：

- `@biomejs/biome`：负责代码格式化与静态检查
- `lint-staged`：负责限定处理范围，仅检查暂存文件
- `husky`：负责将检查流程挂载到 Git hooks
- `@commitlint/cli`：负责执行提交信息校验
- `@commitlint/config-conventional`：负责提供提交信息校验规则

它们组合后，可以形成一套常见且实用的本地提交质量门禁体系。
