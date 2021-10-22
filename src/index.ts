import Cloudflare from 'cloudflare'
import Axios from 'axios'
import { CronJob } from 'cron'
import { config } from 'dotenv'
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), winston.format.colorize(), winston.format.simple()),
    }),
  ],
})

const Cache = new Map<string, string>()

async function getCurrentIp(resolver?: string): Promise<string> {
  const { data } = await Axios({
    url: resolver || 'https://api.ipify.org/',
    method: 'GET',
  })
  return data as string
}

function checkIfUpdateIsRequired(newIP: string): boolean {
  // Check if IP has changed.
  const current = Cache.get('ip')
  if (newIP !== current) {
    Cache.set('ip', newIP)
    return true
  }
  return false
}

type DNSRecord = {
  zone: string
  record: string
  ip: string
}
async function update(cf: Cloudflare, options: DNSRecord) {
  // Find zone
  if (!Cache.has('zone')) {
    logger.debug('Fetching zone')
    const zones: { result: { id: string; name: string }[] } = (await cf.zones.browse()) as any
    const zone = zones.result.find((z) => z.name === options.zone)
    if (!zone) {
      logger.error(`Zone "${options.zone}"" not found`)
      process.exit(1)
    }
    Cache.set('zone', zone.id)
  }

  const zoneId = Cache.get('zone')!
  logger.debug(`Zone ID: ${zoneId}`)

  // Set record
  const records: { result: { id: string; type: string; name: string; ttl: number }[] } = (await cf.dnsRecords.browse(
    zoneId
  )) as any
  const relevant = records.result.filter((r) => r.name === options.record && r.type === 'A')
  if (relevant.length === 0) {
    // Create DNS Record
    logger.debug('Creating DNS record')
    await cf.dnsRecords.add(zoneId, {
      type: 'A',
      name: options.record,
      content: options.ip,
      ttl: 1,
    })
  } else {
    if (relevant.length > 1) {
      // Delete other records as they cannot all point to the same IP
      logger.debug('Deleting other DNS records')
      for (const record of relevant.slice(1)) {
        await cf.dnsRecords.del(zoneId, record.id)
      }
    }
    // Update DNS Record
    logger.debug('Updating DNS record')
    const record = relevant[0]!
    await cf.dnsRecords.edit(zoneId, record.id, {
      type: 'A',
      name: options.record,
      content: options.ip,
      ttl: record.ttl,
    })
    logger.info(`Updated DNS record ${record.name}`)
  }
}

async function main() {
  config()
  const { EMAIL, KEY, TOKEN, ZONE, DNS_RECORD, CRON, RESOLVER } = process.env
  if (!ZONE || !DNS_RECORD) {
    logger.error('Missing environment variables')
    process.exit(1)
  }

  // Initialize Cloudflare
  const cf = new Cloudflare(TOKEN ? { token: TOKEN } : { email: EMAIL, key: KEY })

  async function fn() {
    const ip = await getCurrentIp(RESOLVER)
    const changed = checkIfUpdateIsRequired(ip)
    logger.info(`Running. Update required: ${!!changed}`)
    if (changed) await update(cf, { ip, record: DNS_RECORD!, zone: ZONE! }).catch((e) => logger.error(e.message))
  }

  new CronJob(CRON || '*/5 * * * *', fn, null, true, undefined, null, true)
  logger.info('Started service.')
}

main()
