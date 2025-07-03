import { Rule, RuleViolation } from './rule-interface';

/**
 * MD037: Spaces inside emphasis markers
 * 
 * This rule is triggered when emphasis markers (bold, italic) have spaces between
 * the markers and the text. This is incorrect in most Markdown parsers.
 * For example, ** bold ** should be **bold**.
 */
export const name = 'MD037';
export const description = 'Spaces inside emphasis markers';

/**
 * Fix spaces inside emphasis markers by removing them
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper emphasis marker spacing
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => {
    let fixedLine = line;
    
    // Fix spaces inside bold markers (**text**)
    fixedLine = fixedLine.replace(/\*\*(\s*)([^*]*?)(\s*)\*\*/g, (match, leadingSpaces, content, trailingSpaces) => {
      if (!content.trim()) return match; // Skip empty emphasis
      return `**${content.trim()}**`;
    });
    
    // Fix spaces inside underscore bold markers (__text__)
    fixedLine = fixedLine.replace(/__(\s*)([^_]*?)(\s*)__/g, (match, leadingSpaces, content, trailingSpaces) => {
      if (!content.trim()) return match; // Skip empty emphasis
      return `__${content.trim()}__`;
    });
    
    // Fix spaces inside italic markers (*text*) - simple approach
    fixedLine = fixedLine.replace(/(?<!\*)\*(\s*)([^*]*?)(\s*)\*(?!\*)/g, (match, leadingSpaces, content, trailingSpaces) => {
      if (!content.trim()) return match; // Skip empty emphasis
      return `*${content.trim()}*`;
    });
    
    // Fix spaces inside underscore italic markers (_text_)
    fixedLine = fixedLine.replace(/(?<!_)_(\s*)([^_]*?)(\s*)_(?!_)/g, (match, leadingSpaces, content, trailingSpaces) => {
      if (!content.trim()) return match; // Skip empty emphasis
      return `_${content.trim()}_`;
    });
    
    return fixedLine;
  });
}

/**
 * Validate lines for spaces inside emphasis markers
 * @param lines Array of string lines to validate
 * @returns Array of rule violations
 */
export function validate(lines: string[]): RuleViolation[] {
  const violations: RuleViolation[] = [];
  
  lines.forEach((line, index) => {
    // Check for spaces inside bold markers (**text**)
    const boldMatches = line.matchAll(/\*\*(\s*)([^*]*?)(\s*)\*\*/g);
    for (const match of boldMatches) {
      const leadingSpaces = match[1];
      const content = match[2];
      const trailingSpaces = match[3];
      
      if (content.trim() && (leadingSpaces || trailingSpaces)) {
        violations.push({
          lineNumber: index + 1,
          details: 'Spaces inside bold emphasis markers',
          range: [match.index || 0, match[0].length]
        });
      }
    }
    
    // Check for spaces inside underscore bold markers (__text__)
    const underscoreBoldMatches = line.matchAll(/__(\s*)([^_]*?)(\s*)__/g);
    for (const match of underscoreBoldMatches) {
      const leadingSpaces = match[1];
      const content = match[2];
      const trailingSpaces = match[3];
      
      if (content.trim() && (leadingSpaces || trailingSpaces)) {
        violations.push({
          lineNumber: index + 1,
          details: 'Spaces inside underscore bold emphasis markers',
          range: [match.index || 0, match[0].length]
        });
      }
    }
    
    // Check for spaces inside italic markers (*text*) - simple pattern
    const italicMatches = line.matchAll(/(?<!\*)\*(\s*)([^*]*?)(\s*)\*(?!\*)/g);
    for (const match of italicMatches) {
      const leadingSpaces = match[1];
      const content = match[2];
      const trailingSpaces = match[3];
      
      if (content.trim() && (leadingSpaces || trailingSpaces)) {
        violations.push({
          lineNumber: index + 1,
          details: 'Spaces inside italic emphasis markers',
          range: [match.index || 0, match[0].length]
        });
      }
    }
    
    // Check for spaces inside underscore italic markers (_text_)
    const underscoreItalicMatches = line.matchAll(/(?<!_)_(\s*)([^_]*?)(\s*)_(?!_)/g);
    for (const match of underscoreItalicMatches) {
      const leadingSpaces = match[1];
      const content = match[2];
      const trailingSpaces = match[3];
      
      if (content.trim() && (leadingSpaces || trailingSpaces)) {
        violations.push({
          lineNumber: index + 1,
          details: 'Spaces inside underscore italic emphasis markers',
          range: [match.index || 0, match[0].length]
        });
      }
    }
  });
  
  return violations;
}

/**
 * Rule implementation for MD037
 */
export const rule: Rule = {
  name,
  description,
  validate,
  fix
};

export default rule;
