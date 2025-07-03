import { Rule, RuleViolation } from './rule-interface';

/**
 * MD041: First line in a file should be a top-level heading
 * 
 * This rule is triggered when the first line in a file is not a top-level heading.
 * A top-level heading acts as the title of the document and improves document
 * structure and accessibility. The rule can be configured to require a different
 * heading level if needed.
 * 
 * Note: This rule is detection-only and doesn't provide automatic fixes
 * since adding a meaningful title requires understanding the document's content.
 */
export const name = 'MD041';
export const description = 'First line in a file should be a top-level heading';

/**
 * Validate lines for first line header requirement
 * @param lines Array of string lines to validate
 * @returns Array of rule violations
 */
export function validate(lines: string[]): RuleViolation[] {
  const violations: RuleViolation[] = [];
  
  if (lines.length === 0) {
    return violations;
  }
  
  // Find the first non-empty, non-comment line
  let firstLineIndex = 0;
  while (firstLineIndex < lines.length) {
    const line = lines[firstLineIndex].trim();
    if (line === '' || line.startsWith('<!--')) {
      firstLineIndex++;
      continue;
    }
    break;
  }
  
  if (firstLineIndex >= lines.length) {
    return violations; // Empty document
  }
  
  const firstLine = lines[firstLineIndex];
  
  // Check if first content line is a top-level heading
  if (!firstLine.trim().startsWith('# ')) {
    violations.push({
      lineNumber: firstLineIndex + 1,
      details: 'First line in a file should be a top-level heading',
      range: [0, firstLine.length]
    });
  }
  
  return violations;
}

/**
 * Fix function for MD041
 * Converts headers to H1, but leaves other content unchanged
 * @param lines Array of string lines to fix
 * @returns Fixed lines array
 */
export function fix(lines: string[]): string[] {
  if (lines.length === 0) {
    return lines;
  }
  
  // Find the first non-empty, non-comment line
  let firstLineIndex = 0;
  while (firstLineIndex < lines.length) {
    const line = lines[firstLineIndex].trim();
    if (line === '' || line.startsWith('<!--')) {
      firstLineIndex++;
      continue;
    }
    break;
  }
  
  if (firstLineIndex >= lines.length) {
    return lines; // Empty document
  }
  
  const firstLine = lines[firstLineIndex];
  
  // Only fix if it's already a header (H2-H6)
  const headerMatch = firstLine.match(/^(#{2,6})\s+(.+)$/);
  if (headerMatch) {
    const newLines = [...lines];
    newLines[firstLineIndex] = `# ${headerMatch[2]}`;
    return newLines;
  }
  
  // Don't fix non-header content (text, lists, code, etc.)
  return lines;
}

/**
 * Rule implementation for MD041
 */
export const rule: Rule = {
  name,
  description,
  validate,
  fix
};

export default rule;
