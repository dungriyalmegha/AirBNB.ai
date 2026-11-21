import { defaultSettings } from '../data/settings'
import type { Settings } from '../types'
import { KEYS } from './seed'
import { delay, storage } from './storage'

export const settingsService = {
  async get(): Promise<Settings> {
    await delay(40)
    return { ...defaultSettings, ...storage.read<Partial<Settings>>(KEYS.settings, {}) }
  },
  async update(settings: Settings): Promise<Settings> {
    await delay()
    storage.write(KEYS.settings, settings)
    return settings
  },
}
