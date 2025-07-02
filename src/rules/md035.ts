import { Rule } from './rule-interface';

/**
 * MD035: Horizontal rule style
 * 
 * This rule enforces consistent horizontal rule (thematic break) style.
 * In markdown, horizontal rules can be created using three or more hyphens (-),
 * asterisks (*), or underscores (_). This rule ensures that horizontal rules 
 * use a consistent style throughout a document.
 */
export const name = 'MD035';
export const description = 'Horizontal rule style';

/**
 * Regex to detect a horizontal rule line
 * A horizontal rule is 3+ hyphens, asterisks, or underscores, optionally with spaces between them
 */
const hrLineRegex = /^\s*([-*_])(\s*\1\s*){2,}\s*$/;

/**
 * Fix horizontal rule style by ensuring consistent format for all rules
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with consistent horizontal rule style
 */
export function fix(lines: string[]): string[] {
  // Find the first horizontal rule to use as the preferred style
  let preferredStyle = '---'; // Default to three hyphens if no horizontal rule is found
  
  for (const line of lines) {
    const match = line.match(hrLineRegex);
    if (match) {
      // Use the first found HR as the preferred style
      preferredStyle = line.trim();
      break;
    }
  }
  
  // Now fix all horizontal rules to match the preferred style
  return lines.map(line => {
    const match = line.match(hrLineRegex);
    if (match) {
      // Maintain the original indentation
      const indentation = line.match(/^\s*/)?.[0] || '';
      return indentation + preferredStyle;
    }
    return line;
  });
}

/**
 * Rule implementation for MD035
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
