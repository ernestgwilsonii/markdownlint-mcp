import { Rule } from './rule-interface';

/**
 * MD021: Multiple spaces inside hashes on closed atx style heading
 * 
 * This rule is triggered when more than one space is used to separate the
 * closing hash characters from the heading text in a closed atx style heading.
 * This rule is consistent with the standard CommonMark specification.
 */
export const name = 'MD021';
export const description = 'Multiple spaces inside hashes on closed atx style heading';

/**
 * Fix headings with multiple spaces inside closing hashes by reducing to a single space
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper spacing inside closing hashes
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => 
    line.replace(/^(#{1,6})[ \t]+(.+?)[ \t]{2,}#$/m, '$1 $2 #')
  );
}

/**
 * Rule implementation for MD021
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
