import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { CharacterCard } from '../components/CharacterCard'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { toCharacterCardItem, useThemeDetailData } from '../services/catalog'

export function ThemeDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: theme, loading } = useThemeDetailData(slug)

  if (loading && !theme) {
    return <div className="min-h-full flex items-center justify-center text-[#6C7A89]">加载中...</div>
  }

  if (!theme) {
    return <div className="min-h-full flex items-center justify-center text-[#6C7A89]">主题未找到</div>
  }

  return (
    <div className="min-h-full px-5 py-6">
      <button onClick={() => navigate(-1)} className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white">
        <ArrowLeft size={18} />
      </button>

      <div className="overflow-hidden rounded-3xl bg-[#1A1D23]">
          <ImageWithFallback src={theme.coverUrl} alt={theme.name} fallbackLabel={theme.name} className="h-56 w-full object-cover" loading="eager" />
        <div className="p-5">
          <div className="text-xs text-[#D6B36A]">{theme.category}</div>
          <h1 className="mt-2 text-2xl text-white">{theme.name}</h1>
          <p className="mt-3 text-sm leading-7 text-[#AAB2BD]">{theme.summary}</p>
          <div className="mt-4 text-xs text-white/55">{theme.characters.length} 位人物</div>
        </div>
      </div>

      <section className="mt-7">
        <h2 className="mb-4 text-white">主题人物</h2>
        {theme.characters.length === 0 ? (
          <div className="rounded-2xl bg-[#1A1D23] p-4 text-sm text-[#6C7A89]">这个主题下暂时还没有人物。</div>
        ) : (
          <div className="space-y-4">
            {theme.characters.map((item) => (
              <CharacterCard key={item.id} character={toCharacterCardItem(item)} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
