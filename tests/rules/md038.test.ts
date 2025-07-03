/**
 * Tests for MD038: Spaces inside code span elements
 */
import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md038';

// Test cases for MD038
const testCases = [
  // Valid cases
  {
    name: 'Valid code span without spaces',
    markdown: 'This is `code` without spaces',
    expectedViolations: 0
  },
  {
    name: 'Valid multiple code spans without spaces',
    markdown: 'Use `function()` and `variable` in your code',
    expectedViolations: 0
  },
  {
    name: 'Valid code span with internal spaces',
    markdown: 'This `hello world` has internal spaces which is fine',
    expectedViolations: 0
  },
  {
    name: 'Valid empty code span',
    markdown: 'An empty `` code span is valid',
    expectedViolations: 0
  },
  {
    name: 'Valid code spans on multiple lines',
    markdown: 'Line 1 has `code`\nLine 2 has `more code`',
    expectedViolations: 0
  },
  
  // Invalid cases
  {
    name: 'Code span with leading space',
    markdown: 'This is ` code` with leading space',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This is `code` with leading space'
  },
  {
    name: 'Code span with trailing space',
    markdown: 'This is `code ` with trailing space',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This is `code` with trailing space'
  },
  {
    name: 'Code span with spaces on both sides',
    markdown: 'This is ` code ` with spaces on both sides',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This is `code` with spaces on both sides'
  },
  {
    name: 'Multiple code spans with spaces',
    markdown: 'Use ` function ` and ` variable ` in your code',
    expectedViolations: 2,
    expectedLineNumbers: [1, 1],
    expectedFixedMarkdown: 'Use `function` and `variable` in your code'
  },
  {
    name: 'Mixed valid and invalid code spans',
    markdown: 'Valid `code` and invalid ` code ` on same line',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Valid `code` and invalid `code` on same line'
  },
  {
    name: 'Multiple lines with violations',
    markdown: 'Line 1 has ` code `\nLine 2 has ` more code `',
    expectedViolations: 2,
    expectedLineNumbers: [1, 2],
    expectedFixedMarkdown: 'Line 1 has `code`\nLine 2 has `more code`'
  },
  {
    name: 'Code span with multiple leading spaces',
    markdown: 'This has `  multiple leading spaces`',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This has `multiple leading spaces`'
  },
  {
    name: 'Code span with multiple trailing spaces',
    markdown: 'This has `multiple trailing spaces  `',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This has `multiple trailing spaces`'
  },
  
  // Edge cases
  {
    name: 'Empty document',
    markdown: '',
    expectedViolations: 0
  },
  {
    name: 'Document with no code spans',
    markdown: 'This is just regular text\nWith no code spans at all',
    expectedViolations: 0
  },
  {
    name: 'Backticks not used for code spans',
    markdown: 'This sentence uses `backticks` properly\nThis one has unmatched `',
    expectedViolations: 0
  },
  {
    name: 'Code span at start and end of line',
    markdown: '` code at start` and `code at end `',
    expectedViolations: 2,
    expectedLineNumbers: [1, 1],
    expectedFixedMarkdown: '`code at start` and `code at end`'
  },
  {
    name: 'Code span with only spaces',
    markdown: 'This has `   ` only spaces inside',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This has `` only spaces inside'
  },
  {
    name: 'Code span containing backticks is not handled',
    markdown: 'This is normal `code` without issues',
    expectedViolations: 0
  }
];

// Run tests
testRule('MD038', rule, testCases);
