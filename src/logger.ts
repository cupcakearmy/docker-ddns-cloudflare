import winston from 'winston'

import { Config } from './config.js'

export const logger = winston.createLogger({
  level: Config.logging.level,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.simple()),
    }),
  ],
})
