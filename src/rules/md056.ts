import { Rule } from './rule-interface';

/**
 * MD056: Table column count
 * 
 * This rule ensures that all rows in a Markdown table have the same number
 * of columns. Tables with inconsistent column counts can render unpredictably.
 */
export const name = 'MD056';
export const description = 'Table column count';

/**
 * Check if a line appears to be part of a table
 * @param line The line to check
 * @returns True if the line is part of a table
 */
function isTableLine(line: string): boolean {
  // Tables typically have pipe characters
  return line.trim().includes('|');
}

/**
 * Check if a line is a table separator row (contains only -, |, and :)
 * @param line The line to check
 * @returns True if the line is a table separator row
 */
function isTableSeparator(line: string): boolean {
  return /^\s*\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?\s*$/.test(line);
}

/**
 * Count the number of columns in a table row
 * @param line The table row line
 * @returns The number of columns
 */
function countTableColumns(line: string): number {
  // Remove escaped pipe characters (they don't count as column separators)
  const lineWithoutEscapedPipes = line.replace(/\\\|/g, '');
  
  // Count columns by counting pipe characters
  const trimmed = lineWithoutEscapedPipes.trim();
  let pipeCount = 0;
  
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed[i] === '|') {
      pipeCount++;
    }
  }
  
  // If the line starts and ends with pipes, we have (pipeCount - 1) columns
  // Otherwise, we have pipeCount + 1 columns (when line doesn't have surrounding pipes)
  if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
    return Math.max(0, pipeCount - 1);
  } else if (trimmed.startsWith('|')) {
    return pipeCount;
  } else if (trimmed.endsWith('|')) {
    return pipeCount;
  } else {
    return pipeCount + 1;
  }
}

/**
 * Fix tables to ensure all rows have the same number of columns
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with consistent table column counts
 */
export function fix(lines: string[]): string[] {
  if (lines.length === 0) return lines;
  
  const result = [...lines];
  let inTable = false;
  let tableStartIndex = -1;
  let columnCount = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this line is part of a table
    if (isTableLine(line)) {
      // If we're not already in a table, this is the start of a new table
      if (!inTable) {
        inTable = true;
        tableStartIndex = i;
        columnCount = countTableColumns(line);
      } 
      
      // Check column count against the first row's count
      const lineColumnCount = countTableColumns(line);
      
      // Skip fixing separator lines, they should be adjusted based on content rows
      if (!isTableSeparator(line) && lineColumnCount !== columnCount) {
        // We need to fix this row to match the column count
        const fixedLine = fixTableRow(line, columnCount);
        result[i] = fixedLine;
      }
    } else {
      // If we were in a table and now we're not, reset table tracking
      if (inTable) {
        inTable = false;
        tableStartIndex = -1;
        columnCount = -1;
      }
    }
  }
  
  return result;
}

/**
 * Fix a table row to have the specified number of columns
 * @param line The table row to fix
 * @param targetColumnCount The target number of columns
 * @returns A fixed table row with the correct number of columns
 */
function fixTableRow(line: string, targetColumnCount: number): string {
  const trimmed = line.trim();
  const indentation = line.slice(0, line.indexOf(trimmed));
  
  // Split by pipe characters
  const parts = trimmed.split('|');
  
  // Handle surrounding pipes
  const startWithPipe = trimmed.startsWith('|');
  const endWithPipe = trimmed.endsWith('|');
  
  // Extract actual cell contents
  let cells: string[] = [];
  
  if (startWithPipe && endWithPipe) {
    // Remove empty first and last parts that result from surrounding pipes
    cells = parts.slice(1, -1);
  } else if (startWithPipe) {
    cells = parts.slice(1);
  } else if (endWithPipe) {
    cells = parts.slice(0, -1);
  } else {
    cells = parts;
  }
  
  // If we have too few columns, add empty cells
  while (cells.length < targetColumnCount) {
    cells.push('   ');
  }
  
  // If we have too many columns, remove excess cells
  if (cells.length > targetColumnCount) {
    cells = cells.slice(0, targetColumnCount);
  }
  
  // Reconstruct the line
  let fixedLine = cells.join('|');
  
  // Add surrounding pipes if the original line had them
  if (startWithPipe) {
    fixedLine = '|' + fixedLine;
  }
  if (endWithPipe || startWithPipe) {
    // If the line starts with a pipe, it should also end with a pipe for proper table formatting
    fixedLine = fixedLine + '|';
  }
  
  return indentation + fixedLine;
}

/**
 * Rule implementation for MD056
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
