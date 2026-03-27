import { useEffect, useState } from 'react'
import { characterCards, creatorCards, featuredCharacter, featuredSongs, featuredWorks, themeCards, workCards } from '../data/adapters'
import type { PMCharacterTypeCode } from '../data/types'
import { fetchApi } from './api'

export type HomeSongRef = {
  id: string
  slug: string
  title: string
  coverUrl: string
  audioUrl: string
  characterSlug: string
  characterName?: string
}

export type HomeFeaturedCharacter = {
  id: string
  slug: string
  name: string
  coverUrl: string
  summary: string
  oneLineDefinition: string
  characterTypeCode: PMCharacterTypeCode
  workTitle?: string
  tags: string[]
  song?: HomeSongRef | null
}

export type HomeCharacterCard = {
  id: string
  slug: string
  name: string
  coverUrl: string
  summary: string
  oneLineDefinition: string
  characterTypeCode: PMCharacterTypeCode
  workTitle?: string
  tags: string[]
  hasSong: boolean
}

export type HomeSongCard = {
  id: string
  slug: string
  title: string
  coverUrl: string
  audioUrl: string
  characterSlug: string
  characterName: string
  summary?: string
  songCoreTheme?: string
}

export type HomeWorkCard = {
  id: string
  slug: string
  title: string
  coverUrl: string
  summary: string
  workTypeCode: string
  creatorName?: string
}

export type HomeThemeCard = {
  id: string
  slug: string
  name: string
  coverUrl: string
  summary: string
  characterCount: number
}

export type HomeCategoryCounts = {
  characters: number
  creators: number
  historical: number
  literary: number
  film_tv: number
  anime: number
  works: number
  themes: number
}

export type HomeResponseData = {
  featuredCharacter: HomeFeaturedCharacter | null
  latestCharacters: HomeCharacterCard[]
  featuredSongs: HomeSongCard[]
  recommendedWorks: HomeWorkCard[]
  recommendedThemes: HomeThemeCard[]
  categoryCounts: HomeCategoryCounts
}

export const EMPTY_HOME_DATA: HomeResponseData = {
  featuredCharacter: null,
  latestCharacters: [],
  featuredSongs: [],
  recommendedWorks: [],
  recommendedThemes: [],
  categoryCounts: {
    characters: 0,
    creators: 0,
    historical: 0,
    literary: 0,
    film_tv: 0,
    anime: 0,
    works: 0,
    themes: 0,
  },
}

function buildFallbackHomeData(): HomeResponseData {
  const coherentSong = featuredSongs.find((item) => item.characterName === featuredCharacter.name)

  return {
    featuredCharacter: {
      id: featuredCharacter.id,
      slug: featuredCharacter.slug,
      name: featuredCharacter.name,
      coverUrl: featuredCharacter.imageUrl,
      summary: featuredCharacter.description,
      oneLineDefinition: featuredCharacter.description,
      characterTypeCode: featuredCharacter.typeCode,
      workTitle: featuredCharacter.workTitle,
      tags: featuredCharacter.tags,
      song: coherentSong
        ? {
            id: coherentSong.id,
            slug: coherentSong.slug,
            title: coherentSong.title,
            coverUrl: coherentSong.coverUrl,
            audioUrl: coherentSong.audioUrl,
            characterSlug: coherentSong.characterSlug,
            characterName: coherentSong.characterName,
          }
        : null,
    },
    latestCharacters: characterCards.slice(0, 8).map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      coverUrl: item.imageUrl,
      summary: item.description,
      oneLineDefinition: item.description,
      characterTypeCode: item.typeCode,
      workTitle: item.workTitle,
      tags: item.tags,
      hasSong: item.hasSong,
    })),
    featuredSongs: featuredSongs.slice(0, 8).map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      coverUrl: item.coverUrl,
      audioUrl: item.audioUrl,
      characterSlug: item.characterSlug,
      characterName: item.characterName,
      summary: item.summary,
      songCoreTheme: item.songCoreTheme,
    })),
    recommendedWorks: featuredWorks.slice(0, 8).map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      coverUrl: item.imageUrl,
      summary: item.description,
      workTypeCode: '',
      creatorName: item.creatorName,
    })),
    recommendedThemes: themeCards.slice(0, 8).map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      coverUrl: item.imageUrl,
      summary: item.description,
      characterCount: item.characterCount,
    })),
    categoryCounts: {
      characters: characterCards.length,
      creators: creatorCards.length,
      historical: characterCards.filter((item) => item.typeCode === 'historical').length,
      literary: characterCards.filter((item) => item.typeCode === 'literary').length,
      film_tv: characterCards.filter((item) => item.typeCode === 'film_tv').length,
      anime: characterCards.filter((item) => item.typeCode === 'anime').length,
      works: workCards.length,
      themes: themeCards.length,
    },
  }
}

export function useHomeData() {
  const [data, setData] = useState<HomeResponseData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const next = await fetchApi<HomeResponseData>('/home')
        if (cancelled) return
        setData(next)
        setError(null)
      } catch (err) {
        if (!cancelled) {
          setData(buildFallbackHomeData())
          setError(err instanceof Error ? err.message : 'Failed to load home data')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error }
}
