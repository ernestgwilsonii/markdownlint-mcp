/**
 * Tests for MD010: Hard tabs
 */
import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md010';

// Test cases for MD010
const testCases = [
  // Valid cases
  {
    name: 'Document with spaces for indentation',
    markdown: '# Heading\n\n  * Item with spaces\n    * Subitem with spaces\n\n    Code block with spaces',
    expectedViolations: 0
  },
  {
    name: 'Document with no indentation',
    markdown: 'Line one.\nLine two.\nLine three.',
    expectedViolations: 0
  },
  
  // Invalid cases
  {
    name: 'Line with a tab character',
    markdown: 'This line has a\ttab character.',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This line has a  tab character.'
  },
  {
    name: 'Indentation with tabs',
    markdown: '# Heading\n\n\t* Item with tab\n\t\t* Subitem with tabs',
    expectedViolations: 2,
    expectedLineNumbers: [3, 4],
    expectedFixedMarkdown: '# Heading\n\n  * Item with tab\n    * Subitem with tabs'
  },
  {
    name: 'Code block with tabs',
    markdown: '```\nfunction() {\n\tconst x = 1;\n\treturn x;\n}\n```',
    expectedViolations: 2,
    expectedLineNumbers: [3, 4],
    expectedFixedMarkdown: '```\nfunction() {\n  const x = 1;\n  return x;\n}\n```'
  },
  
  // Configuration cases
  {
    name: 'Custom spaces per tab',
    markdown: 'Text with\ttab.',
    config: { spaces_per_tab: 2 },
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Text with  tab.'
  },
  {
    name: 'Tabs in code blocks allowed',
    markdown: '```js\nfunction() {\n\tconst x = 1;\n}\n```',
    config: { code_blocks: false },
    expectedViolations: 0
  },
  {
    name: 'Tabs allowed in code blocks but not in regular text',
    markdown: 'Regular line with\ttab.\n\n```js\nfunction() {\n\tconst x = 1;\n}\n```',
    config: { code_blocks: false },
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Regular line with  tab.\n\n```js\nfunction() {\n\tconst x = 1;\n}\n```'
  },
  
  // Edge cases
  {
    name: 'Empty document',
    markdown: '',
    expectedViolations: 0
  },
  {
    name: 'Document with only tabs',
    markdown: '\t\t\t',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '      '
  },
  {
    name: 'Document with tabs at line start and middle',
    markdown: '\tIndented line\nMiddle\ttab',
    expectedViolations: 2,
    expectedLineNumbers: [1, 2],
    expectedFixedMarkdown: '  Indented line\nMiddle  tab'
  },
  {
    name: 'Document with mixed tabs and spaces',
    markdown: '  \t  Mixed indentation',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '      Mixed indentation'
  }
];

// Run tests
testRule('MD010', rule, testCases);
