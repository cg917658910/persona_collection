import { useNavigate } from 'react-router'
import type { CreatorCardItem } from '../data/types'

export function CreatorCard({ creator }: { creator: CreatorCardItem }) {
  const navigate = useNavigate()
  return (
    <div className="overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02]" style={{ background: '#1A1D23', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} onClick={() => navigate(`/creator/${creator.slug}`)}>
      <div className="flex gap-4 p-4">
        <img src={creator.imageUrl} alt={creator.name} className="h-20 w-20 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-white">{creator.name}</h3>
          <p className="mb-2 text-xs text-[#D6B36A]">{creator.meta}</p>
          <p className="line-clamp-2 text-xs leading-relaxed text-[#6C7A89]">{creator.description}</p>
          <p className="mt-2 text-[11px] text-white/55">{creator.workCount} 部关联作品</p>
        </div>
      </div>
    </div>
  )
}
