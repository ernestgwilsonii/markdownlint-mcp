/**
 * Tests for MD009: Trailing spaces
 */
import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md009';

// Test cases for MD009
const testCases = [
  // Valid cases
  {
    name: 'No trailing spaces',
    markdown: 'This line has no trailing spaces.\nThis line also has none.',
    expectedViolations: 0
  },
  {
    name: 'No trailing spaces in multiline document',
    markdown: 'Line one.\n\nLine two.\n\nLine three.',
    expectedViolations: 0
  },
  
  // Invalid cases
  {
    name: 'Line with trailing spaces',
    markdown: 'This line has trailing spaces.  \nThis line is fine.',
    config: { strict: true },
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This line has trailing spaces.\nThis line is fine.'
  },
  {
    name: 'Multiple lines with trailing spaces',
    markdown: 'Line with spaces.  \nAnother trailing space. \nThis line is fine.',
    config: { strict: true },
    expectedViolations: 2,
    expectedLineNumbers: [1, 2],
    expectedFixedMarkdown: 'Line with spaces.\nAnother trailing space.\nThis line is fine.'
  },
  {
    name: 'Line with many trailing spaces',
    markdown: 'Many spaces at the end.      \nNo problem here.',
    config: { strict: true },
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Many spaces at the end.\nNo problem here.'
  },
  
  // Configuration cases
  {
    name: 'Allowing two spaces for line breaks (br_spaces = 2)',
    markdown: 'Line with two spaces for break.  \nAnother line.',
    config: { br_spaces: 2 },
    expectedViolations: 0
  },
  {
    name: 'Allowing two spaces for line breaks but has three spaces',
    markdown: 'Line with three spaces for break.   \nAnother line.',
    config: { br_spaces: 2, strict: true },
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Line with three spaces for break.  \nAnother line.'
  },
  {
    name: 'Allowing line breaks but removing other trailing spaces',
    markdown: 'Line with trailing spaces.   \nAnother with just one. \nThis is fine.',
    config: { br_spaces: 2, strict: true },
    expectedViolations: 2,
    expectedLineNumbers: [1, 2]
  },
  // Create a separate test case for just the fix functionality
  {
    name: 'Fix for trailing spaces with line breaks',
    markdown: 'Line with trailing spaces.   \nAnother with just one. \nThis is fine.',
    config: { br_spaces: 2, strict: true },
    expectedViolations: 2,
    expectedLineNumbers: [1, 2],
    expectedFixedMarkdown: 'Line with trailing spaces.  \nAnother with just one.  \nThis is fine.'
  },
  
  // Edge cases
  {
    name: 'Empty document',
    markdown: '',
    expectedViolations: 0
  },
  {
    name: 'Document with only blank lines',
    markdown: '\n\n\n',
    expectedViolations: 0
  },
  {
    name: 'Trailing spaces on blank lines',
    markdown: 'Normal line.\n  \n\nAnother line.',
    config: { strict: true },
    expectedViolations: 1,
    expectedLineNumbers: [2],
    expectedFixedMarkdown: 'Normal line.\n\n\nAnother line.'
  },
  {
    name: 'Trailing tabs',
    markdown: 'Line with trailing tab.\t\nAnother line.',
    config: { strict: true },
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Line with trailing tab.\nAnother line.'
  }
];

// Run tests
testRule('MD009', rule, testCases);
