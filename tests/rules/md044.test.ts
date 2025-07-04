import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md044';

// Test cases for MD044
const testCases = [
  // Valid cases - no violations
  {
    name: '[Valid] No configuration provided',
    markdown: 'This is a test with javascript and react components.',
    config: {},
    expectedViolations: 0
  },
  {
    name: '[Valid] Empty names configuration',
    markdown: 'This is a test with javascript and react components.',
    config: { names: [] },
    expectedViolations: 0
  },
  {
    name: '[Valid] Proper names correctly capitalized',
    markdown: 'This project uses JavaScript and React components.',
    config: { names: ['JavaScript', 'React'] },
    expectedViolations: 0
  },
  {
    name: '[Valid] Multiple proper names correctly capitalized',
    markdown: 'The project uses JavaScript, React, Node.js, and TypeScript.',
    config: { names: ['JavaScript', 'React', 'Node.js', 'TypeScript'] },
    expectedViolations: 0
  },
  {
    name: '[Valid] Proper names in different contexts',
    markdown: 'JavaScript is great. I love JavaScript! What about JavaScript?',
    config: { names: ['JavaScript'] },
    expectedViolations: 0
  },
  {
    name: '[Valid] Proper names with punctuation',
    markdown: 'The JavaScript library works well. JavaScript-based solutions are popular.',
    config: { names: ['JavaScript'] },
    expectedViolations: 0
  },
  {
    name: '[Valid] Proper names in code blocks (ignored by default)',
    markdown: 'JavaScript is great.\n\n```javascript\nconst javascript = "test";\n```',
    config: { names: ['JavaScript'] },
    expectedViolations: 0
  },
  {
    name: '[Valid] Proper names in indented code blocks (ignored by default)',
    markdown: 'JavaScript is great.\n\n    const javascript = "test";',
    config: { names: ['JavaScript'] },
    expectedViolations: 0
  },
  {
    name: '[Valid] Mixed case proper names',
    markdown: 'The jQuery library and iOS app work together.',
    config: { names: ['jQuery', 'iOS'] },
    expectedViolations: 0
  },
  {
    name: '[Valid] Word boundaries respected',
    markdown: 'JavaScript and superjavascript are different words.',
    config: { names: ['JavaScript'] },
    expectedViolations: 0
  },

  // Invalid cases - should have violations
  {
    name: '[Detection] Single proper name incorrect',
    markdown: 'This project uses javascript components.',
    config: { names: ['JavaScript'] },
    expectedViolations: 1,
    expectedLineNumbers: [1]
  },
  {
    name: '[Detection] Multiple proper names incorrect',
    markdown: 'This project uses javascript and react components.',
    config: { names: ['JavaScript', 'React'] },
    expectedViolations: 2,
    expectedLineNumbers: [1, 1]
  },
  {
    name: '[Detection] Mixed correct and incorrect',
    markdown: 'This project uses JavaScript and react components.',
    config: { names: ['JavaScript', 'React'] },
    expectedViolations: 1,
    expectedLineNumbers: [1]
  },
  {
    name: '[Detection] Multiple occurrences of same name',
    markdown: 'javascript is great. I love javascript!',
    config: { names: ['JavaScript'] },
    expectedViolations: 2,
    expectedLineNumbers: [1, 1]
  },
  {
    name: '[Detection] Different case variations',
    markdown: 'javascript, Javascript, JAVASCRIPT, and JaVaScRiPt are all wrong.',
    config: { names: ['JavaScript'] },
    expectedViolations: 4,
    expectedLineNumbers: [1, 1, 1, 1]
  },
  {
    name: '[Detection] Proper names in different lines',
    markdown: 'This uses javascript.\n\nReact is also used here.\n\nMore javascript content.',
    config: { names: ['JavaScript', 'React'] },
    expectedViolations: 2,
    expectedLineNumbers: [1, 5]
  },
  {
    name: '[Detection] Complex proper names',
    markdown: 'node.js and jquery are commonly used.',
    config: { names: ['Node.js', 'jQuery'] },
    expectedViolations: 2,
    expectedLineNumbers: [1, 1]
  },
  {
    name: '[Detection] Proper names with code_blocks disabled',
    markdown: 'JavaScript is great.\n\n```javascript\nconst javascript = "test";\n```',
    config: { names: ['JavaScript'], code_blocks: false },
    expectedViolations: 1,
    expectedLineNumbers: [4]
  },
  {
    name: '[Detection] Case sensitivity important',
    markdown: 'ios and JQUERY need proper capitalization.',
    config: { names: ['iOS', 'jQuery'] },
    expectedViolations: 2,
    expectedLineNumbers: [1, 1]
  },
  {
    name: '[Detection] Proper names in headings',
    markdown: '# Using javascript\n\n## React Components\n\n### node.js Setup',
    config: { names: ['JavaScript', 'React', 'Node.js'] },
    expectedViolations: 2,
    expectedLineNumbers: [1, 5]
  },

  // Fix cases - should be fixed
  {
    name: '[Fix] Single proper name fixed',
    markdown: 'This project uses javascript components.',
    config: { names: ['JavaScript'] },
    expectedViolations: 1,
    expectedFixedMarkdown: 'This project uses JavaScript components.'
  },
  {
    name: '[Fix] Multiple proper names fixed',
    markdown: 'This project uses javascript and react components.',
    config: { names: ['JavaScript', 'React'] },
    expectedViolations: 2,
    expectedFixedMarkdown: 'This project uses JavaScript and React components.'
  },
  {
    name: '[Fix] Mixed correct and incorrect fixed',
    markdown: 'This project uses JavaScript and react components.',
    config: { names: ['JavaScript', 'React'] },
    expectedViolations: 1,
    expectedFixedMarkdown: 'This project uses JavaScript and React components.'
  },
  {
    name: '[Fix] Multiple occurrences fixed',
    markdown: 'javascript is great. I love javascript!',
    config: { names: ['JavaScript'] },
    expectedViolations: 2,
    expectedFixedMarkdown: 'JavaScript is great. I love JavaScript!'
  },
  {
    name: '[Fix] Different case variations fixed',
    markdown: 'javascript, Javascript, JAVASCRIPT, and JaVaScRiPt are all wrong.',
    config: { names: ['JavaScript'] },
    expectedViolations: 4,
    expectedFixedMarkdown: 'JavaScript, JavaScript, JavaScript, and JavaScript are all wrong.'
  },
  {
    name: '[Fix] Multiple lines fixed',
    markdown: 'This uses javascript.\n\nReact is also used here.\n\nMore javascript content.',
    config: { names: ['JavaScript', 'React'] },
    expectedViolations: 2,
    expectedFixedMarkdown: 'This uses JavaScript.\n\nReact is also used here.\n\nMore JavaScript content.'
  },
  {
    name: '[Fix] Complex proper names fixed',
    markdown: 'node.js and jquery are commonly used.',
    config: { names: ['Node.js', 'jQuery'] },
    expectedViolations: 2,
    expectedFixedMarkdown: 'Node.js and jQuery are commonly used.'
  },
  {
    name: '[Fix] Proper names in headings fixed',
    markdown: '# Using javascript\n\n## React Components\n\n### node.js Setup',
    config: { names: ['JavaScript', 'React', 'Node.js'] },
    expectedViolations: 2,
    expectedFixedMarkdown: '# Using JavaScript\n\n## React Components\n\n### Node.js Setup'
  },
  {
    name: '[Fix] Code blocks ignored during fix',
    markdown: 'JavaScript is great.\n\n```javascript\nconst javascript = "test";\n```',
    config: { names: ['JavaScript'] },
    expectedViolations: 0,
    expectedFixedMarkdown: 'JavaScript is great.\n\n```javascript\nconst javascript = "test";\n```'
  },
  {
    name: '[Fix] Indented code blocks ignored during fix',
    markdown: 'JavaScript is great.\n\n    const javascript = "test";',
    config: { names: ['JavaScript'] },
    expectedViolations: 0,
    expectedFixedMarkdown: 'JavaScript is great.\n\n    const javascript = "test";'
  },
  {
    name: '[Fix] Code blocks included when disabled',
    markdown: 'JavaScript is great.\n\n```javascript\nconst javascript = "test";\n```',
    config: { names: ['JavaScript'], code_blocks: false },
    expectedViolations: 1,
    expectedFixedMarkdown: 'JavaScript is great.\n\n```javascript\nconst JavaScript = "test";\n```'
  },

  // Edge cases
  {
    name: '[Detection] Empty proper name in config',
    markdown: 'This has some text.',
    config: { names: [''] },
    expectedViolations: 0
  },
  {
    name: '[Detection] Null configuration',
    markdown: 'javascript and react here.',
    config: null,
    expectedViolations: 0
  },
  {
    name: '[Detection] Configuration with null names',
    markdown: 'javascript and react here.',
    config: { names: null },
    expectedViolations: 0
  },
  {
    name: '[Detection] Configuration with undefined names',
    markdown: 'javascript and react here.',
    config: { names: undefined },
    expectedViolations: 0
  },
  {
    name: '[Detection] Word boundaries respected in detection',
    markdown: 'superjavascript and javascriptlike are not JavaScript.',
    config: { names: ['JavaScript'] },
    expectedViolations: 0
  },
  {
    name: '[Detection] Proper names with special characters',
    markdown: 'c++ and c# are programming languages.',
    config: { names: ['C++', 'C#'] },
    expectedViolations: 2,
    expectedLineNumbers: [1, 1]
  },
  {
    name: '[Fix] Proper names with special characters fixed',
    markdown: 'c++ and c# are programming languages.',
    config: { names: ['C++', 'C#'] },
    expectedViolations: 2,
    expectedFixedMarkdown: 'C++ and C# are programming languages.'
  },
  {
    name: '[Detection] Complex code block detection',
    markdown: 'JavaScript is great.\n\n```js\njavascript code here\n```\n\nMore javascript text.',
    config: { names: ['JavaScript'] },
    expectedViolations: 1,
    expectedLineNumbers: [7]
  },
  {
    name: '[Fix] Complex code block fix',
    markdown: 'JavaScript is great.\n\n```js\njavascript code here\n```\n\nMore javascript text.',
    config: { names: ['JavaScript'] },
    expectedViolations: 1,
    expectedFixedMarkdown: 'JavaScript is great.\n\n```js\njavascript code here\n```\n\nMore JavaScript text.'
  },
  {
    name: '[Detection] Fenced code blocks with tildes',
    markdown: 'JavaScript is great.\n\n~~~js\njavascript code here\n~~~\n\nMore javascript text.',
    config: { names: ['JavaScript'] },
    expectedViolations: 1,
    expectedLineNumbers: [7]
  },
  {
    name: '[Fix] Multiple proper names in single line',
    markdown: 'Using javascript, react, node.js, and typescript together.',
    config: { names: ['JavaScript', 'React', 'Node.js', 'TypeScript'] },
    expectedViolations: 4,
    expectedFixedMarkdown: 'Using JavaScript, React, Node.js, and TypeScript together.'
  }
];

// Run tests
testRule('MD044', rule, testCases);
