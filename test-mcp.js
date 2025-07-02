import { spawn } from 'child_process';
import { promises as fs } from 'fs';

async function testMCPServer() {
  console.log('Testing MCP server directly...\n');
  
  // Test file path
  const testFile = './test.md';
  
  try {
    // Read original content
    const originalContent = await fs.readFile(testFile, 'utf8');
    console.log('Original file content:');
    console.log('---START---');
    console.log(originalContent);
    console.log('---END---\n');
    
    // Call our MCP server's fix function directly
    const mcp = spawn('node', ['dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Send MCP message to fix the file
    const fixRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'fix_markdown',
        arguments: {
          filePath: testFile,
          writeFile: true
        }
      }
    };
    
    mcp.stdin.write(JSON.stringify(fixRequest) + '\n');
    mcp.stdin.end();
    
    // Wait for response
    let output = '';
    mcp.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    mcp.on('close', async () => {
      console.log('MCP Response:', output);
      
      // Check if file was actually modified
      const newContent = await fs.readFile(testFile, 'utf8');
      console.log('\nFile content after fix:');
      console.log('---START---');
      console.log(newContent);
      console.log('---END---\n');
      
      if (originalContent !== newContent) {
        console.log('✅ SUCCESS: File was actually modified!');
      } else {
        console.log('❌ FAIL: File was not modified');
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testMCPServer();
