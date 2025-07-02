/**
 * Exports all rule implementations
 */

import { Rule, RuleMap } from './rule-interface';

// Import implemented rules
import md001 from './md001';
import md003 from './md003';
import md004 from './md004';
import md024 from './md024';
import md025 from './md025';
import md036 from './md036';
import md005 from './md005';
import md007 from './md007';
import md009 from './md009';
import md010 from './md010';
import md011 from './md011';
import md012 from './md012';
import md013 from './md013';
import md014 from './md014';
import md018 from './md018';
import md019 from './md019';
import md020 from './md020';
import md021 from './md021';
import md022 from './md022';
import md023 from './md023';
import md026 from './md026';
import md027 from './md027';
import md028 from './md028';
import md029 from './md029';
import md030 from './md030';
import md031 from './md031';
import md032 from './md032';
import md033 from './md033';
import md034 from './md034';
import md037 from './md037';
import md038 from './md038';
import md039 from './md039';
import md040 from './md040';
import md041 from './md041';
import md042 from './md042';
import md043 from './md043';
import md044 from './md044';
import md045 from './md045';
import md046 from './md046';
import md047 from './md047';
import md048 from './md048';
import md049 from './md049';
import md050 from './md050';
import md051 from './md051';
import md052 from './md052';
import md053 from './md053';
import md054 from './md054';
import md055 from './md055';
import md056 from './md056';
import md058 from './md058';
import md059 from './md059';
import md035 from './md035';

// Future rule imports (to be implemented)
// Add more rule imports as they are implemented

/**
 * Rule implementation map by rule name
 * This will be populated as rules are implemented
 */
export const rules: RuleMap = {
  MD001: md001,
  MD003: md003,
  MD004: md004,
  MD005: md005,
  MD007: md007,
  MD009: md009,
  MD010: md010,
  MD011: md011,
  MD012: md012,
  MD013: md013,
  MD014: md014,
  MD018: md018,
  MD019: md019,
  MD020: md020,
  MD021: md021,
  MD022: md022,
  MD023: md023,
  MD024: md024,
  MD025: md025,
  MD026: md026,
  MD027: md027,
  MD028: md028,
  MD029: md029,
  MD030: md030,
  MD031: md031,
  MD032: md032,
  MD033: md033,
  MD034: md034,
  MD035: md035,
  MD036: md036,
  MD037: md037,
  MD038: md038,
  MD039: md039,
  MD040: md040,
  MD041: md041,
  MD042: md042,
  MD043: md043,
  MD044: md044,
  MD045: md045,
  MD046: md046,
  MD047: md047,
  MD048: md048,
  MD049: md049,
  MD050: md050,
  MD051: md051,
  MD052: md052,
  MD053: md053,
  MD054: md054,
  MD055: md055,
  MD056: md056,
  MD058: md058,
  MD059: md059,
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
