export type RelationPaletteItem = {
  name?: string
  hex: string
}

export type RelationEventApiItem = {
  stage_no: number
  stage_code?: string
  title: string
  summary?: string
  tension_shift?: string
  power_shift?: string
  fate_impact?: string
  source_state?: string
  target_state?: string
  event_quote?: string
  color_hex?: string
}

export type RelationSongApiItem = {
  slug: string
  title: string
  subtitle?: string
  summary?: string
  cover_url?: string
  audio_url?: string
  song_core_theme?: string
  song_emotional_curve?: string
  song_styles?: string[]
  vocal_profile?: string
  lyric?: string
}

export type RelationLinkApiItem = {
  slug: string
  title: string
  subtitle?: string
  cover_url?: string
  link_type_code: string
  reason?: string
}

export type RelationDetailApiResponse = {
  slug: string
  name: string
  subtitle?: string
  relation_type_code?: string
  relation_type_name?: string
  source_character_slug: string
  source_character_name: string
  source_character_cover_url?: string
  target_character_slug: string
  target_character_name: string
  target_character_cover_url?: string
  work_slug?: string
  work_name?: string
  core_tension?: string
  emotional_tone?: string
  one_line_definition?: string
  summary?: string
  cover_url?: string
  connection_trigger?: string
  sustaining_mechanism?: string
  relation_conflict?: string
  relation_arc?: string
  fate_impact?: string
  power_structure?: string
  dependency_pattern?: string
  source_perspective?: string
  source_desire_in_relation?: string
  source_fear_in_relation?: string
  source_unsaid?: string
  target_perspective?: string
  target_desire_in_relation?: string
  target_fear_in_relation?: string
  target_unsaid?: string
  phenomenology?: {
    body?: string
    time?: string
    space?: string
    gaze?: string
    language?: string
  } | null
  relation_palette?: RelationPaletteItem[]
  symbolic_images?: string[]
  relation_keywords?: string[]
  relation_events?: RelationEventApiItem[]
  primary_song?: RelationSongApiItem | null
  related_relations?: RelationLinkApiItem[]
}

export type RelationshipDetailData = {
  slug: string
  name: string
  heroTitle: string
  heroSubtitle: string
  heroTension: string
  workName: string
  coverUrl: string
  description: string
  summary: string
  heroTags: string[]
  sourceCharacter: {
    slug: string
    name: string
    coverUrl: string
  }
  targetCharacter: {
    slug: string
    name: string
    coverUrl: string
  }
  coreDynamicCards: Array<{
    key: string
    title: string
    content: string
  }>
  powerStructure: string
  dependencyPattern: string
  relationArc: string
  relationEvents: Array<{
    stageNo: number
    stageCode: string
    title: string
    summary: string
    tensionShift: string
    powerShift: string
    fateImpact: string
    quote: string
    colorHex: string
  }>
  perspectives: Array<{
    key: 'source' | 'target'
    accentColor: string
    name: string
    perspective: string
    desire: string
    fear: string
    unspoken: string
  }>
  phenomenologyItems: Array<{
    key: string
    label: string
    content: string
  }>
  relationPalette: RelationPaletteItem[]
  symbolicImages: string[]
  relationKeywords: string[]
  primarySong: {
    slug: string
    title: string
    subtitle: string
    summary: string
    coverUrl: string
    audioUrl: string
    songCoreTheme: string
    songEmotionalCurve: string
    songStyles: string[]
    vocalProfile: string
    lyric: string
  } | null
  relatedRelations: Array<{
    slug: string
    title: string
    subtitle: string
    coverUrl: string
    linkTypeCode: string
    reason: string
  }>
}

function compactStrings(items: Array<string | undefined | null>) {
  return items.map((item) => item?.trim() ?? '').filter(Boolean)
}

function uniqueStrings(items: Array<string | undefined | null>) {
  return Array.from(new Set(compactStrings(items)))
}

function buildHeroTitle(api: RelationDetailApiResponse) {
  const source = api.source_character_name?.trim() ?? ''
  const target = api.target_character_name?.trim() ?? ''
  if (source && target) {
    return `${source} × ${target}`
  }
  return api.name
}

function buildHeroSubtitle(api: RelationDetailApiResponse) {
  return compactStrings([api.work_name]).join(' | ')
}

export function adaptRelationDetail(api: RelationDetailApiResponse): RelationshipDetailData {
  const description = api.one_line_definition?.trim() || api.summary?.trim() || ''
  const summary = api.summary?.trim() ?? ''

  return {
    slug: api.slug,
    name: api.name,
    heroTitle: buildHeroTitle(api),
    heroSubtitle: buildHeroSubtitle(api),
    heroTension: api.core_tension?.trim() || api.relation_conflict?.trim() || api.emotional_tone?.trim() || '',
    workName: api.work_name?.trim() ?? '',
    coverUrl: api.cover_url?.trim() ?? '',
    description,
    summary,
    heroTags: uniqueStrings([api.relation_type_name, ...(api.relation_keywords ?? [])]).slice(0, 6),
    sourceCharacter: {
      slug: api.source_character_slug,
      name: api.source_character_name,
      coverUrl: api.source_character_cover_url?.trim() ?? '',
    },
    targetCharacter: {
      slug: api.target_character_slug,
      name: api.target_character_name,
      coverUrl: api.target_character_cover_url?.trim() ?? '',
    },
    coreDynamicCards: [
      { key: 'connection_trigger', title: '为什么他们会靠近', content: api.connection_trigger?.trim() ?? '' },
      { key: 'sustaining_mechanism', title: '这段关系靠什么维持', content: api.sustaining_mechanism?.trim() ?? '' },
      { key: 'relation_conflict', title: '这段关系最深的拉扯是什么', content: api.relation_conflict?.trim() ?? '' },
      { key: 'fate_impact', title: '它最终会把双方带向哪里', content: api.fate_impact?.trim() ?? '' },
    ].filter((item) => item.content),
    powerStructure: api.power_structure?.trim() ?? '',
    dependencyPattern: api.dependency_pattern?.trim() ?? '',
    relationArc: api.relation_arc?.trim() ?? '',
    relationEvents: (api.relation_events ?? []).map((item) => ({
      stageNo: item.stage_no,
      stageCode: item.stage_code?.trim() ?? '',
      title: item.title,
      summary: item.summary?.trim() ?? '',
      tensionShift: item.tension_shift?.trim() ?? '',
      powerShift: item.power_shift?.trim() ?? '',
      fateImpact: item.fate_impact?.trim() ?? '',
      quote: item.event_quote?.trim() ?? '',
      colorHex: item.color_hex?.trim() ?? '',
    })),
    perspectives: [
      {
        key: 'source',
        accentColor: '#C6A86A',
        name: api.source_character_name,
        perspective: api.source_perspective?.trim() ?? '',
        desire: api.source_desire_in_relation?.trim() ?? '',
        fear: api.source_fear_in_relation?.trim() ?? '',
        unspoken: api.source_unsaid?.trim() ?? '',
      },
      {
        key: 'target',
        accentColor: '#6E2C35',
        name: api.target_character_name,
        perspective: api.target_perspective?.trim() ?? '',
        desire: api.target_desire_in_relation?.trim() ?? '',
        fear: api.target_fear_in_relation?.trim() ?? '',
        unspoken: api.target_unsaid?.trim() ?? '',
      },
    ].filter((item) => item.perspective || item.desire || item.fear || item.unspoken),
    phenomenologyItems: [
      { key: 'body', label: '身体感', content: api.phenomenology?.body?.trim() ?? '' },
      { key: 'time', label: '时间感', content: api.phenomenology?.time?.trim() ?? '' },
      { key: 'space', label: '空间感', content: api.phenomenology?.space?.trim() ?? '' },
      { key: 'gaze', label: '目光感', content: api.phenomenology?.gaze?.trim() ?? '' },
      { key: 'language', label: '语言感', content: api.phenomenology?.language?.trim() ?? '' },
    ].filter((item) => item.content),
    relationPalette: (api.relation_palette ?? []).filter((item) => item?.hex?.trim()),
    symbolicImages: compactStrings(api.symbolic_images ?? []),
    relationKeywords: compactStrings(api.relation_keywords ?? []),
    primarySong: api.primary_song
      ? {
          slug: api.primary_song.slug,
          title: api.primary_song.title,
          subtitle: api.primary_song.subtitle?.trim() ?? '',
          summary: api.primary_song.summary?.trim() ?? '',
          coverUrl: api.primary_song.cover_url?.trim() ?? '',
          audioUrl: api.primary_song.audio_url?.trim() ?? '',
          songCoreTheme: api.primary_song.song_core_theme?.trim() ?? '',
          songEmotionalCurve: api.primary_song.song_emotional_curve?.trim() ?? '',
          songStyles: compactStrings(api.primary_song.song_styles ?? []),
          vocalProfile: api.primary_song.vocal_profile?.trim() ?? '',
          lyric: api.primary_song.lyric?.trim() ?? '',
        }
      : null,
    relatedRelations: (api.related_relations ?? []).map((item) => ({
      slug: item.slug,
      title: item.title,
      subtitle: item.subtitle?.trim() ?? '',
      coverUrl: item.cover_url?.trim() ?? '',
      linkTypeCode: item.link_type_code,
      reason: item.reason?.trim() ?? '',
    })),
  }
}
