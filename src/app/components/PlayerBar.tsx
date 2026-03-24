import { AlertCircle, ChevronDown, ChevronUp, ListMusic, LoaderCircle, Pause, Play, SkipBack, SkipForward, Square, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { usePlayer } from '../context/PlayerContext'

function formatTime(v: number) {
  if (!Number.isFinite(v)) return '0:00'
  const m = Math.floor(v / 60)
  const s = Math.floor(v % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

function Visualizer({ active }: { active: boolean }) {
  return (
    <div className="flex h-4 items-end gap-[3px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-[#D6B36A]"
          animate={active ? { height: [5, 14, 8, 12, 4] } : { height: 4 }}
          transition={{ duration: 1.1, repeat: active ? Infinity : 0, delay: i * 0.12 }}
        />
      ))}
    </div>
  )
}

export function PlayerBar() {
  const {
    currentTrack,
    currentIndex,
    isPlaying,
    isReady,
    isQueueOpen,
    displayMode,
    error,
    toggle,
    stop,
    close,
    expand,
    minimize,
    next,
    prev,
    currentTime,
    duration,
    seek,
    progress,
    queue,
    toggleQueue,
    playAtIndex,
  } = usePlayer()

  if (!currentTrack || displayMode === 'hidden') return null

  return (
    <div className="pointer-events-none absolute bottom-16 left-0 right-0 z-30 px-4 pb-2">
      <div className="mx-auto max-w-[375px]">
        <AnimatePresence>
          {displayMode === 'expanded' && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="pointer-events-auto mb-3 overflow-hidden rounded-3xl border border-white/10 bg-[#151920]/96 shadow-2xl backdrop-blur-md"
            >
              <div className="px-4 pt-3">
                <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/10" />
                <div className="mb-3 flex items-center justify-between">
                  <button onClick={minimize} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75">
                    <ChevronDown size={16} />
                  </button>
                  <div className="text-xs tracking-[0.22em] text-white/45">正在播放</div>
                  <button onClick={close} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="mb-4 flex items-center gap-3">
                  {currentTrack.coverUrl ? <img src={currentTrack.coverUrl} alt={currentTrack.title} className="h-14 w-14 rounded-2xl object-cover" /> : <div className="h-14 w-14 rounded-2xl bg-white/5" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-base text-white">{currentTrack.title}</div>
                      <Visualizer active={isPlaying && !error} />
                    </div>
                    <div className="truncate text-sm text-white/55">{currentTrack.subtitle || '人物主题曲'}</div>
                    {error ? (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-300">
                        <AlertCircle size={12} /> {error}
                      </div>
                    ) : !isReady && isPlaying ? (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-300">
                        <LoaderCircle size={12} className="animate-spin" /> 加载中...
                      </div>
                    ) : (
                      <div className="mt-1 text-[10px] text-white/35">本地资源播放 · 状态持久保留</div>
                    )}
                  </div>
                  <button onClick={toggleQueue} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80">
                    {isQueueOpen ? <ChevronUp size={16} /> : <ListMusic size={16} />}
                  </button>
                </div>

                <input type="range" min={0} max={duration || 0} step={0.1} value={currentTime} onChange={(e) => seek(Number(e.target.value))} className="w-full accent-[#D6B36A]" />
                <div className="mt-1 flex items-center justify-between text-[10px] text-white/45">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <button onClick={() => void prev()} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80"><SkipBack size={16} /></button>
                  <button onClick={() => void toggle()} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#D6B36A] text-sm font-medium text-[#111318]">
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    {isPlaying ? '暂停播放' : '继续播放'}
                  </button>
                  <button onClick={() => void next()} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80"><SkipForward size={16} /></button>
                  <button onClick={stop} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80"><Square size={13} /></button>
                </div>
              </div>

              <AnimatePresence>
                {isQueueOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/6 bg-black/10"
                  >
                    <div className="max-h-64 overflow-y-auto px-2 py-2">
                      {queue.map((track, idx) => {
                        const active = idx === currentIndex
                        return (
                          <button
                            key={track.audioUrl}
                            onClick={() => void playAtIndex(idx)}
                            className={`mb-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${active ? 'bg-[#D6B36A]/10' : 'bg-transparent hover:bg-white/5'}`}
                          >
                            {track.coverUrl ? <img src={track.coverUrl} alt={track.title} className="h-10 w-10 rounded-xl object-cover" /> : <div className="h-10 w-10 rounded-xl bg-white/5" />}
                            <div className="min-w-0 flex-1">
                              <div className={`truncate text-sm ${active ? 'text-[#F4E7C4]' : 'text-white/88'}`}>{track.title}</div>
                              <div className="truncate text-xs text-white/45">{track.subtitle || '人物主题曲'}</div>
                            </div>
                            {active ? <Visualizer active={isPlaying} /> : <Play size={14} className="text-white/35" />}
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div layout className="pointer-events-auto overflow-hidden rounded-2xl border border-white/10 bg-[#151920]/92 shadow-2xl backdrop-blur-md">
          <div
            role="button"
            tabIndex={0}
            onClick={expand}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                expand()
              }
            }}
            className="block w-full text-left"
          >
            <div className="flex items-center gap-3 px-3 py-3">
              {currentTrack.coverUrl ? <img src={currentTrack.coverUrl} alt={currentTrack.title} className="h-10 w-10 rounded-xl object-cover" /> : <div className="h-10 w-10 rounded-xl bg-white/5" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="truncate text-sm text-white">{currentTrack.title}</div>
                  <Visualizer active={isPlaying && !error} />
                </div>
                <div className="truncate text-xs text-white/55">{currentTrack.subtitle || '人物主题曲'}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    void toggle()
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80"
                >
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    close()
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
            <div className="h-[2px] w-full bg-white/5">
              <div className="h-full bg-[#D6B36A] transition-all" style={{ width: `${Math.max(progress * 100, 0)}%` }} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
