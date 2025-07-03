/**
 * Tests for MD030: Spaces after list markers
 */
import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md030';

// Test cases for MD030
const testCases = [
  // Valid cases
  {
    name: 'Valid unordered list with single spaces',
    markdown: '* Item 1\n* Item 2\n* Item 3',
    expectedViolations: 0
  },
  {
    name: 'Valid ordered list with single spaces',
    markdown: '1. Item 1\n2. Item 2\n3. Item 3',
    expectedViolations: 0
  },
  {
    name: 'Valid mixed lists with single spaces',
    markdown: '* Unordered item\n1. Ordered item\n+ Another unordered\n2. Another ordered',
    expectedViolations: 0
  },
  {
    name: 'Valid nested lists with single spaces',
    markdown: '* Item 1\n  * Nested item\n* Item 2',
    expectedViolations: 0
  },
  
  // Invalid cases
  {
    name: 'Unordered list with multiple spaces',
    markdown: '*  Item 1\n*   Item 2\n* Item 3',
    expectedViolations: 2,
    expectedLineNumbers: [1, 2],
    expectedFixedMarkdown: '* Item 1\n* Item 2\n* Item 3'
  },
  {
    name: 'Ordered list with multiple spaces',
    markdown: '1.  Item 1\n2.   Item 2\n3. Item 3',
    expectedViolations: 2,
    expectedLineNumbers: [1, 2],
    expectedFixedMarkdown: '1. Item 1\n2. Item 2\n3. Item 3'
  },
  {
    name: 'Mixed lists with inconsistent spacing',
    markdown: '*  Unordered with 2 spaces\n1.   Ordered with 3 spaces\n+ Single space is correct',
    expectedViolations: 2,
    expectedLineNumbers: [1, 2],
    expectedFixedMarkdown: '* Unordered with 2 spaces\n1. Ordered with 3 spaces\n+ Single space is correct'
  },
  {
    name: 'List with no space after marker',
    markdown: '*Item without space\n1.Another without space',
    expectedViolations: 0  // These won't match the regex pattern so won't be detected as list items
  },
  
  // Edge cases
  {
    name: 'Empty document',
    markdown: '',
    expectedViolations: 0
  },
  {
    name: 'Document with no lists',
    markdown: 'This is a paragraph\n\nThis is another paragraph\n\nNo lists here',
    expectedViolations: 0
  },
  {
    name: 'Document with only text that looks like lists but is not',
    markdown: 'The item * should not be detected\nSimilarly 1. this should not be detected',
    expectedViolations: 0
  },
  {
    name: 'Indented list with multiple spaces',
    markdown: '  *  Indented item with extra spaces\n  * Properly spaced indented item',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '  * Indented item with extra spaces\n  * Properly spaced indented item'
  }
];

// Run tests
testRule('MD030', rule, testCases);
