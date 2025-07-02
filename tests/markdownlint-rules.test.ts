import { jest } from '@jest/globals';

// Simple tests for the rule-specific fix logic without relying on server or file operations
describe('Markdownlint Rule Fix Logic', () => {
  // MD009: Trailing spaces
  test('MD009: should fix trailing spaces', () => {
    // Test content with trailing spaces
    const lines = [
      'This line has trailing spaces.  ',
      'This one too.   ',
      'This one is fine.'
    ];
    
    // Apply the fix logic
    const fixedLines = lines.map(line => line.replace(/[ \t]+$/, ''));
    
    // Check the results
    expect(fixedLines).toEqual([
      'This line has trailing spaces.',
      'This one too.',
      'This one is fine.'
    ]);
  });
  
  // MD010: Hard tabs
  test('MD010: should fix hard tabs', () => {
    // Test content with hard tabs
    const lines = [
      'Line with\ttab',
      'Another\tline\twith tabs',
      'Line without tabs'
    ];
    
    // Apply the fix logic
    const fixedLines = lines.map(line => line.replace(/\t/g, '  '));
    
    // Check the results
    expect(fixedLines).toEqual([
      'Line with  tab',
      'Another  line  with tabs',
      'Line without tabs'
    ]);
  });
  
  // MD018: No space after hash on atx style heading
  test('MD018: should fix headings with no space after hash', () => {
    // Test content with incorrect heading format
    const lines = [
      '#Heading 1',
      '##Heading 2',
      '### This one is correct'
    ];
    
    // Apply the fix logic
    const fixedLines = lines.map(line => 
      line.replace(/^(#{1,6})([^#\s])/, '$1 $2')
    );
    
    // Check the results
    expect(fixedLines).toEqual([
      '# Heading 1',
      '## Heading 2',
      '### This one is correct'
    ]);
  });
  
  // MD019: Multiple spaces after hash on atx style heading
  test('MD019: should fix headings with multiple spaces after hash', () => {
    // Test content with incorrect heading format
    const lines = [
      '#   Too many spaces',
      '##    Also too many',
      '### Just right'
    ];
    
    // Apply the fix logic
    const fixedLines = lines.map(line => 
      line.replace(/^(#{1,6})[ \t]{2,}/, '$1 ')
    );
    
    // Check the results
    expect(fixedLines).toEqual([
      '# Too many spaces',
      '## Also too many',
      '### Just right'
    ]);
  });
  
  // MD020: No space inside hashes on closed atx style heading
  test('MD020: should fix headings with no space inside closing hashes', () => {
    // Test content with incorrect heading format
    const lines = [
      '# Heading 1#',
      '## Heading 2#',
      '### Heading 3 #' // This one is correct
    ];
    
    // Apply the fix logic
    const fixedLines = lines.map(line => 
      line.replace(/^(#{1,6})[ \t]+([^#\s].*?)[ \t]*#$/m, '$1 $2 #')
    );
    
    // Check the results
    expect(fixedLines).toEqual([
      '# Heading 1 #',
      '## Heading 2 #',
      '### Heading 3 #'
    ]);
  });
  
  // MD021: Multiple spaces inside hashes on closed atx style heading
  test('MD021: should fix headings with multiple spaces inside closing hashes', () => {
    // Test content with incorrect heading format
    const lines = [
      '# Heading 1   #',
      '## Heading 2    #',
      '### Heading 3 #' // This one is correct
    ];
    
    // Apply the fix logic
    const fixedLines = lines.map(line => 
      line.replace(/^(#{1,6})[ \t]+(.+?)[ \t]{2,}#$/m, '$1 $2 #')
    );
    
    // Check the results
    expect(fixedLines).toEqual([
      '# Heading 1 #',
      '## Heading 2 #',
      '### Heading 3 #'
    ]);
  });
  
  // MD047: Files should end with a single newline character
  test('MD047: should ensure file ends with single newline', () => {
    // Test 1: No newline at end
    let lines = ['Line 1', 'Line 2'];
    
    // Remove any trailing blank lines
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }
    // Add a single blank line at the end
    lines.push('');
    
    // Check the results
    expect(lines).toEqual(['Line 1', 'Line 2', '']);
    
    // Test 2: Multiple newlines at end
    lines = ['Line 1', 'Line 2', '', '', ''];
    
    // Remove any trailing blank lines
    while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
      lines.pop();
    }
    // Add a single blank line at the end
    lines.push('');
    
    // Check the results
    expect(lines).toEqual(['Line 1', 'Line 2', '']);
  });
  
  // MD023: Headings must start at the beginning of the line
  test('MD023: should fix headings with leading whitespace', () => {
    // Test content with incorrect heading format
    const lines = [
      '# Correct heading',
      '  ## Heading with leading spaces',
      '\t# Heading with tab',
      'This is not a heading'
    ];
    
    // Apply the fix logic
    const fixedLines = lines.map(line => {
      const headingMatch = line.match(/^\s+(#{1,6}\s+.+)$/);
      return headingMatch ? headingMatch[1] : line;
    });
    
    // Check the results
    expect(fixedLines).toEqual([
      '# Correct heading',
      '## Heading with leading spaces',
      '# Heading with tab',
      'This is not a heading'
    ]);
  });
  
  // MD026: Trailing punctuation in heading
  test('MD026: should fix headings with trailing punctuation', () => {
    // Test content with incorrect heading format
    const lines = [
      '# Heading 1.',
      '## Heading 2!',
      '### Heading 3?',
      '#### Heading 4;',
      '##### Heading 5:',
      '###### Heading 6 with closing hash #',
      '# This heading is correct'
    ];
    
    // Apply the fix logic
    const fixedLines = lines.map(line => {
      if (/^#{1,6}\s+.+$/.test(line)) {
        return line.replace(/^(#{1,6}\s+.+?)[.,;:!?]+(\s*#*\s*)$/, '$1$2');
      }
      return line;
    });
    
    // Check the results
    expect(fixedLines).toEqual([
      '# Heading 1',
      '## Heading 2',
      '### Heading 3',
      '#### Heading 4',
      '##### Heading 5',
      '###### Heading 6 with closing hash #',
      '# This heading is correct'
    ]);
  });
  
  // MD027: Multiple spaces after blockquote symbol
  test('MD027: should fix blockquotes with too many spaces', () => {
    // Test content with incorrect blockquote format
    const lines = [
      '> Correct blockquote',
      '>  Blockquote with 2 spaces',
      '>   Blockquote with 3 spaces',
      '>    Blockquote with 4 spaces',
      '  > Indented blockquote with correct spacing',
      '  >  Indented blockquote with too many spaces'
    ];
    
    // Apply the fix logic
    const fixedLines = lines.map(line => 
      line.replace(/^(\s*>)\s{2,}(.*)$/, '$1 $2')
    );
    
    // Check the results
    expect(fixedLines).toEqual([
      '> Correct blockquote',
      '> Blockquote with 2 spaces',
      '> Blockquote with 3 spaces',
      '> Blockquote with 4 spaces',
      '  > Indented blockquote with correct spacing',
      '  > Indented blockquote with too many spaces'
    ]);
  });
  
  // Tests for multiple rules working together
  test('Multiple rules: should fix multiple issues in the same content', () => {
    // Test content with multiple issues
    const lines = [
      '#Heading with no space',
      'Text with trailing spaces.  ',
      'Text with\ttabs',
      '#   Multiple spaces after hash',
      '## Heading with no space inside closing hash#',
      '# Heading with multiple spaces inside closing hash   #'
    ];
    
    // Apply all fixes in sequence
    let fixedLines = [...lines];
    
    // MD009: Trailing spaces
    fixedLines = fixedLines.map(line => line.replace(/[ \t]+$/, ''));
    
    // MD010: Hard tabs
    fixedLines = fixedLines.map(line => line.replace(/\t/g, '  '));
    
    // MD018: No space after hash
    fixedLines = fixedLines.map(line => 
      line.replace(/^(#{1,6})([^#\s])/, '$1 $2')
    );
    
    // MD019: Multiple spaces after hash
    fixedLines = fixedLines.map(line => 
      line.replace(/^(#{1,6})[ \t]{2,}/, '$1 ')
    );
    
    // MD020: No space inside closing hash
    fixedLines = fixedLines.map(line => 
      line.replace(/^(#{1,6})[ \t]+([^#\s].*?)[ \t]*#$/m, '$1 $2 #')
    );
    
    // MD021: Multiple spaces inside closing hash
    fixedLines = fixedLines.map(line => 
      line.replace(/^(#{1,6})[ \t]+(.+?)[ \t]{2,}#$/m, '$1 $2 #')
    );
    
    // Check the results
    expect(fixedLines).toEqual([
      '# Heading with no space',
      'Text with trailing spaces.',
      'Text with  tabs',
      '# Multiple spaces after hash',
      '## Heading with no space inside closing hash #',
      '# Heading with multiple spaces inside closing hash #'
    ]);
  });
});
