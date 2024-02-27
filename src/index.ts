import { Cron } from 'croner'
import process from 'node:process'

import { Config } from './config.js'
import { logger } from './logger.js'
import { loop } from './runner.js'

async function main() {
  const cron = new Cron(Config.runner.cron, { protect: true }, loop)
  logger.info('started service', { version: Config.version })
  logger.debug('config', Config)

  const nextRun = cron.nextRun()
  if (nextRun) {
    const pretty = new Intl.DateTimeFormat(undefined, { dateStyle: 'long', timeStyle: 'long' }).format(nextRun)
    logger.info(`next run scheduled for ${pretty}`, { nextRunAt: nextRun })
  }

  function terminate() {
    logger.info('Stopping service.')
    cron.stop()
    process.exit(0)
  }
  process.on('SIGINT', terminate)
  process.on('SIGTERM', terminate)
}

main()
