#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import markdownlint from 'markdownlint';
import { promises as fs } from 'fs';
import path from 'path';

// Define types for markdownlint results
interface MarkdownlintIssue {
  lineNumber: number;
  ruleNames: string[];
  ruleDescription: string;
  errorDetail?: string;
  fixInfo?: {
    editColumn?: number;
    deleteCount?: number;
    insertText?: string;
  };
}

interface ToolArguments {
  filePath?: unknown;
  writeFile?: unknown;
}

// Default markdownlint configuration
const DEFAULT_CONFIG = {
  'default': true,
  'MD013': { 'line_length': 120 }, // Allow longer lines for modern displays
  'MD033': false, // Allow HTML
  'MD041': false, // Allow files to not start with H1
};

class MarkdownLintServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'markdownlint-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'lint_markdown',
            description: 'Analyze a Markdown file and return detailed linting issues',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'Path to the Markdown file to lint'
                }
              },
              required: ['filePath']
            }
          },
          {
            name: 'fix_markdown',
            description: 'Automatically fix ALL possible Markdown issues and return the corrected content',
            inputSchema: {
              type: 'object',
              properties: {
                filePath: {
                  type: 'string',
                  description: 'Path to the Markdown file to fix'
                },
                writeFile: {
                  type: 'boolean',
                  description: 'Whether to write the fixed content back to the file (default: true)',
                  default: true
                }
              },
              required: ['filePath']
            }
          },
          {
            name: 'get_configuration',
            description: 'Display current markdownlint rules and configuration',
            inputSchema: {
              type: 'object',
              properties: {},
              additionalProperties: false
            }
          }
        ]
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Type guard for arguments
        if (!args || typeof args !== 'object') {
          throw new McpError(ErrorCode.InvalidParams, 'Invalid arguments provided');
        }

        const typedArgs = args as ToolArguments;

        switch (name) {
          case 'lint_markdown':
            if (typeof typedArgs.filePath !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'filePath must be a string');
            }
            return await this.lintMarkdown(typedArgs.filePath);
          
          case 'fix_markdown':
            if (typeof typedArgs.filePath !== 'string') {
              throw new McpError(ErrorCode.InvalidParams, 'filePath must be a string');
            }
            const writeFile = typeof typedArgs.writeFile === 'boolean' ? typedArgs.writeFile : true;
            return await this.fixMarkdown(typedArgs.filePath, writeFile);
          
          case 'get_configuration':
            return await this.getConfiguration();
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async lintMarkdown(filePath: string) {
    try {
      // Check if file exists
      await fs.access(filePath);
      
      // Read file content
      const content = await fs.readFile(filePath, 'utf8');
      
      // Load configuration (check for .markdownlint.json in file directory or use defaults)
      const config = await this.loadConfiguration(path.dirname(filePath));
      
      // Run markdownlint
      const results = markdownlint.sync({
        strings: {
          [filePath]: content
        },
        config
      });

      const issues = (results[filePath] || []) as MarkdownlintIssue[];
      
      if (issues.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `✅ **${path.basename(filePath)}** - No linting issues found!\n\nThe file is compliant with Markdown standards.`
            }
          ]
        };
      }

      // Format issues for display
      const issueList = issues.map((issue: MarkdownlintIssue) => 
        `- **Line ${issue.lineNumber}**: ${issue.ruleDescription} (${issue.ruleNames.join('/')})\n  ${issue.errorDetail || ''}`
      ).join('\n');

      const fixableCount = issues.filter(issue => issue.fixInfo).length;
      const fixableText = fixableCount > 0 ? `\n\n💡 **${fixableCount} of these issues can be automatically fixed** using the \`fix_markdown\` tool.` : '';

      return {
        content: [
          {
            type: 'text',
            text: `## Markdown Linting Results for ${path.basename(filePath)}\n\n**Found ${issues.length} issue(s):**\n\n${issueList}${fixableText}`
          }
        ]
      };

    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new McpError(ErrorCode.InvalidParams, `File not found: ${filePath}`);
      }
      throw error;
    }
  }

  private async fixMarkdown(filePath: string, writeFile: boolean) {
    try {
      // Check if file exists
      await fs.access(filePath);
      
      // Read file content
      const originalContent = await fs.readFile(filePath, 'utf8');
      
      // Load configuration
      const config = await this.loadConfiguration(path.dirname(filePath));
      
      // Get initial issues count
      const initialResults = markdownlint.sync({
        strings: {
          [filePath]: originalContent
        },
        config
      });
      const initialIssues = (initialResults[filePath] || []) as MarkdownlintIssue[];
      
      // Apply fixes using markdownlint's built-in fix functionality
      let currentContent = originalContent;
      let totalIterations = 0;
      const maxIterations = 10;
      
      while (totalIterations < maxIterations) {
        totalIterations++;
        
        // Run markdownlint to get current issues
        const results = markdownlint.sync({
          strings: {
            [filePath]: currentContent
          },
          config
        });

        const issues = (results[filePath] || []) as MarkdownlintIssue[];
        const fixableIssues = issues.filter(issue => issue.fixInfo);
        
        if (fixableIssues.length === 0) {
          break; // No more fixable issues
        }

        // Apply fixes manually using the fixInfo
        const lines = currentContent.split('\n');
        let fixesApplied = 0;

        // Process fixes from last line to first to maintain line numbers
        const sortedIssues = [...fixableIssues].sort((a, b) => 
          (b.lineNumber || 0) - (a.lineNumber || 0)
        );

        for (const issue of sortedIssues) {
          if (!issue.fixInfo || !issue.lineNumber) continue;
          
          const lineIndex = issue.lineNumber - 1;
          if (lineIndex < 0 || lineIndex >= lines.length) continue;
          
          const fixInfo = issue.fixInfo;
          const originalLine = lines[lineIndex];
          
          // Handle different types of fixes
          if (fixInfo.editColumn !== undefined) {
            // Character-level edit within a line
            const editColumn = Math.max(0, (fixInfo.editColumn || 1) - 1); // Convert to 0-based
            const deleteCount = fixInfo.deleteCount || 0;
            const insertText = fixInfo.insertText || '';
            
            const before = originalLine.substring(0, editColumn);
            const after = originalLine.substring(editColumn + deleteCount);
            lines[lineIndex] = before + insertText + after;
            fixesApplied++;
            
          } else if (fixInfo.deleteCount !== undefined) {
            // Line-level operations
            if (fixInfo.deleteCount > 0) {
              // Delete lines
              lines.splice(lineIndex, fixInfo.deleteCount);
              
              // Insert replacement text if provided
              if (fixInfo.insertText !== undefined) {
                lines.splice(lineIndex, 0, fixInfo.insertText);
              }
              fixesApplied++;
            } else if (fixInfo.insertText !== undefined) {
              // Replace entire line
              lines[lineIndex] = fixInfo.insertText;
              fixesApplied++;
            }
          } else if (fixInfo.insertText !== undefined) {
            // Simple line replacement
            lines[lineIndex] = fixInfo.insertText;
            fixesApplied++;
          }
        }

        if (fixesApplied === 0) {
          break; // No fixes applied, avoid infinite loop
        }

        currentContent = lines.join('\n');
      }

      // Write the fixed content back to file if requested
      if (writeFile) {
        await fs.writeFile(filePath, currentContent, 'utf8');
      }

      // Get final results
      const finalResults = markdownlint.sync({
        strings: {
          [filePath]: currentContent
        },
        config
      });
      const finalIssues = (finalResults[filePath] || []) as MarkdownlintIssue[];
      
      // Calculate fixes applied
      const fixesApplied = initialIssues.length - finalIssues.length;
      
      // Generate status report
      let statusText = '';
      
      if (fixesApplied > 0) {
        statusText = `✅ **Successfully fixed ${fixesApplied} issue(s)** in ${totalIterations} iteration(s)\n\n`;
      }
      
      if (finalIssues.length > 0) {
        statusText += `⚠️ **${finalIssues.length} issue(s) require manual attention:**\n\n`;
        const remainingList = finalIssues.map((issue: MarkdownlintIssue) => 
          `- **Line ${issue.lineNumber}**: ${issue.ruleDescription} (${issue.ruleNames.join('/')})\n  ${issue.errorDetail || ''}`
        ).join('\n');
        statusText += remainingList;
      } else if (fixesApplied > 0) {
        statusText += `🎉 **All issues resolved!** The file is now fully compliant with Markdown standards.`;
      } else {
        statusText = `✅ **No fixes needed** - The file is already compliant.`;
      }

      if (writeFile && fixesApplied > 0) {
        statusText += `\n\n📝 **Changes saved to file**`;
      }

      // Add summary
      statusText += `\n\n**Summary:**\n- **Before:** ${initialIssues.length} issues\n- **After:** ${finalIssues.length} issues\n- **Fixed:** ${fixesApplied} issues`;

      return {
        content: [
          {
            type: 'text',
            text: `## Fix Results for ${path.basename(filePath)}\n\n${statusText}${!writeFile && currentContent !== originalContent ? '\n\n**Preview of fixed content:**\n\n```markdown\n' + currentContent + '\n```' : ''}`
          }
        ]
      };

    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        throw new McpError(ErrorCode.InvalidParams, `File not found: ${filePath}`);
      }
      throw error;
    }
  }

  private async getConfiguration() {
    return {
      content: [
        {
          type: 'text',
          text: `## Current Markdownlint Configuration\n\n**Active Rules:**\n- Line length limit: 120 characters\n- HTML elements: Allowed\n- First line heading: Not required\n- All other rules: Enabled (default markdownlint ruleset)\n\n**Configuration Source:** Built-in defaults (can be overridden with .markdownlint.json)\n\n**Total Rules:** 30+ standard markdownlint rules covering formatting, consistency, and best practices.\n\n**Auto-Fix Capability:** Automatically fixes all possible issues including spacing, heading formatting, list formatting, and line endings.`
        }
      ]
    };
  }

  private async loadConfiguration(directory: string) {
    const configPath = path.join(directory, '.markdownlint.json');
    
    try {
      await fs.access(configPath);
      const configContent = await fs.readFile(configPath, 'utf8');
      return JSON.parse(configContent);
    } catch {
      // Fall back to default configuration
      return DEFAULT_CONFIG;
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Markdownlint MCP server running on stdio');
  }
}

// Start the server
const server = new MarkdownLintServer();
server.run().catch(console.error);
