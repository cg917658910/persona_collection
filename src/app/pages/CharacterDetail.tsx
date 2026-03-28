import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Heart,
  Music,
  Palette,
  Play,
  Share2,
  Tag,
  Target,
  TrendingUp,
  User,
  Users as UsersIcon,
  Zap,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { CharacterCard } from '../components/CharacterCard'
import { RelationshipPreviewCard } from '../components/RelationshipPreviewCard'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { usePlayer } from '../context/PlayerContext'
import { buildCharacterShareUrl } from '../services/api'
import { humanizeCharacterTypeLabel, toCharacterCardItem, useCharacterDetailData } from '../services/catalog'

function upsertMetaTag(attribute: 'name' | 'property', key: string, content: string) {
  if (typeof document === 'undefined') {
    return
  }
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.content = content
}

function syncCharacterShareMeta(name: string, description: string, imageUrl: string, shareUrl: string) {
  if (typeof document === 'undefined') {
    return
  }
  document.title = name
  upsertMetaTag('name', 'description', description)
  upsertMetaTag('property', 'og:type', 'website')
  upsertMetaTag('property', 'og:title', name)
  upsertMetaTag('property', 'og:description', description)
  upsertMetaTag('property', 'og:image', imageUrl)
  upsertMetaTag('property', 'og:url', shareUrl)
  upsertMetaTag('name', 'twitter:card', 'summary_large_image')
  upsertMetaTag('name', 'twitter:title', name)
  upsertMetaTag('name', 'twitter:description', description)
  upsertMetaTag('name', 'twitter:image', imageUrl)
}

export function CharacterDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { playTrack } = usePlayer()
  const { data: character, loading } = useCharacterDetailData(slug)
  const [isLiked, setIsLiked] = useState(false)
  const [lyricsExpanded, setLyricsExpanded] = useState(false)
  const [activeSongSlug, setActiveSongSlug] = useState('')
  const [songsExpanded, setSongsExpanded] = useState(false)

  const songs = useMemo(() => {
    if (!character) return []
    if (character.songs.length > 0) return character.songs
    return character.song ? [character.song] : []
  }, [character])

  useEffect(() => {
    if (songs.length === 0) {
      setActiveSongSlug('')
      return
    }
    setActiveSongSlug((current) => (songs.some((song) => song.slug === current) ? current : songs[0].slug))
  }, [songs])

  const activeSong = useMemo(() => songs.find((song) => song.slug === activeSongSlug) ?? songs[0] ?? null, [activeSongSlug, songs])

  const relationshipCards = useMemo(() => {
    if (!character) return []
    if (character.relationshipPatterns.length > 0) return character.relationshipPatterns
    return Object.entries(character.relationshipProfile)
      .map(([title, value]) => ({ title, value: value?.trim() ?? '' }))
      .filter((item) => item.value)
  }, [character])

  const heroMeta = useMemo(() => {
    if (!character) return ''
    return [character.work?.title, humanizeCharacterTypeLabel(character.characterTypeCode)].filter(Boolean).join(' · ')
  }, [character])

  const heroTags = useMemo(() => {
    if (!character) return []
    if (character.displayTags.length > 0) return character.displayTags
    return [...character.valuesTags.slice(0, 1), ...character.surfaceTraits.slice(0, 2)].filter(Boolean)
  }, [character])

  useEffect(() => {
    if (!character) {
      return
    }
    syncCharacterShareMeta(
      character.name,
      character.oneLineDefinition || character.summary || character.name,
      character.coverUrl,
      buildCharacterShareUrl(character.slug),
    )
  }, [character])

  async function handleShare() {
    if (!character) {
      return
    }
    const shareUrl = buildCharacterShareUrl(character.slug)
    const shareData = {
      title: character.name,
      text: character.oneLineDefinition || character.summary || character.name,
      url: shareUrl,
    }

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share(shareData)
      return
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl)
      window.alert('分享链接已复制')
      return
    }

    //window.prompt('复制分享链接', shareUrl)
  }

  if (loading && !character) {
    return <div className="flex min-h-full items-center justify-center text-[#6C7A89]">加载中...</div>
  }

  if (!character) {
    return <div className="flex min-h-full items-center justify-center text-[#6C7A89]">人物未找到</div>
  }

  const coreUnderstanding = [
    {
      title: '他是谁',
      content: character.coreIdentity,
      icon: User,
      gradient: 'linear-gradient(135deg, rgba(214, 179, 106, 0.15) 0%, rgba(108, 122, 137, 0.05) 100%)',
    },
    {
      title: '他在追什么',
      content: character.primaryMotivation,
      icon: Target,
      gradient: 'linear-gradient(135deg, rgba(108, 122, 137, 0.15) 0%, rgba(214, 179, 106, 0.05) 100%)',
    },
    {
      title: '他最怕什么',
      content: character.coreFear,
      icon: AlertCircle,
      gradient: 'linear-gradient(135deg, rgba(214, 179, 106, 0.12) 0%, rgba(108, 122, 137, 0.08) 100%)',
    },
    {
      title: '他的冲突',
      content: character.coreConflict,
      icon: Zap,
      gradient: 'linear-gradient(135deg, rgba(108, 122, 137, 0.12) 0%, rgba(214, 179, 106, 0.08) 100%)',
    },
  ].filter((item) => item.content)

  const personalitySections = [
    {
      title: '表面给人的感觉',
      tags: character.surfaceTraits,
      description: character.summary,
    },
    {
      title: '内里真正的伤口',
      tags: character.deepTraits,
      description: character.psychologicalWound,
    },
    {
      title: '长期主导情绪',
      tags: character.dominantEmotions,
      description:
        character.suppressedEmotions.length > 0
          ? `主导情绪：${character.dominantEmotions.join(' / ')}；压抑情绪：${character.suppressedEmotions.join(' / ')}`
          : character.dominantEmotions.join(' / '),
    },
    {
      title: '最看重的价值',
      tags: character.valuesTags,
      description:
        character.valuesTags.length > 0 ? `他不会轻易放弃这些东西：${character.valuesTags.join(' / ')}` : '暂无价值标签',
    },
  ].filter((section) => section.tags.length > 0 || section.description)

  return (
    <div className="min-h-full pb-6">
      <div className="relative overflow-hidden" style={{ height: '60vh' }}>
        <motion.div initial={{ scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} className="h-full w-full">
          <ImageWithFallback src={character.coverUrl} alt={character.name} fallbackLabel={character.name} className="h-full w-full object-cover" loading="eager" />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(15,17,21,0.96) 0%, rgba(15,17,21,0.78) 38%, rgba(15,17,21,0.35) 68%, transparent 100%)',
          }}
        />
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate(-1)}
          className="absolute left-5 top-6 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm"
          style={{ background: 'rgba(26,29,35,0.6)' }}
        >
          <ArrowLeft size={20} style={{ color: '#FFFFFF' }} />
        </motion.button>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="absolute right-5 top-6 flex gap-2">
          <button onClick={() => setIsLiked(!isLiked)} className="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm" style={{ background: 'rgba(26,29,35,0.6)' }}>
            <Heart size={20} fill={isLiked ? '#D6B36A' : 'none'} style={{ color: isLiked ? '#D6B36A' : '#FFFFFF' }} />
          </button>
          <button
            onClick={() => {
              void handleShare()
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm"
            style={{ background: 'rgba(26,29,35,0.6)' }}
          >
            <Share2 size={20} style={{ color: '#FFFFFF' }} />
          </button>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 px-5 pb-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
            {heroMeta ? (
              <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(214,179,106,0.12)', color: '#D6B36A' }}>
                {heroMeta}
              </div>
            ) : null}
            <h1 className="mb-2 text-4xl" style={{ color: '#FFFFFF', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              {character.name}
            </h1>
            <p className="mb-5 text-base leading-relaxed" style={{ color: '#E7ECF2' }}>
              {character.oneLineDefinition}
            </p>
            <div className="mb-5 flex flex-wrap gap-2">
              {heroTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1.5 text-xs backdrop-blur-sm"
                  style={{ background: 'rgba(26,29,35,0.7)', color: '#D6B36A', border: '1px solid rgba(214,179,106,0.3)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
            {activeSong ? (
              <div>
                <div className="flex gap-3">
                  <button
                    className="flex items-center gap-3 rounded-full px-6 py-4"
                    style={{ background: '#D6B36A', color: '#0F1115' }}
                    onClick={() =>
                      void playTrack({
                        title: activeSong.title,
                        subtitle: character.name,
                        coverUrl: activeSong.coverUrl,
                        audioUrl: activeSong.audioUrl,
                        characterSlug: character.slug,
                      })
                    }
                  >
                    <Play size={18} fill="#0F1115" />
                    <span>播放人物之歌</span>
                  </button>
                  <button
                    className="rounded-full px-6 py-4"
                    style={{ background: 'rgba(255,255,255,0.12)', color: '#FFFFFF' }}
                    onClick={() => setSongsExpanded((value) => !value)}
                  >
                    歌曲列表
                  </button>
                </div>
                {songsExpanded ? (
                  <div className="mt-3 rounded-2xl p-3 backdrop-blur-sm" style={{ background: 'rgba(26,29,35,0.72)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="space-y-1">
                      {songs.map((song) => {
                        const isActive = song.slug === activeSong.slug
                        return (
                          <button
                            key={song.slug}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left transition-colors"
                            style={{
                              background: isActive ? 'rgba(214,179,106,0.16)' : 'transparent',
                              color: isActive ? '#FFFFFF' : '#ADB7C2',
                            }}
                            onClick={() => {
                              setActiveSongSlug(song.slug)
                              setSongsExpanded(false)
                            }}
                          >
                            <div className="min-w-0 flex-1 truncate text-sm">{song.title}</div>
                            {isActive ? <Play size={12} style={{ color: '#D6B36A' }} /> : null}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        </div>
      </div>

      <div className="px-5 py-6">
        {coreUnderstanding.length > 0 ? (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={18} style={{ color: '#D6B36A' }} />
              <h2 style={{ color: '#FFFFFF' }}>核心理解</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {coreUnderstanding.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.25 + index * 0.06 }}
                    className="rounded-2xl p-4"
                    style={{ background: item.gradient, border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <Icon size={16} style={{ color: '#D6B36A' }} />
                      <span className="text-xs" style={{ color: '#D6B36A' }}>
                        {item.title}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#E7ECF2' }}>
                      {item.content}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </section>
        ) : null}

        {personalitySections.length > 0 ? (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Tag size={18} style={{ color: '#D6B36A' }} />
              <h2 style={{ color: '#FFFFFF' }}>性格与情绪</h2>
            </div>
            <div className="space-y-3">
              {personalitySections.map((section) => (
                <div key={section.title} className="rounded-2xl p-4" style={{ background: '#1A1D23' }}>
                  <div className="mb-3 text-sm" style={{ color: '#FFFFFF' }}>
                    {section.title}
                  </div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {section.tags.map((tag) => (
                      <span key={tag} className="rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(108,122,137,0.15)', color: '#ADB7C2' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#6C7A89' }}>
                    {section.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {character.timeline.length > 0 ? (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={18} style={{ color: '#D6B36A' }} />
              <h2 style={{ color: '#FFFFFF' }}>命运轨迹</h2>
            </div>
            <div className="rounded-2xl p-5" style={{ background: '#1A1D23' }}>
              <div className="space-y-6">
                {character.timeline.map((item, index) => (
                  <div key={`${item.year}-${item.event}`} className="relative pl-7">
                    <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full" style={{ background: '#D6B36A' }} />
                    {index < character.timeline.length - 1 ? (
                      <div className="absolute left-[5px] top-5 w-px" style={{ height: '54px', background: 'rgba(214,179,106,0.2)' }} />
                    ) : null}
                    <div className="mb-1 text-xs" style={{ color: '#D6B36A' }}>
                      阶段 {item.year}
                    </div>
                    <h4 className="mb-1" style={{ color: '#FFFFFF' }}>
                      {item.event}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#6C7A89' }}>
                      {item.emotion}
                    </p>
                  </div>
                ))}
              </div>
              {character.endingState ? (
                <div className="mt-6 rounded-xl p-4" style={{ background: 'rgba(214,179,106,0.08)' }}>
                  <div className="mb-2 text-xs" style={{ color: '#D6B36A' }}>
                    结局状态
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: '#E7ECF2' }}>
                    {character.endingState}
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {relationshipCards.length > 0 ? (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <UsersIcon size={18} style={{ color: '#D6B36A' }} />
              <h2 style={{ color: '#FFFFFF' }}>关系模式</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {relationshipCards.map((item) => (
                <div key={item.title} className="w-[260px] flex-shrink-0 rounded-2xl p-4" style={{ background: '#1A1D23' }}>
                  <div className="mb-2 text-sm" style={{ color: '#FFFFFF' }}>
                    {item.title}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#6C7A89' }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {character.keyRelationships?.length > 0 ? (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <UsersIcon size={18} style={{ color: '#D6B36A' }} />
              <h2 style={{ color: '#FFFFFF' }}>关键关系</h2>
            </div>
            <div className="space-y-3">
              {character.keyRelationships.map((item) => (
                <RelationshipPreviewCard key={item.id} relationship={item} />
              ))}
            </div>
          </section>
        ) : null}

        {(character.colors.length > 0 || character.symbolicImages.length > 0 || character.soundscapeKeywords.length > 0) ? (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Palette size={18} style={{ color: '#D6B36A' }} />
              <h2 style={{ color: '#FFFFFF' }}>象征意象</h2>
            </div>
            <div className="rounded-2xl p-5" style={{ background: '#1A1D23' }}>
              {character.colors.length > 0 ? (
                <div className="mb-5">
                  <div className="mb-3 text-xs" style={{ color: '#6C7A89' }}>
                    颜色
                  </div>
                  <div className="flex gap-3">
                    {character.colors.map((color) => (
                      <div key={`${color.name}-${color.hex}`} className="text-center">
                        <div className="mb-2 h-10 w-10 rounded-full border" style={{ background: color.hex, borderColor: 'rgba(255,255,255,0.08)' }} />
                        <div className="text-[11px]" style={{ color: '#ADB7C2' }}>
                          {color.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="space-y-4">
                {character.symbolicImages.length > 0 ? (
                  <div>
                    <div className="mb-2 text-xs" style={{ color: '#6C7A89' }}>
                      意象
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {character.symbolicImages.map((item) => (
                        <span key={item} className="rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(108,122,137,0.15)', color: '#ADB7C2' }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {character.soundscapeKeywords.length > 0 ? (
                  <div>
                    <div className="mb-2 text-xs" style={{ color: '#6C7A89' }}>
                      声场
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {character.soundscapeKeywords.map((item) => (
                        <span key={item} className="rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(108,122,137,0.15)', color: '#ADB7C2' }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {activeSong ? (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Music size={18} style={{ color: '#D6B36A' }} />
              <h2 style={{ color: '#FFFFFF' }}>人物之歌</h2>
            </div>
            <div className="overflow-hidden rounded-2xl" style={{ background: '#1A1D23' }}>
              <div className="relative h-56 overflow-hidden">
                <ImageWithFallback src={activeSong.coverUrl} alt={activeSong.title} fallbackLabel={character.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,29,35,0.96) 0%, rgba(26,29,35,0.25) 100%)' }} />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5">
                  <div>
                    <div className="mb-1 text-xs" style={{ color: '#D6B36A' }}>
                      {character.creator?.name}
                    </div>
                    <h3 className="mb-2 text-xl" style={{ color: '#FFFFFF' }}>
                      {activeSong.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#E7ECF2' }}>
                      {activeSong.songCoreTheme}
                    </p>
                  </div>
                  <button
                    className="flex h-14 w-14 items-center justify-center rounded-full"
                    style={{ background: '#D6B36A', color: '#0F1115' }}
                    onClick={() =>
                      void playTrack({
                        title: activeSong.title,
                        subtitle: character.name,
                        coverUrl: activeSong.coverUrl,
                        audioUrl: activeSong.audioUrl,
                        characterSlug: character.slug,
                      })
                    }
                  >
                    <Play size={18} fill="#0F1115" />
                  </button>
                </div>
              </div>
              <div className="space-y-4 p-5">
                {activeSong.emotionalCurve.length > 0 ? (
                  <div className="rounded-xl p-4" style={{ background: 'rgba(15,17,21,0.45)' }}>
                    <div className="mb-2 text-xs" style={{ color: '#6C7A89' }}>
                      情绪曲线
                    </div>
                    <div className="text-sm" style={{ color: '#E7ECF2' }}>
                      {activeSong.emotionalCurve.join(' -> ')}
                    </div>
                  </div>
                ) : null}
                {activeSong.songStyles.length > 0 ? (
                  <div className="rounded-xl p-4" style={{ background: 'rgba(15,17,21,0.45)' }}>
                    <div className="mb-2 text-xs" style={{ color: '#6C7A89' }}>
                      风格
                    </div>
                    <div className="text-sm" style={{ color: '#E7ECF2' }}>
                      {activeSong.songStyles.join(' / ')}
                    </div>
                  </div>
                ) : null}
                {activeSong.vocalProfile ? (
                  <div className="rounded-xl p-4" style={{ background: 'rgba(15,17,21,0.45)' }}>
                    <div className="mb-2 text-xs" style={{ color: '#6C7A89' }}>
                      音色
                    </div>
                    <div className="text-sm" style={{ color: '#E7ECF2' }}>
                      {activeSong.vocalProfile}
                    </div>
                  </div>
                ) : null}
                <div className="rounded-xl p-4" style={{ background: 'rgba(15,17,21,0.45)' }}>
                  <button className="flex w-full items-center justify-between" onClick={() => setLyricsExpanded(!lyricsExpanded)}>
                    <span className="text-sm" style={{ color: '#FFFFFF' }}>
                      歌词片段
                    </span>
                    {lyricsExpanded ? <ChevronUp size={16} style={{ color: '#6C7A89' }} /> : <ChevronDown size={16} style={{ color: '#6C7A89' }} />}
                  </button>
                  <AnimatePresence>
                    {lyricsExpanded ? (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-3 border-t pt-3" style={{ borderColor: 'rgba(108,122,137,0.15)' }}>
                          {activeSong.lyrics.map((line, idx) => (
                            <p key={idx} className="mb-2 text-sm leading-relaxed" style={{ color: '#6C7A89' }}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section>
          <div className="mb-4 flex items-center gap-2">
            <BookOpen size={18} style={{ color: '#D6B36A' }} />
            <h2 style={{ color: '#FFFFFF' }}>继续探索</h2>
          </div>
          <div className="mb-4 space-y-3">
            {character.work ? (
              <div className="cursor-pointer rounded-2xl p-4" style={{ background: '#1A1D23' }} onClick={() => navigate(`/work/${character.work?.slug}`)}>
                <div className="mb-1 text-xs" style={{ color: '#6C7A89' }}>
                  所属作品
                </div>
                <div style={{ color: '#FFFFFF' }}>{character.work.title}</div>
              </div>
            ) : null}
            {character.creator ? (
              <div className="cursor-pointer rounded-2xl p-4" style={{ background: '#1A1D23' }} onClick={() => navigate(`/creator/${character.creator?.slug}`)}>
                <div className="mb-1 text-xs" style={{ color: '#6C7A89' }}>
                  创作者
                </div>
                <div style={{ color: '#FFFFFF' }}>{character.creator.name}</div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            {character.similarCharacters.map((item) => (
              <CharacterCard key={item.id} character={toCharacterCardItem(item)} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
