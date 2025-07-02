import { Rule } from './rule-interface';

/**
 * MD059: Link text should be descriptive
 * 
 * This rule is triggered when link text is non-descriptive, such as "click here",
 * "more", "link", etc. These generic terms don't provide context about where the
 * link will take the user, which is important for accessibility.
 */
export const name = 'MD059';
export const description = 'Link text should be descriptive';

/**
 * Non-descriptive link text patterns that should be avoided
 */
const NON_DESCRIPTIVE_PATTERNS = [
  /^click here$/i,
  /^click$/i,
  /^here$/i,
  /^link$/i,
  /^this link$/i,
  /^more$/i,
  /^more here$/i,
  /^details$/i,
  /^learn more$/i,
  /^read more$/i,
  /^source$/i,
  /^link text$/i,
  /^go$/i,
  /^page$/i,
  /^this$/i,
  /^website$/i,
  /^visit$/i,
  /^info$/i,
];

/**
 * Regular expression to find Markdown links
 * Captures the link text in capture group 1
 */
const LINK_REGEX = /\[([^\]]+)\]\([^)]+\)/g;

/**
 * Check if link text is non-descriptive
 * @param text Link text to check
 * @returns True if the text is non-descriptive
 */
function isNonDescriptive(text: string): boolean {
  const trimmed = text.trim();
  
  // Very short link text (1-2 characters) is likely non-descriptive
  if (trimmed.length <= 2) {
    return true;
  }
  
  // Check against known non-descriptive patterns
  for (const pattern of NON_DESCRIPTIVE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Suggest more descriptive link text by adding context
 * @param linkText Original link text
 * @param surroundingText Text surrounding the link for context
 * @returns Improved link text or null if no improvement needed
 */
function suggestImprovedLinkText(linkText: string, surroundingText: string): string | null {
  // If link text is already descriptive, no change needed
  if (!isNonDescriptive(linkText)) {
    return null;
  }
  
  // Try to find context from surrounding text
  // Get 5 words before and after the link
  const contextWords = surroundingText.split(/\s+/);
  const linkWordIndex = contextWords.findIndex(word => word.includes(`[${linkText}]`));
  
  if (linkWordIndex === -1) {
    // Fallback improvement if we can't find context
    return `More information about ${linkText}`;
  }
  
  // Get words before the link (up to 5)
  const startIndex = Math.max(0, linkWordIndex - 5);
  const beforeWords = contextWords.slice(startIndex, linkWordIndex).join(' ');
  
  // Get words after the link (up to 5)
  const endIndex = Math.min(contextWords.length, linkWordIndex + 6);
  const afterWords = contextWords.slice(linkWordIndex + 1, endIndex).join(' ');
  
  // Try to form an improved link text using context
  let improvedText = '';
  
  // Check for context in surrounding text
  const topicMatch = surroundingText.match(/(?:about|regarding|on|for)\s+(\w+(?:\s+\w+){0,4})/i);
  if (topicMatch && topicMatch[1]) {
    improvedText = `${linkText} about ${topicMatch[1]}`;
  } else if (beforeWords && afterWords) {
    // Combine some context before and after
    const beforeContext = beforeWords.split(/\s+/).slice(-2).join(' ');
    const afterContext = afterWords.split(/\s+/).slice(0, 2).join(' ');
    improvedText = `${beforeContext} ${linkText} ${afterContext}`.trim();
  } else if (beforeWords) {
    // Use context from before
    const relevantBefore = beforeWords.split(/\s+/).slice(-3).join(' ');
    improvedText = `${relevantBefore} ${linkText}`.trim();
  } else if (afterWords) {
    // Use context from after
    const relevantAfter = afterWords.split(/\s+/).slice(0, 3).join(' ');
    improvedText = `${linkText} ${relevantAfter}`.trim();
  } else {
    // Fallback if no context is found
    improvedText = `More information about ${linkText}`;
  }
  
  return improvedText;
}

/**
 * Fix non-descriptive link text in Markdown files
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with more descriptive link text
 */
export function fix(lines: string[]): string[] {
  return lines.map((line, index) => {
    // Skip lines that don't have any links
    if (!line.includes('[') || !line.includes('](')) {
      return line;
    }
    
    let result = line;
    let match;
    let offset = 0;
    
    // Reset the regex lastIndex
    LINK_REGEX.lastIndex = 0;
    
    // Process each link in the line
    while ((match = LINK_REGEX.exec(line)) !== null) {
      const [fullMatch, linkText] = match;
      
      // Check if link text is non-descriptive
      if (isNonDescriptive(linkText)) {
        // Use surrounding text for context
        const improvedText = suggestImprovedLinkText(linkText, line);
        
        if (improvedText) {
          // Create the new link text
          const newText = fullMatch.replace(`[${linkText}]`, `[${improvedText}]`);
          
          // Replace at the correct position with the offset applied
          const startPos = match.index + offset;
          const endPos = startPos + fullMatch.length;
          
          // Update the result string
          result = result.substring(0, startPos) + newText + result.substring(endPos);
          
          // Update the offset for subsequent replacements
          offset += newText.length - fullMatch.length;
          
          // Update the lastIndex to account for the change in string length
          LINK_REGEX.lastIndex += newText.length - fullMatch.length;
        }
      }
    }
    
    return result;
  });
}

/**
 * Rule implementation for MD059
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
