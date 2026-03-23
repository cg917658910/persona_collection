import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { themeCards } from '../data/adapters'
import { ThemeCard } from '../components/ThemeCard'

export function Themes() {
  const [query, setQuery] = useState('')
  const list = useMemo(() => !query.trim() ? themeCards : themeCards.filter((item) => Object.values(item).join(' ').toLowerCase().includes(query.trim().toLowerCase())), [query])
  return <div className="min-h-full px-5 py-6"><motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} className="mb-6"><h1 className="text-2xl mb-2 text-[#D6B36A]">主题集</h1><p className="text-[#6C7A89]">按精神结构、情绪底色与命运形态看人物群像。</p><div className="mt-5 flex items-center gap-3 rounded-xl bg-[#1A1D23] px-4 py-3"><Search size={18} className="text-[#6C7A89]" /><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="搜索主题..." className="flex-1 bg-transparent text-sm text-white outline-none" /></div></motion.div><div className="space-y-4">{list.map((item)=><ThemeCard key={item.id} theme={item} />)}</div></div>
}
