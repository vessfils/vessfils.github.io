import { Pause, Play } from 'lucide-react'
import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Img } from '../../components/ui/Img'

interface AnimatedCaptureProps {
  /** Animated WebP in /public (served as-is, not processed by the media script). */
  animation: string
  /** Media key of a still frame, shown when paused or when reduced motion is requested. */
  still: string
  alt: string
  size: number
  pixelated?: boolean
  className?: string
}

/** Recorded gameplay loop with a pause button. Used for genuine captures (Learn2Slither, CUB3D). */
export function AnimatedCapture({ animation, still, alt, size, pixelated, className = '' }: AnimatedCaptureProps) {
  const reduce = useReducedMotion()
  const [paused, setPaused] = useState(false)
  const showStill = reduce || paused

  return (
    <div className={`relative ${className}`}>
      {showStill ? (
        <Img src={still} alt={alt} sizes={`${size}px`} className="h-full w-full" />
      ) : (
        <img
          src={animation}
          width={size}
          height={size}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={`h-full w-full ${pixelated ? '[image-rendering:pixelated]' : ''}`}
        />
      )}
      {!reduce && (
        <button
          onClick={(event) => {
            event.preventDefault() // the capture may sit inside a card link
            setPaused((p) => !p)
          }}
          className="absolute bottom-2 right-2 grid size-8 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
          aria-label={paused ? 'Play animation' : 'Pause animation'}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      )}
    </div>
  )
}
