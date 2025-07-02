import { Rule } from './rule-interface';

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
    // Fix spaces inside bold markers (**text**)
    let fixedLine = line.replace(/\*\*\s+([^*]+?)\s+\*\*/g, '**$1**');
    
    // Fix spaces inside italic markers (*text*)
    fixedLine = fixedLine.replace(/(?<!\*)\*\s+([^*]+?)\s+\*(?!\*)/g, '*$1*');
    
    // Fix spaces inside underscore bold markers (__text__)
    fixedLine = fixedLine.replace(/__\s+([^_]+?)\s+__/g, '__$1__');
    
    // Fix spaces inside underscore italic markers (_text_)
    fixedLine = fixedLine.replace(/(?<!_)_\s+([^_]+?)\s+_(?!_)/g, '_$1_');
    
    return fixedLine;
  });
}

/**
 * Rule implementation for MD037
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
