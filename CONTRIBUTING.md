# Contributing to markdownlint-mcp

Thank you for your interest in contributing to markdownlint-mcp! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Contributing to markdownlint-mcp](#contributing-to-markdownlint-mcp)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Setting Up the Development Environment](#setting-up-the-development-environment)
  - [Development Workflow](#development-workflow)
  - [Pull Request Process](#pull-request-process)
  - [Testing Guidelines](#testing-guidelines)
    - [Writing Tests](#writing-tests)
  - [Coding Standards](#coding-standards)
    - [TypeScript Best Practices](#typescript-best-practices)
  - [Documentation](#documentation)
  - [Issue Reporting](#issue-reporting)
    - [Bug Reports](#bug-reports)
    - [Feature Requests](#feature-requests)
  - [License](#license)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally
   ```bash
   git clone https://github.com/YOUR-USERNAME/markdownlint-mcp.git
   cd markdownlint-mcp
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Build the project
   ```bash
   npm run build
   ```

## Development Workflow

1. Create a new branch for your feature or bug fix
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes, following the [coding standards](#coding-standards)

3. Add tests for your changes (see [testing guidelines](#testing-guidelines))

4. Run the tests to make sure everything passes
   ```bash
   npm test
   ```

5. Run linting to ensure code quality
   ```bash
   npm run lint
   ```

6. Build the project to ensure it compiles correctly
   ```bash
   npm run build
   ```

7. Commit your changes using a descriptive commit message
   ```bash
   git commit -m "feat: add new feature" -m "Description of the changes and why they were made"
   ```

8. Push your branch to GitHub
   ```bash
   git push origin feature/your-feature-name
   ```

9. Submit a pull request to the main repository

## Pull Request Process

1. Ensure all tests pass and the build is successful
2. Update the documentation with details of changes, including new features, APIs, or breaking changes
3. The versioning scheme we use is [SemVer](http://semver.org/). The maintainers will handle the version updates
4. Your pull request will be reviewed by at least one maintainer
5. Once approved, your pull request will be merged by a maintainer

## Testing Guidelines

- All new features should include unit tests
- Bug fixes should include tests that demonstrate the issue is fixed
- Tests should be placed in the `test` directory, mirroring the structure of the `src` directory
- Run tests using `npm test`
- Aim for high test coverage (>90%)

### Writing Tests

We use Jest for testing. Here's an example of a test:

```typescript
import { functionToTest } from '../src/yourModule';

describe('functionToTest', () => {
  it('should handle normal input correctly', () => {
    expect(functionToTest('normal input')).toBe('expected output');
  });

  it('should handle edge cases', () => {
    expect(functionToTest('')).toBe('expected output for empty string');
  });
});
```

## Coding Standards

This project follows a set of coding standards to ensure consistency across the codebase:

- We use TypeScript for type safety
- Follow the ESLint and Prettier configurations provided in the project
- Use meaningful variable and function names
- Write descriptive comments for complex logic
- Follow the single responsibility principle
- Keep functions small and focused
- Use proper error handling with detailed error messages

### TypeScript Best Practices

- Use explicit types where beneficial for readability
- Avoid the `any` type unless absolutely necessary
- Use interfaces for object shapes
- Use proper access modifiers in classes (public, private, protected)
- Use async/await for asynchronous code

## Documentation

- Update the README.md with any necessary changes
- Update the USAGE.md for any user-facing changes
- Add JSDoc comments to functions and classes
- Keep API documentation up to date

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

1. A clear and descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Environment information (OS, Node.js version, etc.)
6. Any relevant logs or error messages

### Feature Requests

For feature requests, please include:

1. A clear and descriptive title
2. A detailed description of the proposed feature
3. Any relevant examples or use cases
4. An explanation of why this feature would be valuable

## License

By contributing to this project, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers the project.

---

Thank you for contributing to markdownlint-mcp!
