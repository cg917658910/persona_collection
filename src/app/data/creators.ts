import type { PMCreator } from './types'
import { loadJsonCollection } from './json-loader'

const creatorModules = import.meta.glob('./creators/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

export const creators: PMCreator[] = loadJsonCollection<PMCreator>(creatorModules, 'creators')
