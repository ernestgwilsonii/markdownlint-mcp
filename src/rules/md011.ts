import { Rule, RuleViolation } from './rule-interface';

/**
 * MD011: Reversed link syntax
 * 
 * This rule is triggered when the link syntax is reversed, using
 * parentheses for the link text and square brackets for the URL.
 * The correct Markdown link syntax is `[link text](URL)`.
 */
export const name = 'MD011';
export const description = 'Reversed link syntax';

/**
 * Helper function to check if a position is inside a code block or inline code
 * @param line The line to check
 * @param position The position to check
 * @returns True if position is inside code
 */
function isInsideCode(line: string, position: number): boolean {
  // Check for inline code (backticks)
  const beforePosition = line.substring(0, position);
  
  // Count backticks before position
  const ticksBefore = (beforePosition.match(/`/g) || []).length;
  
  // If odd number of backticks before, we're inside inline code
  if (ticksBefore % 2 === 1) {
    return true;
  }
  
  return false;
}

/**
 * Helper function to check if a line is inside a code block
 * @param lines Array of all lines
 * @param lineIndex The index of the line to check
 * @returns True if line is inside a code block
 */
function isInsideCodeBlock(lines: string[], lineIndex: number): boolean {
  let inCodeBlock = false;
  
  for (let i = 0; i <= lineIndex; i++) {
    const line = lines[i].trim();
    
    // Check for fenced code blocks
    if (line.startsWith('```') || line.startsWith('~~~')) {
      inCodeBlock = !inCodeBlock;
    }
  }
  
  return inCodeBlock;
}

/**
 * Validate function to detect reversed link syntax violations
 * @param lines Array of string lines to validate
 * @param config Optional rule configuration
 * @returns Array of rule violations
 */
export function validate(lines: string[], config?: any): RuleViolation[] {
  const violations: RuleViolation[] = [];
  // Regex to match reversed link syntax: (text)[url] with support for nested parentheses
  // This matches: opening paren, text (with possible nested parens), closing paren, opening bracket, text, closing bracket
  const reversedLinkRegex = /\(([^)]*(?:\([^)]*\)[^)]*)*)\)\[([^\]]+)\]/g;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip if line is inside a code block
    if (isInsideCodeBlock(lines, i)) {
      continue;
    }
    
    let match;
    
    // Reset regex for each line
    reversedLinkRegex.lastIndex = 0;
    
    while ((match = reversedLinkRegex.exec(line)) !== null) {
      // Skip if this match is inside inline code
      if (isInsideCode(line, match.index)) {
        continue;
      }
      
      // Additional validation: ensure we have meaningful text in both parts
      const text = match[1].trim();
      const url = match[2].trim();
      
      if (text.length > 0 && url.length > 0) {
        violations.push({
          lineNumber: i + 1,
          details: `Reversed link syntax '(${match[1]})[${match[2]}]' should be '[${match[1]}](${match[2]})'`,
          range: [match.index, match[0].length]
        });
      }
    }
  }
  
  return violations;
}

/**
 * Fix reversed link syntax by swapping brackets and parentheses
 * @param lines Array of string lines to fix
 * @param config Optional rule configuration
 * @returns Fixed lines array with proper link syntax
 */
export function fix(lines: string[], config?: any): string[] {
  // Regex to match reversed link syntax: (text)[url] with support for nested parentheses
  const reversedLinkRegex = /\(([^)]*(?:\([^)]*\)[^)]*)*)\)\[([^\]]+)\]/g;
  
  return lines.map((line, lineIndex) => {
    // Skip if line is inside a code block
    if (isInsideCodeBlock(lines, lineIndex)) {
      return line;
    }
    
    // Replace reversed links with correct syntax: [text](url)
    return line.replace(reversedLinkRegex, (match, text, url, offset) => {
      // Skip if this match is inside inline code
      if (isInsideCode(line, offset)) {
        return match;
      }
      
      // Additional validation: ensure we have meaningful text in both parts
      const textTrimmed = text.trim();
      const urlTrimmed = url.trim();
      
      if (textTrimmed.length > 0 && urlTrimmed.length > 0) {
        return `[${text}](${url})`;
      }
      
      return match;
    });
  });
}

/**
 * Rule implementation for MD011
 */
export const rule: Rule = {
  name,
  description,
  validate,
  fix
};

export default rule;
