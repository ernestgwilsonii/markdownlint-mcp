import { Rule } from './rule-interface';

/**
 * MD036: Emphasis used instead of a heading
 * 
 * This rule identifies when emphasis markers like bold or italic are used to create
 * a heading-like structure, when it would be better to use actual heading syntax.
 * 
 * For example, the following should be converted to a proper heading:
 * **This is a heading**
 * 
 * It should become:
 * ## This is a heading
 */
export const name = 'MD036';
export const description = 'Emphasis used instead of a heading';

/**
 * Configuration options for MD036
 */
interface MD036Config {
  punctuation?: string;  // Regex to match punctuation that indicates the emphasis is not a heading (default: ".,;:!?")
}

/**
 * Fix instances where emphasis is used instead of a heading
 * @param lines Array of string lines to fix
 * @param config Optional configuration object
 * @returns Fixed lines array with proper headings
 */
export function fix(lines: string[], config?: MD036Config): string[] {
  if (lines.length === 0) return lines;
  
  // Default configuration
  const punctuationRegex = config?.punctuation 
    ? new RegExp(`[${config.punctuation}]$`) 
    : /[.,;:!?]$/;
  
  const result: string[] = [];
  let inCodeBlock = false;
  let inList = false;
  
  // Regular expressions for different emphasis styles
  const boldRegex = /^\s*(\*\*|__)(.*?)(\*\*|__)\s*$/;
  const italicRegex = /^\s*(\*|_)(.*?)(\*|_)\s*$/;
  
  // Helper to check if a line is a potential heading
  function isEmphasisHeading(line: string): { isHeading: boolean; content: string; level: number } {
    // Don't convert if we're in a code block or list
    if (inCodeBlock || inList) {
      return { isHeading: false, content: '', level: 0 };
    }
    
    // Check for bold emphasis (**text** or __text__)
    const boldMatch = line.match(boldRegex);
    if (boldMatch) {
      const content = boldMatch[2].trim();
      
      // Skip lines with terminal punctuation or that are too short
      if (punctuationRegex.test(content) || content.length < 2) {
        return { isHeading: false, content: '', level: 0 };
      }
      
      return { isHeading: true, content, level: 2 }; // Bold = h2
    }
    
    // Check for italic emphasis (*text* or _text_)
    const italicMatch = line.match(italicRegex);
    if (italicMatch) {
      const content = italicMatch[2].trim();
      
      // Skip lines with terminal punctuation or that are too short
      if (punctuationRegex.test(content) || content.length < 2) {
        return { isHeading: false, content: '', level: 0 };
      }
      
      return { isHeading: true, content, level: 3 }; // Italic = h3
    }
    
    return { isHeading: false, content: '', level: 0 };
  }
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Track code blocks
    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      inCodeBlock = !inCodeBlock;
      result.push(line);
      continue;
    }
    
    // Track lists (simple detection)
    if (trimmed.match(/^[-+*](\s+|$)/) || trimmed.match(/^\d+\.(\s+|$)/)) {
      inList = true;
      result.push(line);
      continue;
    } else if (trimmed === '' && inList) {
      inList = false;
      result.push(line);
      continue;
    } else if (inList) {
      result.push(line);
      continue;
    }
    
    // Check if this line is an emphasis heading
    const { isHeading, content, level } = isEmphasisHeading(line);
    
    if (isHeading) {
      // Convert to a proper heading
      const indentation = line.match(/^\s*/)?.[0] || '';
      result.push(`${indentation}${'#'.repeat(level)} ${content}`);
      
      // If the next line isn't blank, add a blank line
      if (i < lines.length - 1 && lines[i + 1].trim() !== '') {
        result.push('');
      }
    } else {
      result.push(line);
    }
  }
  
  return result;
}

/**
 * Rule implementation for MD036
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
