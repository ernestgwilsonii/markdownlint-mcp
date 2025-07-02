import { Rule } from './rule-interface';

/**
 * MD033: Inline HTML
 * 
 * This rule is triggered when HTML tags are used in a Markdown document.
 * Some users prefer to use "pure" Markdown without HTML tags, as it improves
 * portability and prevents potential security issues when rendering the Markdown.
 * 
 * Note: This rule is detection-only and doesn't provide automatic fixes
 * since removing HTML would likely break intended functionality.
 */
export const name = 'MD033';
export const description = 'Inline HTML';

/**
 * Fix function for MD033
 * Since HTML tags in Markdown are often used intentionally for specific
 * formatting or functionality, this rule only detects the issue and
 * doesn't automatically fix it.
 * @param lines Array of string lines to check
 * @returns Original lines array unchanged
 */
export function fix(lines: string[]): string[] {
  // This rule is detection-only, so we return the lines unchanged
  return [...lines];
}

/**
 * Rule implementation for MD033
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
