import { Rule } from './rule-interface';

/**
 * MD029: Ordered list item prefix
 * 
 * This rule is triggered when ordered lists don't use the specified prefix style.
 * The rule supports several different styles:
 * - 'one': All items use '1.' as the prefix
 * - 'ordered': Items use increasing numbers ('1.', '2.', etc.)
 * - 'one_or_ordered': Items use either all '1.' or increasing numbers
 * - 'zero': All items use '0.' as the prefix
 * 
 * Note: This rule is detection-only and doesn't provide automatic fixes
 * because it's hard to automatically determine the correct style.
 */
export const name = 'MD029';
export const description = 'Ordered list item prefix';

/**
 * Fix function for MD029
 * Since fixing ordered list numbering requires knowing the preferred style,
 * this rule only detects the issue and doesn't automatically fix it.
 * @param lines Array of string lines to check
 * @returns Original lines array unchanged
 */
export function fix(lines: string[]): string[] {
  // This rule is detection-only, so we return the lines unchanged
  return [...lines];
}

/**
 * Rule implementation for MD029
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
