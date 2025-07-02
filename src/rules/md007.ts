import { Rule } from './rule-interface';

/**
 * MD007: Unordered list indentation
 * 
 * This rule is triggered when unordered list items are not properly indented.
 * By default, this rule enforces a 2-space indentation for nested lists.
 */
export const name = 'MD007';
export const description = 'Unordered list indentation';

/**
 * Fix unordered list indentation by standardizing to 2 spaces per level
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper list indentation
 */
export function fix(lines: string[]): string[] {
  const indentationAmount = 2; // Standard indentation (2 spaces)
  const unorderedListItemRegex = /^(\s*)([*+-])\s+(.*)$/;
  
  // Track list nesting levels
  let nestingStack: number[] = [];
  let currentLevel = 0;
  
  return lines.map(line => {
    const match = line.match(unorderedListItemRegex);
    if (!match) {
      // If we hit a non-list line, reset tracking
      if (line.trim() === '' || !line.trim().startsWith(' ')) {
        nestingStack.length = 0;
        currentLevel = 0;
      }
      return line;
    }
    
    const indentation = match[1].length;
    const marker = match[2];
    const content = match[3];
    
    // Determine nesting level based on indentation
    if (indentation === 0) {
      // Top-level list item
      nestingStack = [];
      currentLevel = 0;
    } else if (nestingStack.length === 0 || indentation > nestingStack[nestingStack.length - 1]) {
      // New nested level
      nestingStack.push(indentation);
      currentLevel++;
    } else if (indentation < nestingStack[nestingStack.length - 1]) {
      // Moving back up in nesting levels
      while (nestingStack.length > 0 && indentation < nestingStack[nestingStack.length - 1]) {
        nestingStack.pop();
        currentLevel--;
      }
    }
    
    // Calculate correct indentation for this level
    const correctIndentation = ' '.repeat(currentLevel * indentationAmount);
    
    // Return fixed line with correct indentation
    return `${correctIndentation}${marker} ${content}`;
  });
}

/**
 * Rule implementation for MD007
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
