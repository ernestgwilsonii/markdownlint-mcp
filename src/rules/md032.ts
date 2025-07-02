import { Rule } from './rule-interface';

/**
 * MD032: Lists should be surrounded by blank lines
 * 
 * This rule is triggered when lists are not surrounded by blank lines. This
 * helps to visually separate content and makes the Markdown more readable.
 */
export const name = 'MD032';
export const description = 'Lists should be surrounded by blank lines';

/**
 * Fix lists by ensuring they're surrounded by blank lines
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper spacing around lists
 */
export function fix(lines: string[]): string[] {
  let fixedLines: string[] = [];
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isListItem = /^(\s*[-+*]|\s*\d+\.)\s+.+/.test(line);
    
    // Detect end of list: we were in a list, current line is not a list item, and it's not empty
    const isEndOfList = inList && !isListItem && line.trim() !== '';
    
    if (isListItem && !inList) {
      // List is starting
      inList = true;
      
      // Check if there's a blank line before the list (unless it's the first line)
      const needsBlankBefore = i > 0 && lines[i-1].trim() !== '';
      
      if (needsBlankBefore) {
        fixedLines.push('');
      }
      
      fixedLines.push(line);
    } else if (isEndOfList) {
      // List is ending
      inList = false;
      
      // The current line is non-list content, make sure there's a blank line before it
      if (fixedLines.length > 0 && fixedLines[fixedLines.length - 1].trim() !== '') {
        fixedLines.push('');
      }
      
      fixedLines.push(line);
    } else {
      // Regular line (could be a list item in an ongoing list or non-list content)
      fixedLines.push(line);
      
      // If this is a list item, we're in a list
      if (isListItem) {
        inList = true;
      } else if (line.trim() === '') {
        // Empty line - not a list item, but doesn't necessarily end the list
        // We'll determine if we're still in a list when we see the next non-empty line
      } else {
        // Non-empty, non-list item line - definitely not in a list
        inList = false;
      }
    }
  }
  
  return fixedLines;
}

/**
 * Rule implementation for MD032
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
