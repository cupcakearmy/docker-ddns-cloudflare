import { update } from './cloudflare.js'
import { checkIfUpdateIsRequired, getCurrentIp } from './ip.js'
import { logger } from './logger.js'

export async function loop() {
  const ip = await getCurrentIp()
  const changed = checkIfUpdateIsRequired(ip)
  logger.info(`Running. Update required: ${!!changed}`)
  if (changed) {
    try {
      await update(ip)
      logger.info('Successfully updated DNS record')
    } catch (e) {
      logger.error(e)
      logger.error('Failed to update DNS record')
    }
  }
}
