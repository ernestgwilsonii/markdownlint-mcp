/**
 * Tests for MD003: Heading style
 */
import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md003';

// Test cases for MD003
const testCases = [
  // Valid cases - ATX style
  {
    name: 'All ATX style headings with "atx" style',
    markdown: '# Heading 1\n\n## Heading 2\n\n### Heading 3',
    config: { style: 'atx' },
    expectedViolations: 0
  },
  {
    name: 'All ATX closed style headings with "atx_closed" style',
    markdown: '# Heading 1 #\n\n## Heading 2 ##\n\n### Heading 3 ###',
    config: { style: 'atx_closed' },
    expectedViolations: 0
  },
  {
    name: 'All Setext style headings with "setext" style',
    markdown: 'Heading 1\n=========\n\nHeading 2\n---------',
    config: { style: 'setext' },
    expectedViolations: 0
  },
  {
    name: 'Mixed styles with "consistent" style (defaults to first heading style)',
    markdown: '# Heading 1\n\n## Heading 2\n\n### Heading 3',
    config: { style: 'consistent' },
    expectedViolations: 0
  },
  
  // Invalid cases
  {
    name: '[Detection] Mixed ATX and Setext with "atx" style',
    markdown: '# Heading 1\n\nHeading 2\n---------\n\n### Heading 3',
    config: { style: 'atx' },
    expectedViolations: 1,
    expectedLineNumbers: [3],
    expectedFixedMarkdown: '# Heading 1\n\n## Heading 2\n\n### Heading 3'
  },
  {
    name: 'Mixed ATX and ATX closed with "atx_closed" style',
    markdown: '# Heading 1\n\n## Heading 2\n\n### Heading 3 ###',
    config: { style: 'atx_closed' },
    expectedViolations: 2,
    expectedLineNumbers: [1, 3],
    expectedFixedMarkdown: '# Heading 1 #\n\n## Heading 2 ##\n\n### Heading 3 ###'
  },
  {
    name: '[Detection] Mixed ATX and Setext with "setext" style (level 1-2 only)',
    markdown: '# Heading 1\n\n## Heading 2\n\n### Heading 3',
    config: { style: 'setext' },
    expectedViolations: 3,
    expectedLineNumbers: [1, 3, 5],
    expectedFixedMarkdown: 'Heading 1\n=========\n\nHeading 2\n---------\n\n### Heading 3'
  },
  {
    name: '[Detection] Mixed styles with "consistent" style (first heading is ATX)',
    markdown: '# Heading 1\n\nHeading 2\n---------\n\n### Heading 3 ###',
    config: { style: 'consistent' },
    expectedViolations: 2,
    expectedLineNumbers: [3, 6],
    expectedFixedMarkdown: '# Heading 1\n\n## Heading 2\n\n### Heading 3'
  },

  // Edge cases
  {
    name: 'Empty document',
    markdown: '',
    expectedViolations: 0
  },
  {
    name: 'Document with no headings',
    markdown: 'This is a paragraph\n\nThis is another paragraph',
    expectedViolations: 0
  },
  {
    name: 'Document with only one heading',
    markdown: '## Just one heading',
    expectedViolations: 0
  },
  {
    name: '[Detection] Higher level headings (h3+) with setext style',
    markdown: 'Heading 1\n=========\n\nHeading 2\n---------\n\n### Heading 3',
    config: { style: 'setext' },
    expectedViolations: 1,
    expectedLineNumbers: [7],
    expectedFixedMarkdown: 'Heading 1\n=========\n\nHeading 2\n---------\n\n### Heading 3'
  }
];

// Run tests
testRule('MD003', rule, testCases);
