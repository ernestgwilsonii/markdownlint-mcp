/**
 * File utility functions
 */
import { promises as fs } from 'fs';
import path from 'path';
import { MarkdownlintConfig } from '../types.js';

/**
 * Default markdownlint configuration
 * Used when no custom configuration is found
 */
const DEFAULT_CONFIG: MarkdownlintConfig = {
  'default': true,
  'MD013': { 'line_length': 120 }, // Allow longer lines for modern displays
  'MD033': false, // Allow HTML
  'MD041': false, // Allow files to not start with H1
};

/**
 * Read a file's content
 * @param filePath Path to the file
 * @returns File content as a string
 * @throws Error if file cannot be read
 */
export async function readFile(filePath: string): Promise<string> {
  try {
    // Check if file exists first
    await fs.access(filePath);
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    throw error;
  }
}

/**
 * Write content to a file
 * @param filePath Path to the file
 * @param content Content to write
 * @throws Error if file cannot be written
 */
export async function writeFile(filePath: string, content: string): Promise<void> {
  return await fs.writeFile(filePath, content, 'utf8');
}

/**
 * Load markdownlint configuration from file or use defaults
 * @param directory Directory to look for .markdownlint.json
 * @returns Configuration object
 */
export async function loadConfiguration(directory: string): Promise<MarkdownlintConfig> {
  const configPath = path.join(directory, '.markdownlint.json');
  
  try {
    await fs.access(configPath);
    const configContent = await fs.readFile(configPath, 'utf8');
    return JSON.parse(configContent) as MarkdownlintConfig;
  } catch (error) {
    // Fall back to default configuration if file not found or invalid
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Get the default markdownlint configuration
 * @returns Default configuration object
 */
export function getDefaultConfig(): MarkdownlintConfig {
  return { ...DEFAULT_CONFIG };
}

/**
 * Convert string content to an array of lines
 * @param content String content to split into lines
 * @returns Array of lines
 */
export function contentToLines(content: string): string[] {
  return content.split('\n');
}

/**
 * Join an array of lines into a single string
 * @param lines Array of lines to join
 * @returns Joined string
 */
export function linesToContent(lines: string[]): string {
  return lines.join('\n');
}
