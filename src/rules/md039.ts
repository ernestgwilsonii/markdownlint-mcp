import { Rule } from './rule-interface';

/**
 * MD039: Spaces inside link text
 * 
 * This rule is triggered when there are spaces inside the square brackets
 * of a link text or image alt text. For example, [ text ](url) should be [text](url).
 */
export const name = 'MD039';
export const description = 'Spaces inside link text';

/**
 * Fix spaces inside link text by removing them
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper link text formatting
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => {
    // Fix spaces inside link text
    // Matches [ text ](url) and replaces with [text](url)
    let fixedLine = line.replace(/\[\s+([^\]]+?)\s+\]\(([^)]+)\)/g, '[$1]($2)');
    
    // Fix spaces inside image alt text
    // Matches ![ alt text ](url) and replaces with ![alt text](url)
    fixedLine = fixedLine.replace(/!\[\s+([^\]]+?)\s+\]\(([^)]+)\)/g, '![$1]($2)');
    
    return fixedLine;
  });
}

/**
 * Rule implementation for MD039
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
