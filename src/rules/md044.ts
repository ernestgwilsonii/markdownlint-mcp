import { Rule } from './rule-interface';

/**
 * MD044: Proper names should have the correct capitalization
 * 
 * This rule is triggered when proper names have incorrect capitalization.
 * It can be used to enforce consistent capitalization of product names,
 * trademarks, and other proper nouns.
 * 
 * Unlike the other rules we've implemented today, this rule CAN be automatically
 * fixed by replacing the incorrect capitalization with the correct form.
 */
export const name = 'MD044';
export const description = 'Proper names should have the correct capitalization';

/**
 * Fix function for MD044
 * This function replaces occurrences of incorrectly capitalized proper names
 * with their correctly capitalized versions.
 * 
 * Note: The actual implementation would need to use a configured list of proper names
 * and their correct capitalizations. This is just a stub implementation.
 * 
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper names correctly capitalized
 */
export function fix(lines: string[]): string[] {
  // This is a simplified implementation
  // In a real implementation, we would:
  // 1. Get the list of proper names from configuration
  // 2. Create a map of lowercase -> correctly capitalized versions
  // 3. Scan each line for matches (ignoring code blocks if configured)
  // 4. Replace incorrect capitalization with the correct form
  
  // For now, return the lines unchanged as a placeholder
  return [...lines];
}

/**
 * Rule implementation for MD044
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
