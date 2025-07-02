import { Rule } from './rule-interface';

/**
 * MD053: Link and image reference definitions should be needed
 * 
 * This rule is triggered when a reference definition is not used by any link or image.
 * Our fix will remove unused reference definitions.
 */
export const name = 'MD053';
export const description = 'Link and image reference definitions should be needed';

/**
 * Fix by removing unused reference definitions
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with only used reference definitions
 */
export function fix(lines: string[]): string[] {
  // First, extract all reference link definitions and their line indices
  const { definitions, definitionLines } = extractReferenceLinkDefinitions(lines);
  
  // Find all reference usages
  const usedLabels = findReferenceUsages(lines);
  
  // Filter out lines with unused reference definitions
  return lines.filter((line, index) => {
    // If this is not a definition line, keep it
    if (!definitionLines.includes(index)) {
      return true;
    }
    
    // Find which definition this line corresponds to
    const definitionMatch = line.match(/^\s*\[([^\]]+)\]:/);
    if (!definitionMatch) {
      return true; // Shouldn't happen, but keep the line if no match
    }
    
    const label = definitionMatch[1].trim().toLowerCase();
    
    // Keep the line if the reference is used
    return usedLabels.includes(label);
  });
}

/**
 * Extract reference link definitions from the document
 * Returns both the definitions and their line indices
 */
function extractReferenceLinkDefinitions(lines: string[]): { 
  definitions: Record<string, string>, 
  definitionLines: number[] 
} {
  const definitions: Record<string, string> = {};
  const definitionLines: number[] = [];
  
  // Regular expression to match reference link definitions: [label]: url
  const definitionRegex = /^\s*\[([^\]]+)\]:\s*(\S+)(?:\s+(?:"([^"]+)"|'([^']+)'|\(([^)]+)\)))?$/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(definitionRegex);
    if (match) {
      const label = match[1].trim();
      const url = match[2];
      
      // Store the definition (case-insensitive)
      definitions[label.toLowerCase()] = url;
      definitionLines.push(i);
    }
  }
  
  return { definitions, definitionLines };
}

/**
 * Find all reference usages in the document
 * Returns an array of lowercase labels that are used
 */
function findReferenceUsages(lines: string[]): string[] {
  const usedLabels: string[] = [];
  
  // Reference link regex: [text][label] or [text][] (shortcut reference)
  const refLinkRegex = /\[([^\]]+)\]\[([^\]]*)\]/g;
  // Reference image regex: ![text][label] or ![text][] (shortcut reference)
  const refImageRegex = /!\[([^\]]+)\]\[([^\]]*)\]/g;
  
  for (const line of lines) {
    // Find all reference links in this line
    let match;
    while ((match = refLinkRegex.exec(line)) !== null) {
      const text = match[1];
      const label = match[2] || text; // For shortcut references, label is the text
      usedLabels.push(label.toLowerCase());
    }
    
    // Reset regex to search from the beginning of the line
    refImageRegex.lastIndex = 0;
    
    // Find all reference images in this line
    while ((match = refImageRegex.exec(line)) !== null) {
      const text = match[1];
      const label = match[2] || text; // For shortcut references, label is the text
      usedLabels.push(label.toLowerCase());
    }
  }
  
  return usedLabels;
}

/**
 * Rule implementation for MD053
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
