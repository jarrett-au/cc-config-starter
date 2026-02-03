# Rule Quality Guidelines

Standards for evaluating and improving generated rules.

## The 3C Principle

**Concise** → **Contextual** → **Constraint-focused**

### Concise
- One rule = one line (when possible)
- Maximum 60 lines per rule file
- No paragraphs explaining concepts

### Contextual
- Every non-global file has `paths:` frontmatter
- Reference existing docs, don't duplicate
- Use project-specific terminology

### Constraint-focused
- Focus on what NOT to do
- Highlight exceptions to common patterns
- Describe boundaries, not tutorials

---

## Good vs Bad Rules

### Naming Rules

**Bad:**
```markdown
When naming files in Go, you should use snake_case. This means words are 
separated by underscores and all letters are lowercase. For example, 
`user_service.go` instead of `UserService.go`.
```

**Good:**
```markdown
- Files: `snake_case.go`
- Tests: `*_test.go` co-located
```

### Pattern Rules

**Bad:**
```markdown
## Error Handling Pattern

In this project, we handle errors using the following pattern. First, 
you wrap the error with context using fmt.Errorf:

​```go
if err != nil {
    return fmt.Errorf("failed to create user: %w", err)
}
​```

Then in the calling code, you check for specific errors using errors.Is():

​```go
if errors.Is(err, domain.ErrNotFound) {
    return nil, errno.ErrNotFound
}
​```
```

**Good:**
```markdown
## Errors
- Wrap: `fmt.Errorf("[action]: %w", err)`
- Check: `errors.Is(err, domain.Err[X])`
- Define in: `internal/domain/errors.go`
```

### Architecture Rules

**Bad:**
```markdown
## Clean Architecture

This project follows Clean Architecture principles. The architecture 
consists of four layers:

1. Domain Layer - Contains business entities and interfaces
2. Service Layer - Contains business logic
3. API Layer - Contains HTTP handlers
4. Infrastructure Layer - Contains external implementations

Dependencies should only point inward...
[continues for 50 more lines]
```

**Good:**
```markdown
## Layers
- Domain (`internal/domain/`): entities, interfaces — zero dependencies
- Service (`internal/service/`): business logic — depends on domain only
- API (`internal/api/`): HTTP handlers — depends on service
- Infra (`internal/infra/`): implementations — implements domain interfaces

## Forbidden Imports
- Domain must NOT import service/api/infra
- Service must NOT import api/infra
```

---

## Paths Configuration Examples

### Match by Directory

```yaml
paths:
  - "internal/api/**/*"          # All files in api tree
  - "internal/handlers/**/*"     # All files in handlers tree
```

### Match by Extension

```yaml
paths:
  - "**/*.go"                    # All Go files
  - "**/*.{ts,tsx}"              # TypeScript + TSX files
```

### Match Test Files

```yaml
paths:
  - "**/*_test.go"               # Go tests
  - "**/*.test.{ts,js}"          # JS/TS tests
  - "**/test/**/*"               # Test directory
```

### Match Config Files

```yaml
paths:
  - "configs/**/*"
  - "**/*.yaml"
  - "**/*.json"
```

### Multiple Related Paths

```yaml
paths:
  - "internal/infra/persistence/**/*"
  - "internal/repository/**/*"
  - "db/migrations/**/*"
```

---

## When NOT to Use Paths

Only these types of rules should be global (no paths):

1. **Architecture rules** - Layer structure applies everywhere
2. **Git/workflow rules** - Not code-specific
3. **Project overview** - CLAUDE.md main file
4. **Cross-cutting patterns** - Logging, error handling philosophy

Everything else should have `paths:` frontmatter.

---

## Size Guidelines

| File Type | Target Lines | Max Lines |
|-----------|--------------|-----------|
| CLAUDE.md | 50-80 | 100 |
| architecture.md | 30-50 | 60 |
| api.md | 30-50 | 60 |
| database.md | 30-50 | 60 |
| testing.md | 30-45 | 55 |
| domain.md | 25-40 | 50 |
| workflow.md | 40-60 | 70 |
| **Total all files** | **250-400** | **500** |

---

## Review Checklist

Before finalizing rules, verify:

### Structure
- [ ] `paths:` frontmatter on all non-global files
- [ ] No file exceeds 60 lines
- [ ] Total rules < 500 lines

### Content
- [ ] No code blocks longer than 3 lines
- [ ] No explanatory paragraphs
- [ ] Each bullet is actionable
- [ ] Uses `@path` to reference existing docs

### Specificity
- [ ] Rules are project-specific, not generic
- [ ] Actual paths/commands from this project
- [ ] Mentions specific patterns used here

### Completeness
- [ ] Key architectural constraints captured
- [ ] Critical "don't do" rules included
- [ ] Development workflow covered
