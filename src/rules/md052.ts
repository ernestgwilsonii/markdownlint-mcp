import { Rule } from './rule-interface';

/**
 * MD052: Reference links and images should use a label that is defined
 * 
 * This rule is triggered when reference links/images use a label that isn't defined.
 * Our fix will convert undefined reference links to inline links when possible.
 */
export const name = 'MD052';
export const description = 'Reference links and images should use a label that is defined';

/**
 * Fix undefined reference links by converting them to inline links
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with valid reference links
 */
export function fix(lines: string[]): string[] {
  // First, extract all reference link definitions
  const definitions = extractReferenceLinkDefinitions(lines);
  
  // Then fix links with undefined references
  return lines.map(line => {
    // Match reference links: [text][label] or [text][]
    return line.replace(/\[([^\]]+)\]\[([^\]]*)\]/g, (match, text, label) => {
      // For shortcut reference links [text][], the label is the text
      const actualLabel = label || text;
      
      // Check if the label is defined
      if (definitions[actualLabel.toLowerCase()]) {
        return match; // Label is defined, keep as is
      }
      
      // Label is undefined, convert to inline link if possible
      // We'll use an empty URL as a placeholder, since we don't know the intended destination
      return `[${text}]()`;
    }).replace(/!\[([^\]]+)\]\[([^\]]*)\]/g, (match, text, label) => {
      // Similar handling for reference images
      const actualLabel = label || text;
      
      if (definitions[actualLabel.toLowerCase()]) {
        return match; // Label is defined, keep as is
      }
      
      // Convert to inline image with empty URL
      return `![${text}]()`;
    });
  });
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
 * Rule implementation for MD052
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
