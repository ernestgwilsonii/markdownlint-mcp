/**
 * Exports all rule implementations
 */

import { Rule, RuleMap } from './rule-interface';

// Import implemented rules
import md009 from './md009';
import md010 from './md010';
import md012 from './md012';
import md022 from './md022';
import md023 from './md023';
import md047 from './md047';

// Future rule imports (to be implemented)
// import md018 from './md018';
// import md019 from './md019';
// import md020 from './md020';
// import md021 from './md021';
// import md022 from './md022';
// import md023 from './md023';
// import md026 from './md026';
// import md027 from './md027';
// import md031 from './md031';
// import md032 from './md032';
// import md040 from './md040';
// import md047 from './md047';

/**
 * Rule implementation map by rule name
 * This will be populated as rules are implemented
 */
export const rules: RuleMap = {
  MD009: md009,
  MD010: md010,
  MD012: md012,
  MD022: md022,
  MD023: md023,
  MD047: md047,
  // Add more rules as they are implemented
  // ...
};

/**
 * Get a list of implemented rule names
 * @returns Array of rule names that have been implemented
 */
export function getImplementedRules(): string[] {
  return Object.keys(rules);
}

/**
 * Apply all rule fixes to an array of lines
 * @param lines Array of string lines to fix
 * @param ruleNames Array of rule names to apply (e.g., ["MD009", "MD010"])
 * @returns Fixed lines array
 */
export function applyRuleFixes(lines: string[], ruleNames: string[]): string[] {
  // Create a copy of the lines array to avoid modifying the original
  let fixedLines = [...lines];
  
  // Apply each rule fix in sequence, but only if the rule is implemented
  for (const ruleName of ruleNames) {
    const rule = rules[ruleName as keyof typeof rules];
    if (rule?.fix) {
      fixedLines = rule.fix(fixedLines);
    }
  }
  
  return fixedLines;
}
