import { Rule } from './rule-interface';

/**
 * MD048: Code fence style
 * 
 * This rule is triggered when the code fence style in a document is inconsistent.
 * In Markdown, code fences can be created using either backticks (```) or 
 * tildes (~~~). This rule ensures that only one style is used throughout the document.
 */
export const name = 'MD048';
export const description = 'Code fence style';

/**
 * Check if a line is a code fence (either opening or closing)
 * @param line The line to check
 * @returns True if the line is a code fence
 */
function isCodeFence(line: string): boolean {
  return /^(`{3,}|~{3,})/.test(line.trim());
}

/**
 * Get the code fence style (backtick or tilde) from a line
 * @param line The line to check
 * @returns The code fence style character, or empty string if not a fence
 */
function getCodeFenceStyle(line: string): string {
  const match = line.trim().match(/^(`{3,}|~{3,})/);
  return match ? match[1][0] : '';
}

/**
 * Fix code fence style by ensuring a consistent style throughout the document
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with consistent code fence style
 */
export function fix(lines: string[]): string[] {
  if (lines.length === 0) return lines;
  
  // Find the first code fence to determine the preferred style
  let preferredStyle = '`'; // Default to backtick if no code fence is found
  
  for (const line of lines) {
    if (isCodeFence(line)) {
      preferredStyle = getCodeFenceStyle(line);
      break;
    }
  }
  
  // Now fix all code fences to match the preferred style
  let inCodeBlock = false;
  
  return lines.map(line => {
    if (isCodeFence(line)) {
      const style = getCodeFenceStyle(line);
      
      if (style !== preferredStyle) {
        // Need to replace the fence character
        const trimmed = line.trim();
        const indentation = line.slice(0, line.indexOf(trimmed));
        
        // Find how many fence characters we have
        const fenceCount = trimmed.match(/^(`{3,}|~{3,})/)?.[0].length || 3;
        
        // Get any language specifier if it exists (for opening fences)
        const language = !inCodeBlock ? trimmed.slice(fenceCount).trim() : '';
        
        // Create the new fence with the preferred style
        const newFence = preferredStyle.repeat(fenceCount);
        
        // Toggle the inCodeBlock state
        inCodeBlock = !inCodeBlock;
        
        // Return the updated line
        return `${indentation}${newFence}${language ? ' ' + language : ''}`;
      } else {
        // Toggle the inCodeBlock state if the style is already correct
        inCodeBlock = !inCodeBlock;
      }
    }
    
    return line;
  });
}

/**
 * Rule implementation for MD048
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
