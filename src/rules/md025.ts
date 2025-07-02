import { Rule } from './rule-interface';

/**
 * MD025: Multiple top-level headings in the same document
 * 
 * This rule is triggered when a document has multiple top-level headings (h1).
 * A top-level heading is a heading with level 1, created using:
 * - # Heading (atx style)
 * - Heading
 *   ======= (setext style)
 * 
 * Having a single h1 heading is recommended for accessibility and SEO reasons.
 */
export const name = 'MD025';
export const description = 'Multiple top-level headings in the same document';

/**
 * Configuration options for MD025
 */
interface MD025Config {
  level?: number;  // Heading level to restrict (default: 1)
  front_matter_title?: string;  // RegExp for matching front matter title (default: ^\s*title\s*[:=])
}

/**
 * Fixes markdown content to ensure there's only one top-level heading
 * @param lines Array of string lines to fix
 * @param config Optional configuration object
 * @returns Fixed lines array with only one top-level heading
 */
export function fix(lines: string[], config?: MD025Config): string[] {
  if (lines.length === 0) return lines;
  
  // Default configuration
  const levelToRestrict = config?.level || 1;
  const frontMatterTitleRegex = config?.front_matter_title ? 
    new RegExp(config.front_matter_title) : 
    /^\s*title\s*[:=]/;
  
  const result = [...lines];
  let firstTopLevelHeadingIndex = -1;
  let inFrontMatter = false;
  let hasFrontMatterTitle = false;
  
  // Check if front matter has a title
  if (lines.length > 0 && lines[0] === '---') {
    inFrontMatter = true;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---' || lines[i] === '...') {
        inFrontMatter = false;
        break;
      }
      
      if (frontMatterTitleRegex.test(lines[i])) {
        hasFrontMatterTitle = true;
      }
    }
  }
  
  // Helper to extract heading level from a line
  function getHeadingLevel(line: string, nextLine?: string): number {
    // Check for ATX style heading (# Heading)
    const atxMatch = line.match(/^(#{1,6})\s+/);
    if (atxMatch) {
      return atxMatch[1].length;
    }
    
    // Check for Setext style heading (Heading ======)
    if (nextLine && /^=+\s*$/.test(nextLine)) {
      return 1;  // Level 1 heading (===)
    }
    if (nextLine && /^-+\s*$/.test(nextLine)) {
      return 2;  // Level 2 heading (---)
    }
    
    return 0;  // Not a heading
  }
  
  // Helper to change a heading's level
  function changeHeadingLevel(line: string, currentLevel: number, newLevel: number, nextLine?: string): string[] {
    const updatedLines = [];
    
    // ATX style heading (# Heading)
    if (/^#{1,6}\s+/.test(line)) {
      // Extract content without the heading marks
      const content = line.replace(/^#{1,6}\s+/, '').replace(/\s+#{1,6}$/, '');
      
      // Create new heading with desired level
      updatedLines.push('#'.repeat(newLevel) + ' ' + content);
    }
    // Setext style heading (Heading ======)
    else if (nextLine && (/^=+\s*$/.test(nextLine) || /^-+\s*$/.test(nextLine))) {
      if (newLevel <= 2) {
        // Convert to another setext style
        updatedLines.push(line);
        updatedLines.push(newLevel === 1 ? '='.repeat(line.length) : '-'.repeat(line.length));
      } else {
        // Convert to ATX style for levels > 2
        updatedLines.push('#'.repeat(newLevel) + ' ' + line);
      }
    }
    
    return updatedLines;
  }
  
  // First pass: find the first top-level heading
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : undefined;
    const level = getHeadingLevel(line, nextLine);
    
    if (level === levelToRestrict) {
      // If we should respect front matter title and one exists, demote all headings
      if (hasFrontMatterTitle) {
        const updatedLines = changeHeadingLevel(line, level, level + 1, nextLine);
        
        // Replace the current line(s)
        result[i] = updatedLines[0];
        if (updatedLines.length > 1 && nextLine) {
          result[i + 1] = updatedLines[1];
        }
        
        // Skip the next line if it was a setext underline
        if (/^[=\-]+\s*$/.test(nextLine || '')) {
          i++;
        }
      } 
      // Otherwise, find the first top-level heading and demote subsequent ones
      else if (firstTopLevelHeadingIndex === -1) {
        firstTopLevelHeadingIndex = i;
        
        // Skip the next line if it was a setext underline
        if (/^[=\-]+\s*$/.test(nextLine || '')) {
          i++;
        }
      } else {
        // Demote this heading since it's not the first one
        const updatedLines = changeHeadingLevel(line, level, level + 1, nextLine);
        
        // Replace the current line(s)
        result[i] = updatedLines[0];
        if (updatedLines.length > 1 && nextLine) {
          result[i + 1] = updatedLines[1];
        }
        
        // Skip the next line if it was a setext underline
        if (/^[=\-]+\s*$/.test(nextLine || '')) {
          i++;
        }
      }
    }
  }
  
  return result;
}

/**
 * Rule implementation for MD025
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
