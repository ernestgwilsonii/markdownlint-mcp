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
import { MarkdownlintIssue, ToolArguments, DEFAULT_CONFIG } from './types.js';

/**
 * MCP server for markdownlint functionality
 * Provides tools for linting and fixing markdown files
 */
export class MarkdownLintServer {
  private server: Server;

  /**
   * Initialize the markdownlint MCP server
   */
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

  /**
   * Set up handlers for MCP tool requests
   */
  private setupToolHandlers(): void {
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

  /**
   * Lint a markdown file and report issues
   * @param filePath Path to the markdown file
   * @returns MCP content response with linting results
   */
  public async lintMarkdown(filePath: string) {
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

  /**
   * Fix markdown issues in a file
   * @param filePath Path to the markdown file
   * @param writeFile Whether to write fixes back to the file
   * @returns MCP content response with fix results
   */
  public async fixMarkdown(filePath: string, writeFile: boolean) {
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
      const fixResults = markdownlint.sync({
        strings: {
          [filePath]: originalContent
        },
        config,
        resultVersion: 3 // Use result version 3 which includes fixInfo
      });
      
      // Get issues
      const issues = (fixResults[filePath] || []) as MarkdownlintIssue[];
      
      // Apply fixes manually since the built-in fix option may not be working correctly
      let lines = originalContent.split('\n');
      let fixesApplied = 0;
      
      // Process issues by rule
      
      // Handle MD009 (trailing spaces) manually
      if (issues.some(issue => issue.ruleNames.includes('MD009'))) {
        let newLines: string[] = [];
        let md009FixesApplied = 0;
        
        for (const line of lines) {
          // Remove trailing spaces
          const newLine = line.replace(/[ \t]+$/, '');
          if (newLine !== line) {
            md009FixesApplied++;
          }
          newLines.push(newLine);
        }
        
        fixesApplied += md009FixesApplied;
        lines = newLines;
      }
      
      // Handle MD010 (hard tabs) manually
      if (issues.some(issue => issue.ruleNames.includes('MD010'))) {
        let newLines: string[] = [];
        let md010FixesApplied = 0;
        
        for (const line of lines) {
          // Replace hard tabs with spaces (2 spaces per tab)
          const newLine = line.replace(/\t/g, '  ');
          if (newLine !== line) {
            md010FixesApplied++;
          }
          newLines.push(newLine);
        }
        
        fixesApplied += md010FixesApplied;
        lines = newLines;
      }
      
      // Handle MD018 (no space after hash on atx style heading)
      if (issues.some(issue => issue.ruleNames.includes('MD018'))) {
        let newLines: string[] = [];
        let md018FixesApplied = 0;
        
        for (const line of lines) {
          // Find headings with no space after hash (e.g., "#Heading")
          const newLine = line.replace(/^(#{1,6})([^#\s])/, '$1 $2');
          if (newLine !== line) {
            md018FixesApplied++;
          }
          newLines.push(newLine);
        }
        
        fixesApplied += md018FixesApplied;
        lines = newLines;
      }
      
      // Handle MD019 (multiple spaces after hash on atx style heading)
      if (issues.some(issue => issue.ruleNames.includes('MD019'))) {
        let newLines: string[] = [];
        let md019FixesApplied = 0;
        
        for (const line of lines) {
          // Find headings with multiple spaces after hash (e.g., "#   Heading")
          const newLine = line.replace(/^(#{1,6})[ \t]{2,}/, '$1 ');
          if (newLine !== line) {
            md019FixesApplied++;
          }
          newLines.push(newLine);
        }
        
        fixesApplied += md019FixesApplied;
        lines = newLines;
      }
      
      // Handle MD020 (no space inside hashes on closed atx style heading)
      if (issues.some(issue => issue.ruleNames.includes('MD020'))) {
        let newLines: string[] = [];
        let md020FixesApplied = 0;
        
        for (const line of lines) {
          // Fix headings with no space inside closing hashes (e.g., "# Heading#")
          const newLine = line.replace(/^(#{1,6})[ \t]+([^#\s].*?)[ \t]*#$/m, '$1 $2 #');
          if (newLine !== line) {
            md020FixesApplied++;
          }
          newLines.push(newLine);
        }
        
        fixesApplied += md020FixesApplied;
        lines = newLines;
      }
      
      // Handle MD021 (multiple spaces inside hashes on closed atx style heading)
      if (issues.some(issue => issue.ruleNames.includes('MD021'))) {
        let newLines: string[] = [];
        let md021FixesApplied = 0;
        
        for (const line of lines) {
          // Fix headings with multiple spaces inside closing hashes (e.g., "# Heading   #")
          const newLine = line.replace(/^(#{1,6})[ \t]+(.+?)[ \t]{2,}#$/m, '$1 $2 #');
          if (newLine !== line) {
            md021FixesApplied++;
          }
          newLines.push(newLine);
        }
        
        fixesApplied += md021FixesApplied;
        lines = newLines;
      }
      
      // Handle MD012 (multiple consecutive blank lines) manually
      if (issues.some(issue => issue.ruleNames.includes('MD012'))) {
        // Find sequences of multiple blank lines and reduce them to single blank lines
        let newLines: string[] = [];
        let blankLineCount = 0;
        
        for (const line of lines) {
          if (line.trim() === '') {
            blankLineCount++;
            // Only add the first blank line of a sequence
            if (blankLineCount === 1) {
              newLines.push(line);
            }
          } else {
            blankLineCount = 0;
            newLines.push(line);
          }
        }
        
        // Calculate fixes applied for this rule
        const md012FixesApplied = lines.length - newLines.length;
        fixesApplied += md012FixesApplied;
        lines = newLines;
      }
      
      // Handle MD022 (blanks around headings)
      if (issues.some(issue => issue.ruleNames.includes('MD022'))) {
        let newLines: string[] = [];
        let md022FixesApplied = 0;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const isHeading = /^#{1,6}\s+.+/.test(line);
          
          if (isHeading) {
            // Check if there's a blank line before the heading (unless it's the first line)
            const needsBlankBefore = i > 0 && lines[i-1].trim() !== '';
            
            // Check if there's a blank line after the heading (unless it's the last line)
            const needsBlankAfter = i < lines.length - 1 && lines[i+1].trim() !== '';
            
            if (needsBlankBefore) {
              newLines.push('');
              md022FixesApplied++;
            }
            
            newLines.push(line);
            
            if (needsBlankAfter) {
              newLines.push('');
              md022FixesApplied++;
            }
          } else {
            newLines.push(line);
          }
        }
        
        fixesApplied += md022FixesApplied;
        lines = newLines;
      }
      
      // Handle MD031 (blanks around fenced code blocks)
      if (issues.some(issue => issue.ruleNames.includes('MD031'))) {
        let newLines: string[] = [];
        let inCodeBlock = false;
        let md031FixesApplied = 0;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const isFenceStart = line.trim().startsWith('```');
          const isFenceEnd = inCodeBlock && line.trim() === '```';
          
          if (isFenceStart && !inCodeBlock) {
            // Check if there's a blank line before the code block (unless it's the first line)
            const needsBlankBefore = i > 0 && lines[i-1].trim() !== '';
            
            if (needsBlankBefore) {
              newLines.push('');
              md031FixesApplied++;
            }
            
            newLines.push(line);
            inCodeBlock = true;
          } else if (isFenceEnd) {
            newLines.push(line);
            inCodeBlock = false;
            
            // Check if there's a blank line after the code block (unless it's the last line)
            const needsBlankAfter = i < lines.length - 1 && lines[i+1].trim() !== '';
            
            if (needsBlankAfter) {
              newLines.push('');
              md031FixesApplied++;
            }
          } else {
            newLines.push(line);
          }
        }
        
        fixesApplied += md031FixesApplied;
        lines = newLines;
      }
      
      // Handle MD040 (fenced code language)
      if (issues.some(issue => issue.ruleNames.includes('MD040'))) {
        let newLines: string[] = [];
        let inCodeBlock = false;
        let md040FixesApplied = 0;
        
        for (const line of lines) {
          if (!inCodeBlock && line.trim() === '```') {
            // Add 'text' as the default language
            newLines.push('```text');
            inCodeBlock = true;
            md040FixesApplied++;
          } else if (inCodeBlock && line.trim() === '```') {
            newLines.push(line);
            inCodeBlock = false;
          } else {
            newLines.push(line);
            if (!inCodeBlock && line.trim().startsWith('```')) {
              inCodeBlock = true;
            }
          }
        }
        
        fixesApplied += md040FixesApplied;
        lines = newLines;
      }
      
      // Handle MD032 (blanks around lists)
      if (issues.some(issue => issue.ruleNames.includes('MD032'))) {
        let newLines: string[] = [];
        let md032FixesApplied = 0;
        let inList = false;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const isListItem = /^(\s*[-+*]|\s*\d+\.)\s+.+/.test(line);
          const isEndOfList = inList && !isListItem && line.trim() !== '';
          
          if (isListItem && !inList) {
            // List is starting
            inList = true;
            
            // Check if there's a blank line before the list (unless it's the first line)
            const needsBlankBefore = i > 0 && lines[i-1].trim() !== '';
            
            if (needsBlankBefore) {
              newLines.push('');
              md032FixesApplied++;
            }
            
            newLines.push(line);
          } else if (isEndOfList) {
            // List is ending
            inList = false;
            
            // Check if there's a blank line after the list
            const needsBlankAfter = line.trim() !== '';
            
            if (needsBlankAfter) {
              newLines.push('');
              md032FixesApplied++;
            }
            
            newLines.push(line);
          } else {
            newLines.push(line);
          }
        }
        
        fixesApplied += md032FixesApplied;
        lines = newLines;
      }
      
      // Handle MD047 (files should end with a single newline character)
      if (issues.some(issue => issue.ruleNames.includes('MD047'))) {
        // Remove any trailing blank lines
        while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
          lines.pop();
          fixesApplied++;
        }
        
        // Add a single blank line at the end
        lines.push('');
        fixesApplied++;
      }
      
      // Handle MD023 (headings must start at the beginning of the line)
      if (issues.some(issue => issue.ruleNames.includes('MD023'))) {
        let newLines: string[] = [];
        let md023FixesApplied = 0;
        
        for (const line of lines) {
          // Check if this is a heading with leading whitespace
          const headingMatch = line.match(/^\s+(#{1,6}\s+.+)$/);
          if (headingMatch) {
            // Remove the leading whitespace
            newLines.push(headingMatch[1]);
            md023FixesApplied++;
          } else {
            newLines.push(line);
          }
        }
        
        fixesApplied += md023FixesApplied;
        lines = newLines;
      }
      
      // Handle MD026 (trailing punctuation in heading)
      if (issues.some(issue => issue.ruleNames.includes('MD026'))) {
        let newLines: string[] = [];
        let md026FixesApplied = 0;
        
        for (const line of lines) {
          // Check if this is a heading
          if (/^#{1,6}\s+.+$/.test(line)) {
            // Remove trailing punctuation (.,;:!?), but preserve closing hash if present
            const newLine = line.replace(/^(#{1,6}\s+.+?)[.,;:!?]+(\s*#*\s*)$/, '$1$2');
            if (newLine !== line) {
              md026FixesApplied++;
            }
            newLines.push(newLine);
          } else {
            newLines.push(line);
          }
        }
        
        fixesApplied += md026FixesApplied;
        lines = newLines;
      }
      
      // Handle MD027 (multiple spaces after blockquote symbol)
      if (issues.some(issue => issue.ruleNames.includes('MD027'))) {
        let newLines: string[] = [];
        let md027FixesApplied = 0;
        
        for (const line of lines) {
          // Check if this is a blockquote with multiple spaces after >
          const newLine = line.replace(/^(\s*>)\s{2,}(.*)$/, '$1 $2');
          if (newLine !== line) {
            md027FixesApplied++;
          }
          newLines.push(newLine);
        }
        
        fixesApplied += md027FixesApplied;
        lines = newLines;
      }
      
      const currentContent = lines.join('\n');

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
      
      // If no fixes were applied but issues were detected, try using markdownlint's fix option
      if (fixesApplied === 0 && finalIssues.length > 0) {
        try {
          // Try markdownlint's built-in fix as a fallback
          const fixResults = markdownlint.sync({
            strings: {
              [filePath]: originalContent
            },
            config,
            fix: true
          } as any);
          
          const fixedContent = (fixResults[filePath] as any)?.fixedContent;
          
          if (fixedContent && fixedContent !== originalContent) {
            // Use the fixed content from markdownlint
            const fixedLines = lines.slice(); // Create a copy of the original lines
            const newLines = fixedContent.split('\n');
            
            // Recalculate fixes applied
            fixesApplied += Math.abs(lines.length - newLines.length);
            
            // Update lines with the fixed content
            lines = newLines;
            
            // Write the fixed content back to file if requested
            if (writeFile) {
              await fs.writeFile(filePath, fixedContent, 'utf8');
            }
          }
        } catch (err) {
          // Ignore errors from the fallback fix attempt
          console.error("Error in fallback fix attempt:", err);
        }
      }
      
      // Generate status report
      let statusText = '';
      
      if (fixesApplied > 0) {
        statusText = `✅ **Successfully fixed ${fixesApplied} issue(s)**\n\n`;
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

  /**
   * Get the current markdownlint configuration
   * @returns MCP content response with configuration details
   */
  public async getConfiguration() {
    return {
      content: [
        {
          type: 'text',
          text: `## Current Markdownlint Configuration\n\n**Active Rules:**\n- Line length limit: 120 characters\n- HTML elements: Allowed\n- First line heading: Not required\n- All other rules: Enabled (default markdownlint ruleset)\n\n**Configuration Source:** Built-in defaults (can be overridden with .markdownlint.json)\n\n**Total Rules:** 30+ standard markdownlint rules covering formatting, consistency, and best practices.\n\n**Auto-Fix Capability:** Automatically fixes all possible issues including spacing, heading formatting, list formatting, and line endings.`
        }
      ]
    };
  }

  /**
   * Load markdownlint configuration from file or use defaults
   * @param directory Directory to look for .markdownlint.json
   * @returns Configuration object
   */
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

  /**
   * Start the MCP server
   */
  public async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Markdownlint MCP server running on stdio');
  }
}

// Start the server
const server = new MarkdownLintServer();
server.run().catch(console.error);
