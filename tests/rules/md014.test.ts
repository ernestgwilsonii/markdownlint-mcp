import { testRule } from '../helpers/rule-test-helper';
import rule from '../../src/rules/md014';

// Test cases for MD014
const testCases = [
    // Valid cases - no violations
    {
      name: '[Valid] Commands with output - dollar signs are appropriate',
      markdown: 'Commands with output:\n\n```bash\n$ ls -la\ntotal 8\ndrwxr-xr-x 2 user user 4096 Jan 1 12:00 .\n$ echo "Hello"\nHello\n```',
      expectedViolations: 0
    },
    {
      name: '[Valid] Commands without dollar signs',
      markdown: 'Commands without dollar signs:\n\n```bash\nnpm install\nnpm test\nnpm run build\n```',
      expectedViolations: 0
    },
    {
      name: '[Valid] Mixed commands and output',
      markdown: 'Mixed commands and output:\n\n```sh\n$ git status\nOn branch main\nYour branch is up to date with \'origin/main\'.\n\n$ git add .\n$ git commit -m "Update"\n[main 1234567] Update\n 1 file changed, 1 insertion(+)\n```',
      expectedViolations: 0
    },
    {
      name: '[Valid] Non-shell code block',
      markdown: 'JavaScript code:\n\n```javascript\n$ console.log("This is not a shell command");\n$ const x = 5;\n```',
      expectedViolations: 0
    },
    {
      name: '[Valid] Python code block',
      markdown: 'Python code:\n\n```python\n$ print("This is not a shell command")\n$ x = 5\n```',
      expectedViolations: 0
    },
    {
      name: '[Valid] Empty code block',
      markdown: 'Empty code block:\n\n```bash\n```',
      expectedViolations: 0
    },
    {
      name: '[Valid] Code block with only empty lines',
      markdown: 'Code block with only empty lines:\n\n```bash\n\n   \n\n```',
      expectedViolations: 0
    },

    // Invalid cases - should have violations
    {
      name: '[Detection] Commands only with dollar signs - bash',
      markdown: 'Commands only:\n\n```bash\n$ npm install\n$ npm test\n$ npm run build\n```',
      expectedViolations: 3,
      expectedLineNumbers: [4, 5, 6]
    },
    {
      name: '[Detection] Commands only with dollar signs - sh',
      markdown: 'Commands only:\n\n```sh\n$ git add .\n$ git commit -m "Update"\n```',
      expectedViolations: 2,
      expectedLineNumbers: [4, 5]
    },
    {
      name: '[Detection] Commands only with dollar signs - shell',
      markdown: 'Commands only:\n\n```shell\n$ echo "Hello"\n$ ls -la\n```',
      expectedViolations: 2,
      expectedLineNumbers: [4, 5]
    },
    {
      name: '[Detection] Commands only with dollar signs - no language specified',
      markdown: 'Commands only:\n\n```\n$ cd /home\n$ pwd\n```',
      expectedViolations: 2,
      expectedLineNumbers: [4, 5]
    },
    {
      name: '[Detection] Commands with empty lines',
      markdown: 'Commands with empty lines:\n\n```bash\n$ npm install\n\n$ npm test\n   \n$ npm run build\n```',
      expectedViolations: 3,
      expectedLineNumbers: [4, 6, 8]
    },
    {
      name: '[Detection] Commands with indentation',
      markdown: 'Commands with indentation:\n\n```bash\n  $ npm install\n    $ npm test\n```',
      expectedViolations: 2,
      expectedLineNumbers: [4, 5]
    },
    {
      name: '[Detection] Single command with dollar sign',
      markdown: 'Single command:\n\n```bash\n$ echo "Hello World"\n```',
      expectedViolations: 1,
      expectedLineNumbers: [4]
    },
    {
      name: '[Detection] Commands with zsh',
      markdown: 'Commands with zsh:\n\n```zsh\n$ source ~/.zshrc\n$ which zsh\n```',
      expectedViolations: 2,
      expectedLineNumbers: [4, 5]
    },

    // Fix cases
    {
      name: '[Fix] Commands only with dollar signs - bash',
      markdown: 'Commands only:\n\n```bash\n$ npm install\n$ npm test\n$ npm run build\n```',
      expectedViolations: 3,
      expectedFixedMarkdown: 'Commands only:\n\n```bash\nnpm install\nnpm test\nnpm run build\n```'
    },
    {
      name: '[Fix] Commands with indentation',
      markdown: 'Commands with indentation:\n\n```bash\n  $ npm install\n    $ npm test\n```',
      expectedViolations: 2,
      expectedFixedMarkdown: 'Commands with indentation:\n\n```bash\n  npm install\n    npm test\n```'
    },
    {
      name: '[Fix] Commands with empty lines preserved',
      markdown: 'Commands with empty lines:\n\n```bash\n$ npm install\n\n$ npm test\n   \n$ npm run build\n```',
      expectedViolations: 3,
      expectedFixedMarkdown: 'Commands with empty lines:\n\n```bash\nnpm install\n\nnpm test\n   \nnpm run build\n```'
    },
    {
      name: '[Fix] Single command with dollar sign',
      markdown: 'Single command:\n\n```bash\n$ echo "Hello World"\n```',
      expectedViolations: 1,
      expectedFixedMarkdown: 'Single command:\n\n```bash\necho "Hello World"\n```'
    },
    {
      name: '[Fix] Commands with mixed languages - only bash gets fixed',
      markdown: 'Multiple code blocks:\n\n```bash\n$ npm install\n$ npm test\n```\n\n```javascript\n$ console.log("Not a shell command");\n```\n\n```sh\n$ git status\n```',
      expectedViolations: 3,
      expectedFixedMarkdown: 'Multiple code blocks:\n\n```bash\nnpm install\nnpm test\n```\n\n```javascript\n$ console.log("Not a shell command");\n```\n\n```sh\ngit status\n```'
    },
    {
      name: '[Fix] No language specified',
      markdown: 'Commands without language:\n\n```\n$ cd /home\n$ pwd\n```',
      expectedViolations: 2,
      expectedFixedMarkdown: 'Commands without language:\n\n```\ncd /home\npwd\n```'
    }
];

// Run tests
testRule('MD014', rule, testCases);
