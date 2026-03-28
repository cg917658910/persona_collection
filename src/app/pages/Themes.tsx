import { Search } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { ThemeCard } from '../components/ThemeCard'
import { useThemeCardsData } from '../services/catalog'

export function Themes() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'character' | 'relation'>('character')
  const { data } = useThemeCardsData()

  const list = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    if (!keyword) return data
    return data.filter((item) =>
      [item.name, item.description, item.meta].join(' ').toLowerCase().includes(keyword),
    )
  }, [data, query])

  const characterThemes = useMemo(() => list.filter((item) => (item.subjectType || 'character') !== 'relation'), [list])
  const relationThemes = useMemo(() => list.filter((item) => item.subjectType === 'relation'), [list])
  const activeList = activeTab === 'relation' ? relationThemes : characterThemes

  return (
    <div className="min-h-full px-5 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
        <h1 className="mb-2 text-2xl text-[#D6B36A]">主题集</h1>
        <p className="text-[#6C7A89]">按人物主题与关系主题进入这座人物博物馆的深层结构。</p>
        <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#1A1D23] px-4 py-3">
          <Search size={18} className="text-[#6C7A89]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索主题..."
            className="flex-1 bg-transparent text-sm text-white outline-none"
          />
        </div>
      </motion.div>

      <div className="mb-5 flex rounded-2xl bg-[#1A1D23] p-1">
        {[
          { key: 'character' as const, label: '人物主题', count: characterThemes.length },
          { key: 'relation' as const, label: '关系主题', count: relationThemes.length },
        ].map((tab) => {
          const active = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 rounded-xl px-4 py-3 text-sm transition-all"
              style={{
                backgroundColor: active ? 'rgba(198, 168, 106, 0.14)' : 'transparent',
                color: active ? '#E2C27A' : '#8B95A1',
                border: active ? '1px solid rgba(198, 168, 106, 0.18)' : '1px solid transparent',
              }}
            >
              {tab.label} · {tab.count}
            </button>
          )
        })}
      </div>

      <div className="mb-4">
        <h2 className="text-lg text-white">{activeTab === 'relation' ? '关系主题' : '人物主题'}</h2>
        <p className="mt-1 text-sm text-[#6C7A89]">
          {activeTab === 'relation'
            ? '从拉扯、依赖、误解与命运结构切入关系网络。'
            : '从人格、命运与情绪结构切入人物群像。'}
        </p>
      </div>

      {activeList.length === 0 ? (
        <div className="rounded-2xl bg-[#1A1D23] p-4 text-sm text-[#6C7A89]">
          {activeTab === 'relation' ? '暂无匹配的关系主题。' : '暂无匹配的人物主题。'}
        </div>
      ) : (
        <div className="space-y-4">{activeList.map((item) => <ThemeCard key={item.id} theme={item} />)}</div>
      )}
    </div>
  )
}
