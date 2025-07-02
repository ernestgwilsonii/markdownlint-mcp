import { Rule } from './rule-interface';

/**
 * MD026: Trailing punctuation in heading
 * 
 * This rule is triggered when headings end with punctuation characters (.,;:!?).
 * The punctuation characters are typically unnecessary and don't add value to the heading.
 */
export const name = 'MD026';
export const description = 'Trailing punctuation in heading';

/**
 * Fix headings with trailing punctuation by removing it
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with heading punctuation removed
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => {
    if (/^#{1,6}\s+.+$/.test(line)) {
      return line.replace(/^(#{1,6}\s+.+?)[.,;:!?]+(\s*#*\s*)$/, '$1$2');
    }
    return line;
  });
}

/**
 * Rule implementation for MD026
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
