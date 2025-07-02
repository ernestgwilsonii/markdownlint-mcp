/**
 * Represents a rule violation detected by a rule
 */
export interface RuleViolation {
  /**
   * Line number where the violation was found (1-based)
   */
  lineNumber: number;
  
  /**
   * Details about the violation
   */
  details: string;
  
  /**
   * Range [startIndex, length] where the violation occurs
   */
  range?: [number, number];
}

/**
 * Interface for rule implementations
 */
export interface Rule {
  /**
   * Rule name
   */
  name: string;
  
  /**
   * Rule description
   */
  description: string;
  
  /**
   * Validate function that checks an array of lines for violations
   * @param lines Array of string lines to validate
   * @param config Optional rule configuration
   * @returns Array of rule violations
   */
  validate?: (lines: string[], config?: any) => RuleViolation[];
  
  /**
   * Fix function that applies the rule to an array of lines
   * @param lines Array of string lines to fix
   * @param config Optional rule configuration
   * @returns Fixed lines array
   */
  fix?: (lines: string[], config?: any) => string[];
}

/**
 * Type for the rules map
 */
export interface RuleMap {
  [key: string]: Rule;
}
