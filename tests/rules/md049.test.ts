import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md049';

// Test cases for MD049
const testCases = [
  // Valid cases - no violations
  {
    name: '[Valid] No emphasis markers',
    markdown: 'This is plain text without any emphasis.',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Valid] Asterisk emphasis with default config',
    markdown: 'This is *emphasized* text with *multiple* emphases.',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Valid] Asterisk emphasis with explicit asterisk config',
    markdown: 'This is *emphasized* text with *multiple* emphases.',
    config: { style: 'asterisk' },
    expectedViolations: 0
  },
  {
    name: '[Valid] Underscore emphasis with underscore config',
    markdown: 'This is _emphasized_ text with _multiple_ emphases.',
    config: { style: 'underscore' },
    expectedViolations: 0
  },
  {
    name: '[Valid] Bold text should not be affected',
    markdown: 'This is **bold** text and __also bold__.',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Valid] Mixed bold and correct emphasis',
    markdown: 'This is **bold** and this is *emphasized*.',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Valid] Emphasis in code spans ignored',
    markdown: 'This is `_not emphasized_` and `*also not emphasized*`.',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Valid] Emphasis in code blocks ignored',
    markdown: 'Regular text\n\n```\n_emphasized in code_\n*also emphasized in code*\n```',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Valid] Emphasis in indented code blocks ignored',
    markdown: 'Regular text\n\n    _emphasized in code_\n    *also emphasized in code*',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Valid] Single character emphasis',
    markdown: 'This is *a* single character emphasis.',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Valid] Multiple lines with consistent emphasis',
    markdown: 'This is *emphasized* text.\n\nThis is *also emphasized* text.',
    config: {},
    expectedViolations: 0
  },

  // Invalid cases - should have violations
  {
    name: '[Detection] Underscore emphasis with default config',
    markdown: 'This is _emphasized_ text.',
    config: {},
    expectedViolations: 1,
    expectedLineNumbers: [1]
  },
  {
    name: '[Detection] Underscore emphasis with explicit asterisk config',
    markdown: 'This is _emphasized_ text.',
    config: { style: 'asterisk' },
    expectedViolations: 1,
    expectedLineNumbers: [1]
  },
  {
    name: '[Detection] Asterisk emphasis with underscore config',
    markdown: 'This is *emphasized* text.',
    config: { style: 'underscore' },
    expectedViolations: 1,
    expectedLineNumbers: [1]
  },
  {
    name: '[Detection] Multiple underscore emphasis with default config',
    markdown: 'This is _emphasized_ and this is _also emphasized_.',
    config: {},
    expectedViolations: 2,
    expectedLineNumbers: [1, 1]
  },
  {
    name: '[Detection] Multiple asterisk emphasis with underscore config',
    markdown: 'This is *emphasized* and this is *also emphasized*.',
    config: { style: 'underscore' },
    expectedViolations: 2,
    expectedLineNumbers: [1, 1]
  },
  {
    name: '[Detection] Mixed emphasis styles with default config',
    markdown: 'This is *correct* but this is _incorrect_.',
    config: {},
    expectedViolations: 1,
    expectedLineNumbers: [1]
  },
  {
    name: '[Detection] Mixed emphasis styles with underscore config',
    markdown: 'This is _correct_ but this is *incorrect*.',
    config: { style: 'underscore' },
    expectedViolations: 1,
    expectedLineNumbers: [1]
  },
  {
    name: '[Detection] Emphasis across multiple lines',
    markdown: 'This is _emphasized_ text.\n\nThis is _also emphasized_ text.',
    config: {},
    expectedViolations: 2,
    expectedLineNumbers: [1, 3]
  },
  {
    name: '[Detection] Emphasis with punctuation',
    markdown: 'This is _emphasized,_ and this is _emphasized!_',
    config: {},
    expectedViolations: 2,
    expectedLineNumbers: [1, 1]
  },
  {
    name: '[Detection] Emphasis in headings',
    markdown: '# This is a heading with _emphasis_',
    config: {},
    expectedViolations: 1,
    expectedLineNumbers: [1]
  },

  // Fix cases - should be fixed
  {
    name: '[Fix] Single underscore emphasis to asterisk',
    markdown: 'This is _emphasized_ text.',
    config: {},
    expectedViolations: 1,
    expectedFixedMarkdown: 'This is *emphasized* text.'
  },
  {
    name: '[Fix] Multiple underscore emphasis to asterisk',
    markdown: 'This is _emphasized_ and this is _also emphasized_.',
    config: {},
    expectedViolations: 2,
    expectedFixedMarkdown: 'This is *emphasized* and this is *also emphasized*.'
  },
  {
    name: '[Fix] Single asterisk emphasis to underscore',
    markdown: 'This is *emphasized* text.',
    config: { style: 'underscore' },
    expectedViolations: 1,
    expectedFixedMarkdown: 'This is _emphasized_ text.'
  },
  {
    name: '[Fix] Multiple asterisk emphasis to underscore',
    markdown: 'This is *emphasized* and this is *also emphasized*.',
    config: { style: 'underscore' },
    expectedViolations: 2,
    expectedFixedMarkdown: 'This is _emphasized_ and this is _also emphasized_.'
  },
  {
    name: '[Fix] Mixed emphasis styles to asterisk',
    markdown: 'This is *correct* but this is _incorrect_.',
    config: {},
    expectedViolations: 1,
    expectedFixedMarkdown: 'This is *correct* but this is *incorrect*.'
  },
  {
    name: '[Fix] Mixed emphasis styles to underscore',
    markdown: 'This is _correct_ but this is *incorrect*.',
    config: { style: 'underscore' },
    expectedViolations: 1,
    expectedFixedMarkdown: 'This is _correct_ but this is _incorrect_.'
  },
  {
    name: '[Fix] Emphasis across multiple lines',
    markdown: 'This is _emphasized_ text.\n\nThis is _also emphasized_ text.',
    config: {},
    expectedViolations: 2,
    expectedFixedMarkdown: 'This is *emphasized* text.\n\nThis is *also emphasized* text.'
  },
  {
    name: '[Fix] Emphasis with bold text preserved',
    markdown: 'This is **bold** and this is _emphasized_.',
    config: {},
    expectedViolations: 1,
    expectedFixedMarkdown: 'This is **bold** and this is *emphasized*.'
  },
  {
    name: '[Fix] Emphasis with punctuation',
    markdown: 'This is _emphasized,_ and this is _emphasized!_',
    config: {},
    expectedViolations: 2,
    expectedFixedMarkdown: 'This is *emphasized,* and this is *emphasized!*'
  },
  {
    name: '[Fix] Emphasis in headings',
    markdown: '# This is a heading with _emphasis_',
    config: {},
    expectedViolations: 1,
    expectedFixedMarkdown: '# This is a heading with *emphasis*'
  },
  {
    name: '[Fix] Code spans preserved during fix',
    markdown: 'This is _emphasized_ but `_this is not_`.',
    config: {},
    expectedViolations: 1,
    expectedFixedMarkdown: 'This is *emphasized* but `_this is not_`.'
  },
  {
    name: '[Fix] Code blocks preserved during fix',
    markdown: 'This is _emphasized_ text.\n\n```\n_this is not emphasized_\n```',
    config: {},
    expectedViolations: 1,
    expectedFixedMarkdown: 'This is *emphasized* text.\n\n```\n_this is not emphasized_\n```'
  },
  {
    name: '[Fix] Single character emphasis',
    markdown: 'This is _a_ single character emphasis.',
    config: {},
    expectedViolations: 1,
    expectedFixedMarkdown: 'This is *a* single character emphasis.'
  },

  // Edge cases
  {
    name: '[Detection] Empty emphasis markers',
    markdown: 'This has __ empty emphasis and ** empty bold.',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Detection] Unmatched emphasis markers',
    markdown: 'This has _unmatched emphasis and *also unmatched.',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Detection] Emphasis with spaces',
    markdown: 'This is _ not emphasized _ and * also not emphasized *.',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Detection] Nested emphasis markers',
    markdown: 'This is *_not properly nested_* emphasis.',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Detection] Emphasis at line boundaries',
    markdown: '_emphasized at start_ and _emphasized at end_',
    config: {},
    expectedViolations: 2,
    expectedLineNumbers: [1, 1]
  },
  {
    name: '[Fix] Emphasis at line boundaries',
    markdown: '_emphasized at start_ and _emphasized at end_',
    config: {},
    expectedViolations: 2,
    expectedFixedMarkdown: '*emphasized at start* and *emphasized at end*'
  },
  {
    name: '[Detection] Complex markdown with mixed emphasis',
    markdown: '# Heading with _emphasis_\n\n- List item with *emphasis*\n- Another item with _emphasis_\n\n> Blockquote with *emphasis*',
    config: {},
    expectedViolations: 2,
    expectedLineNumbers: [1, 4]
  },
  {
    name: '[Fix] Complex markdown with mixed emphasis',
    markdown: '# Heading with _emphasis_\n\n- List item with *emphasis*\n- Another item with _emphasis_\n\n> Blockquote with *emphasis*',
    config: {},
    expectedViolations: 2,
    expectedFixedMarkdown: '# Heading with *emphasis*\n\n- List item with *emphasis*\n- Another item with *emphasis*\n\n> Blockquote with *emphasis*'
  },
  {
    name: '[Detection] Emphasis with numbers and special chars',
    markdown: 'This is _test123_ and this is _test-case_.',
    config: {},
    expectedViolations: 2,
    expectedLineNumbers: [1, 1]
  },
  {
    name: '[Fix] Emphasis with numbers and special chars',
    markdown: 'This is _test123_ and this is _test-case_.',
    config: {},
    expectedViolations: 2,
    expectedFixedMarkdown: 'This is *test123* and this is *test-case*.'
  },
  {
    name: '[Detection] No config should use default style',
    markdown: 'This is _wrong_ emphasis.',
    config: null,
    expectedViolations: 1,
    expectedLineNumbers: [1]
  },
  {
    name: '[Fix] No config should use default style',
    markdown: 'This is _wrong_ emphasis.',
    config: null,
    expectedViolations: 1,
    expectedFixedMarkdown: 'This is *wrong* emphasis.'
  }
];

// Run tests
testRule('MD049', rule, testCases);
