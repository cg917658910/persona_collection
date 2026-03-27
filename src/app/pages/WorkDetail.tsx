import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router'
import { CharacterCard } from '../components/CharacterCard'
import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { toCharacterCardItem, useWorkDetailData } from '../services/catalog'

export function WorkDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: work, loading } = useWorkDetailData(slug)

  if (loading && !work) {
    return <div className="min-h-full flex items-center justify-center text-[#6C7A89]">加载中...</div>
  }

  if (!work) {
    return <div className="min-h-full flex items-center justify-center text-[#6C7A89]">作品未找到</div>
  }

  return (
    <div className="min-h-full px-5 py-6">
      <button onClick={() => navigate(-1)} className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white">
        <ArrowLeft size={18} />
      </button>

      <div className="overflow-hidden rounded-3xl bg-[#1A1D23]">
          <ImageWithFallback src={work.coverUrl} alt={work.title} fallbackLabel={work.title} className="h-60 w-full object-cover" loading="eager" />
        <div className="p-5">
          <div className="text-xs text-[#D6B36A]">{work.workTypeCode}</div>
          <h1 className="mt-2 text-2xl text-white">{work.title}</h1>
          <p className="mt-3 text-sm leading-7 text-[#AAB2BD]">{work.summary}</p>
          {work.creator ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/creator/${work.creator?.slug}`)}
                className="rounded-full bg-white/5 px-3 py-2 text-xs text-white/80"
              >
                {work.creator.name}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <section className="mt-7">
        <h2 className="mb-4 text-white">作品人物</h2>
        <div className="space-y-4">
          {work.characters.map((item) => (
            <CharacterCard key={item.id} character={toCharacterCardItem(item)} />
          ))}
        </div>
      </section>
    </div>
  )
}
