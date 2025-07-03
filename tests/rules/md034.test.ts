/**
 * Tests for MD034: Bare URL used
 */
import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md034';

// Test cases for MD034
const testCases = [
  // Valid cases
  {
    name: 'URL properly enclosed in angle brackets',
    markdown: 'Visit <https://example.com> for more info',
    expectedViolations: 0
  },
  {
    name: 'URL in proper Markdown link format',
    markdown: 'Visit [Example](https://example.com) for more info',
    expectedViolations: 0
  },
  {
    name: 'URL in code span',
    markdown: 'The URL `https://example.com` should not be flagged',
    expectedViolations: 0
  },
  {
    name: 'URL in code block',
    markdown: '```\nhttps://example.com\n```',
    expectedViolations: 0
  },
  {
    name: 'URL in indented code block',
    markdown: '    https://example.com',
    expectedViolations: 0
  },
  {
    name: 'Multiple properly formatted URLs',
    markdown: 'Visit <https://example.com> and [Google](https://google.com)',
    expectedViolations: 0
  },
  
  // Invalid cases
  {
    name: 'Simple bare HTTP URL',
    markdown: 'Visit https://example.com for more info',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Visit <https://example.com> for more info'
  },
  {
    name: 'Simple bare HTTPS URL',
    markdown: 'Visit https://secure-example.com for more info',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Visit <https://secure-example.com> for more info'
  },
  {
    name: 'Multiple bare URLs on one line',
    markdown: 'Visit https://example.com and also https://test.com',
    expectedViolations: 2,
    expectedLineNumbers: [1, 1],
    expectedFixedMarkdown: 'Visit <https://example.com> and also <https://test.com>'
  },
  {
    name: 'Bare URL with query parameters',
    markdown: 'Search at https://google.com/search?q=test',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Search at <https://google.com/search?q=test>'
  },
  {
    name: 'Bare URL with fragment',
    markdown: 'See https://example.com#section1 for details',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'See <https://example.com#section1> for details'
  },
  {
    name: 'Multiple lines with bare URLs',
    markdown: 'Line 1: https://example.com\nLine 2: https://test.com',
    expectedViolations: 2,
    expectedLineNumbers: [1, 2],
    expectedFixedMarkdown: 'Line 1: <https://example.com>\nLine 2: <https://test.com>'
  },
  {
    name: 'Mixed valid and invalid URLs',
    markdown: 'Valid: <https://example.com> and invalid: https://test.com',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Valid: <https://example.com> and invalid: <https://test.com>'
  },
  
  // Edge cases
  {
    name: 'Empty document',
    markdown: '',
    expectedViolations: 0
  },
  {
    name: 'Document with no URLs',
    markdown: 'This is just regular text\nWith no URLs at all',
    expectedViolations: 0
  },
  {
    name: 'URL at start of line',
    markdown: 'https://example.com is a good site',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '<https://example.com> is a good site'
  },
  {
    name: 'URL at end of line',
    markdown: 'Visit the site at https://example.com',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Visit the site at <https://example.com>'
  },
  {
    name: 'URL with punctuation after',
    markdown: 'Check out https://example.com.',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Check out <https://example.com>.'
  },
  {
    name: 'URL in parentheses',
    markdown: 'See the documentation (https://example.com) for details',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'See the documentation (<https://example.com>) for details'
  },
  {
    name: 'FTP URLs should not be flagged',
    markdown: 'The FTP site ftp://example.com should not be flagged',
    expectedViolations: 0
  },
  {
    name: 'Non-URL text that looks like URL',
    markdown: 'The variable https_proxy is used for configuration',
    expectedViolations: 0
  },
  {
    name: 'URL in existing link markup should not be flagged',
    markdown: 'This [link text](https://example.com) is already properly formatted',
    expectedViolations: 0
  }
];

// Run tests
testRule('MD034', rule, testCases);
