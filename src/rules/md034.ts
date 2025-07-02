import { Rule } from './rule-interface';

/**
 * MD034: Bare URL used
 * 
 * This rule is triggered when a bare URL is used in the document.
 * URLs should be enclosed in angle brackets (`<` and `>`) or
 * formatted as proper Markdown links.
 */
export const name = 'MD034';
export const description = 'Bare URL used';

/**
 * Fix bare URLs by enclosing them in angle brackets
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with URLs properly formatted
 */
export function fix(lines: string[]): string[] {
  // URL regex pattern
  // This regex attempts to match URLs that are not already enclosed in angle brackets
  // or formatted as Markdown links
  const urlRegex = /(?<![<`])(https?:\/\/[^\s<>]+)(?![`>])/g;
  
  return lines.map(line => {
    // Skip lines that appear to be in code blocks or already in links
    if (line.trim().startsWith('```') || 
        line.includes('](') || 
        line.trim().startsWith('    ')) {
      return line;
    }
    
    // Enclose bare URLs in angle brackets
    return line.replace(urlRegex, '<$1>');
  });
}

/**
 * Rule implementation for MD034
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
