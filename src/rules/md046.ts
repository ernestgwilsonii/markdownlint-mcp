import { Rule } from './rule-interface';

/**
 * MD046: Code block style
 * 
 * This rule is triggered when code blocks don't use a consistent style
 * throughout a document. Markdown supports two different code block styles:
 * fenced code blocks using ``` or ~~~ delimiters, and indented code blocks
 * using 4 spaces for indentation. This rule ensures a consistent style is used.
 */
export const name = 'MD046';
export const description = 'Code block style';

/**
 * Check if a line starts a fenced code block
 * @param line The line to check
 * @returns True if the line starts a fenced code block
 */
function isFencedCodeBlockStart(line: string): boolean {
  return /^```|^~~~/.test(line.trim());
}

/**
 * Check if a line ends a fenced code block
 * @param line The line to check
 * @returns True if the line ends a fenced code block
 */
function isFencedCodeBlockEnd(line: string): boolean {
  return line.trim() === '```' || line.trim() === '~~~';
}

/**
 * Check if a line appears to be part of an indented code block
 * @param line The line to check
 * @returns True if the line looks like an indented code block
 */
function isIndentedCodeBlockLine(line: string, previousLineEmpty: boolean): boolean {
  // Indented code blocks start with 4 spaces or 1 tab and must be preceded by an empty line
  // unless it's the first line of the file
  return /^(    |\t)/.test(line) && (previousLineEmpty || false);
}

/**
 * Fix code block style by ensuring a consistent style throughout the document
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with consistent code block style
 */
export function fix(lines: string[]): string[] {
  if (lines.length === 0) return lines;
  
  // Count fenced and indented code blocks to determine the preferred style
  let fencedCount = 0;
  let indentedCount = 0;
  
  // First pass: count the different types of code blocks
  let inFencedBlock = false;
  let previousLineEmpty = true; // Start assuming the document starts with a blank line (worse case)
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (inFencedBlock) {
      if (isFencedCodeBlockEnd(line)) {
        inFencedBlock = false;
      }
    } else if (isFencedCodeBlockStart(line)) {
      fencedCount++;
      inFencedBlock = true;
    } else if (isIndentedCodeBlockLine(line, previousLineEmpty)) {
      // Potential start of an indented code block
      indentedCount++;
      
      // Skip ahead to count the entire indented block as one
      while (i + 1 < lines.length && 
             (isIndentedCodeBlockLine(lines[i + 1], false) || lines[i + 1].trim() === '')) {
        i++;
      }
    }
    
    previousLineEmpty = line.trim() === '';
  }
  
  // Determine preferred style - default to fenced if equal or no blocks found
  const preferFenced = fencedCount >= indentedCount;
  
  // Second pass: convert all code blocks to the preferred style
  const result: string[] = [];
  inFencedBlock = false;
  previousLineEmpty = true;
  let currentIndentedBlock: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (inFencedBlock) {
      // Inside a fenced code block, just add the line
      result.push(line);
      if (isFencedCodeBlockEnd(line)) {
        inFencedBlock = false;
      }
    } else if (isFencedCodeBlockStart(line)) {
      // Start of a fenced code block
      if (preferFenced) {
        // Keep the fenced block as is
        result.push(line);
        inFencedBlock = true;
      } else {
        // Convert to indented block
        // Add a blank line before the indented block if needed
        if (result.length > 0 && result[result.length - 1].trim() !== '') {
          result.push('');
        }
        
        // Capture the content of the fenced block
        const content: string[] = [];
        let j = i + 1;
        while (j < lines.length && !isFencedCodeBlockEnd(lines[j])) {
          content.push('    ' + lines[j]);
          j++;
        }
        
        // Add the indented content
        result.push(...content);
        
        // Add a blank line after the indented block
        if (j + 1 < lines.length && lines[j + 1].trim() !== '') {
          result.push('');
        }
        
        // Skip to the end of the fenced block
        i = j;
      }
    } else if (isIndentedCodeBlockLine(line, previousLineEmpty)) {
      // Start of an indented code block
      currentIndentedBlock = [line];
      
      // Collect the entire indented block
      let j = i + 1;
      while (j < lines.length && 
             (isIndentedCodeBlockLine(lines[j], false) || lines[j].trim() === '')) {
        if (lines[j].trim() !== '') {
          currentIndentedBlock.push(lines[j]);
        }
        j++;
      }
      
      if (preferFenced) {
        // Convert to fenced block
        // Add a blank line before the fenced block if needed
        if (result.length > 0 && result[result.length - 1].trim() !== '') {
          result.push('');
        }
        
        // Add the fenced opening
        result.push('```');
        
        // Add the content without the indentation
        for (const blockLine of currentIndentedBlock) {
          result.push(blockLine.replace(/^(    |\t)/, ''));
        }
        
        // Add the fenced closing
        result.push('```');
        
        // Add a blank line after the fenced block if needed
        if (j < lines.length && lines[j].trim() !== '') {
          result.push('');
        }
      } else {
        // Keep indented block as is
        result.push(...currentIndentedBlock);
      }
      
      // Skip to the end of the indented block
      i = j - 1;
    } else {
      // Regular line, add as is
      result.push(line);
    }
    
    previousLineEmpty = line.trim() === '';
  }
  
  return result;
}

/**
 * Rule implementation for MD046
 */
export const rule: Rule = {
  name,
  description,
  fix
};

export default rule;
