import { Rule } from './rule-interface';

/**
 * MD010: Hard tabs
 * 
 * This rule is triggered when hard tabs are used instead of spaces.
 * Hard tabs can lead to inconsistent rendering in different editors
 * and can cause issues when collaborating with others.
 */
export const name = 'MD010';
export const description = 'Hard tabs';

/**
 * Fix hard tabs by replacing them with two spaces
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with hard tabs replaced by spaces
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => line.replace(/\t/g, '  '));
}

/**
 * Rule implementation for MD010
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
