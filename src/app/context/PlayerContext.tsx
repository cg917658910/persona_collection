import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getCharacterBySlug } from '../data/adapters'
import { songs } from '../data/songs'

type Track = {
  title: string
  subtitle?: string
  coverUrl?: string
  audioUrl: string
  characterSlug?: string
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
  characterSlug: song.characterSlug,
}))

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const indexRef = useRef(-1)
  const rafRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
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

  const stopProgressSync = () => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const syncFromAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime || 0)
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    setIsPlaying(!audio.paused && !audio.ended)
  }

  const startProgressSync = () => {
    stopProgressSync()

    const tick = () => {
      const audio = audioRef.current
      if (!audio) return

      if (!document.hidden) {
        setCurrentTime(audio.currentTime || 0)
        setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
      }

      if (!audio.paused && !audio.ended) {
        rafRef.current = window.requestAnimationFrame(tick)
      } else {
        rafRef.current = null
      }
    }

    const audio = audioRef.current
    if (audio && !audio.paused && !audio.ended) {
      rafRef.current = window.requestAnimationFrame(tick)
    }

    intervalRef.current = window.setInterval(() => {
      const liveAudio = audioRef.current
      if (!liveAudio) return
      if (liveAudio.paused || liveAudio.ended || document.hidden) return
      setCurrentTime(liveAudio.currentTime || 0)
      setDuration(Number.isFinite(liveAudio.duration) ? liveAudio.duration : 0)
    }, 1000)
  }

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.crossOrigin = 'anonymous'
    audio.playsInline = true
    ;(audio as HTMLAudioElement & { webkitPlaysInline?: boolean }).webkitPlaysInline = true
    audioRef.current = audio

    const onEnded = () => {
      stopProgressSync()
      void nextInternal(indexRef.current)
    }
    const onPause = () => {
      setIsPlaying(false)
      stopProgressSync()
    }
    const onPlay = () => {
      setIsPlaying(true)
      setError(null)
      syncFromAudio()
      startProgressSync()
    }
    const onTime = () => setCurrentTime(audio.currentTime || 0)
    const onLoaded = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
      setIsReady(true)
      setError(null)
    }
    const onWaiting = () => setIsReady(false)
    const onCanPlay = () => {
      setIsReady(true)
      syncFromAudio()
    }
    const onSeeking = () => setCurrentTime(audio.currentTime || 0)
    const onError = () => {
      const mediaError = audio.error
      const message = mediaError ? `音频加载失败（code: ${mediaError.code}）` : '音频加载失败'
      setError(message)
      setIsPlaying(false)
      setIsReady(false)
      stopProgressSync()
    }

    const resumeFromSystem = () => {
      const liveAudio = audioRef.current
      if (!liveAudio) return
      syncFromAudio()
      if (!liveAudio.paused && !liveAudio.ended) {
        setIsReady(liveAudio.readyState >= 2)
        startProgressSync()
      }
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        stopProgressSync()
      } else {
        resumeFromSystem()
      }
    }

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('seeking', onSeeking)
    audio.addEventListener('seeked', onSeeking)
    audio.addEventListener('error', onError)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('focus', resumeFromSystem)
    window.addEventListener('pageshow', resumeFromSystem)
    document.addEventListener('resume', resumeFromSystem as EventListener)

    return () => {
      stopProgressSync()
      audio.pause()
      audio.src = ''
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('seeking', onSeeking)
      audio.removeEventListener('seeked', onSeeking)
      audio.removeEventListener('error', onError)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('focus', resumeFromSystem)
      window.removeEventListener('pageshow', resumeFromSystem)
      document.removeEventListener('resume', resumeFromSystem as EventListener)
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
    stopProgressSync()
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
    const resolvedTrack = foundIndex >= 0 ? { ...queue[nextIndex], ...track } : track

    if (currentTrack?.audioUrl === track.audioUrl && audioRef.current) {
      setDisplayMode('mini')
      if (audioRef.current.paused) {
        try {
          await audioRef.current.play()
        } catch (err) {
          setError(err instanceof Error ? err.message : '播放失败')
        }
      } else {
        syncFromAudio()
        startProgressSync()
      }
      return
    }

    await setTrackSource(resolvedTrack, nextIndex)
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
    stopProgressSync()
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
    stopProgressSync()
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
