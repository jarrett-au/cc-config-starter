# Claude Code Configuration Starter

A starter template for managing and sharing your [Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview) configuration.

Use this repository to version control your custom commands, skills, and MCP server configurations, and sync them across machines using `cc-devkit`.

## 🚀 How to Use

### 1. Fork this Repository
Click the **Fork** button to create your own copy of this configuration.

### 2. Sync to Claude Code
Use [cc-devkit](https://github.com/jarrett-au/cc-devkit) to apply this configuration to your local Claude Code environment:

```bash
# Replace 'your-username/cc-config-starter' with your forked repo
npx cc-devkit --init claude --from your-username/cc-config-starter
```

That's it! Your commands and skills are now available in Claude Code.

## 📂 Structure

| Directory/File | Description |
|----------------|-------------|
| `commands/` | Custom slash commands (Markdown files). |
| `skills/` | Custom skills (Tools) for Claude. |
| `mcp.json` | MCP Server configurations. |

## 🛠 Customization

### Adding Commands
Create a Markdown file in `commands/`. The filename becomes the command name.
*Example: `commands/my-command.md` becomes `/my-command`.*

### Adding Skills
Create a subdirectory in `skills/` containing a `SKILL.md`.
*See `examples/skills/` in the main toolkit for details.*

### Adding MCP Servers
Edit `mcp.json` to add Model Context Protocol servers. They will be merged into your local configuration.

```json
{
  "sqlite": {
    "command": "uvx",
    "args": ["mcp-server-sqlite", "--db-path", "test.db"]
  }
}
```

## 🔄 Updates

To update your local config after making changes to this repo, simply run the sync command again:

```bash
npx cc-devkit --init claude --from your-username/cc-config-starter
```
