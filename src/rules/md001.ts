import { Rule } from './rule-interface';

/**
 * MD001: Heading levels should only increment by one level at a time
 * 
 * This rule is triggered when you skip heading levels in a markdown document, for example:
 * 
 * # Heading 1
 * ### Heading 3
 * 
 * This rule requires that heading levels only increment by one level at a time.
 */
export const name = 'MD001';
export const description = 'Heading levels should only increment by one level at a time';

/**
 * Fixes markdown content to ensure heading levels only increment by one level at a time
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper heading level increments
 */
export function fix(lines: string[]): string[] {
  if (lines.length === 0) return lines;
  
  const result = [...lines];
  let previousLevel = 0;
  
  // Helper to extract heading level from a line
  function getHeadingLevel(line: string): number {
    const match = line.match(/^(#{1,6})(?:\s|$)/);
    return match ? match[1].length : 0;
  }
  
  // Helper to change a heading's level
  function changeHeadingLevel(line: string, newLevel: number): string {
    // ATX heading (# style)
    if (/^#{1,6}\s/.test(line)) {
      const content = line.replace(/^#{1,6}\s+/, '');
      return '#'.repeat(newLevel) + ' ' + content;
    }
    // Closed ATX heading (# style #)
    else if (/^#{1,6}\s.*\s+#{1,6}$/.test(line)) {
      const content = line.replace(/^#{1,6}\s+/, '').replace(/\s+#{1,6}$/, '');
      return '#'.repeat(newLevel) + ' ' + content + ' ' + '#'.repeat(newLevel);
    }
    
    // If we can't determine the heading style, return original line
    return line;
  }
  
  // Scan through each line to find headings and fix levels
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const level = getHeadingLevel(line);
    
    // Skip non-heading lines
    if (level === 0) {
      continue;
    }
    
    // For the first heading, just set the previous level
    if (previousLevel === 0) {
      previousLevel = level;
      continue;
    }
    
    // If we skip levels (e.g., from h1 to h3), fix it
    if (level > previousLevel + 1) {
      // Change to one level deeper than previous
      const newLevel = previousLevel + 1;
      result[i] = changeHeadingLevel(line, newLevel);
      previousLevel = newLevel;
    } else {
      // If no issues, update previous level
      previousLevel = level;
    }
  }
  
  return result;
}

/**
 * Rule implementation for MD001
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
