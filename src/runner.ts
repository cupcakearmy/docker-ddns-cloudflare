import { update } from './cloudflare.js'
import { checkIfUpdateIsRequired, getCurrentIp } from './ip.js'
import { logger } from './logger.js'

const l = logger.child({ context: 'runner' })

export async function loop() {
  const ip = await getCurrentIp()
  const changed = checkIfUpdateIsRequired(ip)
  l.info(`Running. Update required: ${!!changed}`)
  if (changed) {
    try {
      await update(ip)
      l.info('Successfully updated DNS record')
    } catch (e) {
      l.error(e)
      l.error('Failed to update DNS record')
    }
  }
}
