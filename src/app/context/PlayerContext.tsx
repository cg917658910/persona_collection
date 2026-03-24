import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getCharacterBySlug } from '../data/adapters'
import { songs } from '../data/songs'

type Track = {
  title: string
  subtitle?: string
  coverUrl?: string
  audioUrl: string
}

type PlayerDisplayMode = 'hidden' | 'mini' | 'expanded'

type PlayerContextValue = {
  currentTrack: Track | null
  currentIndex: number
  isPlaying: boolean
  isReady: boolean
  isQueueOpen: boolean
  displayMode: PlayerDisplayMode
  error: string | null
  progress: number
  currentTime: number
  duration: number
  queue: Track[]
  playTrack: (track: Track) => Promise<void>
  toggle: () => Promise<void>
  stop: () => void
  close: () => void
  expand: () => void
  minimize: () => void
  next: () => Promise<void>
  prev: () => Promise<void>
  seek: (time: number) => void
  toggleQueue: () => void
  playAtIndex: (nextIndex: number) => Promise<void>
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

const defaultQueue: Track[] = songs.map((song) => ({
  title: song.title,
  subtitle: getCharacterBySlug(song.characterSlug)?.name ?? song.characterSlug,
  coverUrl: song.coverUrl,
  audioUrl: song.audioUrl,
}))

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const indexRef = useRef(-1)
  const [queue] = useState<Track[]>(defaultQueue)
  const [index, setIndex] = useState(-1)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isQueueOpen, setIsQueueOpen] = useState(false)
  const [displayMode, setDisplayMode] = useState<PlayerDisplayMode>('hidden')
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audioRef.current = audio

    const onEnded = () => {
      void nextInternal(indexRef.current)
    }
    const onPause = () => setIsPlaying(false)
    const onPlay = () => {
      setIsPlaying(true)
      setError(null)
    }
    const onTime = () => setCurrentTime(audio.currentTime || 0)
    const onLoaded = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
      setIsReady(true)
      setError(null)
    }
    const onWaiting = () => setIsReady(false)
    const onCanPlay = () => setIsReady(true)
    const onError = () => {
      const mediaError = audio.error
      const message = mediaError ? `音频加载失败（code: ${mediaError.code}）` : '音频加载失败'
      setError(message)
      setIsPlaying(false)
      setIsReady(false)
    }

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('error', onError)

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('error', onError)
    }
  }, [])

  useEffect(() => {
    indexRef.current = index
  }, [index])

  const setTrackSource = async (track: Track, nextIndex: number) => {
    const audio = audioRef.current
    if (!audio) return
    setError(null)
    setIsReady(false)
    setCurrentTime(0)
    setDuration(0)
    indexRef.current = nextIndex
    setIndex(nextIndex)
    setCurrentTrack(track)
    setDisplayMode('mini')
    audio.pause()
    audio.src = track.audioUrl
    audio.load()
    try {
      await audio.play()
    } catch (err) {
      setIsPlaying(false)
      setError(err instanceof Error ? err.message : '播放失败')
    }
  }

  const nextInternal = async (baseIndex = indexRef.current) => {
    if (!queue.length) return
    const nextIndex = baseIndex >= 0 ? (baseIndex + 1) % queue.length : 0
    const nextTrack = queue[nextIndex]
    await setTrackSource(nextTrack, nextIndex)
  }

  const prevInternal = async (baseIndex = indexRef.current) => {
    if (!queue.length) return
    const prevIndex = baseIndex > 0 ? baseIndex - 1 : queue.length - 1
    const prevTrack = queue[prevIndex]
    await setTrackSource(prevTrack, prevIndex)
  }

  const playAtIndex = async (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= queue.length) return
    await setTrackSource(queue[nextIndex], nextIndex)
  }

  const playTrack = async (track: Track) => {
    const foundIndex = queue.findIndex((item) => item.audioUrl === track.audioUrl)
    const nextIndex = foundIndex >= 0 ? foundIndex : 0

    if (currentTrack?.audioUrl === track.audioUrl && audioRef.current) {
      setDisplayMode('mini')
      if (audioRef.current.paused) {
        try {
          await audioRef.current.play()
        } catch (err) {
          setError(err instanceof Error ? err.message : '播放失败')
        }
      }
      return
    }

    await setTrackSource(track, nextIndex)
  }

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return
    try {
      if (audio.paused) {
        await audio.play()
      } else {
        audio.pause()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '播放失败')
    }
  }

  const stop = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setCurrentTime(0)
    setIsPlaying(false)
    setDisplayMode('mini')
  }

  const close = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      audio.src = ''
    }
    setCurrentTrack(null)
    setIndex(-1)
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(false)
    setIsReady(false)
    setIsQueueOpen(false)
    setError(null)
    setDisplayMode('hidden')
  }

  const expand = () => {
    if (currentTrack) setDisplayMode('expanded')
  }

  const minimize = () => {
    if (currentTrack) setDisplayMode('mini')
    setIsQueueOpen(false)
  }

  const seek = (time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
    setCurrentTime(time)
  }

  const toggleQueue = () => setIsQueueOpen((prev) => !prev)
  const progress = duration > 0 ? currentTime / duration : 0

  const value = useMemo(
    () => ({
      currentTrack,
      currentIndex: index,
      isPlaying,
      isReady,
      isQueueOpen,
      displayMode,
      error,
      progress,
      currentTime,
      duration,
      queue,
      playTrack,
      toggle,
      stop,
      close,
      expand,
      minimize,
      next: nextInternal,
      prev: prevInternal,
      seek,
      toggleQueue,
      playAtIndex,
    }),
    [currentTrack, index, isPlaying, isReady, isQueueOpen, displayMode, error, progress, currentTime, duration, queue],
  )

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}
