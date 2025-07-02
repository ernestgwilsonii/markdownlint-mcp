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
- Supports **all 52 official markdownlint rules**

## Auto-Fixable Rules

Our MCP server can automatically fix 30 out of 52 official markdownlint rules (58%). These rules are deterministic and can be fixed without human judgment:

### Whitespace & Formatting (9 rules)
- **MD009** - Trailing spaces
- **MD010** - Hard tabs
- **MD012** - Multiple consecutive blank lines
- **MD022** - Headings surrounded by blank lines
- **MD031** - Fenced code blocks surrounded by blank lines
- **MD032** - Lists surrounded by blank lines
- **MD047** - Files should end with single newline
- **MD058** - Tables surrounded by blank lines
- **MD027** - Multiple spaces after blockquote symbol

### Heading Formatting (6 rules)
- **MD018** - No space after hash
- **MD019** - Multiple spaces after hash
- **MD020** - No space inside closed ATX
- **MD021** - Multiple spaces inside closed ATX
- **MD023** - Headings start at line beginning
- **MD026** - Trailing punctuation in heading

### List Formatting (4 rules)
- **MD004** - Unordered list style
- **MD005** - List item indentation consistency
- **MD007** - Unordered list indentation
- **MD030** - Spaces after list markers

### Link & Text Formatting (7 rules)
- **MD011** - Reversed link syntax
- **MD034** - Bare URL used
- **MD037** - Spaces inside emphasis
- **MD038** - Spaces inside code spans
- **MD039** - Spaces inside link text
- **MD049** - Emphasis style
- **MD050** - Strong style

### Advanced Fixable (4 rules)
- **MD014** - Dollar signs before commands
- **MD044** - Proper names capitalization
- **MD051** - Link fragments validation
- **MD053** - Unused reference definitions

## Detection-Only Rules

The following 22 rules (42%) cannot be automatically fixed because they require human judgment, content understanding, or style decisions:

### Structural/Content Rules (12 rules)
- **MD001** - Heading increment (requires understanding document structure)
- **MD003** - Heading style consistency (needs style preference decision)
- **MD013** - Line length (requires content-aware line breaking)
- **MD024** - Duplicate headings (could break document structure/navigation)
- **MD025** - Multiple H1s (requires understanding document hierarchy)
- **MD028** - Blank line in blockquote (ambiguous semantic intent)
- **MD029** - Ordered list numbering (style preference)
- **MD035** - Horizontal rule style (style preference)
- **MD036** - Emphasis as heading (requires semantic understanding)
- **MD041** - First line H1 (may break existing document structure)
- **MD043** - Required heading structure (document-specific requirements)
- **MD046** - Code block style (style preference)

### Content/Language Rules (5 rules)
- **MD033** - Inline HTML (may be intentional/necessary)
- **MD040** - Code language specification (requires code language knowledge)
- **MD045** - Alt text for images (requires understanding image content)
- **MD059** - Descriptive link text (requires understanding context/purpose)
- **MD042** - Empty links (may be placeholders or templates)

### Reference/Link Rules (3 rules)
- **MD052** - Reference links defined (may be external or conditional)
- **MD054** - Link/image style (style preference)
- **MD056** - Table column count (may be intentional formatting)

### Table Rules (2 rules)
- **MD055** - Table pipe style (style preference)
- **MD048** - Code fence style (style preference)

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
