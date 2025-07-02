import { Rule } from './rule-interface';

/**
 * MD011: Reversed link syntax
 * 
 * This rule is triggered when the link syntax is reversed, using
 * parentheses for the link text and square brackets for the URL.
 * The correct Markdown link syntax is `[link text](URL)`.
 */
export const name = 'MD011';
export const description = 'Reversed link syntax';

/**
 * Fix reversed link syntax by swapping brackets and parentheses
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper link syntax
 */
export function fix(lines: string[]): string[] {
  // Regex to match reversed link syntax: (text)[url]
  const reversedLinkRegex = /\(([^\)]+)\)\[([^\]]+)\]/g;
  
  return lines.map(line => {
    // Replace reversed links with correct syntax: [text](url)
    return line.replace(reversedLinkRegex, '[$1]($2)');
  });
}

/**
 * Rule implementation for MD011
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
