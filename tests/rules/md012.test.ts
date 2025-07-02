/**
 * Tests for MD012: Multiple consecutive blank lines
 */
import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md012';

// Test cases for MD012
const testCases = [
  // Valid cases
  {
    name: 'Document with no blank lines',
    markdown: 'Line one.\nLine two.\nLine three.',
    expectedViolations: 0
  },
  {
    name: 'Document with single blank lines',
    markdown: 'Line one.\n\nLine two.\n\nLine three.',
    expectedViolations: 0
  },
  {
    name: 'Document with paragraphs and single blank lines',
    markdown: '# Heading\n\nParagraph one.\n\nParagraph two.\n\n* List item',
    expectedViolations: 0
  },
  
  // Invalid cases
  {
    name: 'Document with two consecutive blank lines',
    markdown: 'Line one.\n\n\nLine two.',
    expectedViolations: 1,
    expectedLineNumbers: [3],
    expectedFixedMarkdown: 'Line one.\n\nLine two.'
  },
  {
    name: 'Document with configuration allowing two blank lines',
    markdown: 'Line one.\n\n\nLine two.\n\n\n\nLine three.',
    config: { maximum: 2 },
    expectedViolations: 1,
    expectedLineNumbers: [7],
    expectedFixedMarkdown: 'Line one.\n\n\nLine two.\n\n\nLine three.'
  },
  {
    name: 'Document with three consecutive blank lines',
    markdown: 'Line one.\n\n\n\nLine two.',
    expectedViolations: 2,
    expectedLineNumbers: [3, 4],
    expectedFixedMarkdown: 'Line one.\n\nLine two.'
  },
  {
    name: 'Document with multiple sections of consecutive blank lines',
    markdown: 'Line one.\n\n\nLine two.\n\n\n\nLine three.',
    expectedViolations: 3,
    expectedLineNumbers: [3, 6, 7],
    expectedFixedMarkdown: 'Line one.\n\nLine two.\n\nLine three.'
  },
  
  // Edge cases
  {
    name: 'Empty document',
    markdown: '',
    expectedViolations: 0,
    expectedFixedMarkdown: ''
  },
  {
    name: 'Document with only blank lines',
    markdown: '\n\n\n',
    expectedViolations: 2,
    expectedLineNumbers: [2, 3],
    expectedFixedMarkdown: '\n'
  },
  {
    name: 'Document starting with consecutive blank lines',
    markdown: '\n\n\nLine one.\nLine two.',
    expectedViolations: 2,
    expectedLineNumbers: [2, 3],
    expectedFixedMarkdown: '\nLine one.\nLine two.'
  },
  {
    name: 'Document ending with consecutive blank lines',
    markdown: 'Line one.\nLine two.\n\n\n',
    expectedViolations: 2,
    expectedLineNumbers: [4, 5],
    expectedFixedMarkdown: 'Line one.\nLine two.\n'
  },
  {
    name: 'Document with spaces on blank lines',
    markdown: 'Line one.\n  \n \n\nLine two.',
    expectedViolations: 2,
    expectedLineNumbers: [3, 4],
    expectedFixedMarkdown: 'Line one.\n  \nLine two.'
  }
];

// Run tests
testRule('MD012', rule, testCases);
