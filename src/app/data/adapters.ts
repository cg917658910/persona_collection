import { characters } from './characters'
import { creators } from './creators'
import { songs } from './songs'
import { themes } from './themes'
import { works } from './works'
import type { CharacterDetailView, CharacterListItem, CreatorCardItem, PMCharacter, ThemeCardItem, WorkCardItem } from './types'

export const getWorkBySlug = (slug: string) => works.find((item) => item.slug === slug)
export const getCreatorBySlug = (slug: string) => creators.find((item) => item.slug === slug)
export const getSongBySlug = (slug: string) => songs.find((item) => item.slug === slug)
export const getCharacterBySlug = (slug: string) => characters.find((item) => item.slug === slug)
export const getThemeBySlug = (slug: string) => themes.find((item) => item.slug === slug)
export const getSongsByCharacterSlug = (slug: string) => songs.filter((item) => item.characterSlug === slug)
export const getCharactersByWorkSlug = (slug: string) => characters.filter((item) => item.workSlugs.includes(slug))
export const getWorksByCreatorSlug = (slug: string) => works.filter((item) => item.creatorSlugs.includes(slug))
export const getCharactersByThemeSlug = (slug: string) => {
  const theme = themes.find((item) => item.slug === slug)
  if (theme?.characterSlugs?.length) {
    return theme.characterSlugs.map(getCharacterBySlug).filter(Boolean) as PMCharacter[]
  }
  return characters.filter((item) => item.themeSlugs?.includes(slug))
}
export const getCharactersByType = (type?: string) => type ? characters.filter((item) => item.characterTypeCode === type) : characters

export function mapCharacterToCard(character: PMCharacter): CharacterListItem {
  const primaryWork = getWorkBySlug(character.workSlugs[0])
  const primarySong = getSongBySlug(character.songSlugs[0])
  return {
    id: character.id,
    slug: character.slug,
    name: character.name,
    title: character.coreIdentity,
    description: character.oneLineDefinition,
    imageUrl: character.coverUrl,
    tags: [character.primaryTheme, ...character.surfaceTraits.slice(0, 2)],
    themeSong: primarySong?.title ?? '暂无人物之歌',
    workTitle: primaryWork?.title ?? '',
    hasSong: Boolean(primarySong),
    typeCode: character.characterTypeCode,
  }
}

export function mapCharacterToDetail(character: PMCharacter): CharacterDetailView {
  const primaryWork = getWorkBySlug(character.workSlugs[0])
  const primarySong = getSongBySlug(character.songSlugs[0])
  const primaryCreator = getCreatorBySlug(character.creatorSlugs[0])
  return {
    id: character.id,
    slug: character.slug,
    name: character.name,
    title: `${primaryWork?.title ?? ''} · ${humanizeCharacterType(character.characterTypeCode)}`,
    description: character.summary,
    quote: character.oneLineDefinition,
    psychology: character.psychologicalWound,
    fate: character.fateArc,
    emotion: character.emotionalTone,
    themeSong: primarySong?.title ?? '暂无人物之歌',
    artist: primaryCreator?.name ?? '未知创作者',
    imageUrl: character.coverUrl,
    tags: [character.primaryTheme, ...character.surfaceTraits.slice(0, 2)],
    identity: character.coreIdentity,
    desire: character.primaryMotivation,
    fear: character.coreFear,
    conflict: character.coreConflict,
    traits: [...character.surfaceTraits, ...character.deepTraits].slice(0, 6),
    emotionalStructure: `主导情绪：${character.dominantEmotions.join('、')}；压抑情绪：${character.suppressedEmotions.join('、')}。`,
    values: character.valuesTags,
    timeline: character.timeline.map((node, index) => ({ year: String(index + 1).padStart(2, '0'), event: node.title, emotion: node.summary })),
    relationships: character.relationshipProfile,
    symbolColors: character.colors.map((item) => item.hex),
    symbols: [...character.symbolicImages, ...character.elements].slice(0, 6),
    songStyle: primarySong?.songStyles.join(' / ') ?? '',
    emotionalCurve: primarySong?.emotionalCurve.join(' → ') ?? '',
    lyrics: primarySong?.lyricPreview ? [primarySong.lyricPreview] : [],
    relatedWorks: character.workSlugs.map((slug) => getWorkBySlug(slug)?.title).filter(Boolean) as string[],
    creators: character.creatorSlugs.map((slug) => getCreatorBySlug(slug)?.name).filter(Boolean) as string[],
    similarCharacters: character.similarCharacterSlugs.map((slug) => getCharacterBySlug(slug)?.name).filter(Boolean) as string[],
  }
}

export const mapWorkToCard = (work): WorkCardItem => ({
  id: work.id,
  slug: work.slug,
  title: work.title,
  description: work.summary,
  imageUrl: work.coverUrl,
  meta: `${humanizeWorkType(work.workTypeCode)} · ${work.releaseYear ?? '未知年代'}`,
  creatorName: work.creatorSlugs.map((slug) => getCreatorBySlug(slug)?.name).filter(Boolean).join('、'),
  characterCount: getCharactersByWorkSlug(work.slug).length,
})

export const mapCreatorToCard = (creator): CreatorCardItem => ({
  id: creator.id,
  slug: creator.slug,
  name: creator.name,
  description: creator.summary,
  imageUrl: creator.coverUrl,
  meta: `${humanizeCreatorType(creator.creatorTypeCode)} · ${creator.eraText}`,
  workCount: getWorksByCreatorSlug(creator.slug).length,
})

export const mapThemeToCard = (theme): ThemeCardItem => ({
  id: theme.id,
  slug: theme.slug,
  name: theme.name,
  description: theme.summary,
  imageUrl: theme.coverUrl,
  meta: `${humanizeThemeCategory(theme.category)} · ${getCharactersByThemeSlug(theme.slug).length} 位人物`,
  characterCount: getCharactersByThemeSlug(theme.slug).length,
})

export const characterCards = characters.map(mapCharacterToCard)
export const workCards = works.map(mapWorkToCard)
export const creatorCards = creators.map(mapCreatorToCard)
export const themeCards = themes.map(mapThemeToCard)
export const featuredCharacter = characterCards[0]
export const featuredSongs = songs.map((song) => ({ ...song, characterName: getCharacterBySlug(song.characterSlug)?.name ?? '' }))
export const featuredWorks = workCards.slice(0, 6)

export const discoverGroups = themes.map((theme) => ({ name: theme.name, slugs: getCharactersByThemeSlug(theme.slug).map((item) => item.slug), slug: theme.slug }))

export function humanizeCharacterType(type: string) {
  const map: Record<string, string> = { historical: '历史人物', literary: '文学人物', film_tv: '影视人物', anime: '动漫人物', real: '现实人物' }
  return map[type] ?? type
}
export function humanizeWorkType(type: string) {
  const map: Record<string, string> = { novel: '小说', drama: '戏剧', film: '电影', tv_series: '电视剧', animation: '动画', anime_series: '动画剧集', history_text: '历史著作' }
  return map[type] ?? type
}
export function humanizeCreatorType(type: string) {
  const map: Record<string, string> = { author: '作者', playwright: '剧作家', director: '导演', mangaka: '漫画家', historian: '史学家' }
  return map[type] ?? type
}
export function humanizeThemeCategory(type: string) {
  const map: Record<string, string> = { spirit: '精神结构', emotion: '情绪底色', relation: '关系模式', fate: '命运形态' }
  return map[type] ?? type
}
