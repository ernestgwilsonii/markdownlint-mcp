import { Rule } from './rule-interface';

/**
 * MD045: Images should have alternate text (alt text)
 * 
 * This rule is triggered when an image is missing alternate text (alt text).
 * Alternate text is important for accessibility and should always be provided
 * for images.
 */
export const name = 'MD045';
export const description = 'Images should have alternate text (alt text)';

/**
 * Regular expression to find image references
 * Both inline images ![](url) and reference images ![alt][ref] are included
 */
const imageRegex = /!\[(.*?)\](?:\((.*?)\)|\[(.*?)\])/g;

/**
 * Fix images that are missing alternate text by adding empty alt text
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper alt text for images
 */
export function fix(lines: string[]): string[] {
  return lines.map(line => {
    // Find all image references in the line
    let result = line;
    let match;
    let offset = 0;
    
    // Reset the regex lastIndex
    imageRegex.lastIndex = 0;
    
    // Process each image reference in the line
    while ((match = imageRegex.exec(line)) !== null) {
      const [fullMatch, altText, inlineUrl, referenceId] = match;
      
      // If the alt text is empty, add an empty pair of brackets
      if (!altText || altText.trim() === '') {
        const newText = fullMatch.replace('![]', '![ ]');
        
        // Replace at the correct position with the offset applied
        const startPos = match.index + offset;
        const endPos = startPos + fullMatch.length;
        
        // Update the result string
        result = result.substring(0, startPos) + newText + result.substring(endPos);
        
        // Update the offset for subsequent replacements
        offset += newText.length - fullMatch.length;
        
        // Update the lastIndex to account for the change in string length
        imageRegex.lastIndex += newText.length - fullMatch.length;
      }
    }
    
    return result;
  });
}

/**
 * Rule implementation for MD045
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
