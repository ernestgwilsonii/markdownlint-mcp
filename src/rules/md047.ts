import { Rule } from './rule-interface';

/**
 * MD047: Files should end with a single newline character
 * 
 * This rule is triggered when there is no newline character at the end of a file.
 * The POSIX standard requires every text file to end with a newline character, 
 * and many tools and editors will automatically add one if it's missing.
 */
export const name = 'MD047';
export const description = 'Files should end with a single newline character';

/**
 * Fix files by ensuring they end with exactly one newline character
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with a single newline at the end
 */
export function fix(lines: string[]): string[] {
  // Create a copy of the lines array to avoid modifying the original
  const result = [...lines];
  
  // Remove any trailing empty lines
  while (result.length > 0 && result[result.length - 1].trim() === '') {
    result.pop();
  }
  
  // Add a single empty line at the end
  result.push('');
  
  return result;
}

/**
 * Rule implementation for MD047
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
