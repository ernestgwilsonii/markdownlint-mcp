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
  
  // MD012: Multiple consecutive blank lines
  test('MD012: should fix multiple consecutive blank lines', () => {
    // Test content with multiple blank lines
    const lines = [
      'Line 1',
      '',
      '',
      '',
      'Line 2',
      '',
      'Line 3',
      '',
      '',
      'Line 4'
    ];
    
    // Apply the fix logic
    let fixedLines: string[] = [];
    let blankLineCount = 0;
    
    for (const line of lines) {
      if (line.trim() === '') {
        blankLineCount++;
        // Only add the first blank line of a sequence
        if (blankLineCount === 1) {
          fixedLines.push(line);
        }
      } else {
        blankLineCount = 0;
        fixedLines.push(line);
      }
    }
    
    // Check the results
    expect(fixedLines).toEqual([
      'Line 1',
      '',
      'Line 2',
      '',
      'Line 3',
      '',
      'Line 4'
    ]);
  });
  
  // MD022: Headings should be surrounded by blank lines
  test('MD022: should fix headings not surrounded by blank lines', () => {
    // Test content with headings not properly surrounded by blank lines
    const lines = [
      'Text before heading.',
      '# Heading 1',
      'Text after heading.',
      'More text.',
      '## Heading 2',
      'Text after second heading.',
      '',
      '### Heading 3',
      '',
      'Text properly surrounded by blank lines.'
    ];
    
    let fixedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isHeading = /^#{1,6}\s+.+/.test(line);
      
      if (isHeading) {
        // Check if there's a blank line before the heading (unless it's the first line)
        const needsBlankBefore = i > 0 && lines[i-1].trim() !== '';
        
        // Check if there's a blank line after the heading (unless it's the last line)
        const needsBlankAfter = i < lines.length - 1 && lines[i+1].trim() !== '';
        
        if (needsBlankBefore) {
          fixedLines.push('');
        }
        
        fixedLines.push(line);
        
        if (needsBlankAfter) {
          fixedLines.push('');
        }
      } else {
        fixedLines.push(line);
      }
    }
    
    // Check the results
    expect(fixedLines).toEqual([
      'Text before heading.',
      '',
      '# Heading 1',
      '',
      'Text after heading.',
      'More text.',
      '',
      '## Heading 2',
      '',
      'Text after second heading.',
      '',
      '### Heading 3',
      '',
      'Text properly surrounded by blank lines.'
    ]);
  });
  
  // MD031: Fenced code blocks should be surrounded by blank lines
  test('MD031: should fix code blocks not surrounded by blank lines', () => {
    // Test content with code blocks not properly surrounded by blank lines
    const lines = [
      'Text before code block.',
      '```javascript',
      'const x = 1;',
      '```',
      'Text after code block.',
      'More text.',
      '```python',
      'print("Hello")',
      '```',
      '',
      'Text properly spaced after code.',
      '',
      '```ruby',
      'puts "Hi"',
      '```',
      '',
      'Text properly spaced after code.'
    ];
    
    let fixedLines: string[] = [];
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isFenceStart = line.trim().startsWith('```');
      const isFenceEnd = inCodeBlock && line.trim() === '```';
      
      if (isFenceStart && !inCodeBlock) {
        // Check if there's a blank line before the code block (unless it's the first line)
        const needsBlankBefore = i > 0 && lines[i-1].trim() !== '';
        
        if (needsBlankBefore) {
          fixedLines.push('');
        }
        
        fixedLines.push(line);
        inCodeBlock = true;
      } else if (isFenceEnd) {
        fixedLines.push(line);
        inCodeBlock = false;
        
        // Check if there's a blank line after the code block (unless it's the last line)
        const needsBlankAfter = i < lines.length - 1 && lines[i+1].trim() !== '';
        
        if (needsBlankAfter) {
          fixedLines.push('');
        }
      } else {
        fixedLines.push(line);
      }
    }
    
    // Check the results
    expect(fixedLines).toEqual([
      'Text before code block.',
      '',
      '```javascript',
      'const x = 1;',
      '```',
      '',
      'Text after code block.',
      'More text.',
      '',
      '```python',
      'print("Hello")',
      '```',
      '',
      'Text properly spaced after code.',
      '',
      '```ruby',
      'puts "Hi"',
      '```',
      '',
      'Text properly spaced after code.'
    ]);
  });
  
  // MD032: Lists should be surrounded by blank lines
  test('MD032: should fix lists not surrounded by blank lines', () => {
    // Test content with lists not properly surrounded by blank lines
    const lines = [
      'Text before list.',
      '- Item 1',
      '- Item 2',
      '- Item 3',
      'Text after list.',
      'More text.',
      '1. Numbered item 1',
      '2. Numbered item 2',
      '',
      'Text properly spaced after list.'
    ];
    
    let fixedLines: string[] = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isListItem = /^(\s*[-+*]|\s*\d+\.)\s+.+/.test(line);
      
      // Detect end of list: we were in a list, current line is not a list item, and it's not empty
      const isEndOfList = inList && !isListItem && line.trim() !== '';
      
      if (isListItem && !inList) {
        // List is starting
        inList = true;
        
        // Check if there's a blank line before the list (unless it's the first line)
        const needsBlankBefore = i > 0 && lines[i-1].trim() !== '';
        
        if (needsBlankBefore) {
          fixedLines.push('');
        }
        
        fixedLines.push(line);
      } else if (isEndOfList) {
        // List is ending
        inList = false;
        
        // The current line is non-list content, make sure there's a blank line before it
        if (fixedLines.length > 0 && fixedLines[fixedLines.length - 1].trim() !== '') {
          fixedLines.push('');
        }
        
        fixedLines.push(line);
      } else {
        // Regular line (could be a list item in an ongoing list or non-list content)
        fixedLines.push(line);
        
        // If this is a list item, we're in a list
        if (isListItem) {
          inList = true;
        } else if (line.trim() === '') {
          // Empty line - not a list item, but doesn't necessarily end the list
          // We'll determine if we're still in a list when we see the next non-empty line
        } else {
          // Non-empty, non-list item line - definitely not in a list
          inList = false;
        }
      }
    }
    
    // Check the results
    expect(fixedLines).toEqual([
      'Text before list.',
      '',
      '- Item 1',
      '- Item 2',
      '- Item 3',
      '',
      'Text after list.',
      'More text.',
      '',
      '1. Numbered item 1',
      '2. Numbered item 2',
      '',
      'Text properly spaced after list.'
    ]);
  });
  
  // MD040: Fenced code blocks should have a language specified
  test('MD040: should add language to fenced code blocks', () => {
    // Test content with code blocks missing language specifications
    const lines = [
      '```',
      'Code without language',
      '```',
      '',
      '```javascript',
      'const x = 1; // This one has a language',
      '```',
      '',
      '```',
      'Another code block without language',
      '```'
    ];
    
    let fixedLines: string[] = [];
    let inCodeBlock = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (!inCodeBlock && line.trim() === '```') {
        // Add 'text' as the default language
        fixedLines.push('```text');
        inCodeBlock = true;
      } else if (inCodeBlock && line.trim() === '```') {
        fixedLines.push(line);
        inCodeBlock = false;
      } else {
        fixedLines.push(line);
        if (!inCodeBlock && line.trim().startsWith('```')) {
          inCodeBlock = true;
        }
      }
    }
    
    // Check the results
    expect(fixedLines).toEqual([
      '```text',
      'Code without language',
      '```',
      '',
      '```javascript',
      'const x = 1; // This one has a language',
      '```',
      '',
      '```text',
      'Another code block without language',
      '```'
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
