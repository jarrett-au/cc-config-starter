---
name: codebase-rules-generator
description: Analyze a codebase's architecture, conventions, and patterns to generate comprehensive Claude Code rules. This skill should be used when the user requests to analyze a project and generate .claude/rules/ files, or asks to create CLAUDE.md/rules for a codebase. Triggers on requests like "analyze this codebase and generate claude rules", "create claude code rules for this project", or "generate .claude/rules for this repo".
---

# Codebase Rules Generator

Generate lean, targeted Claude Code rules that precisely guide AI code generation.

## Core Philosophy: Concise Over Comprehensive

**Good rules are:**
- Concise: One rule, one line when possible
- Targeted: Use `paths:` to scope rules to specific directories
- Actionable: Clear "do this" / "don't do that" guidance
- Pattern-focused: Describe patterns, not implementations

**Bad rules contain:**
- Long code examples (move to referenced docs instead)
- Generic advice that applies to any project
- Redundant information already in source files
- Explanations of "why" (focus on "what" and "how")

## Rule Writing Principles

### 1. Use `paths:` Frontmatter Aggressively

Every rule file that targets specific code areas MUST have `paths:` frontmatter:

```yaml
---
paths:
  - "internal/api/**/*"
  - "internal/handlers/**/*"
---
```

**Path Mapping Strategy:**
| Rule Topic | Typical Paths |
|------------|---------------|
| API/Handlers | `**/api/**/*`, `**/handlers/**/*`, `**/controllers/**/*` |
| Database | `**/repository/**/*`, `**/persistence/**/*`, `**/db/**/*` |
| Domain/Models | `**/domain/**/*`, `**/models/**/*`, `**/entities/**/*` |
| Testing | `**/*_test.go`, `**/*.test.ts`, `**/test/**/*` |
| Infrastructure | `**/infra/**/*`, `**/infrastructure/**/*` |
| Config | `**/config/**/*`, `**/configs/**/*` |

### 2. One Rule Per Line

Prefer bullet lists over paragraphs:

```markdown
## Error Handling
- Wrap errors with context: `fmt.Errorf("action failed: %w", err)`
- Use `errors.Is()` for error checking, not string comparison
- Define domain errors in `internal/domain/errors.go`
- Return domain errors from services, HTTP errors from handlers
```

### 3. Avoid Code Blocks Unless Essential

**Instead of:**
```markdown
When creating a service, use this pattern:
​```go
type UserService struct {
    repo domain.UserRepository
    cache domain.Cache
}

func NewUserService(repo domain.UserRepository, cache domain.Cache) *UserService {
    return &UserService{repo: repo, cache: cache}
}
​```
```

**Write:**
```markdown
- Services: Constructor injection via `New<Name>Service(deps...) *<Name>Service`
- Reference: See `internal/service/user_service.go` for pattern
```

### 4. Reference, Don't Duplicate

Use `@path/to/file` to reference existing documentation:

```markdown
## Architecture
- Follow Clean Architecture layers per @docs/ARCHITECTURE.md
- Layer dependencies: API → Service → Domain ← Infrastructure
```

## Workflow

### Step 1: Analyze Codebase Structure

Identify:
1. Directory structure and naming patterns
2. Primary language(s) and framework(s)
3. Existing documentation to reference
4. Key patterns unique to this project

### Step 2: Plan Rule Files with Paths

Create a mapping of rule files to their target paths:

```
.claude/rules/
├── architecture.md      (no paths - applies globally)
├── api.md               paths: ["internal/api/**/*"]
├── database.md          paths: ["internal/infra/persistence/**/*", "db/**/*"]
├── testing.md           paths: ["**/*_test.go", "test/**/*"]
├── domain.md            paths: ["internal/domain/**/*"]
└── workflow.md          (no paths - applies globally)
```

### Step 3: Generate Lean Rules

For each file, follow the templates in `@references/rules-templates.md`.

**Target lengths:**
- Main CLAUDE.md: 50-80 lines
- Individual rule files: 30-60 lines each
- Total rules: < 500 lines combined

### Step 4: Validate Rule Quality

Check each rule file against `@references/rules-quality.md` criteria.

## Sub-Agent Strategy

For large codebases (>50 files), use parallel agents:

| Agent | Focus | Output |
|-------|-------|--------|
| Architecture | Layers, patterns, dependencies | 10-15 rules |
| Conventions | Naming, formatting, imports | 10-15 rules |
| Testing | Test patterns, mocks, coverage | 8-12 rules |
| API | Endpoints, validation, responses | 8-12 rules |

Each agent returns **bullet-point rules only**, no code examples.

## Output Structure

```
project-root/
├── CLAUDE.md
└── .claude/
    └── rules/
        ├── architecture.md
        ├── api.md
        ├── database.md
        └── ...
```

### Main File: `./CLAUDE.md`

```markdown
# Project Name

One-sentence description.

## Commands
| Command | Purpose |
|---------|---------|
| `make run` | Start server |
| `make test` | Run tests |

## Architecture
- Pattern: [Clean Architecture / MVC / etc.]
- Key rule: [Most important constraint]

## Rules
Detailed guidelines in `.claude/rules/`:
- @.claude/rules/architecture.md
- @.claude/rules/api.md
- ...
```

### Rule Files: `.claude/rules/*.md`

See `@references/rules-templates.md` for lean templates.

## Anti-Patterns to Avoid

1. **No paths specified** - Rules apply to entire codebase unnecessarily
2. **Tutorial-style content** - Explaining basics instead of project-specific rules
3. **Code duplication** - Copying code that exists in source files
4. **Generic advice** - "Write clean code" adds no value
5. **Overly long files** - >100 lines per rule file indicates scope creep
