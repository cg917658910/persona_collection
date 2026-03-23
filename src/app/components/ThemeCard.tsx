import { useNavigate } from 'react-router'
import type { ThemeCardItem } from '../data/types'

export function ThemeCard({ theme }: { theme: ThemeCardItem }) {
  const navigate = useNavigate()
  return (
    <div className="overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02]" style={{ background: '#1A1D23', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} onClick={() => navigate(`/theme/${theme.slug}`)}>
      <div className="flex gap-4 p-4">
        <img src={theme.imageUrl} alt={theme.name} className="h-20 w-20 rounded-lg object-cover" />
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-white">{theme.name}</h3>
          <p className="mb-2 text-xs text-[#D6B36A]">{theme.meta}</p>
          <p className="line-clamp-2 text-xs leading-relaxed text-[#6C7A89]">{theme.description}</p>
        </div>
      </div>
    </div>
  )
}
