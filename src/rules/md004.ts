import { Rule } from './rule-interface';

/**
 * MD004: Unordered list style
 * 
 * This rule is triggered when the list style of unordered lists is inconsistent.
 * The rule ensures consistent use of bullet markers (*, +, -) in unordered lists.
 * By default, this rule enforces a consistent style, using the first style detected.
 */
export const name = 'MD004';
export const description = 'Unordered list style';

/**
 * Fix unordered lists by ensuring consistent bullet marker style
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with consistent bullet markers
 */
export function fix(lines: string[]): string[] {
  // First, detect what style is used in the first list
  let firstBulletStyle: string | null = null;
  
  // Detect the first bullet style used
  for (const line of lines) {
    const match = line.match(/^\s*([-+*])\s+/);
    if (match) {
      firstBulletStyle = match[1];
      break;
    }
  }
  
  // If no bullet style was found, return the lines unchanged
  if (!firstBulletStyle) {
    return lines;
  }
  
  // Now apply the consistent style to all list items
  return lines.map(line => {
    // Check if this line is a list item with a different bullet style
    const match = line.match(/^(\s*)([-+*])(\s+.*)/);
    if (match && match[2] !== firstBulletStyle) {
      // Replace the bullet style while keeping indentation and content
      return `${match[1]}${firstBulletStyle}${match[3]}`;
    }
    return line;
  });
}

/**
 * Rule implementation for MD004
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
