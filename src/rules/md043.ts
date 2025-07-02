import { Rule } from './rule-interface';

/**
 * MD043: Required heading structure
 * 
 * This rule is triggered when the headings in a file don't match the array of headings
 * specified in the rule's configuration. It can be used to enforce a standard
 * heading structure across a set of documents.
 * 
 * Note: This rule is detection-only and doesn't provide automatic fixes
 * since fixing would require generating appropriate content for potentially
 * missing headings.
 */
export const name = 'MD043';
export const description = 'Required heading structure';

/**
 * Fix function for MD043
 * Since fixing heading structure issues requires creating meaningful content
 * for missing headings or understanding how to restructure existing ones,
 * this rule only detects the issue and doesn't automatically fix it.
 * @param lines Array of string lines to check
 * @returns Original lines array unchanged
 */
export function fix(lines: string[]): string[] {
  // This rule is detection-only, so we return the lines unchanged
  return [...lines];
}

/**
 * Rule implementation for MD043
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
