/**
 * Tests for MD004: Unordered list style
 */
import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md004';

// Test cases for MD004
const testCases = [
  // Valid cases
  {
    name: 'Consistent asterisk bullets',
    markdown: '* Item 1\n* Item 2\n* Item 3',
    expectedViolations: 0
  },
  {
    name: 'Consistent plus bullets',
    markdown: '+ Item 1\n+ Item 2\n+ Item 3',
    expectedViolations: 0
  },
  {
    name: 'Consistent dash bullets',
    markdown: '- Item 1\n- Item 2\n- Item 3',
    expectedViolations: 0
  },
  {
    name: 'Consistent asterisk bullets with indentation',
    markdown: '* Item 1\n  * Nested item\n* Item 2',
    expectedViolations: 0
  },
  {
    name: 'Single list item',
    markdown: '* Just one item',
    expectedViolations: 0
  },
  
  // Invalid cases
  {
    name: 'Mixed asterisk and plus bullets',
    markdown: '* Item 1\n+ Item 2\n* Item 3',
    expectedViolations: 1,
    expectedLineNumbers: [2],
    expectedFixedMarkdown: '* Item 1\n* Item 2\n* Item 3'
  },
  {
    name: 'Mixed asterisk and dash bullets',
    markdown: '* Item 1\n- Item 2\n* Item 3',
    expectedViolations: 1,
    expectedLineNumbers: [2],
    expectedFixedMarkdown: '* Item 1\n* Item 2\n* Item 3'
  },
  {
    name: 'Mixed plus and dash bullets',
    markdown: '+ Item 1\n- Item 2\n+ Item 3',
    expectedViolations: 1,
    expectedLineNumbers: [2],
    expectedFixedMarkdown: '+ Item 1\n+ Item 2\n+ Item 3'
  },
  {
    name: 'All three bullet types mixed',
    markdown: '* Item 1\n+ Item 2\n- Item 3',
    expectedViolations: 2,
    expectedLineNumbers: [2, 3],
    expectedFixedMarkdown: '* Item 1\n* Item 2\n* Item 3'
  },
  {
    name: 'Mixed bullets with indentation',
    markdown: '* Item 1\n  + Nested item (different style)\n* Item 2',
    expectedViolations: 1,
    expectedLineNumbers: [2],
    expectedFixedMarkdown: '* Item 1\n  * Nested item (different style)\n* Item 2'
  },
  {
    name: 'Multiple inconsistencies',
    markdown: '* Item 1\n+ Item 2\n- Item 3\n+ Item 4\n* Item 5',
    expectedViolations: 3,
    expectedLineNumbers: [2, 3, 4],
    expectedFixedMarkdown: '* Item 1\n* Item 2\n* Item 3\n* Item 4\n* Item 5'
  },
  {
    name: 'Starting with plus then switching to asterisk',
    markdown: '+ First item sets the style\n* This should be fixed\n+ Back to plus',
    expectedViolations: 1,
    expectedLineNumbers: [2],
    expectedFixedMarkdown: '+ First item sets the style\n+ This should be fixed\n+ Back to plus'
  },
  
  // Edge cases
  {
    name: 'Empty document',
    markdown: '',
    expectedViolations: 0
  },
  {
    name: 'Document with no lists',
    markdown: 'This is just regular text\nWith no lists at all',
    expectedViolations: 0
  },
  {
    name: 'Ordered lists should not be affected',
    markdown: '1. Ordered item 1\n2. Ordered item 2\n* Unordered item',
    expectedViolations: 0
  },
  {
    name: 'Mixed ordered and unordered lists',
    markdown: '* Unordered item\n1. Ordered item\n+ Different unordered style',
    expectedViolations: 1,
    expectedLineNumbers: [3],
    expectedFixedMarkdown: '* Unordered item\n1. Ordered item\n* Different unordered style'
  },
  {
    name: 'Text that looks like lists but is not',
    markdown: 'In math, * means multiplication\nThe + symbol means addition\nAnd - means subtraction',
    expectedViolations: 0
  },
  {
    name: 'Lists separated by other content',
    markdown: '* First list item\n\nSome text in between\n\n+ Second list item (different style)',
    expectedViolations: 1,
    expectedLineNumbers: [5],
    expectedFixedMarkdown: '* First list item\n\nSome text in between\n\n* Second list item (different style)'
  },
  {
    name: 'Deeply nested lists with mixed styles',
    markdown: '* Level 1\n  + Level 2 (inconsistent)\n    - Level 3 (also inconsistent)',
    expectedViolations: 2,
    expectedLineNumbers: [2, 3],
    expectedFixedMarkdown: '* Level 1\n  * Level 2 (inconsistent)\n    * Level 3 (also inconsistent)'
  }
];

// Run tests
testRule('MD004', rule, testCases);
