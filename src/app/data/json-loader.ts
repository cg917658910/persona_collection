type JsonModule = unknown

type SupportedEntity = { id?: string; slug?: string }

function normalizeCollection<T>(value: JsonModule, collectionName: string): T[] {
  if (Array.isArray(value)) return value as T[]
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const candidates = [collectionName, 'data', 'items', 'list']
    for (const key of candidates) {
      const candidate = record[key]
      if (Array.isArray(candidate)) return candidate as T[]
    }
  }
  return []
}

function dedupeByIdOrSlug<T extends SupportedEntity>(items: T[]): T[] {
  const seen = new Set<string>()
  const result: T[] = []
  for (const item of items) {
    const key = item.id || item.slug
    if (!key) {
      result.push(item)
      continue
    }
    if (seen.has(key)) continue
    seen.add(key)
    result.push(item)
  }
  return result
}

export function loadJsonCollection<T extends SupportedEntity>(
  modules: Record<string, JsonModule>,
  collectionName: string,
): T[] {
  const merged = Object.keys(modules)
    .sort((a, b) => a.localeCompare(b))
    .flatMap((path) => normalizeCollection<T>(modules[path], collectionName))

  return dedupeByIdOrSlug(merged)
}
