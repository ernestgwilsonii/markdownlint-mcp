import { Rule } from './rule-interface';

/**
 * MD009: Trailing spaces
 * 
 * This rule is triggered when trailing spaces are found at the end of a line.
 * Trailing spaces can cause unnecessary diffs in version control systems and
 * can be confusing in a text editor.
 */
export const name = 'MD009';
export const description = 'Trailing spaces';

/**
 * Fix trailing spaces by removing them from the end of each line
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with trailing spaces removed
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => line.replace(/[ \t]+$/, ''));
}

/**
 * Rule implementation for MD009
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
