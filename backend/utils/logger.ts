import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, errors, colorize } = format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  const lineNumber = stack ? stack.split('\n')[1].trim() : '';
  return `${timestamp} [${level}] ${lineNumber} - ${message}${stack ? `\n${stack}` : ''}`;
});

const logger = createLogger({
  level: 'debug',
  format: combine(
    colorize(),
    timestamp(),
    errors({ stack: true }), // to log error stack
    customFormat
  ),
  transports: [
    new transports.Console(),
    // new transports.File({ filename: 'combined.log' })
  ]
});

export default logger;