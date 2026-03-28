import { useEffect, useState } from 'react'
import { adaptRelationDetail, type RelationDetailApiResponse, type RelationshipDetailData } from '../adapters/relation-detail'
import {
  characterCards,
  creatorCards,
  discoverGroups,
  featuredSongs,
  getCharacterBySlug,
  getCharactersByThemeSlug,
  getCharactersByWorkSlug,
  getCreatorBySlug,
  getSongBySlug,
  getThemeBySlug,
  getWorkBySlug,
  getWorksByCreatorSlug,
  humanizeCharacterType,
  humanizeCreatorType,
  humanizeThemeCategory,
  humanizeWorkType,
  mapCharacterToCard,
  mapCharacterToDetail,
  mapCreatorToCard,
  mapThemeToCard,
  mapWorkToCard,
  themeCards,
  workCards,
} from '../data/adapters'
import { characters as fallbackCharacters } from '../data/characters'
import { songs as fallbackSongs } from '../data/songs'
import type {
  CharacterColorItem,
  CharacterListItem,
  CreatorCardItem,
  PMCharacter,
  PMSong,
  ThemeCardItem,
  WorkCardItem,
} from '../data/types'
import { fetchApi } from './api'

type CharacterListApiItem = {
  id: string
  slug: string
  name: string
  coverUrl: string
  summary: string
  oneLineDefinition: string
  characterTypeCode: PMCharacter['characterTypeCode']
  workTitle?: string
  tags?: string[]
  hasSong: boolean
  themeSongTitle?: string
}

type CharacterListApiResponse = {
  items: CharacterListApiItem[]
  total?: number
}

type WorkListApiItem = {
  id: string
  slug: string
  title: string
  coverUrl: string
  summary: string
  workTypeCode: string
  creatorName?: string
  characterCount: number
}

type WorkListApiResponse = {
  items: WorkListApiItem[]
}

type CreatorListApiItem = {
  id: string
  slug: string
  name: string
  coverUrl: string
  summary: string
  creatorTypeCode?: string
  eraText?: string
  workCount: number
}

type CreatorListApiResponse = {
  items: CreatorListApiItem[]
}

type ThemeListApiItem = {
  id: string
  slug: string
  name: string
  coverUrl: string
  summary: string
  category?: string
  subjectType?: 'character' | 'relation'
  itemCount?: number
  characterCount: number
}

type ThemeListApiResponse = {
  items: ThemeListApiItem[]
}

type SongListApiItem = {
  id: string
  slug: string
  title: string
  characterSlug: string
  coverUrl: string
  audioUrl: string
  styles: string[]
}

type SongListApiResponse = {
  items: SongListApiItem[]
}

type SearchApiResponse = {
  characters: CharacterListApiItem[]
  works: WorkListApiItem[]
  creators: CreatorListApiItem[]
  themes: ThemeListApiItem[]
  songs?: SongListApiItem[]
}

type CharacterDetailRef = {
  slug: string
  title: string
  name: string
  coverUrl: string
  summary?: string
}

type CharacterDetailSong = {
  slug: string
  title: string
  coverUrl: string
  audioUrl: string
  songCoreTheme?: string
  emotionalCurve: string[]
  songStyles: string[]
  vocalProfile?: string
  lyrics: string[]
}

type CharacterRelationshipPattern = {
  title: string
  value: string
}

export type RelationshipCharacterRef = {
  slug: string
  name: string
  coverUrl: string
  summary?: string
}

export type RelationshipListItem = {
  id: string
  slug: string
  name: string
  summary: string
  oneLineDefinition: string
  coverUrl: string
  relationType: string
  relationLabel: string
  workTitle?: string
  intensity: number
  tags: string[]
  sourceCharacter: RelationshipCharacterRef
  targetCharacter: RelationshipCharacterRef
  counterpart?: RelationshipCharacterRef | null
}

export function humanizeCharacterTypeLabel(type: string) {
  return humanizeCharacterType(type)
}

export type CharacterDetailData = {
  id: string
  slug: string
  name: string
  coverUrl: string
  summary: string
  oneLineDefinition: string
  characterTypeCode: string
  work: CharacterDetailRef | null
  creator: CharacterDetailRef | null
  song: CharacterDetailSong | null
  songs: CharacterDetailSong[]
  coreIdentity: string
  publicImage: string
  hiddenSelf: string
  primaryMotivation: string
  coreFear: string
  psychologicalWound: string
  coreConflict: string
  emotionalTone: string
  origin: string
  fateArc: string
  endingState: string
  surfaceTraits: string[]
  deepTraits: string[]
  dominantEmotions: string[]
  suppressedEmotions: string[]
  valuesTags: string[]
  displayTags: string[]
  bottomLines: string[]
  timeline: Array<{ year: string; event: string; emotion: string }>
  relationshipProfile: {
    love?: string
    authority?: string
    friends?: string
    enemies?: string
    [key: string]: string | undefined
  }
  relationshipPatterns: CharacterRelationshipPattern[]
  colors: CharacterColorItem[]
  symbolicImages: string[]
  elements: string[]
  soundscapeKeywords: string[]
  keyRelationships: RelationshipListItem[]
  similarCharacters: CharacterListApiItem[]
}

export type WorkDetailData = {
  id: string
  slug: string
  title: string
  coverUrl: string
  summary: string
  workTypeCode: string
  creator: CharacterDetailRef | null
  characterCount: number
  characters: CharacterListApiItem[]
}

export type CreatorDetailData = {
  id: string
  slug: string
  name: string
  coverUrl: string
  summary: string
  creatorTypeCode?: string
  eraText?: string
  works: WorkListApiItem[]
}

export type ThemeDetailData = {
  id: string
  slug: string
  name: string
  coverUrl: string
  summary: string
  category?: string
  subjectType?: 'character' | 'relation'
  characters: CharacterListApiItem[]
  relationships: RelationshipListItem[]
}

export type DiscoverGroup = {
  slug: string
  name: string
  characterCount: number
}

export type PlayerQueueTrack = {
  title: string
  subtitle?: string
  coverUrl?: string
  audioUrl: string
  characterSlug?: string
}

type AsyncState<T> = {
  data: T
  loading: boolean
  error: string | null
}

export function toCharacterCardItem(item: CharacterListApiItem): CharacterListItem {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    title: item.workTitle || item.oneLineDefinition,
    description: item.oneLineDefinition || item.summary,
    imageUrl: item.coverUrl,
    tags: item.tags ?? [],
    themeSong: item.themeSongTitle ?? '',
    workTitle: item.workTitle ?? '',
    hasSong: item.hasSong,
    typeCode: item.characterTypeCode,
  }
}

export function toWorkCardItem(item: WorkListApiItem): WorkCardItem {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.summary,
    imageUrl: item.coverUrl,
    meta: humanizeWorkType(item.workTypeCode),
    creatorName: item.creatorName ?? '',
    characterCount: item.characterCount,
  }
}

export function toCreatorCardItem(item: CreatorListApiItem): CreatorCardItem {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.summary,
    imageUrl: item.coverUrl,
    meta: [humanizeCreatorType(item.creatorTypeCode || ''), item.eraText || ''].filter(Boolean).join(' 路 '),
    workCount: item.workCount,
  }
}

export function toThemeCardItem(item: ThemeListApiItem): ThemeCardItem {
  const subjectType = item.subjectType === 'relation' ? 'relation' : 'character'
  const itemCount = Number(item.itemCount || item.characterCount || 0)
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: item.summary,
    imageUrl: item.coverUrl,
    meta: `${humanizeThemeCategory(item.category || '')} · ${itemCount}${subjectType === 'relation' ? '组关系' : '位人物'}`,
    characterCount: itemCount,
    subjectType,
  }
}

function buildCharacterCardTags(primaryTheme: string, surfaceTraits: string[]) {
  return [primaryTheme, ...surfaceTraits].filter(Boolean).slice(0, 3)
}

function resolveThemeSongTitle(songSlug?: string) {
  if (!songSlug) return ''
  return getSongBySlug(songSlug)?.title ?? ''
}

function buildRelationshipPatterns(profile: Record<string, string | undefined>): CharacterRelationshipPattern[] {
  const keyMap: Array<{ key: string; title: string }> = [
    { key: 'love', title: '对爱情' },
    { key: 'authority', title: '对权威' },
    { key: 'friends', title: '对朋友' },
    { key: 'enemies', title: '对敌人' },
  ]

  const ordered = keyMap
    .map((item) => ({ title: item.title, value: profile[item.key]?.trim() ?? '' }))
    .filter((item) => item.value)

  if (ordered.length > 0) return ordered

  return Object.entries(profile)
    .map(([title, value]) => ({ title, value: value?.trim() ?? '' }))
    .filter((item) => item.value)
}

function buildFallbackRelationshipItemsForCharacter(slug: string): RelationshipListItem[] {
  const character = getCharacterBySlug(slug)
  if (!character) return []

  return character.similarCharacterSlugs
    .map((otherSlug) => {
      const other = getCharacterBySlug(otherSlug)
      if (!other) return null

      const work = getWorkBySlug(character.workSlugs[0] || other.workSlugs[0] || '')
      const themeNames = [character.primaryTheme, other.primaryTheme]
        .map((themeSlugOrName) => getThemeBySlug(themeSlugOrName)?.name ?? themeSlugOrName)
        .filter(Boolean)

      return {
        id: `${character.slug}--${other.slug}`,
        slug: `${character.slug}--${other.slug}`,
        name: `${character.name} × ${other.name}`,
        summary: `${character.name} 与 ${other.name} 在气质和命运上形成互相照亮的对照。`,
        oneLineDefinition: `${character.name} 的内在张力，在 ${other.name} 身上看见了另一种回应方式。`,
        coverUrl: character.coverUrl || other.coverUrl,
        relationType: 'mirror',
        relationLabel: '镜像',
        workTitle: work?.title ?? '',
        intensity: 0.6,
        tags: ['镜像', ...themeNames].filter(Boolean).slice(0, 3),
        sourceCharacter: {
          slug: character.slug,
          name: character.name,
          coverUrl: character.coverUrl,
          summary: character.summary,
        },
        targetCharacter: {
          slug: other.slug,
          name: other.name,
          coverUrl: other.coverUrl,
          summary: other.summary,
        },
        counterpart: {
          slug: other.slug,
          name: other.name,
          coverUrl: other.coverUrl,
          summary: other.summary,
        },
      } satisfies RelationshipListItem
    })
    .filter((item): item is RelationshipListItem => Boolean(item))
    .slice(0, 4)
}

function buildFallbackRelationshipDetail(slug: string): RelationshipDetailData | null {
  return buildFallbackRelationDetailV2(slug)
}

function fallbackPlayerQueue(): PlayerQueueTrack[] {
  const nameBySlug = new Map(fallbackCharacters.map((item) => [item.slug, item.name]))
  return fallbackSongs.map((song) => ({
    title: song.title,
    subtitle: nameBySlug.get(song.characterSlug) ?? song.characterSlug,
    coverUrl: song.coverUrl,
    audioUrl: song.audioUrl,
    characterSlug: song.characterSlug,
  }))
}

function buildFallbackCharacterDetail(slug: string): CharacterDetailData | null {
  const rawCharacter = getCharacterBySlug(slug)
  if (!rawCharacter) return null
  const character = mapCharacterToDetail(rawCharacter)
  const song = rawCharacter.songSlugs[0] ? getSongBySlug(rawCharacter.songSlugs[0]) : undefined
  const songs = rawCharacter.songSlugs.map((item) => getSongBySlug(item)).filter((item): item is PMSong => Boolean(item))
  const work = rawCharacter.workSlugs[0] ? getWorkBySlug(rawCharacter.workSlugs[0]) : undefined
  const creator = rawCharacter.creatorSlugs[0] ? getCreatorBySlug(rawCharacter.creatorSlugs[0]) : undefined

  return {
    id: rawCharacter.id,
    slug: rawCharacter.slug,
    name: rawCharacter.name,
    coverUrl: rawCharacter.coverUrl,
    summary: rawCharacter.summary,
    oneLineDefinition: rawCharacter.oneLineDefinition,
    characterTypeCode: rawCharacter.characterTypeCode,
    work: work ? { slug: work.slug, title: work.title, name: work.title, coverUrl: work.coverUrl, summary: work.summary } : null,
    creator: creator ? { slug: creator.slug, title: creator.name, name: creator.name, coverUrl: creator.coverUrl, summary: creator.summary } : null,
    song: song
      ? {
          slug: song.slug,
          title: song.title,
          coverUrl: song.coverUrl,
          audioUrl: song.audioUrl,
          songCoreTheme: song.songCoreTheme,
          emotionalCurve: song.emotionalCurve,
          songStyles: song.songStyles,
          vocalProfile: song.vocalProfile,
          lyrics: song.lyricPreview ? [song.lyricPreview] : [],
        }
      : null,
    songs: songs.map((item) => ({
      slug: item.slug,
      title: item.title,
      coverUrl: item.coverUrl,
      audioUrl: item.audioUrl,
      songCoreTheme: item.songCoreTheme,
      emotionalCurve: item.emotionalCurve,
      songStyles: item.songStyles,
      vocalProfile: item.vocalProfile,
      lyrics: item.lyricPreview ? [item.lyricPreview] : [],
    })),
    coreIdentity: rawCharacter.coreIdentity,
    publicImage: '',
    hiddenSelf: '',
      primaryMotivation: rawCharacter.motivationNote || rawCharacter.primaryMotivation,
    coreFear: rawCharacter.coreFear,
    psychologicalWound: rawCharacter.psychologicalWound,
    coreConflict: rawCharacter.coreConflict,
    emotionalTone: rawCharacter.emotionalTone,
    origin: '',
    fateArc: rawCharacter.fateArc,
    endingState: rawCharacter.endingState,
    surfaceTraits: rawCharacter.surfaceTraits,
    deepTraits: rawCharacter.deepTraits,
    dominantEmotions: rawCharacter.dominantEmotions,
    suppressedEmotions: rawCharacter.suppressedEmotions,
    valuesTags: rawCharacter.valuesTags,
    displayTags: buildCharacterCardTags(rawCharacter.primaryTheme, rawCharacter.surfaceTraits),
    bottomLines: [],
    timeline: character.timeline,
    relationshipProfile: rawCharacter.relationshipProfile,
    relationshipPatterns: buildRelationshipPatterns(rawCharacter.relationshipProfile),
    colors: rawCharacter.colors,
    symbolicImages: rawCharacter.symbolicImages,
    elements: rawCharacter.elements,
    soundscapeKeywords: rawCharacter.soundscapeKeywords,
    keyRelationships: buildFallbackRelationshipItemsForCharacter(rawCharacter.slug),
    similarCharacters: rawCharacter.similarCharacterSlugs
      .map((item) => getCharacterBySlug(item))
      .filter(Boolean)
      .map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        coverUrl: item.coverUrl,
        summary: item.summary,
        oneLineDefinition: item.oneLineDefinition,
        characterTypeCode: item.characterTypeCode,
        workTitle: getWorkBySlug(item.workSlugs[0])?.title ?? '',
        tags: buildCharacterCardTags(item.primaryTheme, item.surfaceTraits),
        hasSong: item.songSlugs.length > 0,
        themeSongTitle: resolveThemeSongTitle(item.songSlugs[0]),
      })),
  }
}

function buildFallbackWorkDetail(slug: string): WorkDetailData | null {
  const work = getWorkBySlug(slug)
  if (!work) return null
  const creator = work.creatorSlugs[0] ? getCreatorBySlug(work.creatorSlugs[0]) : undefined
  const characters = getCharactersByWorkSlug(slug).map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    coverUrl: item.coverUrl,
    summary: item.summary,
    oneLineDefinition: item.oneLineDefinition,
    characterTypeCode: item.characterTypeCode,
    workTitle: work.title,
    tags: buildCharacterCardTags(item.primaryTheme, item.surfaceTraits),
    hasSong: item.songSlugs.length > 0,
    themeSongTitle: resolveThemeSongTitle(item.songSlugs[0]),
  }))

  return {
    id: work.id,
    slug: work.slug,
    title: work.title,
    coverUrl: work.coverUrl,
    summary: work.summary,
    workTypeCode: work.workTypeCode,
    creator: creator ? { slug: creator.slug, title: creator.name, name: creator.name, coverUrl: creator.coverUrl, summary: creator.summary } : null,
    characterCount: characters.length,
    characters,
  }
}

function buildFallbackCreatorDetail(slug: string): CreatorDetailData | null {
  const creator = getCreatorBySlug(slug)
  if (!creator) return null

  return {
    id: creator.id,
    slug: creator.slug,
    name: creator.name,
    coverUrl: creator.coverUrl,
    summary: creator.summary,
    creatorTypeCode: creator.creatorTypeCode,
    eraText: creator.eraText,
    works: getWorksByCreatorSlug(slug).map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      coverUrl: item.coverUrl,
      summary: item.summary,
      workTypeCode: item.workTypeCode,
      creatorName: creator.name,
      characterCount: getCharactersByWorkSlug(item.slug).length,
    })),
  }
}

function buildFallbackThemeDetail(slug: string): ThemeDetailData | null {
  const theme = getThemeBySlug(slug)
  if (!theme) return null

  return {
    id: theme.id,
    slug: theme.slug,
    name: theme.name,
    coverUrl: theme.coverUrl,
    summary: theme.summary,
    category: theme.category,
    subjectType: 'character',
    characters: getCharactersByThemeSlug(slug).map((item) => ({
      id: item.id,
      slug: item.slug,
      name: item.name,
      coverUrl: item.coverUrl,
      summary: item.summary,
      oneLineDefinition: item.oneLineDefinition,
      characterTypeCode: item.characterTypeCode,
      workTitle: getWorkBySlug(item.workSlugs[0])?.title ?? '',
      tags: buildCharacterCardTags(item.primaryTheme, item.surfaceTraits),
      hasSong: item.songSlugs.length > 0,
      themeSongTitle: resolveThemeSongTitle(item.songSlugs[0]),
    })),
    relationships: [],
  }
}

async function fetchCharacterCards() {
  const data = await fetchApi<CharacterListApiResponse>('/characters')
  return {
    items: data.items.map(toCharacterCardItem),
    total: data.total ?? data.items.length,
  }
}

async function fetchWorkCards() {
  const data = await fetchApi<WorkListApiResponse>('/works')
  return data.items.map(toWorkCardItem)
}

async function fetchCreatorCards() {
  const data = await fetchApi<CreatorListApiResponse>('/creators')
  return data.items.map(toCreatorCardItem)
}

async function fetchThemeCards() {
  const data = await fetchApi<ThemeListApiResponse>('/themes')
  return data.items.map(toThemeCardItem)
}

async function fetchPlayerQueue() {
  const [songsData, charactersData] = await Promise.all([
    fetchApi<SongListApiResponse>('/songs'),
    fetchApi<CharacterListApiResponse>('/characters'),
  ])

  const nameBySlug = new Map(charactersData.items.map((item) => [item.slug, item.name]))
  return songsData.items.map((song) => ({
    title: song.title,
    subtitle: nameBySlug.get(song.characterSlug) ?? song.characterSlug,
    coverUrl: song.coverUrl,
    audioUrl: song.audioUrl,
    characterSlug: song.characterSlug,
  }))
}

function useAsyncState<T>(initialData: T, loader: () => Promise<T>, fallbackFactory: () => T, deps: unknown[]): AsyncState<T> {
  const [data, setData] = useState<T>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    void (async () => {
      try {
        const next = await loader()
        if (!cancelled) {
          setData(next)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setData(fallbackFactory())
          setError(err instanceof Error ? err.message : 'Failed to load data')
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
  }, deps)

  return { data, loading, error }
}

export function useCharacterCardsData() {
  return useAsyncState(
    { items: [], total: 0 },
    () => fetchCharacterCards(),
    () => ({ items: characterCards, total: characterCards.length }),
    [],
  )
}

export function useWorkCardsData() {
  return useAsyncState([], () => fetchWorkCards(), () => workCards, [])
}

export function useCreatorCardsData() {
  return useAsyncState([], () => fetchCreatorCards(), () => creatorCards, [])
}

export function useThemeCardsData() {
  return useAsyncState([], () => fetchThemeCards(), () => themeCards, [])
}

export function useSearchCatalogData(query: string) {
  return useAsyncState(
    {
      characters: [],
      works: [],
      creators: [],
      themes: [],
    },
    async () => {
      if (query.trim()) {
        const data = await fetchApi<SearchApiResponse>(`/search?q=${encodeURIComponent(query.trim())}`)
        return {
          characters: data.characters.map(toCharacterCardItem),
          works: data.works.map(toWorkCardItem),
          creators: data.creators.map(toCreatorCardItem),
          themes: data.themes.map(toThemeCardItem),
        }
      }

      const [characters, works, creators, themes] = await Promise.all([
        fetchCharacterCards(),
        fetchWorkCards(),
        fetchCreatorCards(),
        fetchThemeCards(),
      ])

      return {
        characters: characters.items,
        works,
        creators,
        themes,
      }
    },
    () => ({
      characters: characterCards,
      works: workCards,
      creators: creatorCards,
      themes: themeCards,
    }),
    [query],
  )
}

export function useCharacterDetailData(slug?: string) {
  return useAsyncState(
    null,
    async () => {
      if (!slug) return null
      return await fetchApi<CharacterDetailData>(`/characters/${slug}`)
    },
    () => (slug ? buildFallbackCharacterDetail(slug) : null),
    [slug],
  )
}

export function useRelationshipDetailData(slug?: string) {
  return useAsyncState(
    null,
    async () => {
      if (!slug) return null
      const data = await fetchApi<RelationDetailApiResponse>(`/relations/${slug}`)
      return adaptRelationDetail(data)
    },
    () => (slug ? buildFallbackRelationDetailV2(slug) : null),
    [slug],
  )
}

export function useWorkDetailData(slug?: string) {
  return useAsyncState(
    null,
    async () => {
      if (!slug) return null
      return await fetchApi<WorkDetailData>(`/works/${slug}`)
    },
    () => (slug ? buildFallbackWorkDetail(slug) : null),
    [slug],
  )
}

export function useCreatorDetailData(slug?: string) {
  return useAsyncState(
    null,
    async () => {
      if (!slug) return null
      return await fetchApi<CreatorDetailData>(`/creators/${slug}`)
    },
    () => (slug ? buildFallbackCreatorDetail(slug) : null),
    [slug],
  )
}

export function useThemeDetailData(slug?: string) {
  return useAsyncState(
    null,
    async () => {
      if (!slug) return null
      return await fetchApi<ThemeDetailData>(`/themes/${slug}`)
    },
    () => (slug ? buildFallbackThemeDetail(slug) : null),
    [slug],
  )
}

export function useDiscoverGroups() {
  const [groups, setGroups] = useState<DiscoverGroup[]>([])
  const [totalCharacters, setTotalCharacters] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const [items, characters] = await Promise.all([fetchThemeCards(), fetchCharacterCards()])
        if (cancelled) return
        setGroups(items.map((item) => ({ slug: item.slug, name: item.name, characterCount: item.characterCount })))
        setTotalCharacters(characters.total)
      } catch {
        if (!cancelled) {
          setGroups(
            discoverGroups.map((group) => ({
              slug: group.slug,
              name: group.name,
              characterCount: group.slugs.length,
            })),
          )
          setTotalCharacters(characterCards.length)
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

  return { groups, loading, totalCharacters }
}

export function usePlayerQueue() {
  const [queue, setQueue] = useState<PlayerQueueTrack[]>([])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const items = await fetchPlayerQueue()
        if (!cancelled && items.length > 0) {
          setQueue(items)
        }
      } catch {
        if (!cancelled) {
          setQueue(fallbackPlayerQueue())
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  return queue
}

export const catalogFallback = {
  characterCards,
  workCards,
  creatorCards,
  themeCards,
  featuredSongs,
}



