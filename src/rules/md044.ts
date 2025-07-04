import { Rule, RuleViolation } from './rule-interface';

/**
 * MD044: Proper names should have the correct capitalization
 * 
 * This rule is triggered when proper names have incorrect capitalization.
 * It can be used to enforce consistent capitalization of product names,
 * trademarks, and other proper nouns.
 * 
 * Unlike the other rules we've implemented today, this rule CAN be automatically
 * fixed by replacing the incorrect capitalization with the correct form.
 */
export const name = 'MD044';
export const description = 'Proper names should have the correct capitalization';

/**
 * Check if a line is within a code block (fenced or indented)
 * @param lines Array of all lines
 * @param lineIndex Index of the line to check
 * @returns True if the line is within a code block
 */
function isInCodeBlock(lines: string[], lineIndex: number): boolean {
  let inFencedBlock = false;
  let fenceChar = '';
  
  // Check if current line is indented code block (4+ spaces)
  const currentLine = lines[lineIndex];
  if (currentLine.match(/^    /)) {
    return true;
  }
  
  // Check lines before current line for fenced code blocks
  for (let i = 0; i < lineIndex; i++) {
    const line = lines[i].trim();
    
    // Check for fenced code block start/end
    const backtickMatch = line.match(/^`{3,}/);
    const tildeMatch = line.match(/^~{3,}/);
    
    if (backtickMatch || tildeMatch) {
      const currentFence = backtickMatch ? '`' : '~';
      
      if (!inFencedBlock) {
        // Starting a fenced block
        inFencedBlock = true;
        fenceChar = currentFence;
      } else if (fenceChar === currentFence) {
        // Ending a fenced block
        inFencedBlock = false;
        fenceChar = '';
      }
    }
  }
  
  // Check if current line is a fence line (should be treated as code block)
  const currentLineTrimmed = currentLine.trim();
  if (currentLineTrimmed.match(/^`{3,}/) || currentLineTrimmed.match(/^~{3,}/)) {
    return true;
  }
  
  return inFencedBlock;
}

/**
 * Validate function to check proper name capitalization
 * @param lines Array of string lines to validate
 * @param config Optional rule configuration with proper names
 * @returns Array of rule violations
 */
export function validate(lines: string[], config?: any): RuleViolation[] {
  const violations: RuleViolation[] = [];
  
  // Get proper names from configuration
  const properNames = config?.names || [];
  const ignoreCodeBlocks = config?.code_blocks !== false; // Default to true (ignore code blocks)
  
  // If no proper names configured, no violations
  if (properNames.length === 0) {
    return violations;
  }
  
  // Create a map of lowercase -> correctly capitalized versions
  const nameMap = new Map<string, string>();
  for (const name of properNames) {
    nameMap.set(name.toLowerCase(), name);
  }
  
  // Check each line for proper name violations
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip code blocks if configured to ignore them
    if (ignoreCodeBlocks && isInCodeBlock(lines, i)) {
      continue;
    }
    
    // Skip fence lines themselves (they are delimiters, not content)
    const trimmedLine = line.trim();
    if (trimmedLine.match(/^`{3,}/) || trimmedLine.match(/^~{3,}/)) {
      continue;
    }
    
    // Check for improper capitalization of proper names
    for (const [lowercase, correct] of nameMap.entries()) {
      // Escape special regex characters in the name
      const escapedLowercase = lowercase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // For names with special characters, use a simpler approach
      let regex;
      if (lowercase.match(/[^\w\s]/)) {
        // Contains special characters - use global search and manual boundary check
        regex = new RegExp(escapedLowercase, 'gi');
      } else {
        // Regular word - use standard word boundaries
        regex = new RegExp(`\\b${escapedLowercase}\\b`, 'gi');
      }
      
      let match;
      while ((match = regex.exec(line)) !== null) {
        const foundText = match[0];
        
        // For special characters, manually check word boundaries
        if (lowercase.match(/[^\w\s]/)) {
          const beforeChar = line[match.index - 1];
          const afterChar = line[match.index + foundText.length];
          
          // Skip if it's part of a larger word
          if ((beforeChar && beforeChar.match(/\w/)) || (afterChar && afterChar.match(/\w/))) {
            continue;
          }
        }
        
        // If the found text doesn't match the correct capitalization
        if (foundText !== correct) {
          violations.push({
            lineNumber: i + 1,
            details: `Proper name "${foundText}" should be "${correct}"`,
            range: [match.index, match.index + foundText.length]
          });
        }
        
        // Prevent infinite loop by breaking if no progress is made
        if (regex.lastIndex === match.index) {
          regex.lastIndex++;
        }
      }
    }
  }
  
  return violations;
}

/**
 * Fix function for MD044
 * This function replaces occurrences of incorrectly capitalized proper names
 * with their correctly capitalized versions.
 * 
 * @param lines Array of string lines to fix
 * @param config Optional rule configuration with proper names
 * @returns Fixed lines array with proper names correctly capitalized
 */
export function fix(lines: string[], config?: any): string[] {
  const fixedLines = [...lines];
  
  // Get proper names from configuration
  const properNames = config?.names || [];
  const ignoreCodeBlocks = config?.code_blocks !== false; // Default to true (ignore code blocks)
  
  // If no proper names configured, return unchanged
  if (properNames.length === 0) {
    return fixedLines;
  }
  
  // Create a map of lowercase -> correctly capitalized versions
  const nameMap = new Map<string, string>();
  for (const name of properNames) {
    nameMap.set(name.toLowerCase(), name);
  }
  
  // Fix each line
  for (let i = 0; i < fixedLines.length; i++) {
    // Skip code blocks if configured to ignore them
    if (ignoreCodeBlocks && isInCodeBlock(fixedLines, i)) {
      continue;
    }
    
    // Skip fence lines themselves (they are delimiters, not content)
    const trimmedLine = fixedLines[i].trim();
    if (trimmedLine.match(/^`{3,}/) || trimmedLine.match(/^~{3,}/)) {
      continue;
    }
    
    let line = fixedLines[i];
    
    // Replace improper capitalization of proper names
    for (const [lowercase, correct] of nameMap.entries()) {
      // Escape special regex characters in the name
      const escapedLowercase = lowercase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // For names with special characters, use a simpler approach
      if (lowercase.match(/[^\w\s]/)) {
        // Contains special characters - use global search and manual boundary check
        const regex = new RegExp(escapedLowercase, 'gi');
        line = line.replace(regex, (match, offset) => {
          const beforeChar = line[offset - 1];
          const afterChar = line[offset + match.length];
          
          // Skip if it's part of a larger word
          if ((beforeChar && beforeChar.match(/\w/)) || (afterChar && afterChar.match(/\w/))) {
            return match;
          }
          
          // If the match doesn't have the correct capitalization, replace it
          return match !== correct ? correct : match;
        });
      } else {
        // Regular word - use standard word boundaries
        const regex = new RegExp(`\\b${escapedLowercase}\\b`, 'gi');
        line = line.replace(regex, (match) => {
          // If the match doesn't have the correct capitalization, replace it
          return match !== correct ? correct : match;
        });
      }
    }
    
    fixedLines[i] = line;
  }
  
  return fixedLines;
}

/**
 * Rule implementation for MD044
 */
export const rule: Rule = {
  name,
  description,
  validate,
  fix
};

export default rule;
