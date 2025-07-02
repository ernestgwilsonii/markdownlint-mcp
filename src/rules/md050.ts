import { Rule } from './rule-interface';

/**
 * MD050: Strong style
 * 
 * This rule is triggered when the style used for strong emphasis (bold) 
 * is inconsistent. By default, this rule enforces double asterisks (**) for strong emphasis,
 * but it can be configured to enforce double underscores (__) instead.
 */
export const name = 'MD050';
export const description = 'Strong style';

/**
 * Fix strong style by standardizing to double asterisks
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with consistent strong style
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => {
    // Convert double underscore strong emphasis to double asterisk
    // Replace __ with ** for strong emphasis
    const fixedLine = line.replace(/__([^_]+?)__/g, '**$1**');
    
    return fixedLine;
  });
}

/**
 * Rule implementation for MD050
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
