import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { workCards } from '../data/adapters'
import { WorkCard } from '../components/WorkCard'

export function Works() {
  const [query, setQuery] = useState('')
  const list = useMemo(() => !query.trim() ? workCards : workCards.filter((item) => Object.values(item).join(' ').toLowerCase().includes(query.trim().toLowerCase())), [query])
  return <div className="min-h-full px-5 py-6"><motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }} className="mb-6"><h1 className="text-2xl mb-2 text-[#D6B36A]">作品</h1><p className="text-[#6C7A89]">从作品进入人物，也从人物回到作品。</p><div className="mt-5 flex items-center gap-3 rounded-xl bg-[#1A1D23] px-4 py-3"><Search size={18} className="text-[#6C7A89]" /><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="搜索作品..." className="flex-1 bg-transparent text-sm text-white outline-none" /></div></motion.div><div className="space-y-4">{list.map((item)=><WorkCard key={item.id} work={item} />)}</div></div>
}
