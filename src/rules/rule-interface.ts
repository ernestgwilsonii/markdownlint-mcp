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
   * Fix function that applies the rule to an array of lines
   * @param lines Array of string lines to fix
   * @returns Fixed lines array
   */
  fix: (lines: string[]) => string[];
}

/**
 * Type for the rules map
 */
export interface RuleMap {
  [key: string]: Rule;
}
