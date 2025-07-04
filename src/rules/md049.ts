import { Rule, RuleViolation } from './rule-interface';

/**
 * MD049: Emphasis style
 * 
 * This rule is triggered when the style used for emphasis (italics) 
 * is inconsistent. By default, this rule enforces asterisks (*) for emphasis,
 * but it can be configured to enforce underscores (_) instead.
 */
export const name = 'MD049';
export const description = 'Emphasis style';

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
  
  return inFencedBlock;
}

/**
 * Find emphasis markers in a line, avoiding code spans
 * @param line Line to search
 * @returns Array of emphasis markers found
 */
function findEmphasisMarkers(line: string): Array<{ type: 'asterisk' | 'underscore'; start: number; end: number; text: string }> {
  const markers: Array<{ type: 'asterisk' | 'underscore'; start: number; end: number; text: string }> = [];
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    // Skip code spans
    if (char === '`') {
      const codeSpanStart = i;
      i++;
      while (i < line.length && line[i] !== '`') {
        i++;
      }
      if (i < line.length) {
        i++; // Skip closing backtick
      }
      continue;
    }
    
    // Look for emphasis markers
    if (char === '*' || char === '_') {
      const markerChar = char;
      const markerStart = i;
      
      // Skip if it's part of bold (**text** or __text__)
      if (i + 1 < line.length && line[i + 1] === markerChar) {
        i += 2;
        continue;
      }
      
      // Look for closing marker
      i++;
      const textStart = i;
      while (i < line.length && line[i] !== markerChar) {
        i++;
      }
      
      if (i < line.length && i > textStart) {
        // Found a complete emphasis
        const text = line.substring(textStart, i);
        
        // Skip if emphasis has spaces at the beginning or end (not valid emphasis)
        if (text.startsWith(' ') || text.endsWith(' ')) {
          i++; // Skip closing marker
          continue;
        }
        
        markers.push({
          type: markerChar === '*' ? 'asterisk' : 'underscore',
          start: markerStart,
          end: i + 1,
          text
        });
        i++; // Skip closing marker
      }
    } else {
      i++;
    }
  }
  
  return markers;
}

/**
 * Validate function to check emphasis style consistency
 * @param lines Array of string lines to validate
 * @param config Optional rule configuration
 * @returns Array of rule violations
 */
export function validate(lines: string[], config?: any): RuleViolation[] {
  const violations: RuleViolation[] = [];
  const style = config?.style || 'asterisk'; // Default to asterisk
  
  // Track what styles we've seen
  const stylesFound = new Set<string>();
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip code blocks
    if (isInCodeBlock(lines, i)) {
      continue;
    }
    
    // Find emphasis markers in this line
    const markers = findEmphasisMarkers(line);
    
    for (const marker of markers) {
      stylesFound.add(marker.type);
      
      // Check if this marker matches the configured style
      if (style === 'asterisk' && marker.type === 'underscore') {
        violations.push({
          lineNumber: i + 1,
          details: `Emphasis style should be asterisk (*) not underscore (_)`,
          range: [marker.start, marker.end]
        });
      } else if (style === 'underscore' && marker.type === 'asterisk') {
        violations.push({
          lineNumber: i + 1,
          details: `Emphasis style should be underscore (_) not asterisk (*)`,
          range: [marker.start, marker.end]
        });
      }
    }
  }
  
  return violations;
}

/**
 * Fix emphasis style by standardizing to the configured style
 * @param lines Array of string lines to fix
 * @param config Optional rule configuration
 * @returns Fixed lines array with consistent emphasis style
 */
export function fix(lines: string[], config?: any): string[] {
  const style = config?.style || 'asterisk'; // Default to asterisk
  
  return lines.map((line, index) => {
    // Skip code blocks
    if (isInCodeBlock(lines, index)) {
      return line;
    }
    
    // Find emphasis markers that need to be fixed
    const markers = findEmphasisMarkers(line);
    let fixedLine = line;
    
    // Process markers from right to left to avoid index shifting issues
    for (let i = markers.length - 1; i >= 0; i--) {
      const marker = markers[i];
      
      // Check if this marker needs to be fixed
      let shouldFix = false;
      let newMarker = '';
      
      if (style === 'asterisk' && marker.type === 'underscore') {
        shouldFix = true;
        newMarker = '*';
      } else if (style === 'underscore' && marker.type === 'asterisk') {
        shouldFix = true;
        newMarker = '_';
      }
      
      if (shouldFix) {
        // Replace the emphasis markers
        const beforePart = fixedLine.substring(0, marker.start);
        const afterPart = fixedLine.substring(marker.end);
        fixedLine = beforePart + newMarker + marker.text + newMarker + afterPart;
      }
    }
    
    return fixedLine;
  });
}

/**
 * Rule implementation for MD049
 */
export const rule: Rule = {
  name,
  description,
  validate,
  fix
};

export default rule;
