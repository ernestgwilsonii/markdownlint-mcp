import { Rule, RuleViolation } from './rule-interface';

/**
 * MD014: Dollar signs used before commands without showing output
 * 
 * This rule is triggered when there are dollar signs ($) before shell commands
 * in a code block that doesn't show command output. The dollar signs are unnecessary
 * in this case and should be removed.
 */
export const name = 'MD014';
export const description = 'Dollar signs used before commands without showing output';

/**
 * Validate function to detect dollar signs used before commands without showing output
 * @param lines Array of string lines to validate
 * @param config Optional rule configuration
 * @returns Array of rule violations
 */
export function validate(lines: string[], config?: any): RuleViolation[] {
  const violations: RuleViolation[] = [];
  let inCodeBlock = false;
  let codeBlockStart = -1;
  let codeBlockLanguage = '';
  let codeBlockLines: Array<{line: string, lineNumber: number}> = [];
  
  // Process the file line by line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for code block boundaries
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        codeBlockStart = i;
        codeBlockLines = [];
        // Extract the language if specified
        codeBlockLanguage = line.trim().substring(3).trim().toLowerCase();
      } else {
        // End of code block - validate it
        violations.push(...validateCodeBlock(codeBlockLines, codeBlockLanguage));
        inCodeBlock = false;
      }
    } else if (inCodeBlock) {
      // Inside code block - collect lines
      codeBlockLines.push({line, lineNumber: i + 1});
    }
  }
  
  return violations;
}

/**
 * Validate a code block for dollar signs used before commands without showing output
 */
function validateCodeBlock(codeLines: Array<{line: string, lineNumber: number}>, language: string): RuleViolation[] {
  const violations: RuleViolation[] = [];
  
  // Only process shell/bash/sh code blocks or code blocks without a language
  const relevantLanguages = ['bash', 'sh', 'shell', 'zsh', ''];
  if (!relevantLanguages.includes(language)) {
    return violations; // Return no violations if not a shell code block
  }
  
  // Check if this is a command-only code block (no output)
  let allCommandsWithDollar = true;
  let hasNonEmptyLines = false;
  
  for (const {line} of codeLines) {
    const trimmedLine = line.trim();
    if (trimmedLine === '') continue; // Skip empty lines
    
    hasNonEmptyLines = true;
    if (!trimmedLine.startsWith('$ ')) {
      allCommandsWithDollar = false;
      break;
    }
  }
  
  // If all lines are commands with dollar signs, report violations
  if (allCommandsWithDollar && hasNonEmptyLines) {
    for (const {line, lineNumber} of codeLines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('$ ')) {
        const dollarIndex = line.indexOf('$');
        violations.push({
          lineNumber,
          details: `Dollar sign used before command without showing output: '${trimmedLine}'`,
          range: [dollarIndex, 2] // $ and the space
        });
      }
    }
  }
  
  return violations;
}

/**
 * Fix code blocks by removing leading dollar signs from commands without output
 * @param lines Array of string lines to fix
 * @returns Fixed lines array with proper command formatting
 */
export function fix(lines: string[]): string[] {
  const fixedLines: string[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeBlockLanguage = '';
  
  // Process the file line by line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for code block boundaries
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        // Start of code block
        inCodeBlock = true;
        codeBlockLines = [];
        // Extract the language if specified
        codeBlockLanguage = line.trim().substring(3).trim().toLowerCase();
        fixedLines.push(line); // Keep the opening fence
      } else {
        // End of code block - process and add fixed code block
        fixedLines.push(...fixCodeBlock(codeBlockLines, codeBlockLanguage));
        fixedLines.push(line); // Keep the closing fence
        inCodeBlock = false;
      }
    } else if (inCodeBlock) {
      // Inside code block - collect lines
      codeBlockLines.push(line);
    } else {
      // Outside code block - keep as is
      fixedLines.push(line);
    }
  }
  
  // Handle case where file ends inside a code block
  if (inCodeBlock) {
    fixedLines.push(...codeBlockLines);
  }
  
  return fixedLines;
}

/**
 * Process code block lines to remove dollar signs where appropriate
 */
function fixCodeBlock(codeLines: string[], language: string): string[] {
  // Only process shell/bash/sh code blocks or code blocks without a language
  const relevantLanguages = ['bash', 'sh', 'shell', 'zsh', ''];
  if (!relevantLanguages.includes(language)) {
    return codeLines; // Return unchanged if not a shell code block
  }
  
  // Check if this is a command-only code block (no output)
  let allCommandsWithDollar = true;
  let hasNonEmptyLines = false;
  
  for (const line of codeLines) {
    const trimmedLine = line.trim();
    if (trimmedLine === '') continue; // Skip empty lines
    
    hasNonEmptyLines = true;
    if (!trimmedLine.startsWith('$ ')) {
      allCommandsWithDollar = false;
      break;
    }
  }
  
  // If all lines are commands with dollar signs, remove them
  if (allCommandsWithDollar && hasNonEmptyLines) {
    return codeLines.map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('$ ')) {
        const leadingSpaces = line.match(/^\s*/)?.[0] || '';
        return leadingSpaces + trimmedLine.substring(2);
      }
      return line;
    });
  }
  
  // Otherwise, return unchanged
  return codeLines;
}

/**
 * Rule implementation for MD014
 */
export const rule: Rule = {
  name,
  description,
  validate,
  fix
};

export default rule;
