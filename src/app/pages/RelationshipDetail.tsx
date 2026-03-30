import {
  ChevronDown,
  Eye,
  Flame,
  Music,
  Palette,
  Play,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { usePlayer } from '../context/PlayerContext'
import { buildRelationShareUrl } from '../services/api'
import { useRelationshipDetailData } from '../services/catalog'

function SectionTitle({
  title,
  icon: Icon,
  action,
}: {
  title: string
  icon?: LucideIcon
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        {Icon ? (
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{
              backgroundColor: 'rgba(198, 168, 106, 0.12)',
              color: '#C6A86A',
              border: '1px solid rgba(198, 168, 106, 0.2)',
            }}
          >
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <h2 className="text-2xl" style={{ color: '#F5F3EE', letterSpacing: '0.02em' }}>
          {title}
        </h2>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl backdrop-blur-sm ${className}`.trim()}
      style={{
        backgroundColor: '#171A20',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.24)',
      }}
    >
      {children}
    </div>
  )
}

function mapLinkTypeLabel(code: string) {
  switch (code.trim()) {
    case 'mirror':
      return '镜像关系'
    case 'same_work':
      return '同作品关系'
    case 'related':
      return '相似关系'
    case 'contrast':
      return '对照关系'
    default:
      return code || '相关关系'
  }
}

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

function syncRelationShareMeta(name: string, description: string, imageUrl: string, shareUrl: string) {
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

function CharacterBadge({
  name,
  coverUrl,
  onClick,
}: {
  name: string
  coverUrl: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-fit items-center gap-3 rounded-full pr-5 text-left transition-transform hover:-translate-y-0.5"
      style={{
        backgroundColor: 'rgba(14, 16, 21, 0.42)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 10px 28px rgba(0, 0, 0, 0.18)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <ImageWithFallback
        src={coverUrl}
        alt={name}
        fallbackLabel={name}
        className="h-11 w-11 rounded-full object-cover"
      />
      <span className="text-[1.02rem]" style={{ color: '#F5F3EE' }}>
        {name}
      </span>
    </button>
  )
}

export function RelationshipDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { currentTrack, isPlaying, playTrack, toggle } = usePlayer()
  const { data: relationship, loading } = useRelationshipDetailData(slug)
  const [lyricsExpanded, setLyricsExpanded] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (!relationship) {
      return
    }
    syncRelationShareMeta(
      relationship.heroTitle,
      relationship.description || relationship.summary || relationship.heroTitle,
      relationship.coverUrl,
      buildRelationShareUrl(relationship.slug),
    )
  }, [relationship])

  const canPlaySong = Boolean(relationship?.primarySong?.audioUrl)

  if (loading && !relationship) {
    return <div className="flex min-h-full items-center justify-center text-[#6C7A89]">加载中...</div>
  }

  if (!relationship) {
    return <div className="flex min-h-full items-center justify-center text-[#6C7A89]">关系未找到</div>
  }

  const playSong = () => {
    if (!relationship.primarySong?.audioUrl) return
    void playTrack({
      title: relationship.primarySong.title,
      subtitle: relationship.heroTitle,
      coverUrl: relationship.primarySong.coverUrl || relationship.coverUrl,
      audioUrl: relationship.primarySong.audioUrl,
    })
  }
  const isRelationSongActive =
    Boolean(relationship.primarySong?.audioUrl) &&
    currentTrack?.audioUrl === relationship.primarySong.audioUrl
  const isRelationSongPlaying = isRelationSongActive && isPlaying

  const handleRelationSongAction = () => {
    if (!canPlaySong) {
      return
    }
    if (isRelationSongActive) {
      void toggle()
      return
    }
    playSong()
  }

  const lyricPreview = relationship.primarySong?.lyric
    ? relationship.primarySong.lyric
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 2)
        .join(' / ')
    : ''
  const relationTypeTag = relationship.heroTags[0] ?? ''
  const extraHeroTags = relationship.heroTags.slice(1, 3)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F1115' }}>
      <motion.div
        className="relative isolate h-[89svh] min-h-[38rem] max-h-[54rem] overflow-hidden sm:h-[88svh] md:min-h-[44rem] md:max-h-[60rem]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <ImageWithFallback
            src={relationship.coverUrl}
            alt={relationship.heroTitle}
            fallbackLabel={relationship.heroTitle}
            className="h-full w-full object-cover"
            loading="eager"
            style={{ objectPosition: 'center 22%' }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,168,106,0.1),transparent_35%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-[#0F1115]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/24 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/62 to-transparent" />
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0 z-10 px-5 pb-0 sm:pb-4"
          initial={{ y: 36, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.8 }}
        >
            <div className="flex w-full max-w-[33rem] flex-col justify-end">
              <div className="max-w-[25rem] pb-0">
                <div className="space-y-2.5">
                  <CharacterBadge
                    name={relationship.sourceCharacter.name}
                    coverUrl={relationship.sourceCharacter.coverUrl}
                    onClick={() => navigate(`/character/${relationship.sourceCharacter.slug}`)}
                  />
                  <CharacterBadge
                    name={relationship.targetCharacter.name}
                    coverUrl={relationship.targetCharacter.coverUrl}
                    onClick={() => navigate(`/character/${relationship.targetCharacter.slug}`)}
                  />
                </div>

                {relationship.workName || relationTypeTag || extraHeroTags.length > 0 ? (
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs sm:text-[0.8rem]">
                    {relationship.workName ? (
                      <span style={{ color: '#DCCBA7' }}>{relationship.workName}</span>
                    ) : null}
                    {relationTypeTag ? (
                      <span
                        className="inline-flex rounded-full px-3.5 py-1.5"
                        style={{
                          backgroundColor: 'rgba(198, 168, 106, 0.14)',
                          color: '#D9C28A',
                          border: '1px solid rgba(198, 168, 106, 0.22)',
                        }}
                      >
                        {relationTypeTag}
                      </span>
                    ) : null}
                    {extraHeroTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-full px-3.5 py-1.5"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          color: 'rgba(245, 243, 238, 0.84)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              {relationship.heroTension ? (
                <p
                  className="max-w-[25rem] text-[0.95rem] leading-7 sm:text-[1rem] sm:leading-8"
                  style={{
                    color: 'rgba(233, 227, 217, 0.84)',
                    textShadow: '0 8px 20px rgba(0, 0, 0, 0.24)',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                  }}
                >
                  {relationship.heroTension}
                </p>
              ) : null}
            </div>
          </motion.div>
      </motion.div>

      <div className="px-6 pb-20">
        {relationship.coreDynamicCards.length > 0 ? (
          <motion.section
            id="relationship-core-section"
            className="mb-16 mt-12"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            >
              <SectionTitle
                title="核心理解"
                icon={Flame}
                action={
                  canPlaySong ? (
                    <button
                      type="button"
                      onClick={handleRelationSongAction}
                      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-all hover:scale-[1.02]"
                      style={{
                        backgroundColor: isRelationSongPlaying
                          ? 'rgba(198, 168, 106, 0.18)'
                          : 'rgba(255, 255, 255, 0.04)',
                        color: isRelationSongPlaying ? '#E6C98A' : 'rgba(245, 243, 238, 0.84)',
                        border: isRelationSongPlaying
                          ? '1px solid rgba(198, 168, 106, 0.28)'
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: isRelationSongPlaying
                          ? '0 8px 24px rgba(198, 168, 106, 0.14)'
                          : 'none',
                      }}
                    >
                      <Play
                        className="h-3.5 w-3.5"
                        fill={isRelationSongPlaying ? '#E6C98A' : 'transparent'}
                      />
                      <span>关系之歌</span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px]"
                        style={{
                          backgroundColor: isRelationSongPlaying
                            ? 'rgba(198, 168, 106, 0.16)'
                            : 'rgba(255, 255, 255, 0.06)',
                          color: isRelationSongPlaying ? '#E6C98A' : 'rgba(184, 180, 174, 0.82)',
                        }}
                      >
                        {isRelationSongPlaying ? '播放中' : '未播放'}
                      </span>
                    </button>
                  ) : null
                }
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {relationship.coreDynamicCards.map((item, index) => (
                <GlassCard
                  key={item.key}
                  className="p-5"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span
                      className="text-[11px] tracking-[0.24em]"
                      style={{ color: '#8E8063' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="h-px flex-1" style={{ backgroundColor: 'rgba(198, 168, 106, 0.18)' }} />
                  </div>
                  <h3 className="mb-3 text-sm" style={{ color: '#C6A86A', letterSpacing: '0.03em' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#F5F3EE', opacity: 0.85 }}>
                    {item.content}
                  </p>
                </GlassCard>
              ))}
            </div>
          </motion.section>
        ) : null}

        {relationship.relationArc || relationship.relationEvents.length > 0 ? (
          <motion.section
            className="mb-20"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            >
              <SectionTitle title="关系弧线" />
              <div className="relative pl-10 pb-2">
              <div
                className="absolute bottom-0 left-0 top-2 w-px"
                style={{ background: 'linear-gradient(to bottom, rgba(198, 168, 106, 0.22), rgba(110, 44, 53, 0.34))' }}
              />

              {relationship.relationEvents.map((node, index) => (
                <motion.div
                  key={`${node.stageNo}-${node.title}`}
                  className="relative mb-12 last:mb-0"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                >
                  <div
                    className="absolute -left-[2.78rem] top-1 h-[1.1rem] w-[1.1rem] rounded-full border"
                    style={{
                      backgroundColor: node.colorHex || (index < 2 ? '#C6A86A' : '#6E2C35'),
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                      boxShadow: `0 0 14px ${index < 2 ? 'rgba(198, 168, 106, 0.2)' : 'rgba(110, 44, 53, 0.18)'}`,
                    }}
                  />

                  <div className="pt-0.5">
                    <h3 className="mb-3 text-[1rem]" style={{ color: '#D9B464', letterSpacing: '-0.01em' }}>
                      {node.title}
                    </h3>
                    {node.summary ? (
                      <p className="mb-4 max-w-[34rem] text-[1rem] leading-relaxed" style={{ color: '#D7D3CB', opacity: 0.84 }}>
                        {node.summary}
                      </p>
                    ) : null}
                    <div className="text-[0.92rem]" style={{ color: '#7E8088' }}>
                      {node.tensionShift || node.powerShift || node.fateImpact || node.quote || ''}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ) : null}
        {relationship.perspectives.length > 0 ? (
          <motion.section
            className="mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle title="双方视角" icon={Sparkles} />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {relationship.perspectives.map((item) => (
                <div
                  key={item.key}
                  className="rounded-[1.75rem] p-6"
                  style={{
                    background:
                      item.key === 'source'
                        ? 'linear-gradient(180deg, rgba(198, 168, 106, 0.05) 0%, rgba(23, 26, 32, 0.96) 26%)'
                        : 'linear-gradient(180deg, rgba(110, 44, 53, 0.06) 0%, rgba(23, 26, 32, 0.96) 26%)',
                    border: `1px solid ${item.accentColor}22`,
                    boxShadow: '0 14px 32px rgba(0, 0, 0, 0.18)',
                  }}
                >
                  <div className="mb-5">
                    <div
                      className="mb-3 h-px w-14"
                      style={{ background: `linear-gradient(90deg, ${item.accentColor}, transparent)` }}
                    />
                    <h3 className="text-[1.4rem]" style={{ color: item.accentColor, letterSpacing: '-0.02em' }}>
                      {item.name}
                    </h3>
                  </div>
                  <div className="space-y-4 text-sm">
                      {item.perspective ? (
                        <div>
                          <div className="mb-2 text-xs tracking-[0.18em]" style={{ color: '#7F8289' }}>
                            这段关系意味着
                          </div>
                          <p style={{ color: '#F5F3EE', opacity: 0.9 }}>{item.perspective}</p>
                        </div>
                    ) : null}
                    {item.desire ? (
                      <div>
                        <div className="mb-2 text-xs tracking-[0.18em]" style={{ color: '#7F8289' }}>
                          想要
                        </div>
                        <p style={{ color: '#F5F3EE', opacity: 0.9 }}>{item.desire}</p>
                      </div>
                    ) : null}
                    {item.fear ? (
                      <div>
                        <div className="mb-2 text-xs tracking-[0.18em]" style={{ color: '#7F8289' }}>
                          害怕
                        </div>
                        <p style={{ color: '#F5F3EE', opacity: 0.9 }}>{item.fear}</p>
                      </div>
                    ) : null}
                    {item.unspoken ? (
                      <div
                        className="rounded-2xl px-4 py-4"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        <div className="mb-2 text-xs tracking-[0.18em]" style={{ color: '#7F8289' }}>
                          没有说出口的
                        </div>
                        <p style={{ color: '#E8E1D7', opacity: 0.94, fontStyle: 'italic' }}>“{item.unspoken}”</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        ) : null}

        {relationship.phenomenologyItems.length > 0 ? (
          <motion.section
            className="mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
              <SectionTitle title="关系体验" icon={Eye} />
              <div className="grid gap-3 md:grid-cols-2">
                {relationship.phenomenologyItems.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.5 }}
                  >
                    <GlassCard
                      className="relative overflow-hidden p-0"
                      style={{
                        background:
                          index % 2 === 0
                            ? 'linear-gradient(180deg, rgba(20, 23, 31, 0.92) 0%, rgba(13, 15, 21, 0.98) 100%)'
                            : 'linear-gradient(180deg, rgba(18, 20, 28, 0.9) 0%, rgba(11, 13, 18, 0.98) 100%)',
                      }}
                    >
                      <div
                        className="absolute inset-x-0 top-0 h-px"
                        style={{ background: 'linear-gradient(90deg, rgba(198, 168, 106, 0.45), rgba(198, 168, 106, 0))' }}
                      />
                      <div className="relative px-5 py-5">
                        <div
                          className="mb-3 text-[11px] tracking-[0.26em]"
                          style={{ color: 'rgba(198, 168, 106, 0.82)' }}
                        >
                          {item.label}
                        </div>
                        <p
                          className="text-[15px] leading-8"
                          style={{ color: 'rgba(245, 243, 238, 0.9)' }}
                        >
                          {item.content}
                        </p>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
          </motion.section>
        ) : null}

        {relationship.relationPalette.length > 0 || relationship.symbolicImages.length > 0 || relationship.relationKeywords.length > 0 ? (
          <motion.section
            className="mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionTitle title="关系意象" icon={Palette} />
              <GlassCard className="overflow-hidden p-0">
                <div className="grid gap-px overflow-hidden md:grid-cols-[0.95fr_1.25fr]">
                  <div
                    className="px-5 py-6"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(18, 21, 29, 0.92) 0%, rgba(12, 14, 20, 0.98) 100%)',
                    }}
                  >
                    <div
                      className="mb-4 text-[11px] tracking-[0.26em]"
                      style={{ color: 'rgba(198, 168, 106, 0.8)' }}
                    >
                      RELATION PALETTE
                    </div>
                    {relationship.relationPalette.length > 0 ? (
                      <div className="space-y-3">
                        {relationship.relationPalette.map((color) => (
                          <div
                            key={`${color.name}-${color.hex}`}
                            className="flex items-center gap-3 rounded-2xl px-3 py-3"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            <div
                              className="h-11 w-11 rounded-2xl"
                              style={{ backgroundColor: color.hex, boxShadow: '0 10px 28px rgba(0, 0, 0, 0.22)' }}
                            />
                            <div className="min-w-0">
                              <div className="text-sm" style={{ color: '#F5F3EE' }}>
                                {color.name || color.hex}
                              </div>
                              <div className="text-xs uppercase tracking-[0.18em]" style={{ color: 'rgba(184, 180, 174, 0.7)' }}>
                                {color.hex}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm leading-7" style={{ color: 'rgba(184, 180, 174, 0.78)' }}>
                        这段关系没有稳定的颜色，它更像一种不断改变温度的气压。
                      </p>
                    )}
                  </div>

                  <div
                    className="px-5 py-6"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(15, 17, 23, 0.96) 0%, rgba(10, 12, 17, 0.98) 100%)',
                    }}
                  >
                    {relationship.symbolicImages.length > 0 ? (
                      <div className={relationship.relationKeywords.length > 0 ? 'mb-6' : ''}>
                        <div className="mb-4 text-[11px] tracking-[0.26em]" style={{ color: 'rgba(198, 168, 106, 0.8)' }}>
                          SYMBOLIC IMAGES
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {relationship.symbolicImages.map((tag, index) => (
                            <span
                              key={tag}
                              className="rounded-full px-4 py-2.5 text-sm"
                              style={{
                                backgroundColor:
                                  index % 2 === 0 ? 'rgba(198, 168, 106, 0.14)' : 'rgba(255, 255, 255, 0.05)',
                                color: index % 2 === 0 ? '#E6C98A' : 'rgba(245, 243, 238, 0.9)',
                                border:
                                  index % 2 === 0
                                    ? '1px solid rgba(198, 168, 106, 0.24)'
                                    : '1px solid rgba(255, 255, 255, 0.08)',
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {relationship.relationKeywords.length > 0 ? (
                      <div>
                        <div className="mb-4 text-[11px] tracking-[0.26em]" style={{ color: 'rgba(184, 180, 174, 0.72)' }}>
                          KEYWORDS
                        </div>
                        <div className="flex flex-wrap gap-2.5">
                          {relationship.relationKeywords.map((keyword) => (
                            <span
                              key={keyword}
                              className="rounded-lg px-3.5 py-2 text-sm"
                              style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                                color: 'rgba(245, 243, 238, 0.72)',
                                border: '1px solid rgba(255, 255, 255, 0.06)',
                              }}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </GlassCard>
            </motion.section>
          ) : null}
          {relationship.primarySong ? (
            <motion.section
              id="relationship-song-section"
              className="mb-16"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            >
              <SectionTitle title="关系之歌" icon={Music} />
              <GlassCard className="overflow-hidden p-0">
                <div className="grid gap-px overflow-hidden md:grid-cols-[0.86fr_1.24fr]">
                  <div className="relative min-h-[18rem] overflow-hidden">
                    <ImageWithFallback
                      src={relationship.primarySong.coverUrl || relationship.coverUrl}
                      alt={relationship.primarySong.title}
                      fallbackLabel={relationship.primarySong.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1015] via-[#0E1015]/35 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="text-[11px] tracking-[0.26em]" style={{ color: 'rgba(198, 168, 106, 0.78)' }}>
                        RELATION SONG
                      </div>
                      {lyricPreview ? (
                        <p className="mt-3 text-sm leading-7" style={{ color: 'rgba(245, 243, 238, 0.88)' }}>
                          “{lyricPreview}”
                        </p>
                      ) : relationship.primarySong.summary ? (
                        <p className="mt-3 text-sm leading-7" style={{ color: 'rgba(245, 243, 238, 0.82)' }}>
                          {relationship.primarySong.summary}
                        </p>
                      ) : null}
                      {canPlaySong ? (
                        <button
                          type="button"
                          onClick={playSong}
                          className="mt-4 inline-flex items-center gap-3 rounded-full px-4 py-2.5 transition-transform hover:scale-[1.01]"
                          style={{
                            backgroundColor: 'rgba(198, 168, 106, 0.9)',
                            color: '#101217',
                            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.24)',
                          }}
                        >
                          <Play className="h-4 w-4" fill="#101217" style={{ color: '#101217' }} />
                          <span className="text-sm">播放关系之歌</span>
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div
                    className="px-5 py-6 md:px-6"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(15, 17, 23, 0.98) 0%, rgba(10, 12, 17, 0.98) 100%)',
                    }}
                  >
                    <h3 className="mb-2 text-[1.6rem] leading-tight" style={{ color: '#F5F3EE' }}>
                      {relationship.primarySong.title}
                    </h3>
                    {relationship.primarySong.subtitle ? (
                      <p className="mb-4 text-sm" style={{ color: 'rgba(184, 180, 174, 0.82)' }}>
                        {relationship.primarySong.subtitle}
                      </p>
                    ) : null}

                    {relationship.primarySong.songCoreTheme || relationship.primarySong.songEmotionalCurve ? (
                      <div className="mb-5 grid gap-3 sm:grid-cols-2">
                        {relationship.primarySong.songCoreTheme ? (
                          <div
                            className="rounded-2xl px-4 py-3"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.035)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            <div className="mb-1 text-[11px] tracking-[0.22em]" style={{ color: 'rgba(184, 180, 174, 0.72)' }}>
                              CORE THEME
                            </div>
                            <div className="text-sm leading-7" style={{ color: '#E6C98A' }}>
                              {relationship.primarySong.songCoreTheme}
                            </div>
                          </div>
                        ) : null}
                        {relationship.primarySong.songEmotionalCurve ? (
                          <div
                            className="rounded-2xl px-4 py-3"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.035)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            <div className="mb-1 text-[11px] tracking-[0.22em]" style={{ color: 'rgba(184, 180, 174, 0.72)' }}>
                              EMOTIONAL CURVE
                            </div>
                            <div className="text-sm leading-7" style={{ color: '#E6C98A' }}>
                              {relationship.primarySong.songEmotionalCurve}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {relationship.primarySong.summary ? (
                      <p className="mb-5 text-[15px] leading-8" style={{ color: 'rgba(245, 243, 238, 0.84)' }}>
                        {relationship.primarySong.summary}
                      </p>
                    ) : null}

                    {relationship.primarySong.songStyles.length > 0 ? (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {relationship.primarySong.songStyles.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full px-3 py-1.5 text-xs"
                            style={{
                              backgroundColor: 'rgba(198, 168, 106, 0.12)',
                              color: '#D8B972',
                              border: '1px solid rgba(198, 168, 106, 0.18)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {relationship.primarySong.vocalProfile ? (
                      <p className="mb-5 text-xs leading-6" style={{ color: 'rgba(184, 180, 174, 0.78)' }}>
                        {relationship.primarySong.vocalProfile}
                      </p>
                    ) : null}

                    {relationship.primarySong.lyric ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setLyricsExpanded((value) => !value)}
                          className="flex w-full items-center justify-between rounded-2xl px-4 py-3 transition-all"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            color: '#F5F3EE',
                          }}
                        >
                          <span className="text-sm">{lyricsExpanded ? '收起完整歌词' : '展开完整歌词'}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${lyricsExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {lyricsExpanded ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-5 rounded-2xl px-4 py-4"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.03)',
                              border: '1px solid rgba(255, 255, 255, 0.06)',
                            }}
                          >
                            <pre
                              className="whitespace-pre-wrap font-sans text-sm leading-loose"
                              style={{ color: 'rgba(245, 243, 238, 0.84)' }}
                            >
                              {relationship.primarySong.lyric}
                            </pre>
                          </motion.div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </div>
              </GlassCard>
            </motion.section>
          ) : null}

        {relationship.relatedRelations.length > 0 ? (
          <motion.section
            className="mb-8"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionTitle title="继续进入这些关系" icon={Sparkles} />
            <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-4">
              {relationship.relatedRelations.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  className="w-52 flex-shrink-0 overflow-hidden rounded-xl text-left"
                  style={{ backgroundColor: '#171A20', border: '1px solid rgba(255, 255, 255, 0.08)' }}
                  onClick={() => navigate(`/relationship/${item.slug}`)}
                >
                  <div className="h-64 overflow-hidden">
                    <ImageWithFallback
                      src={item.coverUrl}
                      alt={item.title}
                      fallbackLabel={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div
                      className="mb-2 inline-block rounded px-2 py-1 text-xs"
                      style={{ backgroundColor: 'rgba(198, 168, 106, 0.15)', color: '#C6A86A' }}
                    >
                      {mapLinkTypeLabel(item.linkTypeCode)}
                    </div>
                    <h4 className="mb-1 text-sm" style={{ color: '#F5F3EE' }}>
                      {item.title}
                    </h4>
                    {item.reason ? (
                      <p className="mb-2 text-xs leading-relaxed" style={{ color: '#D4CDC2' }}>
                        {item.reason}
                      </p>
                    ) : null}
                    {item.subtitle ? (
                      <p className="text-xs" style={{ color: '#B8B4AE' }}>
                        {item.subtitle}
                      </p>
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </motion.section>
        ) : null}
      </div>
    </div>
  )
}
