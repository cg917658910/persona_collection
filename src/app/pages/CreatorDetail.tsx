import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { getCreatorBySlug, getWorksByCreatorSlug, mapWorkToCard } from '../data/adapters'
import { WorkCard } from '../components/WorkCard'

export function CreatorDetail() {
  const { slug } = useParams(); const navigate = useNavigate(); const creator = slug ? getCreatorBySlug(slug) : undefined
  if (!creator) return <div className="min-h-full flex items-center justify-center text-[#6C7A89]">创作者未找到</div>
  const works = getWorksByCreatorSlug(creator.slug).map(mapWorkToCard)
  return <div className="min-h-full px-5 py-6"><button onClick={()=>navigate(-1)} className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white"><ArrowLeft size={18} /></button><div className="overflow-hidden rounded-3xl bg-[#1A1D23]"><ImageWithFallback src={creator.coverUrl} alt={creator.name} className="h-60 w-full object-cover" /><div className="p-5"><div className="text-xs text-[#D6B36A]">{creator.eraText}</div><h1 className="mt-2 text-2xl text-white">{creator.name}</h1><p className="mt-3 text-sm leading-7 text-[#AAB2BD]">{creator.summary}</p></div></div><section className="mt-7"><h2 className="mb-4 text-white">相关作品</h2><div className="space-y-4">{works.map((item)=><WorkCard key={item.id} work={item} />)}</div></section></div>
}
