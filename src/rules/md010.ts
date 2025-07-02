import { Rule, RuleViolation } from './rule-interface';

/**
 * MD010: Hard tabs
 * 
 * This rule is triggered when hard tabs are used instead of spaces.
 * Hard tabs can lead to inconsistent rendering in different editors
 * and can cause issues when collaborating with others.
 */
export const name = 'MD010';
export const description = 'Hard tabs';

interface MD010Config {
  code_blocks?: boolean;
  spaces_per_tab?: number;
}

/**
 * Validate lines for hard tabs
 * @param lines Array of string lines to validate
 * @param config Rule configuration
 * @returns Array of rule violations
 */
export function validate(lines: string[], config: MD010Config = {}): RuleViolation[] {
  const violations: RuleViolation[] = [];
  // Default configuration: check code blocks and convert tabs to 2 spaces
  const checkCodeBlocks = config.code_blocks !== false;
  
  let inCodeBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Keep track of code blocks
    if (line.trim().startsWith('```') || line.trim().startsWith('~~~')) {
      inCodeBlock = !inCodeBlock;
    }
    
    // Skip code blocks if configured to do so
    if (inCodeBlock && !checkCodeBlocks) {
      continue;
    }
    
    const tabMatch = line.match(/\t/g);
    if (tabMatch) {
      violations.push({
        lineNumber: i + 1,
        details: `Hard tab${tabMatch.length > 1 ? 's' : ''} found`,
        range: [line.indexOf('\t'), tabMatch.length]
      });
    }
  }
  
  return violations;
}

/**
 * Fix hard tabs by replacing them with spaces
 * @param lines Array of string lines to fix
 * @param config Rule configuration
 * @returns Fixed lines array with hard tabs replaced by spaces
 */
export function fix(lines: string[], config: MD010Config = {}): string[] {
  // Default to 2 spaces per tab if not specified
  const spacesPerTab = config.spaces_per_tab || 2;
  const checkCodeBlocks = config.code_blocks !== false;
  
  let inCodeBlock = false;
  
  return lines.map(line => {
    // Keep track of code blocks
    if (line.trim().startsWith('```') || line.trim().startsWith('~~~')) {
      inCodeBlock = !inCodeBlock;
    }
    
    // Skip code blocks if configured to do so
    if (inCodeBlock && !checkCodeBlocks) {
      return line;
    }
    
    return line.replace(/\t/g, ' '.repeat(spacesPerTab));
  });
}

/**
 * Rule implementation for MD010
 */
export const rule: Rule = {
  name,
  description,
  validate,
  fix
};

export default rule;
