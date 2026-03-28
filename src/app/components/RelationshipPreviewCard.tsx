import { ArrowRight, Link2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import type { RelationshipListItem } from '../services/catalog'
import { ImageWithFallback } from './figma/ImageWithFallback'

interface RelationshipPreviewCardProps {
  relationship: RelationshipListItem
}

export function RelationshipPreviewCard({ relationship }: RelationshipPreviewCardProps) {
  const navigate = useNavigate()
  const counterpart = relationship.counterpart ?? relationship.targetCharacter

  return (
    <button
      type="button"
      className="w-full rounded-2xl p-4 text-left transition-transform duration-300 hover:scale-[1.01]"
      style={{ background: '#1A1D23', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.24)' }}
      onClick={() => navigate(`/relationship/${relationship.slug}`)}
    >
      <div className="mb-3 flex items-start gap-3">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl" style={{ background: '#0F1115' }}>
          <ImageWithFallback src={counterpart.coverUrl || relationship.coverUrl} alt={counterpart.name} fallbackLabel={counterpart.name} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px]" style={{ background: 'rgba(214, 179, 106, 0.12)', color: '#D6B36A' }}>
              <Link2 size={10} />
              {relationship.relationLabel || relationship.relationType}
            </span>
            {relationship.workTitle ? (
              <span className="truncate text-[11px]" style={{ color: '#6C7A89' }}>
                {relationship.workTitle}
              </span>
            ) : null}
          </div>
          <div className="text-base" style={{ color: '#FFFFFF' }}>
            {counterpart.name}
          </div>
          <div className="mt-1 line-clamp-2 text-sm leading-6" style={{ color: '#ADB7C2' }}>
            {relationship.oneLineDefinition || relationship.summary}
          </div>
        </div>
      </div>

      {relationship.tags.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {relationship.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full px-2 py-1 text-[10px]" style={{ background: 'rgba(108, 122, 137, 0.15)', color: '#ADB7C2' }}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between text-xs" style={{ color: '#6C7A89' }}>
        <span>
          {relationship.sourceCharacter.name} × {relationship.targetCharacter.name}
        </span>
        <ArrowRight size={14} />
      </div>
    </button>
  )
}
