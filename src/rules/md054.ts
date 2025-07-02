import { Rule } from './rule-interface';

/**
 * MD054: Link and image style
 * 
 * This rule is triggered when the style of links or images is inconsistent.
 * Our fix will standardize on inline links and images.
 */
export const name = 'MD054';
export const description = 'Link and image style';

/**
 * Fix by converting reference links/images to inline links/images
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with standardized link style
 */
export function fix(lines: string[]): string[] {
  // First, extract all reference link definitions
  const definitions = extractReferenceLinkDefinitions(lines);
  
  // Convert reference links/images to inline links/images
  const updatedLines = lines.map(line => {
    // Handle reference links: [text][label] or [text][]
    let updatedLine = line.replace(/\[([^\]]+)\]\[([^\]]*)\]/g, (match, text, label) => {
      // For shortcut reference links [text][], the label is the text
      const actualLabel = label || text;
      const labelKey = actualLabel.toLowerCase();
      
      // Check if the label is defined
      if (definitions[labelKey]) {
        // Convert to inline link
        return `[${text}](${definitions[labelKey]})`;
      }
      
      // If label is not defined, leave as is (MD052 will handle this)
      return match;
    });
    
    // Handle reference images: ![text][label] or ![text][]
    updatedLine = updatedLine.replace(/!\[([^\]]+)\]\[([^\]]*)\]/g, (match, text, label) => {
      // For shortcut reference images ![text][], the label is the text
      const actualLabel = label || text;
      const labelKey = actualLabel.toLowerCase();
      
      // Check if the label is defined
      if (definitions[labelKey]) {
        // Convert to inline image
        return `![${text}](${definitions[labelKey]})`;
      }
      
      // If label is not defined, leave as is (MD052 will handle this)
      return match;
    });
    
    return updatedLine;
  });
  
  // Finally, remove reference definitions since they're now inline
  const usedDefinitionLines = new Set();
  
  // Find lines that contain reference definitions
  for (let i = 0; i < lines.length; i++) {
    const definitionMatch = lines[i].match(/^\s*\[([^\]]+)\]:/);
    if (definitionMatch) {
      usedDefinitionLines.add(i);
    }
  }
  
  // Filter out reference definition lines
  return updatedLines.filter((_, index) => !usedDefinitionLines.has(index));
}

/**
 * Extract reference link definitions from the document
 * Returns a map of lowercase labels to their URLs
 */
function extractReferenceLinkDefinitions(lines: string[]): Record<string, string> {
  const definitions: Record<string, string> = {};
  
  // Regular expression to match reference link definitions: [label]: url
  const definitionRegex = /^\s*\[([^\]]+)\]:\s*(\S+)(?:\s+(?:"([^"]+)"|'([^']+)'|\(([^)]+)\)))?$/;
  
  for (const line of lines) {
    const match = line.match(definitionRegex);
    if (match) {
      const label = match[1].trim();
      const url = match[2];
      
      // Store the definition (case-insensitive)
      definitions[label.toLowerCase()] = url;
    }
  }
  
  return definitions;
}

/**
 * Rule implementation for MD054
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
