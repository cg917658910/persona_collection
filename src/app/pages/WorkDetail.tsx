import { ImageWithFallback } from '../components/figma/ImageWithFallback'
import { useNavigate, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { getCharactersByWorkSlug, getCreatorBySlug, getWorkBySlug, mapCharacterToCard } from '../data/adapters'
import { CharacterCard } from '../components/CharacterCard'

export function WorkDetail() {
  const { slug } = useParams(); const navigate = useNavigate(); const work = slug ? getWorkBySlug(slug) : undefined
  if (!work) return <div className="min-h-full flex items-center justify-center text-[#6C7A89]">作品未找到</div>
  const creators = work.creatorSlugs.map(getCreatorBySlug).filter(Boolean)
  const characters = getCharactersByWorkSlug(work.slug).map(mapCharacterToCard)
  return <div className="min-h-full px-5 py-6"><button onClick={()=>navigate(-1)} className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white"><ArrowLeft size={18} /></button><div className="overflow-hidden rounded-3xl bg-[#1A1D23]"><ImageWithFallback src={work.coverUrl} alt={work.title} className="h-60 w-full object-cover" /><div className="p-5"><div className="text-xs text-[#D6B36A]">{work.eraText} · {work.releaseYear}</div><h1 className="mt-2 text-2xl text-white">{work.title}</h1><p className="mt-3 text-sm leading-7 text-[#AAB2BD]">{work.summary}</p><div className="mt-4 flex flex-wrap gap-2">{creators.map((item:any)=><button key={item.slug} onClick={()=>navigate(`/creator/${item.slug}`)} className="rounded-full bg-white/5 px-3 py-2 text-xs text-white/80">{item.name}</button>)}</div></div></div><section className="mt-7"><h2 className="mb-4 text-white">作品人物</h2><div className="space-y-4">{characters.map((item)=><CharacterCard key={item.id} character={item} />)}</div></section></div>
}
