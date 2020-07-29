const { readFileSync, writeFileSync, existsSync } = require('fs')
const Cloudflare = require('cloudflare')
const Axios = require('axios')
const { CronJob } = require('cron')

require('dotenv').config()

const { EMAIL, KEY, ZONE, DNS_RECORD, CRON, RESOLVER } = process.env

const cf = Cloudflare({
  email: EMAIL,
  key: KEY,
})

function log(message) {
  const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  console.log(timestamp + '\t' + message)
}

async function getCurrentIp() {
  const { data } = await Axios({
    url: RESOLVER || 'https://api.ipify.org/',
    method: 'GET',
  })
  return data
}

async function checkIfUpdateIsRequired() {
  const LOG = './ip.log'
  const current = await getCurrentIp()
  const saved = existsSync(LOG) ? readFileSync(LOG, 'utf-8') : null

  if (current === saved) return false
  else {
    writeFileSync(LOG, current, { encoding: 'utf-8' })
    return current
  }
}

async function update(newIP) {
  const { result: zones } = await cf.zones.browse({ name: ZONE })
  if (!zones.length) throw new Error(`No ZONE "${ZONE}" found`)

  const zoneId = zones[0].id
  const { result: records } = await cf.dnsRecords.browse(zoneId, { name: DNS_RECORD, type: 'A' })

  const recordAlreadyExists = records.length
  if (recordAlreadyExists) {
    const { id: recordId, ...rest } = records[0]
    await cf.dnsRecords.edit(zoneId, recordId, { ...rest, content: newIP })
    log(`Updated:\t${DNS_RECORD} → ${newIP} `)
  } else {
    await cf.dnsRecords.add(zoneId, {
      name: DNS_RECORD,
      type: 'A',
      content: newIP,
    })
    log(`Created:\t${DNS_RECORD} → ${newIP} `)
  }
}

async function main() {
  const changed = await checkIfUpdateIsRequired()
  log(`Running. Update required: ${!!changed}`)
  if (changed) await update(changed).catch((e) => console.error(e.message))
}

new CronJob(CRON || '*/5 * * * *', main, null, true, null, null, true)
log('Started service.')
