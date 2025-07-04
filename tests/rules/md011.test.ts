/**
 * Tests for MD011: Reversed link syntax
 */
import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md011';

// Test cases for MD011
const testCases = [
  // Valid cases
  {
    name: 'Valid link syntax',
    markdown: 'This is a [valid link](https://example.com) in markdown.',
    expectedViolations: 0
  },
  {
    name: 'Multiple valid links',
    markdown: 'Check out [Google](https://google.com) and [GitHub](https://github.com).',
    expectedViolations: 0
  },
  {
    name: 'Valid reference links',
    markdown: 'This is a [reference link][ref] and [another][ref2].\n\n[ref]: https://example.com\n[ref2]: https://example.org',
    expectedViolations: 0
  },
  {
    name: 'Valid inline code with parentheses and brackets',
    markdown: 'Use `(text)[url]` for reversed syntax, but `[text](url)` is correct.',
    expectedViolations: 0
  },
  {
    name: 'Valid code block with parentheses and brackets',
    markdown: '```\n(text)[url] - this is just code\n[text](url) - this is also just code\n```',
    expectedViolations: 0
  },
  
  // Invalid cases
  {
    name: 'Simple reversed link syntax',
    markdown: 'This is (reversed syntax)[https://example.com] that should be fixed.',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This is [reversed syntax](https://example.com) that should be fixed.'
  },
  {
    name: 'Multiple reversed links on same line',
    markdown: 'Visit (Google)[https://google.com] and (GitHub)[https://github.com].',
    expectedViolations: 2,
    expectedLineNumbers: [1, 1],
    expectedFixedMarkdown: 'Visit [Google](https://google.com) and [GitHub](https://github.com).'
  },
  {
    name: 'Mixed valid and invalid links',
    markdown: 'This [valid link](https://example.com) and (invalid link)[https://example.org].',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This [valid link](https://example.com) and [invalid link](https://example.org).'
  },
  {
    name: 'Reversed links on multiple lines',
    markdown: 'First line has (reversed)[https://example.com] link.\n\nSecond line has (another reversed)[https://example.org] link.',
    expectedViolations: 2,
    expectedLineNumbers: [1, 3],
    expectedFixedMarkdown: 'First line has [reversed](https://example.com) link.\n\nSecond line has [another reversed](https://example.org) link.'
  },
  {
    name: 'Reversed link with special characters',
    markdown: 'Check out (My "Special" Link)[https://example.com/path?param=value&other=123].',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Check out [My "Special" Link](https://example.com/path?param=value&other=123).'
  },
  {
    name: 'Reversed link with spaces and punctuation',
    markdown: 'Visit (The Best Website Ever!)[https://example.com] for more info.',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Visit [The Best Website Ever!](https://example.com) for more info.'
  },
  
  // Edge cases
  {
    name: 'Empty document',
    markdown: '',
    expectedViolations: 0
  },
  {
    name: 'Document with no links',
    markdown: 'This is a paragraph with no links.\n\nThis is another paragraph.',
    expectedViolations: 0
  },
  {
    name: 'Document with only text and parentheses',
    markdown: 'This has (parentheses) but no links.',
    expectedViolations: 0
  },
  {
    name: 'Document with only text and brackets',
    markdown: 'This has [brackets] but no links.',
    expectedViolations: 0
  },
  {
    name: 'Empty brackets and parentheses',
    markdown: 'This has ()[) and (][] but no valid links.',
    expectedViolations: 0
  },
  {
    name: 'Nested brackets and parentheses',
    markdown: 'This has (text with (nested) parens)[https://example.com] link.',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This has [text with (nested) parens](https://example.com) link.'
  },
  {
    name: 'Multiple reversed links with different formats',
    markdown: 'Links: (text1)[url1], (text2)[url2], and (text3)[url3].',
    expectedViolations: 3,
    expectedLineNumbers: [1, 1, 1],
    expectedFixedMarkdown: 'Links: [text1](url1), [text2](url2), and [text3](url3).'
  },
  {
    name: 'Reversed link in list item',
    markdown: '- First item with (reversed)[https://example.com] link\n- Second item with normal [link](https://example.org)',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '- First item with [reversed](https://example.com) link\n- Second item with normal [link](https://example.org)'
  },
  {
    name: 'Reversed link in heading',
    markdown: '# Heading with (reversed)[https://example.com] link',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '# Heading with [reversed](https://example.com) link'
  },
  {
    name: 'Reversed link in blockquote',
    markdown: '> This quote has (reversed)[https://example.com] link.',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '> This quote has [reversed](https://example.com) link.'
  },
  {
    name: 'Reversed link adjacent to other markdown',
    markdown: 'Text **bold** (reversed)[https://example.com] *italic* text.',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Text **bold** [reversed](https://example.com) *italic* text.'
  },
  {
    name: 'Reversed link with relative URL',
    markdown: 'Check out (local page)[/path/to/page.html] for details.',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'Check out [local page](/path/to/page.html) for details.'
  },
  {
    name: 'Complex document with mixed content',
    markdown: '# Title\n\nThis paragraph has (reversed)[https://example.com] link.\n\n- List item 1\n- List item with (another reversed)[https://example.org]\n\n> Quote with [normal link](https://example.net)\n\n(Final reversed)[https://example.edu] at the end.',
    expectedViolations: 3,
    expectedLineNumbers: [3, 6, 10],
    expectedFixedMarkdown: '# Title\n\nThis paragraph has [reversed](https://example.com) link.\n\n- List item 1\n- List item with [another reversed](https://example.org)\n\n> Quote with [normal link](https://example.net)\n\n[Final reversed](https://example.edu) at the end.'
  }
];

// Run tests
testRule('MD011', rule, testCases);
