import { useNavigate } from 'react-router'
import type { WorkCardItem } from '../data/types'

export function WorkCard({ work }: { work: WorkCardItem }) {
  const navigate = useNavigate()
  return (
    <div className="overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02]" style={{ background: '#1A1D23', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} onClick={() => navigate(`/work/${work.slug}`)}>
      <div className="flex gap-4 p-4">
        <img src={work.imageUrl} alt={work.title} className="h-20 w-20 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-white">{work.title}</h3>
          <p className="mb-2 text-xs text-[#D6B36A]">{work.meta}</p>
          <p className="line-clamp-2 text-xs leading-relaxed text-[#6C7A89]">{work.description}</p>
          <p className="mt-2 text-[11px] text-white/55">{work.creatorName} · {work.characterCount} 位人物</p>
        </div>
      </div>
    </div>
  )
}
