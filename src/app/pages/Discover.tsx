import { ArrowRight, Play, RefreshCcw, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { usePlayer } from '../context/PlayerContext'
import { fallbackRandomDiscoverCharacter, fetchRandomDiscoverCharacter } from '../services/discover'
import { useDiscoverGroups } from '../services/catalog'
import type { HomeFeaturedCharacter } from '../services/home'

const discoverTexts = [
  '今天你会遇见谁？',
  '让命运替你翻开一个人物的一页。',
  '有些人物不是被搜索到的，而是被撞见的。',
]

export function Discover() {
  const navigate = useNavigate()
  const { playTrack } = usePlayer()
  const { groups, totalCharacters } = useDiscoverGroups()

  const [groupSlug, setGroupSlug] = useState<string | null>(null)
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [current, setCurrent] = useState<HomeFeaturedCharacter | null>(null)
  const [history, setHistory] = useState<HomeFeaturedCharacter[]>([])

  const currentGroupCount = useMemo(() => {
    if (!groupSlug) {
      return totalCharacters
    }
    return groups.find((item) => item.slug === groupSlug)?.characterCount ?? 0
  }, [groupSlug, groups, totalCharacters])

  const pullRandomCharacter = async (nextGroupSlug: string | null, resetHistory = false) => {
    const exclude = resetHistory ? [] : history.slice(-8).map((item) => item.slug)

    try {
      const item = await fetchRandomDiscoverCharacter(nextGroupSlug, exclude)
      setCurrent(item)
      setHistory((prev) => {
        const base = resetHistory ? [] : prev
        return [...base.filter((entry) => entry.slug !== item.slug), item]
      })
    } catch {
      const fallback = fallbackRandomDiscoverCharacter(nextGroupSlug, exclude)
      setCurrent(fallback)
      setHistory((prev) => {
        const base = resetHistory ? [] : prev
        return [...base.filter((entry) => entry.slug !== fallback.slug), fallback]
      })
    }
  }

  useEffect(() => {
    void pullRandomCharacter(groupSlug, true)
  }, [groupSlug])

  const handleRefresh = () => {
    setHeadlineIndex((prev) => (prev + 1) % discoverTexts.length)
    void pullRandomCharacter(groupSlug)
  }

  return (
    <div className="min-h-full px-5 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
        <h1 className="mb-2 text-2xl" style={{ color: '#D6B36A' }}>
          发现
        </h1>
        <p style={{ color: '#6C7A89' }}>{discoverTexts[headlineIndex]}</p>
      </motion.div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setGroupSlug(null)}
          className="rounded-full px-4 py-2 text-sm"
          style={{ background: groupSlug === null ? 'rgba(214,179,106,0.12)' : '#1A1D23', color: groupSlug === null ? '#D6B36A' : '#AAB2BD' }}
        >
          全部
        </button>
        {groups.slice(0, 8).map((group) => (
          <button
            key={group.slug}
            onClick={() => setGroupSlug(group.slug)}
            className="whitespace-nowrap rounded-full px-4 py-2 text-sm"
            style={{ background: groupSlug === group.slug ? 'rgba(214,179,106,0.12)' : '#1A1D23', color: groupSlug === group.slug ? '#D6B36A' : '#AAB2BD' }}
          >
            {group.name}
          </button>
        ))}
      </div>

      <div className="mb-8">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={`${groupSlug || 'all'}-${current.id}`}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.45 }}
              className="overflow-hidden rounded-[28px]"
              style={{ background: '#1A1D23', boxShadow: '0 12px 40px rgba(0,0,0,0.45)' }}
            >
              <div className="relative h-[440px] overflow-hidden">
              <ImageWithFallback src={current.coverUrl} alt={current.name} fallbackLabel={current.name} className="h-full w-full object-cover" loading="eager" />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(26,29,35,0.96) 0%, rgba(26,29,35,0.55) 55%, transparent 100%)' }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <div
                      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
                      style={{ background: 'rgba(214,179,106,0.12)', color: '#D6B36A' }}
                    >
                      <Sparkles size={14} /> 随机遇见
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/15 px-3 py-1 text-[11px] text-white/70">
                      {currentGroupCount} 位人物可发现
                    </div>
                  </div>
                  <h2 className="mb-2 text-[30px] leading-none" style={{ color: '#FFFFFF' }}>
                    {current.name}
                  </h2>
                  <p className="mb-3 text-sm" style={{ color: '#D6B36A' }}>
                    {current.workTitle}
                  </p>
                  <p className="mb-4 max-w-[92%] text-sm leading-7" style={{ color: '#EEF2F7' }}>
                    {current.oneLineDefinition || current.summary}
                  </p>
                  <div className="mb-5 flex flex-wrap gap-2">
                    {current.tags.map((tag) => (
                      <span key={tag} className="rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(255,255,255,0.08)', color: '#E8EDF4' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="flex items-center gap-2 rounded-full px-5 py-3"
                      style={{ background: '#D6B36A', color: '#0F1115' }}
                      onClick={() => navigate(`/character/${current.slug}`)}
                    >
                      <ArrowRight size={16} /> 查看人物
                    </button>
                    {current.song ? (
                      <button
                        className="flex items-center gap-2 rounded-full px-5 py-3"
                        style={{ background: 'rgba(255,255,255,0.08)', color: '#FFFFFF' }}
                        onClick={() =>
                          void playTrack({
                            title: current.song?.title || '',
                            subtitle: current.song?.characterName || current.name,
                            coverUrl: current.song?.coverUrl,
                            audioUrl: current.song?.audioUrl || '',
                            characterSlug: current.song?.characterSlug,
                          })
                        }
                      >
                        <Play size={16} /> 播放人物之歌
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.15 }}
        onClick={handleRefresh}
        className="mb-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4"
        style={{ background: '#D6B36A', color: '#0F1115' }}
      >
        <RefreshCcw size={18} /> 再遇见一个人
      </motion.button>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ color: '#FFFFFF' }}>你刚刚路过的人</h3>
          <button className="text-sm text-[#D6B36A]" onClick={() => navigate('/search')}>
            去搜索
          </button>
        </div>
        <div className="space-y-3">
          {history
            .slice(-3)
            .reverse()
            .map((item, idx) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="flex w-full items-center gap-4 rounded-2xl p-4 text-left"
                style={{ background: '#1A1D23' }}
                onClick={() => navigate(`/character/${item.slug}`)}
              >
                <ImageWithFallback src={item.coverUrl} alt={item.name} fallbackLabel={item.name} className="h-16 w-16 rounded-xl object-cover" />
                <div className="min-w-0">
                  <div className="mb-1 text-sm" style={{ color: '#FFFFFF' }}>
                    {item.name}
                  </div>
                  <div className="line-clamp-2 text-xs" style={{ color: '#6C7A89' }}>
                    {item.oneLineDefinition || item.summary}
                  </div>
                </div>
              </motion.button>
            ))}
        </div>
      </section>
    </div>
  )
}
