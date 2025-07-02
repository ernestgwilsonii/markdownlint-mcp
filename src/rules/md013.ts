import { Rule } from './rule-interface';

/**
 * MD013: Line length
 * 
 * This rule is triggered when lines are longer than the configured line length.
 * This rule is good for readability and maintaining a consistent code style.
 * 
 * Note: This rule is detection-only and doesn't provide automatic fixes
 * since line length remediation often requires human judgment for proper formatting.
 */
export const name = 'MD013';
export const description = 'Line length';

/**
 * Fix function for MD013
 * Since line length issues usually require human judgment for proper line breaking,
 * this rule only detects the issue and doesn't automatically fix it.
 * @param lines Array of string lines to check
 * @returns Original lines array unchanged
 */
export function fix(lines: string[]): string[] {
  // This rule is detection-only, so we return the lines unchanged
  return [...lines];
}

/**
 * Rule implementation for MD013
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
