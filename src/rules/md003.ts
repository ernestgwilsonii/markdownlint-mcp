import { Rule } from './rule-interface';

/**
 * MD003: Heading style
 * 
 * This rule enforces a consistent heading style, which could be:
 * - atx: # Heading
 * - atx_closed: # Heading #
 * - setext: Heading
 *           =======
 * 
 * The default is atx, but this can be configured in .markdownlint.json.
 */
export const name = 'MD003';
export const description = 'Heading style';

/**
 * Enum for heading styles
 */
enum HeadingStyle {
  ATX = 'atx',
  ATX_CLOSED = 'atx_closed',
  SETEXT = 'setext'
}

/**
 * Configuration options for MD003
 */
interface MD003Config {
  style?: HeadingStyle;
}

/**
 * Detect if a line is a heading and what style it uses
 * @param line The line to check
 * @returns An object with the heading level and style, or null if not a heading
 */
function detectHeadingStyle(line: string, nextLine?: string): {
  level: number;
  style: HeadingStyle;
  content: string;
} | null {
  // ATX style: # Heading
  const atxMatch = line.match(/^(#{1,6})\s+(.+?)(?:\s+#*)?$/);
  if (atxMatch) {
    // Check if it's closed style: # Heading #
    const isClosed = line.trim().endsWith('#');
    return {
      level: atxMatch[1].length,
      style: isClosed ? HeadingStyle.ATX_CLOSED : HeadingStyle.ATX,
      content: atxMatch[2].trim()
    };
  }
  
  // Setext style: Heading
  //               =======
  if (nextLine && /^[=-]+$/.test(nextLine.trim())) {
    return {
      level: nextLine.trim()[0] === '=' ? 1 : 2,
      style: HeadingStyle.SETEXT,
      content: line.trim()
    };
  }
  
  return null;
}

/**
 * Convert a heading to the specified style
 * @param headingInfo The heading information (level, style, content)
 * @param targetStyle The style to convert to
 * @returns An array of lines for the new heading (could be 1 or 2 lines)
 */
function convertHeadingStyle(
  headingInfo: { level: number; style: HeadingStyle; content: string },
  targetStyle: HeadingStyle
): string[] {
  const { level, content } = headingInfo;
  
  // Cannot convert to setext if level > 2
  if (targetStyle === HeadingStyle.SETEXT && level > 2) {
    targetStyle = HeadingStyle.ATX;
  }
  
  switch (targetStyle) {
    case HeadingStyle.ATX:
      return [`${'#'.repeat(level)} ${content}`];
    
    case HeadingStyle.ATX_CLOSED:
      return [`${'#'.repeat(level)} ${content} ${'#'.repeat(level)}`];
    
    case HeadingStyle.SETEXT:
      const underline = level === 1 ? '='.repeat(content.length) : '-'.repeat(content.length);
      return [content, underline];
      
    default:
      return [`${'#'.repeat(level)} ${content}`]; // Default to ATX
  }
}

/**
 * Fix headings to use a consistent style
 * @param lines Array of string lines to fix
 * @param config Optional configuration object
 * @returns Fixed lines array with consistent heading styles
 */
export function fix(lines: string[], config?: MD003Config): string[] {
  if (lines.length === 0) return lines;
  
  // Default to ATX style if not configured
  const targetStyle = config?.style || HeadingStyle.ATX;
  
  const result: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : undefined;
    
    // Check if this line is a heading
    const headingInfo = detectHeadingStyle(line, nextLine);
    
    if (headingInfo) {
      // We found a heading, let's check if it needs to be converted
      if (headingInfo.style !== targetStyle) {
        // Convert to the target style
        const newHeadingLines = convertHeadingStyle(headingInfo, targetStyle);
        
        // Add the new heading lines
        result.push(...newHeadingLines);
        
        // If we processed a setext heading, skip the next line (the underline)
        if (headingInfo.style === HeadingStyle.SETEXT) {
          i++;
        }
      } else {
        // Heading is already in the correct style
        result.push(line);
        
        // If it's a setext heading, also add the underline
        if (headingInfo.style === HeadingStyle.SETEXT) {
          result.push(nextLine!);
          i++;
        }
      }
    } else {
      // Not a heading, just add the line
      result.push(line);
    }
  }
  
  return result;
}

/**
 * Rule implementation for MD003
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
