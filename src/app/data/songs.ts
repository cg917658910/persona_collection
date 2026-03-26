import type { PMSong } from './types'
import { loadJsonCollection } from './json-loader'

const songModules = import.meta.glob('./songs/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

export const songs: PMSong[] = loadJsonCollection<PMSong>(songModules, 'songs')
