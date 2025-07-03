import { Rule, RuleViolation } from './rule-interface';

/**
 * MD034: Bare URL used
 * 
 * This rule is triggered when a bare URL is used in the document.
 * URLs should be enclosed in angle brackets (`<` and `>`) or
 * formatted as proper Markdown links.
 */
export const name = 'MD034';
export const description = 'Bare URL used';

/**
 * Fix bare URLs by enclosing them in angle brackets
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with URLs properly formatted
 */
export function fix(lines: string[]): string[] {
  // URL regex pattern that captures full URLs
  const urlRegex = /(https?:\/\/[^\s<>]+)/g;
  let inCodeBlock = false;
  
  return lines.map(line => {
    // Track code block state
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return line;
    }
    
    // Skip lines that are in code blocks or indented code or already in links
    if (inCodeBlock || 
        line.startsWith('    ') || 
        line.includes('](')) {
      return line;
    }
    
    // Check if URL is already properly formatted
    return line.replace(urlRegex, (match, url, offset) => {
      const before = line.charAt(offset - 1);
      const after = line.charAt(offset + match.length);
      
      // Don't modify if already in angle brackets or code
      if (before === '<' || before === '`' || after === '>' || after === '`') {
        return match;
      }
      
      // Don't modify if part of markdown link
      if (line.includes(`](${url})`)) {
        return match;
      }
      
      // Remove trailing punctuation that shouldn't be part of URL
      const cleanUrl = url.replace(/[.,;!?)\]]+$/, '');
      const trailingPunct = url.slice(cleanUrl.length);
      
      return `<${cleanUrl}>${trailingPunct}`;
    });
  });
}

/**
 * Validate lines for bare URLs
 * @param lines Array of string lines to validate
 * @returns Array of rule violations
 */
export function validate(lines: string[]): RuleViolation[] {
  const violations: RuleViolation[] = [];
  const urlRegex = /(https?:\/\/[^\s<>]+)/g;
  let inCodeBlock = false;
  
  lines.forEach((line, index) => {
    // Track code block state
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return;
    }
    
    // Skip lines that are in code blocks or indented code or already in links
    if (inCodeBlock || 
        line.startsWith('    ') || 
        line.includes('](')) {
      return;
    }
    
    const matches = line.matchAll(urlRegex);
    for (const match of matches) {
      const url = match[1];
      const offset = match.index || 0;
      const before = line.charAt(offset - 1);
      const after = line.charAt(offset + match[0].length);
      
      // Skip if already in angle brackets or code
      if (before === '<' || before === '`' || after === '>' || after === '`') {
        continue;
      }
      
      // Skip if part of markdown link
      if (line.includes(`](${url})`)) {
        continue;
      }
      
      violations.push({
        lineNumber: index + 1,
        details: 'Bare URL used - consider using angle brackets or proper link format',
        range: [offset, match[0].length]
      });
    }
  });
  
  return violations;
}

/**
 * Rule implementation for MD034
 */
export const rule: Rule = {
  name,
  description,
  validate,
  fix
};

export default rule;
