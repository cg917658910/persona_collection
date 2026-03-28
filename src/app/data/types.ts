export type PMCharacterTypeCode = "historical" | "literary" | "film_tv" | "anime" | "real";

export interface PMCreator {
  id: string;
  slug: string;
  name: string;
  summary: string;
  creatorTypeCode: string;
  regionCode: string;
  culturalRegionCode: string;
  eraText: string;
  coverUrl: string;
  workSlugs?: string[];
}

export interface PMWork {
  id: string;
  slug: string;
  title: string;
  summary: string;
  workTypeCode: string;
  regionCode: string;
  culturalRegionCode: string;
  eraText: string;
  releaseYear?: number;
  coverUrl: string;
  creatorSlugs: string[];
  characterSlugs?: string[];
}

export interface PMSong {
  id: string;
  slug: string;
  characterSlug: string;
  title: string;
  summary: string;
  coverUrl: string;
  audioUrl: string;
  songCoreTheme: string;
  songStyles: string[];
  tempoBpm?: number;
  vocalProfile: string;
  emotionalCurve: string[];
  lyricPreview: string;
}

export interface PMTheme {
  id: string;
  slug: string;
  code: string;
  name: string;
  summary: string;
  category: string;
  coverUrl: string;
  characterSlugs: string[];
}

export interface PMCharacter {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  characterTypeCode: PMCharacterTypeCode;
  subtype: string;
  gender: string;
  regionCode: string;
  culturalRegionCode: string;
  eraText: string;
  summary: string;
  coverUrl: string;
  oneLineDefinition: string;
    coreIdentity: string;
    motivationNote?: string;
    coreFear: string;
  coreConflict: string;
  primaryMotivation: string;
  primaryTheme: string;
  emotionalTone: string;
  emotionalTemperature: "low" | "medium" | "high";
  psychologicalWound: string;
  fateArc: string;
  endingState: string;
  surfaceTraits: string[];
  deepTraits: string[];
  dominantEmotions: string[];
  suppressedEmotions: string[];
  valuesTags: string[];
  symbolicImages: string[];
  colors: Array<{ name: string; hex: string }>;
  elements: string[];
  soundscapeKeywords: string[];
  relationshipProfile: {
    love?: string;
    authority?: string;
    friends?: string;
    enemies?: string;
  };
  timeline: Array<{ title: string; summary: string }>;
  workSlugs: string[];
  creatorSlugs: string[];
  songSlugs: string[];
  themeSlugs?: string[];
  similarCharacterSlugs: string[];
}

export interface CharacterListItem {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  themeSong: string;
  workTitle: string;
  hasSong: boolean;
  typeCode: PMCharacterTypeCode;
}

export interface WorkCardItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  meta: string;
  creatorName: string;
  characterCount: number;
}

export interface CreatorCardItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  meta: string;
  workCount: number;
}

export interface ThemeCardItem {
    id: string;
    slug: string;
    name: string;
    description: string;
    imageUrl: string;
    meta: string;
    characterCount: number;
    subjectType?: 'character' | 'relation';
  }

export interface CharacterDetailView {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  quote: string;
  psychology: string;
  fate: string;
  emotion: string;
  themeSong: string;
  artist: string;
  imageUrl: string;
  tags: string[];
  identity: string;
  desire: string;
  fear: string;
  conflict: string;
  traits: string[];
  emotionalStructure: string;
  values: string[];
  timeline: Array<{ year: string; event: string; emotion: string }>;
  relationships: {
    love?: string;
    authority?: string;
    friends?: string;
    enemies?: string;
  };
  symbolColors: string[];
  symbols: string[];
  songStyle: string;
  emotionalCurve: string;
  lyrics: string[];
  relatedWorks: string[];
  creators: string[];
  similarCharacters: string[];
}
