import { characterCards, discoverGroups, featuredSongs } from '../data/adapters'
import { fetchApi } from './api'
import type { HomeFeaturedCharacter } from './home'

function fallbackGroupName(slug: string | null) {
  if (!slug) return ''
  return discoverGroups.find((item) => item.slug === slug)?.name ?? ''
}

export async function fetchRandomDiscoverCharacter(groupSlug: string | null, exclude: string[]) {
  const params = new URLSearchParams()
  if (groupSlug) {
    params.set('theme', groupSlug)
  }
  for (const item of exclude) {
    params.append('exclude', item)
  }
  const query = params.toString()
  return fetchApi<HomeFeaturedCharacter>(`/discover/random${query ? `?${query}` : ''}`)
}

export function fallbackRandomDiscoverCharacter(groupSlug: string | null, exclude: string[]): HomeFeaturedCharacter {
  const allowedSlugs = groupSlug
    ? new Set(discoverGroups.find((item) => item.slug === groupSlug)?.slugs ?? [])
    : null
  const pool = characterCards.filter((item) => {
    if (exclude.includes(item.slug)) return false
    if (!allowedSlugs) return true
    return allowedSlugs.has(item.slug)
  })
  const target = pool[Math.floor(Math.random() * Math.max(pool.length, 1))] ?? characterCards[0]
  const song = featuredSongs.find((item) => item.characterName === target.name)

  return {
    id: target.id,
    slug: target.slug,
    name: target.name,
    coverUrl: target.imageUrl,
    summary: target.description,
    oneLineDefinition: target.description,
    characterTypeCode: target.typeCode,
    workTitle: target.workTitle || fallbackGroupName(groupSlug),
    tags: target.tags,
    song: song
      ? {
          id: song.id,
          slug: song.slug,
          title: song.title,
          coverUrl: song.coverUrl,
          audioUrl: song.audioUrl,
          characterSlug: song.characterSlug,
          characterName: song.characterName,
        }
      : null,
  }
}
