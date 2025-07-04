import { Rule, RuleViolation } from './rule-interface';

/**
 * MD043: Required heading structure
 * 
 * This rule is triggered when the headings in a file don't match the array of headings
 * specified in the rule's configuration. It can be used to enforce a standard
 * heading structure across a set of documents.
 * 
 * Note: This rule is detection-only and doesn't provide automatic fixes
 * since fixing would require generating appropriate content for potentially
 * missing headings.
 */
export const name = 'MD043';
export const description = 'Required heading structure';

/**
 * Extract heading text from a line
 * @param line The line to extract heading text from
 * @returns The heading text without the hash symbols
 */
function extractHeadingText(line: string): string {
  const trimmed = line.trim();
  const match = trimmed.match(/^#{1,6}\s+(.+?)(?:\s+#{1,6})?$/);
  return match ? match[1].trim() : '';
}

/**
 * Get heading level from a line
 * @param line The line to get heading level from
 * @returns The heading level (1-6) or 0 if not a heading
 */
function getHeadingLevel(line: string): number {
  const trimmed = line.trim();
  const match = trimmed.match(/^(#{1,6})(\s|$)/);
  return match ? match[1].length : 0;
}

/**
 * Validate function to check if headings match required structure
 * @param lines Array of string lines to validate
 * @param config Optional rule configuration with expected headings
 * @returns Array of rule violations
 */
export function validate(lines: string[], config?: any): RuleViolation[] {
  const violations: RuleViolation[] = [];
  
  // Default configuration - if no headings specified, no violations
  const expectedHeadings = config?.headings || [];
  
  // If no expected headings configured, skip validation
  if (expectedHeadings.length === 0) {
    return violations;
  }
  
  // Extract all headings from the document
  const documentHeadings: Array<{text: string, level: number, lineNumber: number}> = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this line is a heading
    if (trimmed.match(/^#{1,6}(\s|$)/)) {
      const headingText = extractHeadingText(line);
      const level = getHeadingLevel(line);
      
      // Include all headings, even empty ones
      documentHeadings.push({
        text: headingText,
        level: level,
        lineNumber: i + 1
      });
    }
  }
  
  // Compare document headings with expected structure
  for (let i = 0; i < Math.max(documentHeadings.length, expectedHeadings.length); i++) {
    const documentHeading = documentHeadings[i];
    const expectedHeading = expectedHeadings[i];
    
    if (!documentHeading && expectedHeading) {
      // Missing expected heading
      violations.push({
        lineNumber: documentHeadings.length > 0 ? documentHeadings[documentHeadings.length - 1].lineNumber : 1,
        details: `Missing expected heading: "${expectedHeading}"`,
        range: [0, 0]
      });
    } else if (documentHeading && !expectedHeading) {
      // Extra heading not in expected structure
      violations.push({
        lineNumber: documentHeading.lineNumber,
        details: `Unexpected heading: "${documentHeading.text}"`,
        range: [0, lines[documentHeading.lineNumber - 1].length]
      });
    } else if (documentHeading && expectedHeading) {
      // Check if heading text matches expected
      if (documentHeading.text !== expectedHeading) {
        violations.push({
          lineNumber: documentHeading.lineNumber,
          details: `Expected heading "${expectedHeading}" but found "${documentHeading.text}"`,
          range: [0, lines[documentHeading.lineNumber - 1].length]
        });
      }
    }
  }
  
  return violations;
}

/**
 * Fix function for MD043
 * Since fixing heading structure issues requires creating meaningful content
 * for missing headings or understanding how to restructure existing ones,
 * this rule only detects the issue and doesn't automatically fix it.
 * @param lines Array of string lines to check
 * @returns Original lines array unchanged
 */
export function fix(lines: string[]): string[] {
  // This rule is detection-only, so we return the lines unchanged
  return [...lines];
}

/**
 * Rule implementation for MD043
 */
export const rule: Rule = {
  name,
  description,
  validate,
  fix
};

export default rule;
