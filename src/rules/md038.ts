import { Rule, RuleViolation } from './rule-interface';

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
    // Handle spaces inside code spans with a comprehensive pattern
    return line.replace(/`(\s*)([^`]*?)(\s*)`/g, (match, leadingSpaces, content, trailingSpaces) => {
      // If there's no content, return as-is (empty code span)
      if (!content.trim()) {
        return '``';
      }
      
      // Remove leading and trailing spaces but preserve internal content
      return `\`${content.trim()}\``;
    });
  });
}

/**
 * Validate lines for spaces inside code span elements
 * @param lines Array of string lines to validate
 * @returns Array of rule violations
 */
export function validate(lines: string[]): RuleViolation[] {
  const violations: RuleViolation[] = [];
  
  lines.forEach((line, index) => {
    // Find all code spans
    const codeSpanMatches = line.matchAll(/`([^`]*)`/g);
    
    for (const match of codeSpanMatches) {
      const content = match[1];
      
      // Check if there are leading or trailing spaces in the content
      if (content.length > 0 && (content.startsWith(' ') || content.endsWith(' '))) {
        violations.push({
          lineNumber: index + 1,
          details: 'Spaces inside code span elements',
          range: [match.index || 0, match[0].length]
        });
      }
    }
  });
  
  return violations;
}

/**
 * Rule implementation for MD038
 */
export const rule: Rule = {
  name,
  description,
  validate,
  fix
};

export default rule;
