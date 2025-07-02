import { Rule } from './rule-interface';

/**
 * MD041: First line in a file should be a top-level heading
 * 
 * This rule is triggered when the first line in a file is not a top-level heading.
 * A top-level heading acts as the title of the document and improves document
 * structure and accessibility. The rule can be configured to require a different
 * heading level if needed.
 * 
 * Note: This rule is detection-only and doesn't provide automatic fixes
 * since adding a meaningful title requires understanding the document's content.
 */
export const name = 'MD041';
export const description = 'First line in a file should be a top-level heading';

/**
 * Fix function for MD041
 * Since adding a proper title requires understanding the document's content,
 * this rule only detects the issue and doesn't automatically fix it.
 * @param lines Array of string lines to check
 * @returns Original lines array unchanged
 */
export function fix(lines: string[]): string[] {
  // This rule is detection-only, so we return the lines unchanged
  return [...lines];
}

/**
 * Rule implementation for MD041
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
