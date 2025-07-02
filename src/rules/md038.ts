import { Rule } from './rule-interface';

/**
 * MD038: Spaces inside code span elements
 * 
 * This rule is triggered when code span elements have spaces right after the
 * opening backtick or right before the closing backtick. For example, 
 * ` code ` should be `code`.
 */
export const name = 'MD038';
export const description = 'Spaces inside code span elements';

/**
 * Fix spaces inside code span elements by removing them
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper code span spacing
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => {
    // Look for code spans with spaces after opening backtick or before closing backtick
    // This handles the case where there's a space after the opening backtick
    let fixedLine = line.replace(/`\s+([^`]+?)`/g, '`$1`');
    
    // This handles the case where there's a space before the closing backtick
    fixedLine = fixedLine.replace(/`([^`]+?)\s+`/g, '`$1`');
    
    // Handle the edge case where there are spaces on both sides
    // We need a separate replacement to avoid missing some cases due to the
    // non-greedy operator in the previous patterns
    fixedLine = fixedLine.replace(/`\s+([^`]+?)\s+`/g, '`$1`');
    
    return fixedLine;
  });
}

/**
 * Rule implementation for MD038
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
