import { Rule } from './rule-interface';

/**
 * MD023: Headings must start at the beginning of the line
 * 
 * This rule is triggered when headings (any style) don't start at the beginning of the line.
 * Having whitespace before a heading can lead to rendering issues and inconsistent styling.
 */
export const name = 'MD023';
export const description = 'Headings must start at the beginning of the line';

/**
 * Fix headings by removing leading whitespace
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with headings starting at the beginning of each line
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => {
    // Check if this is a heading with leading whitespace
    const headingMatch = line.match(/^\s+(#{1,6}\s+.+)$/);
    if (headingMatch) {
      // Remove the leading whitespace
      return headingMatch[1];
    }
    return line;
  });
}

/**
 * Rule implementation for MD023
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
