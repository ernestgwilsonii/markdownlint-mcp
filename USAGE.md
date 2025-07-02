# Usage Instructions

## Installation

```bash
npm install -g markdownlint-mcp
```

## Configuration with Claude Desktop

Add this to your Claude Desktop MCP configuration file:

### Location of config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Configuration:
```json
{
  "mcpServers": {
    "markdownlint": {
      "command": "markdownlint-mcp"
    }
  }
}
```

## Available Tools

Once configured, you can ask Claude to:

1. **Lint markdown files**: "Please lint my README.md file"
2. **Fix markdown issues**: "Fix all markdown issues in my documentation"
3. **Check configuration**: "Show me the current markdownlint configuration"

## Examples

- "Analyze the markdown issues in my project's README.md"
- "Fix the formatting in docs/guide.md and save the changes"
- "What markdown linting rules are currently active?"
