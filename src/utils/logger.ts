/**
 * Logger utility for consistent logging throughout the application
 */

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

/**
 * Current log level (can be changed at runtime)
 */
let currentLogLevel: LogLevel = LogLevel.INFO;

/**
 * Set the current log level
 * @param level Log level to set
 */
export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level;
}

/**
 * Get the current log level
 * @returns The current log level
 */
export function getLogLevel(): LogLevel {
  return currentLogLevel;
}

/**
 * Log a debug message (only displayed if log level is DEBUG)
 * @param message Message to log
 * @param meta Optional metadata to include
 */
export function debug(message: string, meta?: any): void {
  if (currentLogLevel <= LogLevel.DEBUG) {
    console.debug(`[DEBUG] ${message}`, meta ? meta : '');
  }
}

/**
 * Log an info message (displayed if log level is INFO or lower)
 * @param message Message to log
 * @param meta Optional metadata to include
 */
export function info(message: string, meta?: any): void {
  if (currentLogLevel <= LogLevel.INFO) {
    console.info(`[INFO] ${message}`, meta ? meta : '');
  }
}

/**
 * Log a warning message (displayed if log level is WARN or lower)
 * @param message Message to log
 * @param meta Optional metadata to include
 */
export function warn(message: string, meta?: any): void {
  if (currentLogLevel <= LogLevel.WARN) {
    console.warn(`[WARN] ${message}`, meta ? meta : '');
  }
}

/**
 * Log an error message (displayed if log level is ERROR or lower)
 * @param message Message to log
 * @param error Optional error to include
 */
export function error(message: string, error?: any): void {
  if (currentLogLevel <= LogLevel.ERROR) {
    console.error(`[ERROR] ${message}`, error ? error : '');
  }
}

/**
 * Default export for the logger
 */
export default {
  setLogLevel,
  getLogLevel,
  debug,
  info,
  warn,
  error,
  LogLevel
};
