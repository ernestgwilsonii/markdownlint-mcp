import { Rule } from './rule-interface';

/**
 * MD019: Multiple spaces after hash on atx style heading
 * 
 * This rule is triggered when more than one space is used to separate the
 * opening hash characters from the heading text in an atx style heading.
 * This rule is consistent with the standard CommonMark specification.
 */
export const name = 'MD019';
export const description = 'Multiple spaces after hash on atx style heading';

/**
 * Fix headings with multiple spaces after hash by reducing to a single space
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper spacing after heading hashes
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => 
    line.replace(/^(#{1,6})[ \t]{2,}/, '$1 ')
  );
}

/**
 * Rule implementation for MD019
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
