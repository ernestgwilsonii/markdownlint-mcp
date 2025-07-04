import { Rule, RuleViolation } from './rule-interface';

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
 * Validate function to detect blank lines inside blockquotes
 * @param lines Array of string lines to validate
 * @param config Optional rule configuration
 * @returns Array of rule violations
 */
export function validate(lines: string[], config?: any): RuleViolation[] {
  const violations: RuleViolation[] = [];
  
  // Track blockquote state
  let inBlockquote = false;
  let lastBlockquoteLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Check if current line is a blockquote
    const isBlockquoteLine = trimmedLine.startsWith('>');
    
    if (isBlockquoteLine) {
      // If we're starting a new blockquote after a blank line
      if (inBlockquote && i > lastBlockquoteLine + 1) {
        // Check if there's a blank line between blockquotes
        for (let j = lastBlockquoteLine + 1; j < i; j++) {
          const intermediateLine = lines[j];
          // Only treat truly empty lines as blank lines, not whitespace-only lines
          if (intermediateLine === '') {
            // Found a blank line between blockquotes
            violations.push({
              lineNumber: j + 1,
              details: 'Blank line inside blockquote',
              range: [0, intermediateLine.length]
            });
          }
        }
      }
      
      inBlockquote = true;
      lastBlockquoteLine = i;
    } else if (trimmedLine === '') {
      // Empty line - continue tracking
      continue;
    } else {
      // Non-blockquote, non-empty line - end blockquote tracking
      inBlockquote = false;
    }
  }
  
  return violations;
}

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
  validate,
  fix
};

export default rule;
