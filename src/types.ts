/**
 * markdownlint-mcp type definitions
 */

/**
 * Interface for markdownlint issue object
 */
export interface MarkdownlintIssue {
  /**
   * Line number where the issue was found
   */
  lineNumber: number;

  /**
   * Array of rule names that were violated
   */
  ruleNames: string[];

  /**
   * Human-readable description of the rule
   */
  ruleDescription: string;

  /**
   * Additional details about the error (optional)
   */
  errorDetail?: string;

  /**
   * Information for automatic fixing (optional)
   */
  fixInfo?: {
    /**
     * Column where the edit should start
     */
    editColumn?: number;

    /**
     * Number of characters to delete
     */
    deleteCount?: number;

    /**
     * Text to insert at the edit position
     */
    insertText?: string;
  };
}

/**
 * Interface for tool argument objects
 */
export interface ToolArguments {
  /**
   * Path to the markdown file
   */
  filePath?: unknown;

  /**
   * Whether to write fixes back to the file
   */
  writeFile?: unknown;
}

/**
 * Interface for markdownlint configuration
 */
export interface MarkdownlintConfig {
  /**
   * Default configuration flag (enables all rules)
   */
  default?: boolean;

  /**
   * Individual rule configurations
   * Keys are rule identifiers like 'MD013'
   */
  [key: string]: unknown;
}

/**
 * Default markdownlint configuration
 * Used when no custom configuration is provided
 */
export const DEFAULT_CONFIG: MarkdownlintConfig = {
  'default': true,
  'MD013': { 'line_length': 120 }, // Allow longer lines for modern displays
  'MD033': false, // Allow HTML
  'MD041': false, // Allow files to not start with H1
};
