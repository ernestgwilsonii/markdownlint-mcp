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
  - Phase 1A (Initial Rules):
    - MD009 - Trailing spaces
    - MD010 - Hard tabs
    - MD012 - Multiple consecutive blank lines
    - MD022 - Headings should be surrounded by blank lines
    - MD023 - Headings must start at the beginning of the line
    - MD047 - Files should end with a single newline character
  - Phase 1B (Heading and Blockquote Rules):
    - MD018 - No space after hash on atx style heading
    - MD019 - Multiple spaces after hash on atx style heading
    - MD020 - No space inside hashes on closed atx style heading
    - MD021 - Multiple spaces inside hashes on closed atx style heading
    - MD026 - Trailing punctuation in heading
    - MD027 - Multiple spaces after blockquote symbol
  - Phase 1C (Structure and Format Rules):
    - MD004 - Unordered list style
    - MD030 - Spaces after list markers
    - MD031 - Fenced code blocks should be surrounded by blank lines
    - MD032 - Lists should be surrounded by blank lines
    - MD034 - Bare URL used
    - MD040 - Fenced code blocks should have a language specified
  - Phase 1D (Links, Emphasis, and Style Rules):
    - MD011 - Reversed link syntax
    - MD037 - Spaces inside emphasis markers
    - MD038 - Spaces inside code span elements
    - MD039 - Spaces inside link text
    - MD049 - Emphasis style
    - MD050 - Strong style
  - Phase 1E (List Indentation and Advanced Link Rules):
    - MD005 - Inconsistent indentation for list items at the same level
    - MD007 - Unordered list indentation
    - MD014 - Dollar signs used before commands without showing output
    - MD051 - Link fragments should be valid
    - MD052 - Reference links and images should use a label that is defined
    - MD053 - Link and image reference definitions should be needed
    - MD054 - Link and image style
  - Phase 2A (Table Rules):
    - MD058 - Tables should be surrounded by blank lines
  - Phase 2B (Whitespace and Line Rules):
    - MD035 - Horizontal rule style
    - MD046 - Code block style
    - MD048 - Code fence style
    - MD042 - No empty links
  - Phase 2C (Table Rules):
    - MD055 - Table pipe style
    - MD056 - Table column count
  - Phase 2D (Accessibility Rules):
    - MD045 - Images should have alternate text (alt text)
    - MD059 - Link text should be descriptive
  - Phase 2E (Heading Structure Rules):
    - MD001 - Heading levels should only increment by one level at a time
    - MD003 - Heading style
    - MD024 - Multiple headings with the same content
    - MD025 - Multiple top-level headings in the same document
    - MD036 - Emphasis used instead of a heading
  - Phase 2F (Remaining Rules - 100% Coverage):
    - MD013 - Line length
    - MD028 - Blank line inside blockquote
    - MD029 - Ordered list item prefix
    - MD033 - Inline HTML
    - MD041 - First line in a file should be a top-level heading
    - MD043 - Required heading structure
    - MD044 - Proper names should have the correct capitalization

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
