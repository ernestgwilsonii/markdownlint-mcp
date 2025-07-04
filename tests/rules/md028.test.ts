import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md028';

// Test cases for MD028
const testCases = [
  // Valid cases - no violations
  {
    name: '[Valid] Consecutive blockquotes without blank lines',
    markdown: '> This is a blockquote\n> This continues the blockquote\n> This is still part of the same blockquote',
    expectedViolations: 0
  },
  {
    name: '[Valid] Single blockquote',
    markdown: '> This is a single blockquote\n> with multiple lines\n> but no blank lines inside',
    expectedViolations: 0
  },
  {
    name: '[Valid] Blockquotes separated by non-blank content',
    markdown: '> First blockquote\n\nSome regular text\n\n> Second blockquote\n> continues here',
    expectedViolations: 0
  },
  {
    name: '[Valid] No blockquotes',
    markdown: 'This is regular text\n\nWith some paragraphs\n\nBut no blockquotes',
    expectedViolations: 0
  },
  {
    name: '[Valid] Empty document',
    markdown: '',
    expectedViolations: 0
  },
  {
    name: '[Valid] Blockquotes with nested content',
    markdown: '> This is a blockquote\n> \n> - With a list\n> - Inside it\n> \n> And more content',
    expectedViolations: 0
  },
  {
    name: '[Valid] Blockquotes with different indentation',
    markdown: '> Level 1\n>> Level 2\n>>> Level 3\n>> Back to level 2\n> Back to level 1',
    expectedViolations: 0
  },

  // Invalid cases - should have violations
  {
    name: '[Detection] Two blockquotes separated by blank line',
    markdown: '> First blockquote\n> continues here\n\n> Second blockquote\n> continues here too',
    expectedViolations: 1,
    expectedLineNumbers: [3]
  },
  {
    name: '[Detection] Multiple blockquotes with blank lines',
    markdown: '> First blockquote\n\n> Second blockquote\n\n> Third blockquote',
    expectedViolations: 2,
    expectedLineNumbers: [2, 4]
  },
  {
    name: '[Detection] Blockquote with blank line in middle',
    markdown: '> Start of blockquote\n> More content\n\n> Continuation after blank line',
    expectedViolations: 1,
    expectedLineNumbers: [3]
  },
  {
    name: '[Detection] Multiple blank lines between blockquotes',
    markdown: '> First blockquote\n\n\n> Second blockquote',
    expectedViolations: 2,
    expectedLineNumbers: [2, 3]
  },
  {
    name: '[Detection] Blank line between nested blockquotes',
    markdown: '> Outer blockquote\n>> Inner blockquote\n\n>> Another inner blockquote',
    expectedViolations: 1,
    expectedLineNumbers: [3]
  },
  {
    name: '[Detection] Complex case with multiple violations',
    markdown: '> First blockquote\n> continues\n\n> Second blockquote\n\n> Third blockquote\n> continues\n\n> Fourth blockquote',
    expectedViolations: 3,
    expectedLineNumbers: [3, 5, 8]
  },
  {
    name: '[Detection] Blockquote after content with blank line',
    markdown: 'Some text\n\n> First blockquote\n\n> Second blockquote',
    expectedViolations: 1,
    expectedLineNumbers: [4]
  },
  {
    name: '[Detection] Indented blockquotes with blank line',
    markdown: '  > First blockquote\n  > continues\n\n  > Second blockquote',
    expectedViolations: 1,
    expectedLineNumbers: [3]
  },

  // Edge cases
  {
    name: '[Detection] Blockquotes with whitespace-only blank line',
    markdown: '> First blockquote\n   \n> Second blockquote',
    expectedViolations: 0 // Whitespace-only lines are not considered "blank" in this context
  },
  {
    name: '[Detection] Mixed regular and nested blockquotes',
    markdown: '> Regular blockquote\n\n>> Nested blockquote\n\n> Back to regular',
    expectedViolations: 2,
    expectedLineNumbers: [2, 4]
  },
  {
    name: '[Detection] Blockquotes with empty content',
    markdown: '>\n> \n\n> Another blockquote',
    expectedViolations: 1,
    expectedLineNumbers: [3]
  },

  // Fix cases (should return unchanged since this is detection-only)
  {
    name: '[Fix] Detection-only rule returns unchanged content',
    markdown: '> First blockquote\n\n> Second blockquote',
    expectedViolations: 1,
    expectedFixedMarkdown: '> First blockquote\n\n> Second blockquote'
  },
  {
    name: '[Fix] Complex violation case unchanged',
    markdown: '> First\n\n> Second\n\n> Third',
    expectedViolations: 2,
    expectedFixedMarkdown: '> First\n\n> Second\n\n> Third'
  }
];

// Run tests
testRule('MD028', rule, testCases);
