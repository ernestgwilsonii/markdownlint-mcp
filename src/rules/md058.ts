import { Rule } from './rule-interface';

/**
 * MD058: Tables should be surrounded by blank lines
 * 
 * This rule is triggered when tables are not preceded or followed by a blank line.
 * Surrounding tables with blank lines improves readability by visually separating
 * them from other content.
 */
export const name = 'MD058';
export const description = 'Tables should be surrounded by blank lines';

/**
 * Checks if a line appears to be part of a table
 * Tables in markdown typically start with | or have a line with |---|---| pattern
 * @param line The line to check
 * @returns True if the line appears to be part of a table
 */
function isTableLine(line: string): boolean {
  // Table lines either start with | or have | inside them with spaces/dashes in between
  return line.trim().startsWith('|') || /^\s*\|.*\|/.test(line);
}

/**
 * Checks if a line is a table divider row (contains only |, -, :, and spaces)
 * @param line The line to check
 * @returns True if the line is a table divider
 */
function isTableDivider(line: string): boolean {
  return /^\s*\|[\s\-:\|]+\|\s*$/.test(line);
}

/**
 * Fix tables by ensuring they have blank lines before and after
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with blank lines added around tables
 */
export function fix(lines: string[]): string[] {
  if (lines.length === 0) return lines;
  
  const result: string[] = [];
  let inTable = false;
  let tableStartIndex = -1;
  
  // Process each line to identify table boundaries
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Check for table start
    if (!inTable && isTableLine(line)) {
      inTable = true;
      tableStartIndex = result.length;
      
      // Add a blank line before the table if needed
      if (tableStartIndex > 0 && result[tableStartIndex - 1].trim() !== '') {
        result.splice(tableStartIndex, 0, '');
        tableStartIndex++;
      }
    }
    
    // Add the current line
    result.push(line);
    
    // Check for table end
    if (inTable && (i === lines.length - 1 || !isTableLine(lines[i + 1]))) {
      inTable = false;
      
      // Add a blank line after the table if needed
      if (i < lines.length - 1 && lines[i + 1].trim() !== '') {
        result.push('');
      }
    }
  }
  
  return result;
}

/**
 * Rule implementation for MD058
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
