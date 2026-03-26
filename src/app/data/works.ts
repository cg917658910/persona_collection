import type { PMWork } from './types'
import { loadJsonCollection } from './json-loader'

const workModules = import.meta.glob('./works/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

export const works: PMWork[] = loadJsonCollection<PMWork>(workModules, 'works')
