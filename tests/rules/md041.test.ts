/**
 * Tests for MD041: First line in file should be a top level header
 */
import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md041';

// Test cases for MD041
const testCases = [
  // Valid cases
  {
    name: 'Document starts with H1 header',
    markdown: '# Main Title\n\nSome content here',
    expectedViolations: 0
  },
  {
    name: 'Document starts with H1 header (no content after)',
    markdown: '# Main Title',
    expectedViolations: 0
  },
  {
    name: 'Document starts with H1 header with multiple words',
    markdown: '# This is a Main Title\n\nContent follows',
    expectedViolations: 0
  },
  
  // Invalid cases
  {
    name: 'Document starts with H2 header',
    markdown: '## Secondary Title\n\nSome content here',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '# Secondary Title\n\nSome content here'
  },
  {
    name: 'Document starts with H3 header',
    markdown: '### Tertiary Title\n\nSome content here',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '# Tertiary Title\n\nSome content here'
  },
  {
    name: 'Document starts with H4 header',
    markdown: '#### Fourth Level Title\n\nSome content here',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '# Fourth Level Title\n\nSome content here'
  },
  {
    name: 'Document starts with H5 header',
    markdown: '##### Fifth Level Title\n\nSome content here',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '# Fifth Level Title\n\nSome content here'
  },
  {
    name: 'Document starts with H6 header',
    markdown: '###### Sixth Level Title\n\nSome content here',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '# Sixth Level Title\n\nSome content here'
  },
  {
    name: 'Document starts with regular text',
    markdown: 'This is just regular text\n\n# Header comes later',
    expectedViolations: 1,
    expectedLineNumbers: [1]
    // No fix expected - turning text into headers changes meaning
  },
  {
    name: 'Document starts with list',
    markdown: '* List item\n* Another item\n\n# Header later',
    expectedViolations: 1,
    expectedLineNumbers: [1]
    // No fix expected - turning lists into headers changes meaning
  },
  {
    name: 'Document starts with code block',
    markdown: '```js\nconsole.log("hello");\n```\n\n# Header later',
    expectedViolations: 1,
    expectedLineNumbers: [1]
    // No fix expected - turning code into headers changes meaning
  },
  
  // Edge cases
  {
    name: 'Empty document',
    markdown: '',
    expectedViolations: 0
  },
  {
    name: 'Document with only whitespace',
    markdown: '   \n  \n',
    expectedViolations: 0
  },
  {
    name: 'Document starts with empty lines then H1',
    markdown: '\n\n# Main Title\n\nContent',
    expectedViolations: 0
  },
  {
    name: 'Document starts with empty lines then H2',
    markdown: '\n\n## Secondary Title\n\nContent',
    expectedViolations: 1,
    expectedLineNumbers: [3],
    expectedFixedMarkdown: '\n\n# Secondary Title\n\nContent'
  },
  {
    name: 'Document with only H1 header',
    markdown: '# Solo Title',
    expectedViolations: 0
  },
  {
    name: 'Document starts with HTML comment then H2',
    markdown: '<!-- Comment -->\n## Title\n\nContent',
    expectedViolations: 1,
    expectedLineNumbers: [2],
    expectedFixedMarkdown: '<!-- Comment -->\n# Title\n\nContent'
  },
  {
    name: 'Document starts with horizontal rule',
    markdown: '---\n\n# Title later',
    expectedViolations: 1,
    expectedLineNumbers: [1]
    // No fix expected - turning horizontal rule into header changes meaning
  }
];

// Run tests
testRule('MD041', rule, testCases);
