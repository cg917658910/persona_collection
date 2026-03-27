import { Search as SearchIcon, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useDeferredValue, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { CharacterCard } from '../components/CharacterCard'
import { CreatorCard } from '../components/CreatorCard'
import { ThemeCard } from '../components/ThemeCard'
import { WorkCard } from '../components/WorkCard'
import { humanizeCharacterType } from '../data/adapters'
import { useSearchCatalogData } from '../services/catalog'

const tabs = [
  { key: 'characters', label: '人物' },
  { key: 'works', label: '作品' },
  { key: 'creators', label: '创作者' },
  { key: 'themes', label: '主题集' },
] as const

const quickTypeFilters = [
  { key: '', label: '全部' },
  { key: 'historical', label: '历史' },
  { key: 'literary', label: '文学' },
  { key: 'film_tv', label: '影视' },
  { key: 'anime', label: '动漫' },
]

export function Search() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialTab = (searchParams.get('tab') as (typeof tabs)[number]['key']) || 'characters'
  const typeFilter = searchParams.get('type') || ''
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]['key']>(initialTab)
  const [isFocused, setIsFocused] = useState(false)
  const deferredQuery = useDeferredValue(query)
  const { data } = useSearchCatalogData(deferredQuery)

  const keyword = query.trim().toLowerCase()
  const filteredCharacters = useMemo(() => {
    const base = typeFilter ? data.characters.filter((item) => item.typeCode === typeFilter) : data.characters
    if (deferredQuery.trim()) return base
    if (!keyword) return base
    return base.filter((item) =>
      [item.name, item.title, item.description, item.workTitle, ...item.tags].join(' ').toLowerCase().includes(keyword),
    )
  }, [data.characters, deferredQuery, keyword, typeFilter])

  const filteredWorks = useMemo(() => {
    if (deferredQuery.trim()) return data.works
    if (!keyword) return data.works
    return data.works.filter((item) =>
      [item.title, item.description, item.meta, item.creatorName].join(' ').toLowerCase().includes(keyword),
    )
  }, [data.works, deferredQuery, keyword])

  const filteredCreators = useMemo(() => {
    if (deferredQuery.trim()) return data.creators
    if (!keyword) return data.creators
    return data.creators.filter((item) =>
      [item.name, item.description, item.meta].join(' ').toLowerCase().includes(keyword),
    )
  }, [data.creators, deferredQuery, keyword])

  const filteredThemes = useMemo(() => {
    if (deferredQuery.trim()) return data.themes
    if (!keyword) return data.themes
    return data.themes.filter((item) =>
      [item.name, item.description, item.meta].join(' ').toLowerCase().includes(keyword),
    )
  }, [data.themes, deferredQuery, keyword])

  const title =
    activeTab === 'characters' && typeFilter ? `${humanizeCharacterType(typeFilter)} · 分类浏览` : '搜索'
  const subtitle =
    activeTab === 'characters' && typeFilter
      ? '带着人物类型条件浏览，也可以继续按关键词查找。'
      : '搜索人物、作品、创作者、主题。'

  return (
    <div className="min-h-full px-5 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-6">
        <h1 className="mb-2 text-2xl" style={{ color: '#D6B36A' }}>
          {title}
        </h1>
        <p style={{ color: '#6C7A89' }}>{subtitle}</p>
        {typeFilter && activeTab === 'characters' ? (
          <div className="mt-3 inline-flex rounded-full bg-[#1A1D23] px-3 py-1 text-xs text-[#D6B36A]">
            当前筛选：{humanizeCharacterType(typeFilter)}
          </div>
        ) : null}
        <div
          className="relative mt-5 overflow-hidden rounded-xl transition-all duration-300"
          style={{ background: '#1A1D23', boxShadow: isFocused ? '0 0 0 2px rgba(214, 179, 106, 0.3)' : 'none' }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <SearchIcon size={20} style={{ color: '#6C7A89' }} />
            <input
              type="text"
              placeholder="搜索人物、作品、创作者、主题..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: '#FFFFFF' }}
            />
            {query ? (
              <button onClick={() => setQuery('')}>
                <X size={18} style={{ color: '#6C7A89' }} />
              </button>
            ) : null}
          </div>
        </div>
      </motion.div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="rounded-full px-4 py-2 text-sm"
            style={{ background: activeTab === tab.key ? 'rgba(214,179,106,0.12)' : '#1A1D23', color: activeTab === tab.key ? '#D6B36A' : '#AAB2BD' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'characters' ? (
        <div className="mb-5 flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {quickTypeFilters.map((item) => (
            <button
              key={item.key || 'all'}
              onClick={() => navigate(item.key ? `/search?type=${item.key}` : '/search')}
              className="whitespace-nowrap rounded-full px-4 py-2 text-xs"
              style={{ background: typeFilter === item.key ? 'rgba(214,179,106,0.12)' : '#1A1D23', color: typeFilter === item.key ? '#D6B36A' : '#AAB2BD' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div key={activeTab + keyword + typeFilter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {activeTab === 'characters' ? <div className="space-y-4">{filteredCharacters.map((item) => <CharacterCard key={item.id} character={item} />)}</div> : null}
          {activeTab === 'works' ? <div className="space-y-4">{filteredWorks.map((item) => <WorkCard key={item.id} work={item} />)}</div> : null}
          {activeTab === 'creators' ? <div className="space-y-4">{filteredCreators.map((item) => <CreatorCard key={item.id} creator={item} />)}</div> : null}
          {activeTab === 'themes' ? <div className="space-y-4">{filteredThemes.map((item) => <ThemeCard key={item.id} theme={item} />)}</div> : null}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
