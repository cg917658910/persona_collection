import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { ArrowRight, Play, RefreshCcw, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { usePlayer } from '../context/PlayerContext'
import { characterCards, discoverGroups, featuredSongs } from '../data/adapters'

const getPoolByGroupSlug = (slug: string | null) => {
  if (!slug) return characterCards
  const group = discoverGroups.find((item) => item.slug === slug)
  if (!group?.slugs?.length) return characterCards
  return characterCards.filter((item) => group.slugs.includes(item.slug))
}

const discoverTexts = [
  '今天你会遇见谁？',
  '让命运替你翻开一个人物的一页。',
  '有些人物不是被搜索到的，而是被撞见的。',
]

export function Discover() {
  const navigate = useNavigate()
  const { playTrack } = usePlayer()

  const [groupSlug, setGroupSlug] = useState<string | null>(null)
  const pool = useMemo(() => getPoolByGroupSlug(groupSlug), [groupSlug])
  
  const getRandomIndex = (length = pool.length, exclude?: number) => {
    if (length <= 1) return 0

    let nextIndex = Math.floor(Math.random() * length)
    while (nextIndex === exclude) {
      nextIndex = Math.floor(Math.random() * length)
    }

    return nextIndex
  }

  const [index, setIndex] = useState(getRandomIndex())
  const [headlineIndex, setHeadlineIndex] = useState(0)
  const [history, setHistory] = useState<number[]>([0])

  const current = pool[index] ?? characterCards[0]
  const discovered = useMemo(
    () =>
      history
        .map((itemIndex) => pool[itemIndex])
        .filter((item): item is (typeof characterCards)[number] => Boolean(item)),
    [history, pool],
  )
  const currentSong = featuredSongs.find((item) => item.characterName === current.name)

  const handleRefresh = () => {
    const nextIndex = getRandomIndex(pool.length, index)
    setIndex(nextIndex)
    setHistory((prev) => [...prev, nextIndex])
    setHeadlineIndex((prev) => (prev + 1) % discoverTexts.length)
  }

  const resetGroup = (slug: string | null) => {
    const nextPool = getPoolByGroupSlug(slug)
    const nextIndex = getRandomIndex(nextPool.length)
    setGroupSlug(slug)
    setIndex(nextIndex)
    setHistory([nextIndex])
  }

  return (
    <div className="min-h-full px-5 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
        <h1 className="text-2xl mb-2" style={{ color: '#D6B36A' }}>发现</h1>
        <p style={{ color: '#6C7A89' }}>{discoverTexts[headlineIndex]}</p>
      </motion.div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        <button onClick={() => resetGroup(null)} className="rounded-full px-4 py-2 text-sm" style={{ background: groupSlug === null ? 'rgba(214,179,106,0.12)' : '#1A1D23', color: groupSlug === null ? '#D6B36A' : '#AAB2BD' }}>全部</button>
        {discoverGroups.slice(0, 8).map((group) => (
          <button key={group.slug} onClick={() => resetGroup(group.slug)} className="rounded-full px-4 py-2 text-sm whitespace-nowrap" style={{ background: groupSlug === group.slug ? 'rgba(214,179,106,0.12)' : '#1A1D23', color: groupSlug === group.slug ? '#D6B36A' : '#AAB2BD' }}>{group.name}</button>
        ))}
      </div>

      <div className="mb-8">
        <AnimatePresence mode="wait">
          <motion.div key={`${groupSlug || 'all'}-${current.id}`} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -24, scale: 0.98 }} transition={{ duration: 0.45 }} className="rounded-[28px] overflow-hidden" style={{ background: '#1A1D23', boxShadow: '0 12px 40px rgba(0,0,0,0.45)' }}>
            <div className="relative h-[440px] overflow-hidden">
              <ImageWithFallback src={current.imageUrl} alt={current.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,29,35,0.96) 0%, rgba(26,29,35,0.55) 55%, transparent 100%)' }} />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="mb-3 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(214,179,106,0.12)', color: '#D6B36A' }}><Sparkles size={14} /> 随机遇见</div>
                  <div className="rounded-full border border-white/10 bg-black/15 px-3 py-1 text-[11px] text-white/70">{pool.length} 位人物可发现</div>
                </div>
                <h2 className="text-[30px] leading-none mb-2" style={{ color: '#FFFFFF' }}>{current.name}</h2>
                <p className="text-sm mb-3" style={{ color: '#D6B36A' }}>{current.workTitle}</p>
                <p className="text-sm leading-7 mb-4 max-w-[92%]" style={{ color: '#EEF2F7' }}>{current.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">{current.tags.map((tag) => <span key={tag} className="px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.08)', color: '#E8EDF4' }}>{tag}</span>)}</div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-5 py-3 rounded-full" style={{ background: '#D6B36A', color: '#0F1115' }} onClick={() => navigate(`/character/${current.slug}`)}><ArrowRight size={16} /> 查看人物</button>
                  {currentSong && <button className="flex items-center gap-2 px-5 py-3 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFFFFF' }} onClick={() => void playTrack({ title: currentSong.title, subtitle: currentSong.characterName, coverUrl: currentSong.coverUrl, audioUrl: currentSong.audioUrl })}><Play size={16} /> 播放人物之歌</button>}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.button initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }} onClick={handleRefresh} className="w-full rounded-2xl py-4 mb-8 flex items-center justify-center gap-2" style={{ background: '#D6B36A', color: '#0F1115' }}><RefreshCcw size={18} /> 再遇见一个人</motion.button>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 style={{ color: '#FFFFFF' }}>你刚刚路过的人</h3>
          <button className="text-sm text-[#D6B36A]" onClick={() => navigate('/search')}>去搜索</button>
        </div>
        <div className="space-y-3">
          {discovered.slice(-3).reverse().map((item, idx) => (
            <motion.button key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: idx * 0.05 }} className="w-full rounded-2xl p-4 text-left flex items-center gap-4" style={{ background: '#1A1D23' }} onClick={() => navigate(`/character/${item.slug}`)}>
              <ImageWithFallback src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
              <div className="min-w-0"><div className="text-sm mb-1" style={{ color: '#FFFFFF' }}>{item.name}</div><div className="text-xs line-clamp-2" style={{ color: '#6C7A89' }}>{item.description}</div></div>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  )
}
