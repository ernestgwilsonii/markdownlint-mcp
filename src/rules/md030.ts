import { Rule } from './rule-interface';

/**
 * MD030: Spaces after list markers
 * 
 * This rule is triggered when the spacing after list markers is inconsistent.
 * The rule ensures that there is a consistent number of spaces (usually 1)
 * between the list marker and the list content.
 */
export const name = 'MD030';
export const description = 'Spaces after list markers';

/**
 * Fix lists by ensuring consistent spacing after list markers
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with consistent spacing after list markers
 */
export function fix(lines: string[]): string[] {
  // Regular expressions to match ordered and unordered list items
  const unorderedListItemRegex = /^(\s*)([-+*])(\s+)(.*)$/;
  const orderedListItemRegex = /^(\s*)(\d+\.)(\s+)(.*)$/;
  
  return lines.map(line => {
    // Fix unordered list items (standardize to one space after marker)
    let match = line.match(unorderedListItemRegex);
    if (match && match[3] !== ' ') {
      // Replace with exactly one space
      return `${match[1]}${match[2]} ${match[4]}`;
    }
    
    // Fix ordered list items (standardize to one space after marker)
    match = line.match(orderedListItemRegex);
    if (match && match[3] !== ' ') {
      // Replace with exactly one space
      return `${match[1]}${match[2]} ${match[4]}`;
    }
    
    return line;
  });
}

/**
 * Rule implementation for MD030
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
