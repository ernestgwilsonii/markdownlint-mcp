import { Rule } from './rule-interface';

/**
 * MD005: Inconsistent indentation for list items at the same level
 * 
 * This rule is triggered when list items at the same level have different indentation.
 * List items should be consistently indented for readability.
 */
export const name = 'MD005';
export const description = 'Inconsistent indentation for list items at the same level';

/**
 * Fix inconsistently indented list items by standardizing indentation
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with consistent list indentation
 */
export function fix(lines: string[]): string[] {
  const listItemRegex = /^(\s*)([*+-]|\d+[.)])\s+(.*)$/;
  // Maps indentation level (number of parent lists) to space count
  const levelToSpaces: { [level: number]: number } = {};
  // Track current list level - increments on nested lists, decrements when nesting ends
  let currentLevel = 0;
  
  // First pass: detect the correct indentation for each level
  lines.forEach(line => {
    const match = line.match(listItemRegex);
    if (!match) return;
    
    const indentation = match[1].length;
    
    // If this is the first item at this level or has less indentation than what we've seen
    if (!(currentLevel in levelToSpaces) || indentation < levelToSpaces[currentLevel]) {
      levelToSpaces[currentLevel] = indentation;
    }
    
    // Check for new list level by looking at indentation
    if (currentLevel === 0 || indentation > levelToSpaces[currentLevel - 1]) {
      currentLevel++;
    } else if (currentLevel > 0 && indentation <= levelToSpaces[currentLevel - 1]) {
      // Find the right level based on indentation
      while (currentLevel > 0 && indentation <= levelToSpaces[currentLevel - 1]) {
        currentLevel--;
      }
      // If still a list item, we're at the correct level
      if (indentation > 0) {
        currentLevel++;
      }
    }
  });
  
  // Reset for second pass
  currentLevel = 0;
  
  // Second pass: fix inconsistent indentation
  return lines.map(line => {
    const match = line.match(listItemRegex);
    if (!match) {
      // Not a list item, but if blank line or non-list content, may affect list nesting
      if (line.trim() === '' || !line.trim().startsWith(' ')) {
        // Reset level when we encounter non-list content
        currentLevel = 0;
      }
      return line;
    }
    
    const indentation = match[1].length;
    const marker = match[2];
    const content = match[3];
    
    // Update current level based on indentation
    if (currentLevel === 0 || indentation > levelToSpaces[currentLevel - 1]) {
      currentLevel++;
    } else if (currentLevel > 0 && indentation <= levelToSpaces[currentLevel - 1]) {
      while (currentLevel > 0 && indentation <= levelToSpaces[currentLevel - 1]) {
        currentLevel--;
      }
      if (indentation > 0) {
        currentLevel++;
      }
    }
    
    // Calculate correct indentation for this level
    const correctIndentation = ' '.repeat(levelToSpaces[currentLevel - 1] || 0);
    
    // Return fixed line with correct indentation
    return `${correctIndentation}${marker} ${content}`;
  });
}

/**
 * Rule implementation for MD005
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
