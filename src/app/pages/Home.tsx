import { BookOpen, BrushIcon, ChevronRight, Film, Headphones, LibraryBig, Music2, ScrollText, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { usePlayer } from '../context/PlayerContext'
import { EMPTY_HOME_DATA, useHomeData } from '../services/home'

export function Home() {
  const navigate = useNavigate()
  const { playTrack } = usePlayer()
  const { data } = useHomeData()
  const homeData = data ?? EMPTY_HOME_DATA

  const featuredCharacter = homeData.featuredCharacter
  const categories = [
    { id: 'historical', name: '历史人物', icon: ScrollText, color: '#D6B36A', to: '/search?type=historical' },
    { id: 'literary', name: '文学人物', icon: BookOpen, color: '#A9B3BE', to: '/search?type=literary' },
    { id: 'film_tv', name: '影视人物', icon: Film, color: '#8A9EFF', to: '/search?type=film_tv' },
    { id: 'anime', name: '动漫人物', icon: Sparkles, color: '#D98CE0', to: '/search?type=anime' },
    { id: 'works', name: '作品', icon: LibraryBig, color: '#6CD3C1', to: '/works' },
    { id: 'themes', name: '主题集', icon: BrushIcon, color: '#E2A96B', to: '/themes' },
  ] as const

  return (
    <div className="min-h-full px-5 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl" style={{ color: '#D6B36A' }}>
          拾荒者·人物集
        </h1>
        <p className="max-w-[92%] leading-7" style={{ color: '#6C7A89' }}>
          重新理解你见过的人，把人物收藏成一座内心博物馆。
        </p>
      </motion.div>

      {featuredCharacter ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-10"
        >
          <div
            className="cursor-pointer overflow-hidden rounded-3xl"
            style={{ background: '#1A1D23', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
            onClick={() => navigate(`/character/${featuredCharacter.slug}`)}
          >
            <div className="relative h-80 overflow-hidden">
              <ImageWithFallback
                src={featuredCharacter.coverUrl}
                alt={featuredCharacter.name}
                fallbackLabel={featuredCharacter.name}
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(26,29,35,0.96) 0%, rgba(26,29,35,0.6) 50%, transparent 100%)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div
                  className="mb-3 inline-flex rounded-full px-3 py-1 text-xs"
                  style={{ background: 'rgba(214,179,106,0.12)', color: '#D6B36A' }}
                >
                  今日人物
                </div>
                <h2 className="mb-2 text-3xl" style={{ color: '#FFFFFF' }}>
                  {featuredCharacter.name}
                </h2>
                <p className="mb-3 text-sm" style={{ color: '#D6B36A' }}>
                  {featuredCharacter.workTitle}
                </p>
                <p className="mb-4 max-w-[92%] text-sm leading-relaxed" style={{ color: '#E6EAF0' }}>
                  {featuredCharacter.oneLineDefinition || featuredCharacter.summary}
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {featuredCharacter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/8 bg-white/8 px-3 py-1 text-[11px] text-white/85"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {featuredCharacter.song ? (
                  <button
                    className="flex items-center gap-2 rounded-full px-5 py-2.5"
                    style={{ background: '#D6B36A', color: '#0F1115' }}
                    onClick={(event) => {
                      event.stopPropagation()
                      void playTrack({
                        title: featuredCharacter.song?.title || '',
                        subtitle: featuredCharacter.song?.characterName || featuredCharacter.name,
                        coverUrl: featuredCharacter.song?.coverUrl,
                        audioUrl: featuredCharacter.song?.audioUrl || '',
                        characterSlug: featuredCharacter.song?.characterSlug,
                      })
                    }}
                  >
                    <Music2 size={16} />
                    播放人物之歌
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ color: '#FFFFFF' }}>分类浏览</h3>
          <button className="flex items-center gap-1 text-sm text-[#D6B36A]" onClick={() => navigate('/search')}>
            全部人物 <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((category, index) => {
            const Icon = category.icon
            const count = homeData.categoryCounts[category.id]
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.2 + index * 0.04 }}
                className="rounded-2xl p-4 text-left"
                style={{ background: '#1A1D23' }}
                onClick={() => navigate(category.to)}
              >
                <div
                  className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl"
                  style={{ background: `${category.color}15`, color: category.color }}
                >
                  <Icon size={18} />
                </div>
                <div className="text-sm text-white">{category.name}</div>
                <div className="mt-1 text-xs text-white/45">{count} 个条目</div>
              </motion.button>
            )
          })}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ color: '#FFFFFF' }}>最近录入</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {homeData.latestCharacters.slice(0, 8).map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.25 + index * 0.04 }}
              className="w-[180px] flex-shrink-0 overflow-hidden rounded-2xl text-left"
              style={{ background: '#1A1D23' }}
              onClick={() => navigate(`/character/${item.slug}`)}
            >
              <ImageWithFallback
                src={item.coverUrl}
                alt={item.name}
                fallbackLabel={item.name}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <div className="mb-1 text-sm text-white">{item.name}</div>
                <div className="mb-2 text-xs text-[#D6B36A]">{item.workTitle}</div>
                <p className="line-clamp-2 text-xs leading-6 text-white/55">{item.oneLineDefinition || item.summary}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ color: '#FFFFFF' }}>人物之歌</h3>
          <button className="flex items-center gap-1 text-sm text-[#D6B36A]" onClick={() => navigate('/search?tab=characters')}>
            关联人物 <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {homeData.featuredSongs.slice(0, 4).map((song) => (
            <button
              key={song.id}
              className="overflow-hidden rounded-2xl text-left"
              style={{ background: '#1A1D23' }}
              onClick={() =>
                void playTrack({
                  title: song.title,
                  subtitle: song.characterName,
                  coverUrl: song.coverUrl,
                  audioUrl: song.audioUrl,
                  characterSlug: song.characterSlug,
                })
              }
            >
              <ImageWithFallback src={song.coverUrl} alt={song.title} fallbackLabel={song.title} className="h-32 w-full object-cover" />
              <div className="p-4">
                <div className="text-sm text-white">{song.title}</div>
                <div className="mt-1 text-xs text-[#D6B36A]">{song.characterName}</div>
                <p className="mt-2 line-clamp-2 text-xs leading-6 text-white/55">{song.songCoreTheme || song.summary}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ color: '#FFFFFF' }}>推荐作品</h3>
          <button className="flex items-center gap-1 text-sm text-[#D6B36A]" onClick={() => navigate('/works')}>
            更多作品 <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {homeData.recommendedWorks.slice(0, 4).map((item) => (
            <button
              key={item.id}
              className="overflow-hidden rounded-2xl text-left"
              style={{ background: '#1A1D23' }}
              onClick={() => navigate(`/work/${item.slug}`)}
            >
              <ImageWithFallback src={item.coverUrl} alt={item.title} fallbackLabel={item.title} className="h-32 w-full object-cover" />
              <div className="p-4">
                <div className="text-sm text-white">{item.title}</div>
                <div className="mt-1 text-xs text-[#D6B36A]">{item.creatorName}</div>
                <p className="mt-2 line-clamp-2 text-xs leading-6 text-white/55">{item.summary}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ color: '#FFFFFF' }}>主题集推荐</h3>
          <button className="flex items-center gap-1 text-sm text-[#D6B36A]" onClick={() => navigate('/themes')}>
            进入主题集 <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {homeData.recommendedThemes.slice(0, 8).map((theme) => (
            <button
              key={theme.id}
              className="w-[168px] flex-shrink-0 overflow-hidden rounded-2xl text-left"
              style={{ background: '#1A1D23' }}
              onClick={() => navigate(`/theme/${theme.slug}`)}
            >
              <ImageWithFallback src={theme.coverUrl} alt={theme.name} fallbackLabel={theme.name} className="h-28 w-full object-cover" />
              <div className="p-4">
                <div className="text-sm text-white">{theme.name}</div>
                <p className="mt-2 line-clamp-2 text-xs leading-6 text-white/55">{theme.summary}</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 text-[11px] text-white/45">
                  <Headphones size={11} /> {theme.characterCount} 位人物
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="rounded-3xl border border-[#D6B36A]/10 bg-[#1A1D23] p-5">
          <div className="text-sm text-[#D6B36A]">去发现一个人物</div>
          <p className="mt-2 max-w-[90%] text-sm leading-7 text-white/60">
            不是搜索，不是筛选，而是随机撞见一个你本来没有打算遇见的人。
          </p>
          <button className="mt-4 rounded-full bg-[#D6B36A] px-5 py-3 text-sm text-[#0F1115]" onClick={() => navigate('/discover')}>
            进入发现
          </button>
        </div>
      </section>
    </div>
  )
}
