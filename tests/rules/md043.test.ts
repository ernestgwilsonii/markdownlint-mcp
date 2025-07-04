import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md043';

// Test cases for MD043
const testCases = [
  // Valid cases - no violations
  {
    name: '[Valid] No configuration provided',
    markdown: '# First Heading\n\n## Second Heading\n\n### Third Heading',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Valid] Empty headings configuration',
    markdown: '# First Heading\n\n## Second Heading\n\n### Third Heading',
    config: { headings: [] },
    expectedViolations: 0
  },
  {
    name: '[Valid] Document matches expected structure exactly',
    markdown: '# Introduction\n\n## Getting Started\n\n## Configuration\n\n### Basic Setup\n\n### Advanced Setup\n\n## Conclusion',
    config: { headings: ['Introduction', 'Getting Started', 'Configuration', 'Basic Setup', 'Advanced Setup', 'Conclusion'] },
    expectedViolations: 0
  },
  {
    name: '[Valid] Single heading matches expected',
    markdown: '# Welcome',
    config: { headings: ['Welcome'] },
    expectedViolations: 0
  },
  {
    name: '[Valid] No headings and no expected structure',
    markdown: 'This is just regular text\n\nWith some paragraphs\n\nBut no headings',
    config: { headings: [] },
    expectedViolations: 0
  },
  {
    name: '[Valid] Headings with punctuation match expected',
    markdown: '# What is This?\n\n## How Does It Work?\n\n## Why Use It?',
    config: { headings: ['What is This?', 'How Does It Work?', 'Why Use It?'] },
    expectedViolations: 0
  },
  {
    name: '[Valid] Closed atx headings match expected',
    markdown: '# Introduction #\n\n## Setup ##\n\n## Usage ##',
    config: { headings: ['Introduction', 'Setup', 'Usage'] },
    expectedViolations: 0
  },

  // Invalid cases - should have violations
  {
    name: '[Detection] Missing expected heading',
    markdown: '# Introduction\n\n## Getting Started',
    config: { headings: ['Introduction', 'Getting Started', 'Configuration'] },
    expectedViolations: 1,
    expectedLineNumbers: [3]
  },
  {
    name: '[Detection] Extra heading not in expected structure',
    markdown: '# Introduction\n\n## Getting Started\n\n## Unexpected Section',
    config: { headings: ['Introduction', 'Getting Started'] },
    expectedViolations: 1,
    expectedLineNumbers: [5]
  },
  {
    name: '[Detection] Wrong heading text',
    markdown: '# Introduction\n\n## Wrong Title',
    config: { headings: ['Introduction', 'Getting Started'] },
    expectedViolations: 1,
    expectedLineNumbers: [3]
  },
  {
    name: '[Detection] Multiple violations - missing and wrong',
    markdown: '# Introduction\n\n## Wrong Title\n\n## Another Wrong Title',
    config: { headings: ['Introduction', 'Getting Started', 'Configuration', 'Conclusion'] },
    expectedViolations: 3,
    expectedLineNumbers: [3, 5, 5]
  },
  {
    name: '[Detection] Document has no headings but structure expected',
    markdown: 'This is just regular text\n\nWith some paragraphs',
    config: { headings: ['Introduction', 'Getting Started'] },
    expectedViolations: 2,
    expectedLineNumbers: [1, 1]
  },
  {
    name: '[Detection] Complex mismatch scenario',
    markdown: '# Wrong First\n\n## Correct Second\n\n## Wrong Third\n\n## Extra Fourth',
    config: { headings: ['Introduction', 'Correct Second', 'Configuration'] },
    expectedViolations: 3,
    expectedLineNumbers: [1, 5, 7]
  },
  {
    name: '[Detection] Heading text case sensitivity',
    markdown: '# introduction\n\n## getting started',
    config: { headings: ['Introduction', 'Getting Started'] },
    expectedViolations: 2,
    expectedLineNumbers: [1, 3]
  },
  {
    name: '[Detection] Heading with different levels but same text',
    markdown: '# Introduction\n\n### Getting Started',
    config: { headings: ['Introduction', 'Getting Started'] },
    expectedViolations: 0 // MD043 only cares about text, not level
  },

  // Edge cases
  {
    name: '[Detection] Empty heading in document',
    markdown: '# Introduction\n\n## \n\n## Configuration',
    config: { headings: ['Introduction', 'Getting Started', 'Configuration'] },
    expectedViolations: 1,
    expectedLineNumbers: [3]
  },
  {
    name: '[Detection] Heading with only whitespace',
    markdown: '# Introduction\n\n##    \n\n## Configuration',
    config: { headings: ['Introduction', 'Getting Started', 'Configuration'] },
    expectedViolations: 1,
    expectedLineNumbers: [3]
  },
  {
    name: '[Detection] Mixed atx and closed atx headings',
    markdown: '# Introduction\n\n## Getting Started ##\n\n## Configuration',
    config: { headings: ['Introduction', 'Getting Started', 'Configuration'] },
    expectedViolations: 0
  },
  {
    name: '[Detection] Headings with trailing spaces',
    markdown: '# Introduction   \n\n## Getting Started   \n\n## Configuration   ',
    config: { headings: ['Introduction', 'Getting Started', 'Configuration'] },
    expectedViolations: 0
  },
  {
    name: '[Detection] Document with only high-level headings',
    markdown: '# First\n\n# Second\n\n# Third',
    config: { headings: ['First', 'Second', 'Third'] },
    expectedViolations: 0
  },
  {
    name: '[Detection] Document with only low-level headings',
    markdown: '#### First\n\n##### Second\n\n###### Third',
    config: { headings: ['First', 'Second', 'Third'] },
    expectedViolations: 0
  },

  // Configuration edge cases
  {
    name: '[Detection] Null configuration',
    markdown: '# Any Heading',
    config: null,
    expectedViolations: 0
  },
  {
    name: '[Detection] Configuration with null headings',
    markdown: '# Any Heading',
    config: { headings: null },
    expectedViolations: 0
  },
  {
    name: '[Detection] Configuration with undefined headings',
    markdown: '# Any Heading',
    config: { headings: undefined },
    expectedViolations: 0
  },

  // Fix cases (should return unchanged since this is detection-only)
  {
    name: '[Fix] Detection-only rule returns unchanged content',
    markdown: '# Wrong Title\n\n## Another Wrong Title',
    config: { headings: ['Introduction', 'Getting Started'] },
    expectedViolations: 2,
    expectedFixedMarkdown: '# Wrong Title\n\n## Another Wrong Title'
  },
  {
    name: '[Fix] Complex violation case unchanged',
    markdown: '# Introduction\n\n## Wrong Section\n\n## Extra Section',
    config: { headings: ['Introduction', 'Getting Started'] },
    expectedViolations: 2,
    expectedFixedMarkdown: '# Introduction\n\n## Wrong Section\n\n## Extra Section'
  },
  {
    name: '[Fix] Missing headings case unchanged',
    markdown: '# Introduction',
    config: { headings: ['Introduction', 'Getting Started', 'Configuration'] },
    expectedViolations: 2,
    expectedFixedMarkdown: '# Introduction'
  }
];

// Run tests
testRule('MD043', rule, testCases);
