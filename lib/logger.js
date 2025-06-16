import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';

// Log directory setup
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Custom color scheme
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
  command: 'cyan'
};

// Custom format for console
const consoleFormat = format.printf(({ level, message, timestamp, stack }) => {
  const color = chalk[logColors[level]] || chalk.white;
  let logMsg = `${chalk.gray(timestamp)} ${color.bold(level.toUpperCase())} ${message}`;
  if (stack) logMsg += `\n${chalk.red(stack)}`;
  return logMsg;
});

// Custom format for files
const fileFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.json()
);

// Command-specific logger
const commandTransport = new DailyRotateFile({
  filename: path.join(logDir, 'commands-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ message }) => {
      return `[${new Date().toISOString()}] COMMAND: ${message}`;
    })
  )
});

// Main logger instance
const logger = createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
    command: 5
  },
  transports: [
    // Console transport
    new transports.Console({
      level: 'debug',
      format: format.combine(
        format.timestamp({ format: 'HH:mm:ss' }),
        format.errors({ stack: true }),
        consoleFormat
      )
    }),
    
    // Daily error logs
    new DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: fileFormat,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    }),
    
    // Combined logs
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      format: fileFormat,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d'
    }),
    
    // Command logs (separate file)
    commandTransport
  ],
  exceptionHandlers: [
    new transports.File({ 
      filename: path.join(logDir, 'exceptions.log'),
      format: fileFormat
    })
  ]
});

// Add MongoDB transport in production
if (process.env.NODE_ENV === 'production') {
  const { MongoDB } = require('winston-mongodb');
  logger.add(new MongoDB({
    level: 'info',
    db: process.env.MONGODB_URI,
    collection: 'bot_logs',
    capped: true,
    cappedSize: 10000000, // 10MB
    format: fileFormat
  }));
}

// Custom logger methods
export const logCommand = (user, command) => {
  logger.log('command', `${user} used: ${command}`);
};

// Pretty error formatter
export const logError = (error, context = '') => {
  if (error instanceof Error) {
    logger.error(`${context} ${error.message}\n${error.stack}`);
  } else {
    logger.error(`${context} ${JSON.stringify(error)}`);
  }
};

// HTTP request logger middleware
export const httpLogger = (req, res, next) => {
  logger.http(`${req.method} ${req.url} ${req.ip}`);
  next();
};

export default logger;
