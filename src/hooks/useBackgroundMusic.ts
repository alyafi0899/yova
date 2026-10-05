import { useState, useEffect, useRef, useCallback } from 'react'
import bgm01 from '../assets/bgm01.mp3'

export function useBackgroundMusic(initialPlay = false) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(bgm01)
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio

    if (initialPlay) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Autoplay prevented by browser policy:', err)
          setIsPlaying(false)
        })
    }

    return () => {
      audio.pause()
      audio.currentTime = 0
      audioRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Audio play error:', err)
          setIsPlaying(false)
        })
    }
  }, [])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, pause, play])

  return {
    isPlaying,
    play,
    pause,
    toggle
  }
}
