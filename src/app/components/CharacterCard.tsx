import { useNavigate } from "react-router";
import { Music, Play } from "lucide-react";
import type { CharacterListItem } from "../data/types";
import { featuredSongs } from "../data/adapters";
import { usePlayer } from "../context/PlayerContext";

interface CharacterCardProps {
  character: CharacterListItem;
}

export function CharacterCard({ character }: CharacterCardProps) {
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  const song = featuredSongs.find((item) => item.characterName === character.name);

  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: '#1A1D23',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
      onClick={() => navigate(`/character/${character.slug}`)}
    >
      <div className="flex gap-4 p-4">
        <div
          className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
          style={{ background: '#0F1115' }}
        >
          <img
            src={character.imageUrl}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 style={{ color: '#FFFFFF' }}>{character.name}</h3>
            {character.hasSong && (
              <button
                className="px-2 py-0.5 rounded-full text-[10px] inline-flex items-center gap-1"
                style={{ background: 'rgba(214, 179, 106, 0.12)', color: '#D6B36A' }}
                onClick={(e) => { e.stopPropagation(); if (song) playTrack({ title: song.title, subtitle: song.characterName, coverUrl: song.coverUrl, audioUrl: song.audioUrl }); }}
              >
                <Play size={10} /> 人物之歌
              </button>
            )}
          </div>
          <p className="text-sm mb-2" style={{ color: '#D6B36A' }}>
            {character.workTitle || character.title}
          </p>
          <p
            className="text-xs line-clamp-2 leading-relaxed"
            style={{ color: '#6C7A89' }}
          >
            {character.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {character.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 rounded-full text-[10px]" style={{ background: 'rgba(108, 122, 137, 0.15)', color: '#ADB7C2' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="px-4 py-3 border-t flex items-center gap-2"
        style={{
          borderColor: 'rgba(108, 122, 137, 0.15)',
          background: 'rgba(15, 17, 21, 0.5)'
        }}
      >
        <Music size={14} style={{ color: '#6C7A89' }} />
        <span className="text-xs truncate" style={{ color: '#6C7A89' }}>
          {character.themeSong}
        </span>
      </div>
    </div>
  );
}
