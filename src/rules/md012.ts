import { Rule } from './rule-interface';

/**
 * MD012: Multiple consecutive blank lines
 * 
 * This rule is triggered when there are multiple consecutive blank lines in the document.
 * Having more than one blank line in a row doesn't add any value and can make the document
 * look less tidy and harder to read.
 */
export const name = 'MD012';
export const description = 'Multiple consecutive blank lines';

/**
 * Fix multiple consecutive blank lines by reducing them to a single blank line
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with no more than one consecutive blank line
 */
export function fix(lines: string[]): string[] {
  const result: string[] = [];
  let previousLineBlank = false;
  
  for (const line of lines) {
    const isLineBlank = line.trim() === '';
    
    // If current line is blank and previous line was also blank, skip it
    if (isLineBlank && previousLineBlank) {
      continue;
    }
    
    // Otherwise add the line to the result
    result.push(line);
    previousLineBlank = isLineBlank;
  }
  
  return result;
}

/**
 * Rule implementation for MD012
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
