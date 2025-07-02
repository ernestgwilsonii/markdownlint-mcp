# markdownlint-mcp

A Model Context Protocol (MCP) server for markdown linting, formatting, and compliance checking.

## Overview

This MCP server provides AI assistants with the ability to lint, validate, and auto-fix Markdown files to ensure compliance with established Markdown standards and best practices.

## The Problem

While many MCP servers exist for converting various file formats **to** Markdown, there was no MCP server specifically designed for **linting and ensuring compliance** of existing Markdown files. This creates a gap in the workflow where Markdown content may be created or converted but not validated for quality and consistency.

## Solution

`markdownlint-mcp` bridges this gap by providing:

- **Markdown linting** using industry-standard rules
- **Automatic fixing** of common Markdown issues  
- **Compliance validation** against established standards
- **Seamless integration** with MCP-compatible AI assistants


## Features

### MCP Tools Provided

1. **`lint_markdown`** - Analyze a Markdown file and return detailed issues
2. **`fix_markdown`** - Automatically fix Markdown issues and return corrected content
3. **`get_configuration`** - Display current linting rules and configuration


### Standards-Based Approach

- Uses **markdownlint** default ruleset (community standard)
- Based on **CommonMark specification**
- Follows **GitHub Flavored Markdown** conventions
- Supports **30+ established linting rules** covering:
  - Consistent heading styles
  - Proper list formatting
  - Line length limits
  - No trailing whitespace
  - Consistent emphasis markers
  - And much more


### Configuration Support

- **Zero configuration** required (uses sensible defaults)
- **Optional customization** via `.markdownlint.json` files
- **Ecosystem compatibility** for specialized Markdown requirements


## Installation

```bash
npm install markdownlint-mcp
```

## Usage

### With Claude Desktop

Add to your Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "markdownlint": {
      "command": "npx",
      "args": ["markdownlint-mcp"]
    }
  }
}
```

### With Other MCP Clients

This server works with any MCP-compatible client including:

- Claude Desktop
- Cursor
- Cline
- VS Code with MCP support


## Example Workflows

### Lint a Markdown File

```text
User: "Please lint my README.md file and tell me what issues exist"
AI: Uses lint_markdown tool to analyze and report issues
```

### Fix Markdown Issues

```text
User: "Fix all the markdown issues in my documentation files"
AI: Uses fix_markdown tool to automatically correct problems
```

### Validate Compliance

```text
User: "Is my markdown compliant with standard formatting rules?"
AI: Uses lint_markdown to validate and provide compliance status
```

## Technical Approach

- **Direct library integration** with `markdownlint` npm package
- **No external CLI dependencies** required
- **Cross-platform** support (Windows, macOS, Linux)
- **Single installation** - no additional tools needed
- **Efficient processing** via direct API calls


## Development Status

🚧 **In Development** - This project is currently being built with the goal of:

1. **Initial release** with core functionality
2. **Community testing** and feedback
3. **Submission to official MCP collection** for maximum visibility
4. **Continuous improvement** based on user needs


## Contributing

We welcome contributions! This project aims to become part of the official MCP server collection and follows MCP best practices.

### Roadmap

- [ ] Core MCP server implementation
- [ ] Comprehensive testing suite
- [ ] Documentation and examples
- [ ] Community feedback integration
- [ ] Submission to official MCP collection


## License

MIT License - see LICENSE file for details

## Related Projects

- [markdownlint](https://github.com/DavidAnson/markdownlint) - The underlying linting engine
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol this server implements
- [MCP Servers Collection](https://github.com/modelcontextprotocol/servers) - Official MCP servers


## Support

For issues, questions, or contributions, please use the GitHub issues page.
