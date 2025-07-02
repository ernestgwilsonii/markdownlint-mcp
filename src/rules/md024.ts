import { Rule } from './rule-interface';

/**
 * MD024: Multiple headings with the same content
 * 
 * This rule is triggered when multiple headings in the document have the same text content.
 * The rule can be configured to allow this behavior for siblings (headings at the same level)
 * while still preventing duplicate headings across different levels.
 */
export const name = 'MD024';
export const description = 'Multiple headings with the same content';

/**
 * Configuration options for MD024
 */
interface MD024Config {
  allow_different_nesting?: boolean;  // Allow headings with same content if they have different nesting (default: false)
  siblings_only?: boolean;            // Only check sibling headings (default: false)
}

/**
 * Interface for tracking headings with their level and content
 */
interface HeadingInfo {
  level: number;
  content: string;
  index: number;
  section?: number[];  // Track section numbering (e.g., [2, 1] for heading 2.1)
}

/**
 * Fix markdown content to make heading content unique
 * @param lines Array of string lines to fix
 * @param config Optional configuration object
 * @returns Fixed lines array with unique heading content
 */
export function fix(lines: string[], config?: MD024Config): string[] {
  if (lines.length === 0) return lines;
  
  // Default configuration
  const allowDifferentNesting = config?.allow_different_nesting || false;
  const siblingsOnly = config?.siblings_only || false;
  
  // Track all headings
  const headings: HeadingInfo[] = [];
  
  // Helper to extract heading level and content from a line
  function parseHeading(line: string): HeadingInfo | null {
    // ATX style heading (# Heading)
    const atxMatch = line.match(/^(#{1,6})\s+(.+?)(?:\s+#*)?$/);
    if (atxMatch) {
      return {
        level: atxMatch[1].length,
        content: atxMatch[2].trim(),
        index: -1,  // Will be set when processing
      };
    }
    
    return null;
  }
  
  // First pass: collect all headings and track their positions
  for (let i = 0; i < lines.length; i++) {
    const heading = parseHeading(lines[i]);
    if (heading) {
      heading.index = i;
      headings.push(heading);
    }
  }
  
  // Add section numbering to help track hierarchy
  let currentSection: number[] = [];
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    
    // Update section tracking
    while (currentSection.length >= heading.level) {
      currentSection.pop();
    }
    
    while (currentSection.length < heading.level - 1) {
      currentSection.push(0);
    }
    
    if (currentSection.length < heading.level) {
      currentSection.push(1);
    } else {
      currentSection[currentSection.length - 1]++;
    }
    
    heading.section = [...currentSection];
  }
  
  // Second pass: identify duplicate headings and modify them
  const result = [...lines];
  const seenHeadings: Map<string, Set<string>> = new Map();
  
  for (const heading of headings) {
    const { level, content, index, section } = heading;
    
    // Key to check against depends on configuration
    let key = content.toLowerCase();
    if (allowDifferentNesting || siblingsOnly) {
      // For allow_different_nesting or siblings_only, also consider the heading's location
      if (allowDifferentNesting) {
        // Consider full path (different nesting allowed)
        key = section?.join('.') + ':' + key;
      } else if (siblingsOnly) {
        // Consider only parent section (siblings only)
        key = section?.slice(0, -1).join('.') + ':' + level + ':' + key;
      }
    }
    
    // Track seen headings by key
    if (!seenHeadings.has(key)) {
      seenHeadings.set(key, new Set([content]));
    } else {
      const headingSet = seenHeadings.get(key)!;
      
      // If we've seen this heading before, modify it to make it unique
      if (headingSet.has(content)) {
        // Use section numbering to make the heading unique
        const sectionLabel = section?.join('.') || '';
        const newContent = `${content} (${sectionLabel})`;
        
        // Update the line with the new heading content
        const line = result[index];
        if (line.endsWith('#')) {
          // For closed ATX headings (# Heading #)
          result[index] = line.replace(/^(#{1,6}\s+)(.+?)(\s+#*)?$/, `$1${newContent}$3`);
        } else {
          // For regular ATX headings (# Heading)
          result[index] = line.replace(/^(#{1,6}\s+)(.+?)$/, `$1${newContent}`);
        }
        
        // Add the new content to the set to avoid duplicates
        headingSet.add(newContent);
      } else {
        // First time seeing this exact content in this context
        headingSet.add(content);
      }
    }
  }
  
  return result;
}

/**
 * Rule implementation for MD024
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
