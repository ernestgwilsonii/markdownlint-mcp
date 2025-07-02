import { Rule } from './rule-interface';

/**
 * MD049: Emphasis style
 * 
 * This rule is triggered when the style used for emphasis (italics) 
 * is inconsistent. By default, this rule enforces asterisks (*) for emphasis,
 * but it can be configured to enforce underscores (_) instead.
 */
export const name = 'MD049';
export const description = 'Emphasis style';

/**
 * Fix emphasis style by standardizing to asterisks
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with consistent emphasis style
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => {
    // Convert underscore emphasis to asterisk emphasis
    // This pattern looks for standalone _ used for emphasis (not part of __)
    // and replaces them with *
    let fixedLine = line;
    
    // Replace emphasis with single underscores with asterisks
    // Make sure we don't match cases that are part of bold (__) syntax
    // We use a negative lookbehind (?<!_) and a negative lookahead (?!_)
    // to ensure we only match single underscores, not double underscores
    fixedLine = fixedLine.replace(/(?<!_)_([^_]+?)_(?!_)/g, '*$1*');
    
    return fixedLine;
  });
}

/**
 * Rule implementation for MD049
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
