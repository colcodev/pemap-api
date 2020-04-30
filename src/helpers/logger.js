import { createLogger, format, transports } from 'winston';

const isProd = process.env.NODE_ENV === 'production';
const transportOpts = {};

if (!isProd) {
  transportOpts.format = format.combine(
    // format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.colorize(),
    // format.prettyPrint()
    format.simple()
  );
}

const logger = createLogger({
  level: isProd ? 'info' : 'debug',
  // format: format.combine(format.simple()),
  transports: [new transports.Console(transportOpts)],
});

export default logger;
