import { Rule } from './rule-interface';

/**
 * MD040: Fenced code blocks should have a language specified
 * 
 * This rule is triggered when fenced code blocks do not have a language specified.
 * Adding a language helps syntax highlighting and improves readability.
 */
export const name = 'MD040';
export const description = 'Fenced code blocks should have a language specified';

/**
 * Fix code blocks by adding a default language when none is specified
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with language added to code blocks
 */
export function fix(lines: string[]): string[] {
  let fixedLines: string[] = [];
  let inCodeBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (!inCodeBlock && line.trim() === '```') {
      // Add 'text' as the default language
      fixedLines.push('```text');
      inCodeBlock = true;
    } else if (inCodeBlock && line.trim() === '```') {
      fixedLines.push(line);
      inCodeBlock = false;
    } else {
      fixedLines.push(line);
      if (!inCodeBlock && line.trim().startsWith('```')) {
        inCodeBlock = true;
      }
    }
  }
  
  return fixedLines;
}

/**
 * Rule implementation for MD040
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
