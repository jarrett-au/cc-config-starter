---
name: pr-generator
description: Generate PR titles and descriptions from git branch changes. Use when creating pull requests, needing to summarize branch changes, or preparing PR documentation for GitHub repositories. Analyzes commits and changed files to create conventional commit-formatted titles with concise change summaries.
---

# PR Generator

## Overview

Generate conventional commit-formatted PR titles and concise descriptions by analyzing git changes between branches. Uses `gh` CLI and `git` commands to gather information intelligently.

## When to Use

- Creating a new pull request
- Summarizing changes between branches
- Generating PR documentation for GitHub repositories
- Preparing change summaries for code review

## Workflow

### Step 1: Gather Branch Information

Use `gh` and `git` commands to collect necessary data:

```bash
# Get current branch (if source not specified)
git branch --show-current

# Get merge base
git merge-base main <source_branch>

# Get commit messages
git log <merge_base>..<source_branch> --pretty=format:%s

# Get changed files
git diff --name-only --diff-filter=d <merge_base> <source_branch>

# Get file statistics
git diff --stat <merge_base> <source_branch>
```

**For existing PRs**, gather additional context:
```bash
gh pr view <pr_number> --json title,body,files
```

### Step 2: Analyze Commits

Extract information from commit messages:

1. **Check for conventional commits** - Look for `<type>:` or `<type>(scope):` pattern
2. **Identify main themes** - Group related commits by functionality
3. **Count commits** - Understand scope of changes

If commits follow conventional format, extract type and scope directly:
```
feat(auth): add login → type=feat, scope=auth, description=add login
fix: handle null → type=fix, scope=None, description=handle null
```

### Step 3: Generate PR Title

Use conventional commit format: `<type>[optional scope]: <description>`

**Type inference priority:**
1. Extract from existing conventional commit messages (most common type)
2. Infer from file patterns:
   - Test files (test/, *_test.py, *.spec.ts) → `test`
   - Documentation (*.md, docs/) → `docs`
   - Config (*.yaml, *.json, *.toml) → `chore`
   - "fix"/"bug" in commit messages → `fix`
3. Default to `feat` for new features

**Title guidelines:**
- Use imperative mood: "add" not "added"
- Capitalize first letter
- Keep under 72 characters
- Don't end with period

**Examples:**
```
feat: add user authentication
fix(api): handle rate limiting errors
docs: update installation guide
refactor(components): extract shared button logic
test: add unit tests for auth module
```

See [references/conventional_commits.md](references/conventional_commits.md) for complete type reference.

### Step 4: Generate PR Description

Create a concise, structured description:

**Summary section:**
- High-level overview (2-3 sentences)
- List main changes using commit messages (max 5 if many commits)
- Focus on what and why, not how

**Changed Files section:**
- Categorize files: **Code**, **Tests**, **Config**, **Documentation**, **Scripts**
- Use file count: "**Code** (5 files):"
- List file paths (truncate at 10 if extensive)
- Mark type: `src/api/auth.py` vs docs/

**Example:**
```markdown
## Summary

This PR implements user authentication with JWT tokens. Includes login/logout endpoints and session management.

Main changes:
- Add JWT-based authentication service
- Implement login/logout API endpoints
- Add session management middleware
- Create user model and database schema

## Changed Files

**Code** (5 files):
  - `src/api/auth.py`
  - `src/services/auth_service.py`
  - `src/middleware/session.py`
  - `src/models/user.py`
  - `src/utils/jwt.py`

**Tests** (2 files):
  - `tests/test_auth.py`
  - `tests/fixtures/auth.py`

**Config** (1 files):
  - `config/auth.yaml`

**Documentation** (1 files):
  - `docs/api/auth.md`
```

### Step 5: Optional Enhancements

Include when relevant:

**Breaking changes:**
```markdown
## Breaking Changes

- Remove deprecated `authenticate()` method
- Change `login()` signature to require email instead of username
```

**Testing notes:**
```markdown
## Testing

- Login/logout with valid credentials
- Invalid credential handling
- Session persistence
- Token expiration behavior
```

**Related issues:**
```markdown
Closes #123
Fixes #456
```

## Important Notes

### Context Preservation

**Skip document file contents** - Only list filenames:
- `.md`, `.txt`, `.rst`, `.adoc` files
- Don't read file content to preserve context

For extensive changes (50+ files, 1000+ lines):
- Focus on recent commits
- Truncate file lists at 10 per category
- Summarize themes rather than listing all changes

### Smart Analysis

When gathering information:

1. **Start with gh** - If PR exists, use `gh pr view` for context
2. **Get commit count first** - Decide how deep to analyze
3. **Sample commits** - If >20 commits, check first 10 and last 5
4. **Categorize intelligently** - Group related changes in summary

Example efficient workflow:
```bash
# Quick scope check
git log main..feature-branch --oneline | wc -l

# If >20 commits, sample instead of reading all
git log main..feature-branch --pretty=format:%s | head -10

# Get files (always safe)
git diff --name-only main feature-branch

# Only get detailed stats if needed
git diff --stat main feature-branch
```

### Quality Checklist

Before finalizing:
- [ ] Title uses conventional commit format
- [ ] Title is concise (<72 chars)
- [ ] Title capitalized correctly
- [ ] Summary captures main changes
- [ ] Files logically categorized
- [ ] No redundancy between title and summary
- [ ] Doc files listed, not read

## Resources

### references/conventional_commits.md

Quick reference for conventional commit types and formatting. Consult when:
- Selecting appropriate commit type
- Adding scope to title
- Verifying title format
- Explaining conventional commits to users

### assets/pr_template.md

Basic PR template structure. Reference for common sections but not required for generated descriptions.
