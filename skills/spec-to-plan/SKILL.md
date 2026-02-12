---
name: spec-to-plan
description: 规范化软件开发项目规划流程。当用户提出新功能需求、重构任务或复杂开发任务时使用。引导用户按照「先完善 spec 文档到 docs/specs/，再使用 planning-with-files 生成实施计划到 docs/plans/」的流程。
---

# Spec to Plan

规范化软件开发项目规划流程，确保每个开发任务都有完善的 spec 文档和详细的实施计划。

## 工作流程

当用户提出开发需求时，按照以下两步流程进行：

### 第一步：完善 Spec 文档

使用 `spec-forge` 与用户沟通，完善 spec 文档并保存到 `docs/specs/YYYYMMDD_<标题>.md`。

### 第二步：生成实施计划

Spec 完善后，使用 `planning-with-files skill` 生成实施计划：

**调用方式**：

```
请使用 planning-with-files skill 基于以下 spec 生成实施计划：
- Spec 路径：docs/specs/YYYYMMDD_<标题>.md
- 计划目录：docs/plans/YYYYMMDD_<标题>/
```

**生成的文件**：

- `docs/plans/YYYYMMDD_<标题>/task_plan.md` - 详细任务分解
- `docs/plans/YYYYMMDD_<标题>/progress.md` - 进度跟踪
- `docs/plans/YYYYMMDD_<标题>/findings.md` - 发现和问题记录

## 命名规范

**Spec 文档**：`docs/specs/YYYYMMDD_<标题>.md`
- 使用日期前缀（YYYYMMDD）
- 标题使用下划线分隔单词
- 示例：`docs/specs/20260210_user_authentication_spec.md`

**计划目录**：`docs/plans/YYYYMMDD_<标题>/`
- 与 spec 同名（去除 .md 扩展名）
- 示例：`docs/plans/20260210_user_authentication/`

**计划文件**：
- `task_plan.md` - 固定名称，不含日期
- `progress.md` - 固定名称，不含日期
- `findings.md` - 固定名称，不含日期

## 快速示例

**用户输入**：
> 我需要实现一个用户认证系统

**执行流程**：

1. **沟通需求**，确认：
   - 技术选型（JWT/Session）
   - 是否需要 OAuth
   - 安全要求

2. **创建 Spec**：
   ```bash
   docs/specs/20260210_user_authentication_spec.md
   ```

3. **生成计划**，调用 planning-with-files skill：
   ```
   基于 docs/specs/20260210_user_authentication_spec.md
   生成到 docs/plans/20260210_user_authentication/
   ```

4. **结果**：
   ```
   docs/plans/20260210_user_authentication/
   ├── task_plan.md
   ├── progress.md
   └── findings.md
   ```

## 常见场景

**场景 1：全新功能**
- 用户提出新功能需求
- 完整流程：沟通需求 → 创建 spec → 生成计划

**场景 2：重构任务**
- 用户提出重构现有代码
- spec 重点：当前问题、目标架构、迁移路径

**场景 3：已有 Spec**
- 用户已提供 spec 文档
- 直接进入第二步：生成实施计划

**场景 4：Spec 迭代**
- spec 需要修改
- 编辑 spec 文档后重新生成计划

## 注意事项

1. **Spec 完善后再生成计划**：不要在 spec 不完整的情况下生成计划
2. **命名一致性**：计划目录名称必须与 spec 文件名保持一致
3. **日期前缀必须准确**：使用 spec 创建日期的 YYYYMMDD 格式
4. **计划文件固定命名**：不要给 task_plan.md、progress.md、findings.md 添加日期前缀
