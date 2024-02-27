import { Cron } from 'croner'
import pkg from '../package.json'

function getEnv(key: string, fallback: string, parse?: undefined, validator?: (s: string) => boolean): string
function getEnv<T>(key: string, fallback: T, parse: (value: string) => T, validator?: (T: string) => boolean): T
function getEnv<T>(
  key: string,
  fallback: T,
  parse?: (value: string) => T,
  validator?: (s: string | T) => boolean
): T | string {
  const value = process.env[key]
  const parsed = value === undefined ? fallback : parse ? parse(value) : value
  if (validator && !validator(parsed)) {
    console.error(`Invalid or missing value for ${key}: ${value}`)
    process.exit(1)
  }
  return parsed
}

function parseBoolean(value: string): boolean {
  value = value.toLowerCase()
  const truthy = ['true', 'yes', '1', 'y']
  return truthy.includes(value)
}

function isPresent(s: string): boolean {
  return s.length > 0
}

export const Config = {
  version: pkg.version,
  logging: {
    level: getEnv('LOG_LEVEL', 'info'),
  },
  auth: {
    token: getEnv('TOKEN', '', undefined, isPresent),
  },
  dns: {
    zone: getEnv('ZONE', '', undefined, isPresent),
    record: getEnv('DNS_RECORD', '', undefined, isPresent),
    proxied: getEnv('PROXIED', false, parseBoolean),
  },
  runner: {
    cron: getEnv('CRON', '*/5 * * * *', undefined, (s) => {
      try {
        new Cron(s)
        return true
      } catch {
        return false
      }
    }),
    resolver: getEnv('RESOLVER', 'https://api.ipify.org'),
  },
}
