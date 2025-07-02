import { Rule } from './rule-interface';

/**
 * MD055: Table pipe style
 * 
 * This rule enforces consistent style for pipe characters in tables.
 * Table pipes can be aligned with spaces, surrounded by spaces, 
 * or neither, but the style should be consistent throughout the document.
 */
export const name = 'MD055';
export const description = 'Table pipe style';

/**
 * Check if a line appears to be part of a table
 * @param line The line to check
 * @returns True if the line looks like a table row
 */
function isTableLine(line: string): boolean {
  // Tables must have at least one pipe character
  // And generally start and end with a pipe
  return line.trim().includes('|');
}

/**
 * Determine the pipe style from a table line
 * @param line The table line to check
 * @returns The pipe style ('surrounded', 'left', 'right', or 'none')
 */
function determinePipeStyle(line: string): string {
  // Skip separator lines (those with only dashes, pipes, and colons)
  if (/^[\s|:\-]+$/.test(line)) {
    return '';
  }
  
  const trimmed = line.trim();
  
  // Check if the line has surrounding pipes (starts and ends with pipe)
  const hasSurroundingPipes = trimmed.startsWith('|') && trimmed.endsWith('|');
  
  // Check if pipes have spaces on both sides
  const pipeWithSpaces = / \| /.test(trimmed);
  const pipeWithLeftSpace = / \|/.test(trimmed);
  const pipeWithRightSpace = /\| /.test(trimmed);
  
  if (hasSurroundingPipes && pipeWithSpaces) {
    return 'surrounded';
  } else if (hasSurroundingPipes && pipeWithLeftSpace) {
    return 'left';
  } else if (hasSurroundingPipes && pipeWithRightSpace) {
    return 'right';
  } else {
    return 'none';
  }
}

/**
 * Fix table pipe style by ensuring a consistent style throughout the document
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with consistent table pipe style
 */
export function fix(lines: string[]): string[] {
  if (lines.length === 0) return lines;
  
  // Find all table lines
  const tableLines: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (isTableLine(lines[i])) {
      tableLines.push(i);
    }
  }
  
  if (tableLines.length === 0) {
    return lines; // No tables found
  }
  
  // Determine the preferred pipe style
  let styleCount = {
    surrounded: 0,
    left: 0,
    right: 0,
    none: 0
  };
  
  for (const lineIndex of tableLines) {
    const style = determinePipeStyle(lines[lineIndex]);
    if (style) {
      styleCount[style as keyof typeof styleCount]++;
    }
  }
  
  // Find the most common style
  let preferredStyle = 'surrounded'; // Default to surrounded
  let maxCount = 0;
  
  for (const [style, count] of Object.entries(styleCount)) {
    if (count > maxCount) {
      maxCount = count;
      preferredStyle = style;
    }
  }
  
  // Now fix all table lines to match the preferred style
  const result = [...lines];
  
  for (const lineIndex of tableLines) {
    const line = lines[lineIndex];
    
    // Skip separator lines (those with only dashes, pipes, and colons)
    if (/^[\s|:\-]+$/.test(line.trim())) {
      continue;
    }
    
    const currentStyle = determinePipeStyle(line);
    if (!currentStyle || currentStyle === preferredStyle) {
      continue; // Skip separator lines or lines already in the preferred style
    }
    
    const trimmed = line.trim();
    const indentation = line.slice(0, line.indexOf(trimmed));
    
    // Split the line by pipes
    let parts = trimmed.split('|');
    
    // Handle surrounding pipes
    let startWithPipe = trimmed.startsWith('|');
    let endWithPipe = trimmed.endsWith('|');
    
    // If the line doesn't start with a pipe, the first part is content
    if (!startWithPipe) {
      parts.unshift('');
    }
    
    // If the line doesn't end with a pipe, the last part is content
    if (!endWithPipe) {
      parts.push('');
    }
    
    // Remove empty parts at the beginning and end if they exist
    if (parts[0] === '') {
      parts.shift();
    }
    if (parts[parts.length - 1] === '') {
      parts.pop();
    }
    
    // Now adjust according to preferred style
    let newLine = '';
    
    switch (preferredStyle) {
      case 'surrounded':
        // Ensure spaces around pipes and pipes at start and end
        newLine = '| ' + parts.map(p => p.trim()).join(' | ') + ' |';
        break;
      case 'left':
        // Ensure spaces before pipes
        newLine = '|' + parts.map(p => ' ' + p.trim()).join('|') + '|';
        break;
      case 'right':
        // Ensure spaces after pipes
        newLine = '|' + parts.map(p => p.trim() + ' ').join('|') + '|';
        break;
      case 'none':
        // No spaces around pipes
        newLine = '|' + parts.map(p => p.trim()).join('|') + '|';
        break;
    }
    
    result[lineIndex] = indentation + newLine;
  }
  
  return result;
}

/**
 * Rule implementation for MD055
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
