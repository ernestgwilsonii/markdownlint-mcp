# Changelog

All notable changes to the markdownlint-mcp project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive development plan (PLAN.md)
- Contribution guidelines (CONTRIBUTING.md)
- Enhanced .gitignore for Node.js projects
- This CHANGELOG.md to track project evolution
- Refactored project structure with modular organization:
  - Created separate directories for rules and utilities
  - Implemented rule interface for consistent rule implementation
  - Extracted server logic to dedicated server.ts module
  - Created file utility functions for file operations
  - Added structured logging system with configurable log levels
- Implemented the following markdownlint auto-fix rules:
  - MD009 - Trailing spaces
  - MD010 - Hard tabs
  - MD012 - Multiple consecutive blank lines
  - MD018 - No space after hash on atx style heading
  - MD019 - Multiple spaces after hash on atx style heading
  - MD020 - No space inside hashes on closed atx style heading
  - MD021 - Multiple spaces inside hashes on closed atx style heading
  - MD022 - Headings should be surrounded by blank lines
  - MD023 - Headings must start at the beginning of the line
  - MD026 - Trailing punctuation in heading
  - MD027 - Multiple spaces after blockquote symbol
  - MD047 - Files should end with a single newline character

### Planned
- Testing framework with Jest
- Enhanced project structure
- ESLint and Prettier configuration
- GitHub Actions CI/CD pipeline
- Enhanced documentation
- Improved error handling
- Performance optimizations

## [1.0.0] - Initial Release

### Added
- Basic MCP server implementation
- Integration with markdownlint library
- Three MCP tools:
  - `lint_markdown`: Analyze Markdown files for issues
  - `fix_markdown`: Automatically fix Markdown issues
  - `get_configuration`: Display current linting rules
- Custom fix implementations for common Markdown issues
- Configuration support via .markdownlint.json
- Basic error handling
- README.md with project overview
- USAGE.md with basic usage instructions
