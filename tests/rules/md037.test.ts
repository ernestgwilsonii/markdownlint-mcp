/**
 * Tests for MD037: Spaces inside emphasis markers
 */
import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md037';

// Test cases for MD037
const testCases = [
  // Valid cases
  {
    name: 'Valid bold text without spaces',
    markdown: 'This is **bold** text',
    expectedViolations: 0
  },
  {
    name: 'Valid italic text without spaces',
    markdown: 'This is *italic* text',
    expectedViolations: 0
  },
  {
    name: 'Valid underscore bold without spaces',
    markdown: 'This is __bold__ text',
    expectedViolations: 0
  },
  {
    name: 'Valid underscore italic without spaces',
    markdown: 'This is _italic_ text',
    expectedViolations: 0
  },
  {
    name: 'Valid mixed emphasis without spaces',
    markdown: 'This has **bold** and *italic* and __underscore bold__ and _underscore italic_ text',
    expectedViolations: 0
  },
  
  // Invalid cases
  {
    name: 'Bold text with spaces inside markers',
    markdown: 'This is ** bold ** text',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This is **bold** text'
  },
  {
    name: 'Italic text with spaces inside markers',
    markdown: 'This is * italic * text',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This is *italic* text'
  },
  {
    name: 'Underscore bold with spaces inside markers',
    markdown: 'This is __ bold __ text',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This is __bold__ text'
  },
  {
    name: 'Underscore italic with spaces inside markers',
    markdown: 'This is _ italic _ text',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This is _italic_ text'
  },
  {
    name: 'Multiple emphasis violations on one line',
    markdown: 'Text with ** bold ** and * italic * violations',
    expectedViolations: 2,
    expectedLineNumbers: [1, 1],
    expectedFixedMarkdown: 'Text with **bold** and *italic* violations'
  },
  {
    name: 'Mixed valid and invalid emphasis',
    markdown: '**Valid bold** and ** invalid bold ** on same line',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: '**Valid bold** and **invalid bold** on same line'
  },
  {
    name: 'Multiple lines with violations',
    markdown: 'Line 1 has ** bold spaces **\nLine 2 has * italic spaces *',
    expectedViolations: 2,
    expectedLineNumbers: [1, 2],
    expectedFixedMarkdown: 'Line 1 has **bold spaces**\nLine 2 has *italic spaces*'
  },
  
  // Edge cases
  {
    name: 'Empty document',
    markdown: '',
    expectedViolations: 0
  },
  {
    name: 'Document with no emphasis',
    markdown: 'This is just regular text\nWith no emphasis markers at all',
    expectedViolations: 0
  },
  {
    name: 'Asterisks not used for emphasis',
    markdown: 'Math: 2*3*4 = 24\nThis should not trigger the rule',
    expectedViolations: 0
  },
  {
    name: 'Incomplete emphasis markers',
    markdown: 'This has * only one asterisk\nAnd this has ** only two',
    expectedViolations: 0
  },
  {
    name: 'Nested emphasis without spaces',
    markdown: 'This has ***bold italic*** text',
    expectedViolations: 0
  },
  {
    name: 'Emphasis with leading space only',
    markdown: 'This has ** bold with leading space**',
    expectedViolations: 1,
    expectedLineNumbers: [1],
    expectedFixedMarkdown: 'This has **bold with leading space**'
  }
];

// Run tests
testRule('MD037', rule, testCases);
