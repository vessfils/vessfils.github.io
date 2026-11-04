import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import type { MediaRef } from '../../content/types'
import { Img } from './Img'

interface LightboxProps {
  images: MediaRef[]
  index: number | null
  onChange: (index: number | null) => void
  caption?: string
}

/**
 * Full-screen image viewer. Keyboard: Esc closes, ←/→ navigate.
 * Focus moves to the close button on open and returns to the page on close.
 */
export function Lightbox({ images, index, onChange, caption }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = index !== null
  const current = open ? images[index] : null

  const step = useCallback(
    (delta: number) => {
      if (index === null) return
      onChange((index + delta + images.length) % images.length)
    },
    [index, images.length, onChange],
  )

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onChange(null)
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previouslyFocused?.focus()
    }
  }, [open, onChange, step])

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => onChange(null)}
        >
          <div className="flex items-center justify-between px-4 py-3 text-sm text-white/70">
            <span className="font-mono text-xs">
              {index! + 1} / {images.length}
            </span>
            <button
              ref={closeRef}
              onClick={() => onChange(null)}
              className="grid size-11 place-items-center rounded-full hover:bg-white/10"
              aria-label="Close image viewer"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
            <motion.div
              key={current.src}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex max-h-full max-w-full flex-col items-center"
              onClick={(event) => event.stopPropagation()}
            >
              <Img
                src={current.src}
                alt={current.alt}
                sizes="100vw"
                eager
                className="max-h-[78vh] w-auto max-w-full rounded-md object-contain"
              />
              {(current.caption || caption) && (
                <p className="mt-3 max-w-2xl text-center text-sm text-white/70">{current.caption || caption}</p>
              )}
            </motion.div>

            {images.length > 1 && (
              <>
                <NavButton side="left" onClick={() => step(-1)} />
                <NavButton side="right" onClick={() => step(1)} />
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      onClick={(event) => {
        event.stopPropagation()
        onClick()
      }}
      aria-label={side === 'left' ? 'Previous image' : 'Next image'}
      className={`absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 ${
        side === 'left' ? 'left-2 sm:left-4' : 'right-2 sm:right-4'
      }`}
    >
      <Icon size={20} />
    </button>
  )
}
