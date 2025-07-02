/**
 * Tests for MD001: Heading levels should only increment by one level at a time
 */
import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md001';

// Test cases for MD001
const testCases = [
  // Valid cases
  {
    name: 'Valid sequential headings',
    markdown: '# Heading 1\n\n## Heading 2\n\n### Heading 3\n\n#### Heading 4',
    expectedViolations: 0
  },
  {
    name: 'Valid headings with proper incrementing',
    markdown: '# Heading 1\n\n## Heading 2\n\n## Another Heading 2\n\n### Heading 3',
    expectedViolations: 0
  },
  {
    name: 'Valid with non-sequential but not incrementing headings',
    markdown: '### Heading 3\n\n# Heading 1\n\n## Heading 2',
    expectedViolations: 0 // Decrementing is allowed, only incrementing has to be by one
  },
  
  // Invalid cases
  {
    name: 'Invalid heading increment (h1 to h3)',
    markdown: '# Heading 1\n\n### Heading 3',
    expectedViolations: 1,
    expectedLineNumbers: [3],
    expectedFixedMarkdown: '# Heading 1\n\n## Heading 3'
  },
  {
    name: 'Invalid heading increment (h2 to h4)',
    markdown: '## Heading 2\n\n#### Heading 4',
    expectedViolations: 1,
    expectedLineNumbers: [3],
    expectedFixedMarkdown: '## Heading 2\n\n### Heading 4'
  },
  {
    name: 'Multiple invalid increments',
    markdown: '# Heading 1\n\n### Heading 3\n\n##### Heading 5',
    expectedViolations: 2,
    expectedLineNumbers: [3, 5],
    expectedFixedMarkdown: '# Heading 1\n\n## Heading 3\n\n### Heading 5'
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
    name: 'Document with ATX and closed ATX headings',
    markdown: '# Heading 1\n\n### Heading 3 ###',
    expectedViolations: 1,
    expectedLineNumbers: [3],
    expectedFixedMarkdown: '# Heading 1\n\n## Heading 3 ###'
  }
];

// Run tests
testRule('MD001', rule, testCases);
