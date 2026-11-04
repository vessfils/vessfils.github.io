import { resolveImage } from '../../lib/media'

interface ImgProps {
  src: string
  alt: string
  /** CSS sizes attribute: how wide the image is rendered at each breakpoint. */
  sizes?: string
  className?: string
  eager?: boolean
}

/** Responsive, lazy-loaded WebP image with intrinsic dimensions to avoid layout shift. */
export function Img({ src, alt, sizes = '(min-width: 1024px) 900px, 100vw', className = '', eager }: ImgProps) {
  const image = resolveImage(src)
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`${image.crisp ? '[image-rendering:pixelated]' : ''} ${className}`}
    />
  )
}
