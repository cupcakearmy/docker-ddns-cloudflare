import { schedule } from 'node-cron'
import process from 'process'

import { Config } from './config.js'
import { logger } from './logger.js'
import { loop } from './runner.js'

async function main() {
  const cron = schedule(Config.runner.cron, loop)
  logger.info('Started service.', { version: Config.version })
  logger.debug('Config', Config)

  function terminate() {
    logger.info('Stopping service.')
    cron.stop()
    process.exit(0)
  }
  process.on('SIGINT', terminate)
  process.on('SIGTERM', terminate)
}

main()
