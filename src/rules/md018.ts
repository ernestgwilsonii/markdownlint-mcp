import { Rule } from './rule-interface';

/**
 * MD018: No space after hash on atx style heading
 * 
 * This rule is triggered when there is no space after the hash characters
 * that open an atx style heading. This rule is consistent with the standard
 * CommonMark specification.
 */
export const name = 'MD018';
export const description = 'No space after hash on atx style heading';

/**
 * Fix headings with no space after hash by adding a space
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper spacing after heading hashes
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => 
    line.replace(/^(#{1,6})([^#\s])/, '$1 $2')
  );
}

/**
 * Rule implementation for MD018
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
