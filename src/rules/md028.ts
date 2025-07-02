import { Rule } from './rule-interface';

/**
 * MD028: Blank line inside blockquote
 * 
 * This rule is triggered when two blockquote blocks are separated by a blank line.
 * Some Markdown parsers will treat these as the same blockquote, while others
 * will treat them as separate blockquotes. To ensure consistent rendering,
 * either add content between the blockquotes or add the blockquote symbol to
 * the blank line.
 * 
 * Note: This rule is detection-only and doesn't provide automatic fixes
 * since fixing requires knowing the author's intention.
 */
export const name = 'MD028';
export const description = 'Blank line inside blockquote';

/**
 * Fix function for MD028
 * Since resolving blank lines in blockquotes requires understanding
 * the author's intention (whether it should be one blockquote or two),
 * this rule only detects the issue and doesn't automatically fix it.
 * @param lines Array of string lines to check
 * @returns Original lines array unchanged
 */
export function fix(lines: string[]): string[] {
  // This rule is detection-only, so we return the lines unchanged
  return [...lines];
}

/**
 * Rule implementation for MD028
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
