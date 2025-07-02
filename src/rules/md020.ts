import { Rule } from './rule-interface';

/**
 * MD020: No space inside hashes on closed atx style heading
 * 
 * This rule is triggered when closing hash characters in an atx style heading
 * are not separated from the heading text by a space. This rule is consistent
 * with the standard CommonMark specification.
 */
export const name = 'MD020';
export const description = 'No space inside hashes on closed atx style heading';

/**
 * Fix headings with no space inside closing hashes by adding a space
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper spacing inside closing hashes
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => 
    line.replace(/^(#{1,6})[ \t]+([^#\s].*?)[ \t]*#$/m, '$1 $2 #')
  );
}

/**
 * Rule implementation for MD020
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
