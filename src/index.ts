#!/usr/bin/env node

import { createServer } from './server.js';
import logger, { LogLevel } from './utils/logger.js';

/**
 * Main entry point for the markdownlint-mcp server
 */
function main() {
  // Set logging level based on environment variable or default to INFO
  const logLevel = process.env.LOG_LEVEL || 'INFO';
  switch (logLevel.toUpperCase()) {
    case 'DEBUG':
      logger.setLogLevel(LogLevel.DEBUG);
      break;
    case 'INFO':
      logger.setLogLevel(LogLevel.INFO);
      break;
    case 'WARN':
      logger.setLogLevel(LogLevel.WARN);
      break;
    case 'ERROR':
      logger.setLogLevel(LogLevel.ERROR);
      break;
    case 'NONE':
      logger.setLogLevel(LogLevel.NONE);
      break;
    default:
      logger.setLogLevel(LogLevel.INFO);
  }

  // Create and start the server
  const server = createServer();
  
  // Start the server and handle any startup errors
  server.run().catch(error => {
    logger.error('Failed to start markdownlint MCP server', error);
    process.exit(1);
  });
}

// Execute the main function
main();
