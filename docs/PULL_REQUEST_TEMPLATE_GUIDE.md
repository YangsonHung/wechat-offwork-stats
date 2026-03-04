# Pull Request 描述模板

## 1. 文档目的

本文档提供一套通用的 Pull Request（PR）描述模板，用于提升代码评审效率和协作质量。

目标是：

- 让评审者快速理解改动内容
- 让提交者明确说明变更范围与影响
- 降低因上下文缺失导致的沟通成本
- 为上线、回滚、排查提供更完整的变更记录

---

## 2. 推荐的 PR 描述结构

推荐使用以下结构：

```md
## Summary
- 简要说明本次改动做了什么

## Changes
- 列出主要改动点

## Impact
- 说明影响范围

## Testing
- 说明验证方式和结果

## Risks
- 说明潜在风险和注意事项

## Related
- 关联需求、工单、Issue 或文档
```

---

## 3. 通用 PR 模板

以下模板可直接用于大多数项目：

```md
## Summary
- This PR introduces:
- This PR fixes:

## Changes
- Added:
- Updated:
- Removed:

## Impact
- Affected modules:
- User-facing changes:
- Backward compatibility:

## Testing
- [ ] Local verification completed
- [ ] Lint passed
- [ ] Build passed
- [ ] Relevant tests passed

### Verification Details
- Commands run:
- Manual checks:

## Risks
- Potential risks:
- Rollback plan:

## Related
- Issue:
- Ticket:
- Docs:
```

---

## 4. 各部分填写说明

### 4.1 `Summary`

用于概括本次 PR 的主要目标。

要求：

- 简短
- 聚焦核心目的
- 让评审者在几秒内知道本次改动的主题

示例：

```md
## Summary
- Add MySQL-based persistence for offwork stats
- Replace file storage with database-backed queries
```

---

### 4.2 `Changes`

用于拆解本次具体改动项。

建议按“新增 / 修改 / 删除”或按模块列出。

示例：

```md
## Changes
- Added MySQL connection pool and schema initialization
- Refactored API routes to query by stat date
- Removed JSON file-based storage path
```

---

### 4.3 `Impact`

用于说明本次改动的影响范围。

建议说明：

- 影响哪些模块
- 是否有用户可感知变化
- 是否涉及兼容性变化

示例：

```md
## Impact
- Affected modules: API, storage layer
- User-facing changes: none
- Backward compatibility: existing API paths remain unchanged
```

---

### 4.4 `Testing`

用于说明本次改动如何被验证。

建议包含：

- 执行过哪些命令
- 做过哪些手动验证
- 是否通过

示例：

```md
## Testing
- [x] Local verification completed
- [x] Lint passed
- [x] Build passed
- [x] Relevant tests passed

### Verification Details
- Commands run: `pnpm lint`, `pnpm build`
- Manual checks: verified `/api/stats/today` and `/api/me/today`
```

---

### 4.5 `Risks`

用于提前说明潜在风险，帮助评审者和上线人员关注关键点。

建议说明：

- 哪些地方可能出问题
- 是否涉及迁移
- 如何回滚

示例：

```md
## Risks
- Potential risks: database credentials misconfiguration may block server startup
- Rollback plan: revert to previous commit and restore file-based storage version
```

---

### 4.6 `Related`

用于关联上下文。

可以填写：

- Issue 编号
- 需求单号
- 设计文档
- 相关 PR

示例：

```md
## Related
- Issue: #12
- Ticket: PROJ-102
- Docs: ./GIT_TOOLING_GUIDE.md
```

---

## 5. 不同类型 PR 的建议写法

### 5.1 功能型 PR

重点说明：

- 新增了什么能力
- 对用户或业务有什么影响
- 兼容性是否变化

推荐模板：

```md
## Summary
- Add new feature for ...

## Changes
- Added:
- Updated:

## Impact
- User-facing changes:
- API changes:

## Testing
- Commands run:
- Manual checks:
```

---

### 5.2 修复型 PR

重点说明：

- 修复了什么问题
- 触发条件是什么
- 如何验证修复有效

推荐模板：

```md
## Summary
- Fix issue where ...

## Root Cause
- The issue was caused by ...

## Fix
- Updated:

## Testing
- Reproduced issue before fix
- Verified behavior after fix
```

---

### 5.3 文档型 PR

重点说明：

- 更新了哪些文档
- 文档服务于什么目的

推荐模板：

```md
## Summary
- Update documentation for ...

## Changes
- Added:
- Updated:

## Related
- Linked docs:
```

---

### 5.4 工具链 / 配置型 PR

重点说明：

- 增加了什么工程约束
- 会如何影响本地开发流程
- 是否会影响 CI 或提交流程

推荐模板：

```md
## Summary
- Add developer tooling for ...

## Changes
- Added:
- Updated:

## Impact
- Local workflow:
- CI workflow:
```

---

## 6. 实践建议

### 6.1 PR 描述应服务于评审，而不是重复提交记录

PR 描述不应只是把 commit message 再抄一遍，而应补充：

- 改动背景
- 范围
- 风险
- 验证方式

### 6.2 先写“为什么”和“影响”，再写细节

评审者最关心的是：

- 这次改动要解决什么问题
- 会影响哪里
- 有没有风险

因此，PR 描述开头应优先提供这些信息。

### 6.3 对于较大 PR，明确标出评审重点

如果 PR 较大，建议增加：

```md
## Review Focus
- Please focus on:
```

这样能帮助评审者把注意力集中在关键变更处。

### 6.4 不要省略验证信息

“已测试”这种表述价值很低，建议明确写出：

- 执行了哪些命令
- 手动检查了哪些路径
- 哪些场景已覆盖

### 6.5 风险说明应具体

推荐：

```md
- Potential risks: incorrect DB credentials will prevent API startup
```

不推荐：

```md
- Risks: low
```

---

## 7. 推荐模板（精简版）

适合日常使用的精简模板如下：

```md
## Summary
- 

## Changes
- 

## Impact
- 

## Testing
- 

## Risks
- 

## Related
- 
```

---

## 8. 总结

一份好的 PR 描述应具备以下特点：

- 能快速说明改动目的
- 能准确描述改动范围
- 能明确说明验证方式
- 能提前暴露潜在风险

建议团队统一模板，并在此基础上按项目规模逐步细化。
