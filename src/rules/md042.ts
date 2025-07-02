import { Rule } from './rule-interface';

/**
 * MD042: No empty links
 * 
 * This rule is triggered when links have empty URLs or text. These empty links
 * don't point to anything and should be removed or filled in with proper content.
 * Empty links in markdown take the form of [] or [text]() or [](url).
 */
export const name = 'MD042';
export const description = 'No empty links';

/**
 * Check if a string contains empty links
 * An empty link can be [] or [text]() or [](url)
 * @param line The line to check
 * @returns True if the line contains empty links
 */
function hasEmptyLinks(line: string): boolean {
  // Match empty links: [] or [text]() or [](url)
  return /\[\](?:\(\)|\([^)]+\))?|\[[^\]]+\]\(\)/.test(line);
}

/**
 * Fix empty links by removing them
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with empty links removed
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => {
    if (!hasEmptyLinks(line)) {
      return line;
    }
    
    // Replace links with empty text and URL: []()
    let fixedLine = line.replace(/\[\]\(\)/g, '');
    
    // Replace links with empty text but with URL: [](url)
    fixedLine = fixedLine.replace(/\[\]\(([^)]+)\)/g, '$1');
    
    // Replace links with text but empty URL: [text]()
    fixedLine = fixedLine.replace(/\[([^\]]+)\]\(\)/g, '$1');
    
    // Replace completely empty links: []
    fixedLine = fixedLine.replace(/\[\]/g, '');
    
    return fixedLine;
  });
}

/**
 * Rule implementation for MD042
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
