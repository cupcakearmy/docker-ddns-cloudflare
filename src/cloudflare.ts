import axios from 'axios'

import { Cache } from './cache.js'
import { Config } from './config.js'
import { logger } from './logger.js'

type DNSRecord = {
  id: string
  zone_id: string
  zone_name: string
  name: string
  type: string
  content: string
  proxiable: boolean
  proxied: boolean
  ttl: number // 1 means automatic
  locked: boolean
}

type DNSRecordCreate = Pick<DNSRecord, 'name' | 'type' | 'ttl' | 'proxied' | 'content'>
type DNSRecordPatch = Partial<DNSRecordCreate>

const l = logger.child({ context: 'cloudflare' })

const Base = axios.create({
  baseURL: 'https://api.cloudflare.com/client/v4',
  headers: {
    Authorization: `Bearer ${Config.auth.token}`,
  },
})

export const API = {
  zones: {
    async findByName(name: string): Promise<string | null> {
      try {
        const { data } = await Base({
          url: '/zones',
          params: {
            name,
          },
        })
        return data.result[0].id
      } catch {
        return null
      }
    },
  },
  records: {
    async create(zoneId: string, zone: DNSRecordCreate): Promise<void> {
      await Base({
        url: `/zones/${zoneId}/dns_records`,
        method: 'POST',
        data: zone,
      })
    },
    async remove(zoneId: string, recordId: string): Promise<void> {
      await Base({
        url: `/zones/${zoneId}/dns_records/${recordId}`,
        method: 'DELETE',
      })
    },
    async patch(zoneId: string, recordId: string, data: DNSRecordPatch): Promise<void> {
      await Base({
        url: `/zones/${zoneId}/dns_records/${recordId}`,
        method: 'PATCH',
        data,
      })
    },
    async find(zoneId: string): Promise<DNSRecord[]> {
      const { data } = await Base({
        url: `/zones/${zoneId}/dns_records`,
        params: {
          type: 'A',
          name: Config.dns.record,
        },
      })
      return data.result as DNSRecord[]
    },
  },
}

export async function update(ip: string) {
  // Find zone
  if (!Cache.has('zone')) {
    l.debug('Fetching zone')
    const zone = await API.zones.findByName(Config.dns.zone)
    if (!zone) {
      l.error(`Zone "${Config.dns.zone}" not found`)
      process.exit(1)
    }
    Cache.set('zone', zone)
  }

  const zoneId = Cache.get('zone')!
  l.debug(`Zone ID: ${zoneId}`)

  // Set record
  const records = await API.records.find(zoneId)

  l.debug('Updating record', ip)

  switch (records.length) {
    case 0:
      // Create DNS Record
      l.debug('Creating DNS record')
      await API.records.create(zoneId, {
        content: ip,
        name: Config.dns.record,
        proxied: Config.dns.proxied,
        ttl: 1,
        type: 'A',
      })
      return
    case 1:
      // Only one record, thats fine
      break
    default:
      // More than one record, delete all but the first
      l.debug('Deleting other DNS records')
      for (const record of records.slice(1)) {
        await API.records.remove(zoneId, record.id)
      }
      break
  }

  // Update the remaining record
  await API.records.patch(zoneId, records[0]!.id, { content: ip, proxied: Config.dns.proxied })
}
