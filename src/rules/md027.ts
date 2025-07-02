import { Rule } from './rule-interface';

/**
 * MD027: Multiple spaces after blockquote symbol
 * 
 * This rule is triggered when blockquotes have more than one space after the
 * blockquote marker (>). According to the CommonMark spec, only one space is
 * required after the blockquote marker.
 */
export const name = 'MD027';
export const description = 'Multiple spaces after blockquote symbol';

/**
 * Fix blockquotes with too many spaces after the blockquote symbol
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper spacing after blockquote symbols
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => 
    line.replace(/^(\s*>)\s{2,}(.*)$/, '$1 $2')
  );
}

/**
 * Rule implementation for MD027
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
