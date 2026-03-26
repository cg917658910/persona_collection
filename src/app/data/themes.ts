import type { PMTheme } from './types'
import { loadJsonCollection } from './json-loader'

const themeModules = import.meta.glob('./themes/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

export const themes: PMTheme[] = loadJsonCollection<PMTheme>(themeModules, 'themes')
