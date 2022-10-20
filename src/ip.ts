import axios from 'axios'

import { Cache } from './cache.js'
import { Config } from './config.js'

export async function getCurrentIp(): Promise<string> {
  const { data } = await axios({
    url: Config.runner.resolver,
    method: 'GET',
  })
  return data as string
}

export function checkIfUpdateIsRequired(newIP: string): boolean {
  // Check if IP has changed.
  const current = Cache.get('ip')
  if (newIP !== current) {
    Cache.set('ip', newIP)
    return true
  }
  return false
}
