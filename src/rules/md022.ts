import { Rule } from './rule-interface';

/**
 * MD022: Headings should be surrounded by blank lines
 * 
 * This rule is triggered when headings (any style) are either not preceded or not followed by a blank line.
 * This is a common formatting convention that makes it easier to visually distinguish sections of a document.
 */
export const name = 'MD022';
export const description = 'Headings should be surrounded by blank lines';

/**
 * Fix headings by ensuring they have blank lines before and after
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with blank lines added around headings
 */
export function fix(lines: string[]): string[] {
  const result: string[] = [];
  const isHeading = (line: string): boolean => /^#{1,6}(\s+|$)/.test(line);
  
  // Process lines one by one
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isCurrentLineHeading = isHeading(line);
    
    // Check if we need to add a blank line before a heading
    if (isCurrentLineHeading && i > 0 && lines[i - 1].trim() !== '') {
      result.push(''); // Add blank line before heading
    }
    
    // Add the current line
    result.push(line);
    
    // Check if we need to add a blank line after a heading
    if (isCurrentLineHeading && i < lines.length - 1 && lines[i + 1].trim() !== '') {
      result.push(''); // Add blank line after heading
    }
  }
  
  return result;
}

/**
 * Rule implementation for MD022
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
