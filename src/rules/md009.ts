import { Rule, RuleViolation } from './rule-interface';

/**
 * MD009: Trailing spaces
 * 
 * This rule is triggered when trailing spaces are found at the end of a line.
 * Trailing spaces can cause unnecessary diffs in version control systems and
 * can be confusing in a text editor.
 */
export const name = 'MD009';
export const description = 'Trailing spaces';

interface MD009Config {
  br_spaces?: number;
  list_item_empty_lines?: boolean;
  strict?: boolean;
}

/**
 * Validate lines for trailing spaces
 * @param lines Array of string lines to validate
 * @param config Rule configuration
 * @returns Array of rule violations
 */
export function validate(lines: string[], config: MD009Config = {}): RuleViolation[] {
  const violations: RuleViolation[] = [];
  const brSpaces = config.br_spaces ?? 0;
  const strictMode = config.strict === true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trailingSpaceMatch = line.match(/[ \t]+$/);
    
    if (trailingSpaceMatch) {
      const trailingSpaces = trailingSpaceMatch[0];
      
      // In strict mode, any trailing whitespace is a violation
      if (strictMode) {
        violations.push({
          lineNumber: i + 1,
          details: `Trailing spaces${trailingSpaces.length > 0 ? ` (${trailingSpaces.length})` : ''}`,
          range: [line.length - trailingSpaces.length, trailingSpaces.length]
        });
        continue;
      }
      
      // Check if line is blank (only whitespace)
      const isBlankLine = line.trim() === '';
      
      // Check if this line has a valid line break (exactly br_spaces trailing spaces)
      const hasContent = line.trim().length > 0;
      const isLineBreak = brSpaces > 0 && hasContent && trailingSpaces.length === brSpaces;
      
      // Report a violation if:
      // 1. It's not a valid line break (and br_spaces is set)
      // 2. It's a blank line with trailing spaces
      // 3. Any trailing spaces when br_spaces is 0
      if ((brSpaces > 0 && !isLineBreak && hasContent) || 
          (isBlankLine && trailingSpaces.length > 0) || 
          (brSpaces === 0)) {
        violations.push({
          lineNumber: i + 1,
          details: `Trailing spaces${trailingSpaces.length > 0 ? ` (${trailingSpaces.length})` : ''}`,
          range: [line.length - trailingSpaces.length, trailingSpaces.length]
        });
      }
    }
  }

  return violations;
}

/**
 * Fix trailing spaces by removing them from the end of each line
 * @param lines Array of string lines to fix
 * @param config Rule configuration
 * @returns Fixed lines array with trailing spaces removed
 */
export function fix(lines: string[], config: MD009Config = {}): string[] {
  const brSpaces = config.br_spaces ?? 0;
  const strictMode = config.strict === true;
  
  return lines.map(line => {
    // Check if line has trailing spaces
    const trailingSpaceMatch = line.match(/[ \t]+$/);
    if (!trailingSpaceMatch) return line;
    
    // Check if line is blank (only whitespace)
    const isBlankLine = line.trim() === '';
    
    // If it's a blank line, always remove all trailing whitespace
    if (isBlankLine) {
      return '';
    }
    
    // Handle strict mode differently
    if (strictMode) {
      // In strict mode, if br_spaces is set, normalize to exactly that many spaces
      if (brSpaces > 0) {
        const hasContent = line.trim().length > 0;
        
        if (hasContent) {
          // Example: Line with trailing spaces.   -> Line with trailing spaces.  
          return line.replace(/[ \t]+$/, ' '.repeat(brSpaces));
        } else {
          // Empty lines should have no trailing spaces
          return '';
        }
      } else {
        // If br_spaces is not set, remove all trailing spaces
        return line.replace(/[ \t]+$/, '');
      }
    }
    
    // Non-strict mode handling
    if (brSpaces > 0) {
      // If trailing spaces are already exactly br_spaces, keep them
      if (trailingSpaceMatch[0].length === brSpaces) {
        return line;
      }
      
      // If trailing spaces are fewer than br_spaces, replace with br_spaces
      if (trailingSpaceMatch[0].length < brSpaces) {
        return line.replace(/[ \t]+$/, ' '.repeat(brSpaces));
      }
      
      // If trailing spaces are more than br_spaces, replace with br_spaces
      return line.replace(/[ \t]+$/, ' '.repeat(brSpaces));
    }
    
    // If br_spaces is 0 or not specified, remove all trailing whitespace
    return line.replace(/[ \t]+$/, '');
  });
}

/**
 * Rule implementation for MD009
 */
export const rule: Rule = {
  name,
  description,
  validate,
  fix
};

export default rule;
