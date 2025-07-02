import { Rule } from './rule-interface';

/**
 * MD031: Fenced code blocks should be surrounded by blank lines
 * 
 * This rule is triggered when fenced code blocks are not surrounded by blank
 * lines. Inserting blank lines helps to visually separate content and makes
 * the Markdown more readable.
 */
export const name = 'MD031';
export const description = 'Fenced code blocks should be surrounded by blank lines';

/**
 * Fix fenced code blocks by ensuring they're surrounded by blank lines
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper spacing around code blocks
 */
export function fix(lines: string[]): string[] {
  let fixedLines: string[] = [];
  let inCodeBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isFenceStart = line.trim().startsWith('```');
    const isFenceEnd = inCodeBlock && line.trim() === '```';
    
    if (isFenceStart && !inCodeBlock) {
      // Check if there's a blank line before the code block (unless it's the first line)
      const needsBlankBefore = i > 0 && lines[i-1].trim() !== '';
      
      if (needsBlankBefore) {
        fixedLines.push('');
      }
      
      fixedLines.push(line);
      inCodeBlock = true;
    } else if (isFenceEnd) {
      fixedLines.push(line);
      inCodeBlock = false;
      
      // Check if there's a blank line after the code block (unless it's the last line)
      const needsBlankAfter = i < lines.length - 1 && lines[i+1].trim() !== '';
      
      if (needsBlankAfter) {
        fixedLines.push('');
      }
    } else {
      fixedLines.push(line);
    }
  }
  
  return fixedLines;
}

/**
 * Rule implementation for MD031
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
