import type { PMCharacter } from './types'
import { loadJsonCollection } from './json-loader'

const characterModules = import.meta.glob('./characters/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

export const characters: PMCharacter[] = loadJsonCollection<PMCharacter>(characterModules, 'characters')
